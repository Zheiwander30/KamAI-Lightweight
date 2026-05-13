"""
Keras .h5 → TensorFlow.js manual converter for KamAI models.
Handles: Sequential, Dense, BatchNormalization, Dropout layers.

Run:
  pip install h5py numpy scikit-learn
  python convert_to_tfjs.py
"""
import json, pickle, sys
import numpy as np
import h5py
from pathlib import Path

BASE            = Path(__file__).parent
MODELS_DIR      = BASE / "models"
FRONTEND_MODELS = BASE.parent / "frontend" / "public" / "models"

ACT_MAP = {
    'relu': 'relu', 'softmax': 'softmax', 'sigmoid': 'sigmoid',
    'tanh': 'tanh', 'linear': 'linear', 'elu': 'elu',
}

def decode(v):
    return v.decode() if isinstance(v, bytes) else v

def get_weights(f, layer_name):
    """
    Exact path from inspection:
    model_weights/{layer}/{layer}/sequential/{layer}/{layer}/kernel
                                              ^-- 'sequential' may differ
    We search for kernel/bias under model_weights/{layer}/ recursively.
    """
    base = f['model_weights'][layer_name]
    kernel = bias = None

    def find(name, obj):
        nonlocal kernel, bias
        if isinstance(obj, h5py.Dataset):
            n = name.split('/')[-1]
            if n == 'kernel' and kernel is None:
                kernel = np.array(obj, dtype=np.float32)
            elif n == 'bias' and bias is None:
                bias = np.array(obj, dtype=np.float32)

    base.visititems(find)

    if kernel is None or bias is None:
        raise KeyError(f"kernel/bias not found under model_weights/{layer_name}")
    return kernel, bias

def get_bn_weights(f, layer_name):
    """
    BatchNorm weights: gamma, beta, moving_mean, moving_variance
    """
    base = f['model_weights'][layer_name]
    weights = {}

    def find(name, obj):
        if isinstance(obj, h5py.Dataset):
            n = name.split('/')[-1]
            weights[n] = np.array(obj, dtype=np.float32)

    base.visititems(find)

    needed = ['gamma', 'beta', 'moving_mean', 'moving_variance']
    for n in needed:
        if n not in weights:
            raise KeyError(f"BatchNorm weight '{n}' not found for {layer_name}")
    return weights

