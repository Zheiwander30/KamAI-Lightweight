// ─── Prediction tuning ────────────────────────────────────────────────────────
export const MIN_CONFIDENCE       = 0.75
export const MAX_TRANSCRIPT_WORDS = 200
export const MAX_PENDING_LETTERS  = 40

// ─── Speed modes ─────────────────────────────────────────────────────────────
// captureInterval: ms between prediction calls (lower = faster detection)
// repeatsToConfirm: how many consecutive matching predictions to confirm a letter
//   Higher repeats = harder to accidentally trigger, but slower to build words

export const SPEED_MODES = [
  {
    id:               'slow',
    label:            'Slow',
    icon:             '🐢',
    desc:             'Learners & Beginners',
    captureInterval:  600,
    repeatsToConfirm: 4,
  },
  {
    id:               'normal',
    label:            'Normal',
    icon:             '👋',
    desc:             'Comfortable Pace',
    captureInterval:  400,
    repeatsToConfirm: 3,
  },
  {
    id:               'fast',
    label:            'Fast',
    icon:             '⚡',
    desc:             'Experienced Fingerspellers',
    captureInterval:  200,
    repeatsToConfirm: 2,
  },
]
export const DEFAULT_SPEED = SPEED_MODES[1]   // Normal

// ─── Sign Language Models ─────────────────────────────────────────────────────
// To add a new model:
//   1. Add an entry here with id, label, fullName, countryCode

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
