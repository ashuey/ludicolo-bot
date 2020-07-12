export default class Counter<K> extends Map<K, number> {
    public increase(key: K, value: number = 1) {
        const currentValue = this.get(key) || 0;
        this.set(key, currentValue + value);
    }

    public decrease(key: K, value: number = 1) {
        const currentValue = this.get(key) || 0;
        this.set(key, currentValue - value);
    }
}