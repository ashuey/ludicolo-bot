import { default as ApplicationContract } from "../Contracts/Foundation/Application"
import Container from "../Container/Container"
import * as path from 'path'
import Bootstrapper from "../Contracts/Foundation/Bootstrapper";
import ServiceProvider from "../Support/ServiceProvider";
import DiscordServiceProvider from "../Discord/DiscordServiceProvider";

export default class Application extends Container implements ApplicationContract {
    protected basePath_: string;

    protected hasBeenBootstrapped_: boolean = false;

    protected booted: boolean = false;

    protected serviceProviders: ServiceProvider[] = [];

    protected appPath_: string;

    protected environmentPath_: string;

    protected environmentFile_: string = '.env';

    constructor(basePath?: string) {
        super();

        if (basePath) {
            this.setBasePath(basePath)
        }

        this.registerBaseBindings();
    }

    protected registerBaseBindings(): void {
        Application.setInstance(this);

        this.instance('app', this);
    }

    public async bootstrapWith(bootstrappers: (new (...any: any[]) => Bootstrapper)[]): Promise<void> {
        this.hasBeenBootstrapped_ = true;

        for (const bootstrapper of bootstrappers) {
             await (new bootstrapper()).bootstrap(this);
        }
    }

    public hasBeenBootstrapped(): boolean {
        return this.hasBeenBootstrapped_;
    }

    public setBasePath(basePath: string): Application {
        this.basePath_ = basePath;
        return this;
    }

    public path(...paths: string[]): string {
        const appPath = this.appPath_ ? this.appPath_ : path.join(this.basePath_, 'app');

        return path.join(appPath, ...paths);
    }

    public useAppPath(appPath): Application {
        this.appPath_ = appPath;

        return this;
    }

    public basePath(...paths: string[]): string {
        return path.join(this.basePath_, ...paths);
    }

    public configPath(...paths: string[]): string {
        return path.join(this.basePath_, 'config', ...paths);
    }

    public environmentPath(): string {
        return this.environmentPath_ ? this.environmentPath_ : this.basePath_;
    }

    public useEnvironmentPath(path: string): Application {
        this.environmentPath_ = path;

        return this;
    }

    public loadEnvironmentFrom(file: string): Application {
        this.environmentFile_ = file;

        return this;
    }

    public environmentFile(): string {
        return this.environmentFile_ ? this.environmentFile_ : '.env';
    }

    public  environmentFilePath(): string {
        return path.join(this.environmentPath(), this.environmentFile());
    }

    public async registerConfiguredProviders(): Promise<void> {
        const providers = this.make('config').get('app.providers');

        for (const provider of providers) {
            await this.register(new provider(this));
        }
    };

    public async register(provider: ServiceProvider): Promise<ServiceProvider> {
        this.serviceProviders.push(provider);

        provider.register();

        if (this.booted) {
            await provider.boot();
        }

        return provider;
    }

    public isBooted(): boolean {
        return this.booted;
    }

    public async boot(): Promise<void> {
        if (this.booted) {
            return;
        }

        for (const provider of this.serviceProviders) {
            await provider.boot();
        }

        this.booted = true;
    }
}