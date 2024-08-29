export class RuntimeError {
    public readonly message: string;

    public readonly isPublic: boolean;

    constructor(message: string, isPublic = true) {
        this.isPublic = isPublic;
        this.message = message;
    }

    toString() {
        return `RuntimeError: ${this.message}`;
    }
}
