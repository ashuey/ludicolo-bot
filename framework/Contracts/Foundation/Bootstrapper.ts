import Application from "./Application";

export default interface Bootstrapper {
    bootstrap(app: Application): Promise<void>;
}