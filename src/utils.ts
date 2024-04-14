new EventSource('/esbuild').addEventListener('change', () => location.reload())

export function range(start: number, end: number) {
    return Array.from({ length: end - start }, (_, i) => i + start);
}

export function compare<T>(arr1: T[], arr2: T[]){
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}