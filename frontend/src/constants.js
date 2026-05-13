// ─── Prediction tuning ────────────────────────────────────────────────────────
export const CAPTURE_INTERVAL    = 300   // ms between predict calls (only fires when hand visible)
export const MIN_CONFIDENCE      = 0.75  // minimum confidence to accept a prediction
export const REPEATS_TO_CONFIRM  = 2     // same letter must appear N times consecutively to confirm
export const MAX_TRANSCRIPT_WORDS = 200  // auto-archive oldest words beyond this cap
export const MAX_PENDING_LETTERS  = 40   // auto-commit building-word if it hits this length

// ─── Sign Language Models ─────────────────────────────────────────────────────
// To add a new model:
//   1. Add an entry here with id, label, fullName, countryCode
//   2. Add matching model files to backend/models/<id>/
//   3. Register the id in backend/main.py MODEL_REGISTRY
export const SIGN_MODELS = [
  {
    id:          'fsl',
    label:       'FSL',
    fullName:    'Filipino Sign Language',
    countryCode: 'ph',
  },
  {
    id:          'asl',
    label:       'ASL',
    fullName:    'American Sign Language',
    countryCode: 'us',
  },
  {
    id:          'dgs',
    label:       'DGS',
    fullName:    'Deutsche Gebärdensprache',
    countryCode: 'de',
  },
]

export const DEFAULT_MODEL = SIGN_MODELS[0]
