export default interface Container {
    bound(abstract_: string): boolean;
    resolved(abstract_: string): boolean;
    isShared(abstract_: string): boolean;
    isAlias(name: string): boolean;
    bind(abstract_: string, concrete: new (...any: any[]) => {}, ...dependency: string[]): void;
    singleton(abstract_: string, concrete: new (...any: any[]) => {}, ...dependency: string[]): void;
    instance(abstract_: string, instance: any): any;
    alias(abstract_: string, alias: string): void;
    make(abstract_: string, ...parameters: any[]): any;
    resolve(abstract_: string, ...parameters: any[]): any;
    getAlias(abstract_: string): string;
    flush(): void;
}