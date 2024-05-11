export function recordGetOrMake<K extends string | number | symbol, V>(record: Record<K, V>, key: K, factory: () => V): V {
    return record[key] = record[key] ?? factory();
}
