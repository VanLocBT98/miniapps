import { z } from 'zod'

/** API response envelope — every booking endpoint uses this shape. */
export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
})

export const apiMetaSchema = z.record(z.string(), z.unknown()).optional()

export function apiEnvelopeSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema.nullable(),
    error: apiErrorSchema.nullable(),
    meta: apiMetaSchema,
  })
}

export const unknownEnvelopeSchema = apiEnvelopeSchema(z.unknown())

export type ApiError = z.infer<typeof apiErrorSchema>
export type ApiEnvelope<T> = {
  success: boolean
  data: T | null
  error: ApiError | null
  meta?: Record<string, unknown>
}

export function okEnvelope<T>(
  data: T,
  meta?: Record<string, unknown>,
): ApiEnvelope<T> {
  return { success: true, data, error: null, meta }
}

export function failEnvelope<T = never>(
  error: ApiError,
  meta?: Record<string, unknown>,
): ApiEnvelope<T> {
  return { success: false, data: null, error, meta }
}
