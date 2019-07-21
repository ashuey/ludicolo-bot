export default interface Kernel {
    startListening(): void;
    bootstrap(): Promise<void>;
}