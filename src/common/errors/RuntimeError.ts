export class RuntimeError {
    constructor(public readonly message: string, public readonly isPublic = true) {}

    toString() {
        return `RuntimeError: ${this.message}`;
    }
}
