import Application from "../Contracts/Foundation/Application";

export default abstract class ServiceProvider {
    protected app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    register() {
        //
    }

    async boot(): Promise<void> {
        //
    }
}