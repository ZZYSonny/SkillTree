export function range(start: number, end: number) {
    return Array.from({ length: end - start }, (_, i) => i + start);
}
new EventSource('/esbuild').addEventListener('change', () => location.reload())
