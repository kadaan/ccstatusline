import { z } from 'zod';

import { ColorLevelSchema } from './ColorLevel';
import { FlexModeSchema } from './FlexMode';
import { PowerlineConfigSchema } from './PowerlineConfig';
import { WidgetItemSchema } from './Widget';

// Current version - bump this when making breaking changes to the schema
export const CURRENT_VERSION = 5;

// Schema for v1 settings (before version field was added)
export const SettingsSchema_v1 = z.object({
    lines: z.array(z.array(WidgetItemSchema)).optional(),
    flexMode: FlexModeSchema.optional(),
    compactThreshold: z.number().optional(),
    colorLevel: ColorLevelSchema.optional(),
    defaultSeparator: z.string().optional(),
    defaultPadding: z.string().optional(),
    inheritSeparatorColors: z.boolean().optional(),
    overrideBackgroundColor: z.string().optional(),
    overrideForegroundColor: z.string().optional(),
    globalBold: z.boolean().optional()
});

// Schema for model name mappings
// id: env var name whose value is the exact model ID to match
// displayName: env var name whose value is the display name to use
export const ModelMappingSchema = z.object({
    id: z.string(),
    displayName: z.string()
});

// Main settings schema with defaults
export const SettingsSchema = z.object({
    version: z.number().default(CURRENT_VERSION),
    lines: z.array(z.array(WidgetItemSchema))
        .min(1)
        .default([
            [
                { id: '1', type: 'model', color: 'cyan' },
                { id: '2', type: 'separator' },
                { id: '3', type: 'context-length', color: 'brightBlack' },
                { id: '4', type: 'separator' },
                { id: '5', type: 'git-branch', color: 'magenta' },
                { id: '6', type: 'separator' },
                { id: '7', type: 'git-changes', color: 'yellow' }
            ],
            [],
            []
        ]), // Ensure max 3 lines
    flexMode: FlexModeSchema.default('full-minus-40'),
    compactThreshold: z.number().min(1).max(99).default(60),
    colorLevel: ColorLevelSchema.default(2),
    defaultSeparator: z.string().optional(),
    defaultPadding: z.string().optional(),
    inheritSeparatorColors: z.boolean().default(false),
    overrideBackgroundColor: z.string().optional(),
    overrideForegroundColor: z.string().optional(),
    globalBold: z.boolean().default(false),
    powerline: PowerlineConfigSchema.default({
        enabled: false,
        separators: ['\uE0B0'],
        separatorInvertBackground: [false],
        startCaps: [],
        endCaps: [],
        theme: undefined,
        autoAlign: false
    }),
    modelMappings: z.array(ModelMappingSchema).default([
        { id: 'ANTHROPIC_DEFAULT_HAIKU_MODEL', displayName: 'ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME' },
        { id: 'ANTHROPIC_DEFAULT_SONNET_MODEL', displayName: 'ANTHROPIC_DEFAULT_SONNET_MODEL_NAME' },
        { id: 'ANTHROPIC_DEFAULT_OPUS_MODEL', displayName: 'ANTHROPIC_DEFAULT_OPUS_MODEL_NAME' },
    ]),
    updatemessage: z.object({
        message: z.string().nullable().optional(),
        remaining: z.number().nullable().optional()
    }).optional()
});

// Inferred type from schema
export type Settings = z.infer<typeof SettingsSchema>;

// Export a default settings constant for reference
export const DEFAULT_SETTINGS: Settings = SettingsSchema.parse({});