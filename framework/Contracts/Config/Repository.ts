export default interface Repository {
    has(key: string): boolean;
    get(key: string, default_?: any): any;
    all(): object;
    set(key: string, value?: any);
}