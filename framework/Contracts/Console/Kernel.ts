export default interface Kernel {
    bootstrap(): Promise<void>;
}