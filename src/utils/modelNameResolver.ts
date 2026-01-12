import type { Settings } from '../types/Settings';

interface ModelMapping {
    pattern: string;
    displayName: string;
    matchType: 'contains' | 'glob' | 'regex';
}

/**
 * Convert a glob pattern to a regex
 * Supports * (match any) and ? (match single char)
 */
function globToRegex(glob: string): RegExp {
    const escaped = glob
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')  // Escape special regex chars
        .replace(/\*/g, '.*')                   // * -> .*
        .replace(/\?/g, '.');                   // ? -> .
    return new RegExp(`^${escaped}$`, 'i');     // Case insensitive, match full string
}

/**
 * Check if a model ID matches a pattern
 */
function matchesPattern(
    modelId: string,
    pattern: string,
    matchType: 'contains' | 'glob' | 'regex'
): boolean {
    switch (matchType) {
        case 'contains':
            return modelId.toLowerCase().includes(pattern.toLowerCase());
        case 'glob':
            return globToRegex(pattern).test(modelId);
        case 'regex':
            try {
                return new RegExp(pattern, 'i').test(modelId);
            } catch {
                return false;  // Invalid regex falls back to no match
            }
        default:
            return false;
    }
}

/**
 * Resolve a model ID to a display name using configured mappings
 * Returns the mapped name if found, or the original display_name as fallback
 */
export function resolveModelDisplayName(
    modelId: string | undefined,
    originalDisplayName: string | undefined,
    settings: Settings
): string | undefined {
    // If no model ID, return original display name
    if (!modelId) {
        return originalDisplayName;
    }

    // Check mappings in order (first match wins)
    const mappings = settings.modelMappings ?? [];
    for (const mapping of mappings) {
        if (matchesPattern(modelId, mapping.pattern, mapping.matchType)) {
            return mapping.displayName;
        }
    }

    // No match found, return original display name
    return originalDisplayName;
}