def convert_model(h5_path, out_dir):
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    with h5py.File(h5_path, 'r') as f:
        config_raw = f.attrs.get('model_config')
        if config_raw is None:
            raise ValueError("No model_config in .h5 — not a valid Keras model?")

        config     = json.loads(decode(config_raw))
        class_name = config.get('class_name', '')

        if class_name == 'Sequential':
            layer_cfgs = config['config']['layers']
        else:
            raise ValueError(f"Unsupported model type: {class_name}")

        tfjs_layers  = []
        weight_specs = []
        weight_data  = []

        for lc in layer_cfgs:
            lname  = lc.get('class_name', '')
            lcfg   = lc.get('config', {})
            lnm    = lcfg.get('name', '')

            # ── InputLayer ────────────────────────────────────────────────────
            if lname == 'InputLayer':
                shape = lcfg.get('batch_input_shape') or lcfg.get('batch_shape', [None, 63])
                tfjs_layers.append({
                    'class_name': 'InputLayer',
                    'name': lnm,
                    'inboundNodes': [],
                    'config': {
                        'batchInputShape': shape,
                        'dtype': 'float32',
                        'name': lnm,
                    },
                    'weights': []
                })

            # ── BatchNormalization ────────────────────────────────────────────
            elif lname == 'BatchNormalization':
                try:
                    w = get_bn_weights(f, lnm)
                except KeyError as e:
                    print(f"    Warning: {e} — skipping BatchNorm")
                    continue

                for wname in ['gamma', 'beta', 'moving_mean', 'moving_variance']:
                    spec_name = f'{lnm}/{wname}'
                    weight_specs.append({'name': spec_name, 'shape': list(w[wname].shape), 'dtype': 'float32'})
                    weight_data.append(w[wname])

                tfjs_layers.append({
                    'class_name': 'BatchNormalization',
                    'name': lnm,
                    'inboundNodes': [],
                    'config': {
                        'name': lnm,
                        'axis': lcfg.get('axis', -1),
                        'momentum': lcfg.get('momentum', 0.99),
                        'epsilon': lcfg.get('epsilon', 0.001),
                        'center': True,
                        'scale': True,
                        'dtype': 'float32',
                    },
                    'weights': [f'{lnm}/gamma', f'{lnm}/beta',
                                f'{lnm}/moving_mean', f'{lnm}/moving_variance']
                })

            # ── Dense ─────────────────────────────────────────────────────────
            elif lname == 'Dense':
                try:
                    kernel, bias = get_weights(f, lnm)
                except KeyError as e:
                    print(f"    Warning: {e} — skipping Dense layer")
                    continue

                act_raw = lcfg.get('activation', 'linear')
                if isinstance(act_raw, dict):
                    act = act_raw.get('class_name', 'linear').lower()
                else:
                    act = decode(act_raw).lower()
                activation = ACT_MAP.get(act, act)

                k_name = f'{lnm}/kernel'
                b_name = f'{lnm}/bias'

                weight_specs.extend([
                    {'name': k_name, 'shape': list(kernel.shape), 'dtype': 'float32'},
                    {'name': b_name, 'shape': list(bias.shape),   'dtype': 'float32'},
                ])
                weight_data.extend([kernel, bias])

                tfjs_layers.append({
                    'class_name': 'Dense',
                    'name': lnm,
                    'inboundNodes': [],
                    'config': {
                        'name': lnm,
                        'units': lcfg.get('units', 1),
                        'activation': activation,
                        'useBias': True,
                        'dtype': 'float32',
                    },
                    'weights': [k_name, b_name]
                })

            # ── Dropout (no weights, just pass through) ───────────────────────
            elif lname == 'Dropout':
                tfjs_layers.append({
                    'class_name': 'Dropout',
                    'name': lnm,
                    'inboundNodes': [],
                    'config': {
                        'name': lnm,
                        'rate': lcfg.get('rate', 0.5),
                        'dtype': 'float32',
                    },
                    'weights': []
                })

            else:
                print(f"    Skipping unsupported layer type: {lname} ({lnm})")

        # ── Write weights.bin ─────────────────────────────────────────────────
        with open(out_dir / 'weights.bin', 'wb') as wb:
            for arr in weight_data:
                wb.write(arr.tobytes())

        total_bytes = sum(a.nbytes for a in weight_data)

        # ── Build weight manifest with byte offsets ───────────────────────────
        manifest_weights = []
        offset = 0
        for spec, arr in zip(weight_specs, weight_data):
            manifest_weights.append({
                'name':       spec['name'],
                'shape':      spec['shape'],
                'dtype':      spec['dtype'],
                'byteOffset': offset,
            })
            offset += arr.nbytes

        # ── Write model.json ──────────────────────────────────────────────────
        model_json = {
            'modelTopology': {
                'class_name': 'Sequential',
                'config': {
                    'name': config['config'].get('name', 'sequential'),
                    'layers': tfjs_layers,
                },
                'keras_version': '2.x',
                'backend': 'tensorflow',
            },
            'weightsManifest': [{
                'paths': ['weights.bin'],
                'weights': manifest_weights,
            }],
            'format': 'layers-model',
            'generatedBy': 'KamAI convert_to_tfjs.py',
            'convertedBy': None,
        }

        with open(out_dir / 'model.json', 'w') as mf:
            json.dump(model_json, mf, indent=2)

        return total_bytes, len([l for l in tfjs_layers if l['class_name'] not in ('InputLayer',)])


# ── Main ──────────────────────────────────────────────────────────────────────
if not MODELS_DIR.exists():
    print(f"ERROR: {MODELS_DIR} not found.")
    print("Expected:  backend/models/fsl/fsl_model.h5 + fsl_label_encoder.pkl")
    sys.exit(1)

converted = []
for model_dir in sorted(MODELS_DIR.iterdir()):
    if not model_dir.is_dir(): continue
    model_id  = model_dir.name
    h5_files  = list(model_dir.glob("*.h5"))
    pkl_files = list(model_dir.glob("*.pkl"))

    if not h5_files or not pkl_files:
        print(f"Skipping {model_id} — need both .h5 and .pkl")
        continue

    h5_path  = h5_files[0]
    pkl_path = pkl_files[0]
    out_dir  = FRONTEND_MODELS / model_id

    print(f"\nConverting {model_id} ({h5_path.name}, {h5_path.stat().st_size//1024}KB)...")
    try:
        total_bytes, n_layers = convert_model(h5_path, out_dir)
    except Exception as e:
        print(f"  ERROR: {e}")
        import traceback; traceback.print_exc()
        continue

    with open(pkl_path, 'rb') as pf:
        encoder = pickle.load(pf)
    classes = [str(c) for c in encoder.classes_]
    with open(out_dir / 'labels.json', 'w') as lf:
        json.dump(classes, lf)

    print(f"  ✓ {n_layers} layers, {total_bytes//1024}KB weights")
    print(f"  ✓ {len(classes)} labels: {classes}")
    print(f"  → frontend/public/models/{model_id}/")
    converted.append(model_id)

print(f"\n{'='*40}")
if converted:
    print(f"Done. Converted: {converted}")
    print("\nNext:  git add frontend/public/models/  &&  git push")
else:
    print("Nothing converted — check folder structure.")
