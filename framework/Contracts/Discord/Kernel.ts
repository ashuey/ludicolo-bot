export default interface Kernel {
    startListening(): void;
    bootstrap(): void;
}