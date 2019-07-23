import Application from "../Contracts/Foundation/Application";
import {CommandoClient} from "discord.js-commando";
import {default as KernelContract} from "../Contracts/Discord/Kernel"
import * as _ from "lodash";
import Bootstrapper from "../Contracts/Foundation/Bootstrapper";
import LoadConfiguration from "../Foundation/Bootstrap/LoadConfiguration";
import LoadEnvironmentVariables from "../Foundation/Bootstrap/LoadEnvironmentVariables";
import RegisterProviders from "../Foundation/Bootstrap/RegisterProviders";
import BootProviders from "../Foundation/Bootstrap/BootProviders";
import {config} from "../Support/helpers";

export default class Kernel implements KernelContract {
    protected app: Application;

    protected client: CommandoClient;

    protected commandsLoaded: boolean = false;

    protected bootstrappers_: (new (...any: any[]) => Bootstrapper)[] = [
        LoadEnvironmentVariables,
        LoadConfiguration,
        RegisterProviders,
        BootProviders
    ];

    constructor(app: Application) {
        this.app = app;
    }

    public startListening(): void {
        this.client.login(config('services.discord.token'));
    }

    // noinspection JSMethodCanBeStatic
    protected groups(): string[][] {
        return [];
    }

    protected commands() {
        //
    }

    protected load(paths: string | string[]) {
        _(paths).castArray().forEach(path => {
            this.client.registry.registerCommandsIn(path)
        });
    }

    protected registerDefaults() {
        this.client.registry.registerDefaults();
    }

    public async bootstrap(): Promise<void> {
        if (!this.app.hasBeenBootstrapped()) {
            await this.app.bootstrapWith(this.bootstrappers());
        }

        this.client = this.app.make('discord.client');

        if (!this.commandsLoaded) {
            this.client.registry.registerGroups(this.groups());
            this.commands();
            this.commandsLoaded = true;
        }
    }

    protected bootstrappers(): (new (...any: any[]) => Bootstrapper)[] {
        return this.bootstrappers_;
    }
}