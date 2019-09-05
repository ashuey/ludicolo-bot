import Application from "../Contracts/Foundation/Application";
import Bootstrapper from "../Contracts/Foundation/Bootstrapper";
import LoadEnvironmentVariables from "../Foundation/Bootstrap/LoadEnvironmentVariables";
import LoadConfiguration from "../Foundation/Bootstrap/LoadConfiguration";
import RegisterProviders from "../Foundation/Bootstrap/RegisterProviders";
import BootProviders from "../Foundation/Bootstrap/BootProviders";
import ConsoleManager from "./ConsoleManager"

export default class Kernel {
    protected app: Application;

    protected commandsLoaded: boolean = false;

    protected consoleApplication: ConsoleManager;

    protected bootstrappers_: (new (...any: any[]) => Bootstrapper)[] = [
        LoadEnvironmentVariables,
        LoadConfiguration,
        RegisterProviders,
        BootProviders
    ];

    constructor(app: Application) {
        this.app = app;
    }

    public handle(argv: string[]): void {
        this.getConsoleManager().run(argv);
    }

    protected commands() {
        //
    }

    protected load(paths: string | string[]): void {
        //
    }

    public async bootstrap(): Promise<void> {
        if (!this.app.hasBeenBootstrapped()) {
            await this.app.bootstrapWith(this.bootstrappers());
        }

        if (!this.commandsLoaded) {
            this.commands();
            this.commandsLoaded = true;
        }
    }

    protected getConsoleManager(): ConsoleManager {
        if (!this.consoleApplication) {
            this.consoleApplication = new ConsoleManager(this.app);
        }

        return this.consoleApplication;
    }

    protected bootstrappers(): (new (...any: any[]) => Bootstrapper)[] {
        return this.bootstrappers_;
    }


}