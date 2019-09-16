import Bootstrapper from "./Bootstrapper";
import Container from "../Container/Container";
import ServiceProvider from "../../Support/ServiceProvider";

export default interface Application extends Container {
    bootstrapWith(bootstrappers: (new (...any: any[]) => Bootstrapper)[]): Promise<void>;

    hasBeenBootstrapped(): boolean;

    setBasePath(basePath: string): Application;

    path(...paths: string[]): string;

    useAppPath(appPath): Application;

    basePath(...paths: string[]): string;

    configPath(...paths: string[]): string;

    databasePath(...paths: string[]): string;

    useDatabasePath(path: string): Application;

    storagePath(...paths: string[]): string;

    useStoragePath(path: string): Application;

    environmentPath(): string;

    useEnvironmentPath(path: string): Application;

    loadEnvironmentFrom(file: string): Application;

    environmentFile(): string;

    environmentFilePath(): string;

    registerConfiguredProviders(): Promise<void>;

    register(provider: ServiceProvider): Promise<ServiceProvider>;

    isBooted(): boolean;

    boot(): Promise<void>;
}