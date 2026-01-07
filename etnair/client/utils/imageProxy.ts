export function getProxiedImageKey(imageKey: string | null): string | null {
    if (!imageKey) return null;
    return `/api/image?key=${encodeURIComponent(imageKey)}`;
}