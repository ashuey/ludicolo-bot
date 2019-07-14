export default interface Binding {
    concrete: new (...any: any[]) => {};
    shared: boolean;
    dependencies: string[];
}