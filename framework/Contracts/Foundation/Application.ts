import Bootstrapper from "./Bootstrapper";
import Container from "../Container/Container";
import ServiceProvider from "../../Support/ServiceProvider";

export default interface Application extends Container {
    bootstrapWith(bootstrappers: (new (...any: any[]) => Bootstrapper)[]): void;

    hasBeenBootstrapped(): boolean;

    setBasePath(basePath: string): Application;

    path(...paths: string[]): string;

    useAppPath(appPath): Application;

    basePath(...paths: string[]): string;

    configPath(...paths: string[]): string;

    environmentPath(): string;

    useEnvironmentPath(path: string): Application;

    loadEnvironmentFrom(file: string): Application;

    environmentFile(): string;

    environmentFilePath(): string;

    registerConfiguredProviders(): void;

    register(provider: ServiceProvider): ServiceProvider;

    isBooted(): boolean;

    boot(): void;
}