import { z } from 'zod';

import { ColorLevelSchema } from './ColorLevel';
import { FlexModeSchema } from './FlexMode';
import { PowerlineConfigSchema } from './PowerlineConfig';
import { WidgetItemSchema } from './Widget';

// Current version - bump this when making breaking changes to the schema
export const CURRENT_VERSION = 4;

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
export const ModelMappingSchema = z.object({
    pattern: z.string(),
    displayName: z.string(),
    matchType: z.enum(['contains', 'glob', 'regex']).default('contains')
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
        { pattern: 'claude-haiku-4-5', displayName: 'Haiku 4.5', matchType: 'contains' },
        { pattern: 'claude-sonnet-4-5', displayName: 'Sonnet 4.5', matchType: 'contains' },
        { pattern: 'claude-opus-4-5', displayName: 'Opus 4.5', matchType: 'contains' },
        { pattern: 'claude-sonnet-4-0', displayName: 'Sonnet 4', matchType: 'contains' },
        { pattern: 'claude-opus-4-0', displayName: 'Opus 4', matchType: 'contains' },
        { pattern: 'claude-3-5-sonnet', displayName: 'Sonnet 3.5', matchType: 'contains' },
        { pattern: 'claude-3-5-haiku', displayName: 'Haiku 3.5', matchType: 'contains' },
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