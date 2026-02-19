import type { Settings } from '../types/Settings';

/**
 * Resolve a model ID to a display name using configured mappings.
 * Each mapping's `id` and `displayName` fields are environment variable names.
 * The env var named by `id` holds the exact model ID to match against;
 * the env var named by `displayName` holds the display name to return.
 * Returns the mapped name if found, or the original display_name as fallback.
 */
export function resolveModelDisplayName(
    modelId: string | undefined,
    originalDisplayName: string | undefined,
    settings: Settings
): string | undefined {
    if (!modelId) {
        return originalDisplayName;
    }

    const mappings = settings.modelMappings ?? [];
    for (const mapping of mappings) {
        const idValue = process.env[mapping.id];
        if (idValue !== undefined && idValue === modelId) {
            const displayValue = process.env[mapping.displayName];
            if (displayValue !== undefined) {
                return displayValue;
            }
        }
    }

    return originalDisplayName;
}
