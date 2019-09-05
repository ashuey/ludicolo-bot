import Application from "../Contracts/Foundation/Application";
import { default as ConsoleManager } from "../Console/ConsoleManager";

export default abstract class ServiceProvider {
    protected app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public register() {
        //
    }

    public async boot(): Promise<void> {
        //
    }

    public commands(...commands: string[]): void {
        ConsoleManager.starting((consoleApplication: ConsoleManager) => {
            consoleApplication.resolve(commands);
        })
    }
}