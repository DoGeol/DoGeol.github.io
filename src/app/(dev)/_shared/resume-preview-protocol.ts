import { z } from 'zod'

import { resumeRegionTypes } from '@/app/(pages)/resume/_model/resume-region'
import { resumeDraftSchema } from '@/app/(pages)/resume/_model/resume-schema'

const editorToPreviewMessageSchema = z.discriminatedUnion('type', [
  z
    .object({
      type: z.literal('RENDER_DRAFT'),
      draft: resumeDraftSchema,
      selectedRegionId: z.string().min(1).nullable(),
    })
    .strict(),
  z.object({ type: z.literal('SET_PREVIEW_MODE'), mode: z.enum(['select', 'actual']) }).strict(),
])

const previewToEditorMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('PREVIEW_READY') }).strict(),
  z
    .object({
      type: z.literal('SELECT_REGION'),
      regionId: z.string().min(1),
      regionType: z.enum(resumeRegionTypes),
    })
    .strict(),
])

export type EditorToPreviewMessage = z.infer<typeof editorToPreviewMessageSchema>
export type PreviewToEditorMessage = z.infer<typeof previewToEditorMessageSchema>
export type PreviewMode = Extract<EditorToPreviewMessage, { type: 'SET_PREVIEW_MODE' }>['mode']

const parseMessage = <Schema extends z.ZodType>(
  schema: Schema,
  event: MessageEvent,
  expectedOrigin: string,
  expectedSource: WindowProxy,
): z.infer<Schema> | null => {
  if (event.origin !== expectedOrigin || event.source !== expectedSource) return null
  const parsed = schema.safeParse(event.data)
  return parsed.success ? parsed.data : null
}

export const parseEditorToPreviewMessage = (
  event: MessageEvent,
  origin: string,
  source: WindowProxy,
): EditorToPreviewMessage | null =>
  parseMessage(editorToPreviewMessageSchema, event, origin, source)

export const parsePreviewToEditorMessage = (
  event: MessageEvent,
  origin: string,
  source: WindowProxy,
): PreviewToEditorMessage | null =>
  parseMessage(previewToEditorMessageSchema, event, origin, source)
