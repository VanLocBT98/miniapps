export type ThemeMode = 'light' | 'dark' | 'system'

export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E }
