import Container from "../Container/Container";
import ApplicationContract from "../Contracts/Foundation/Application";
import RepositoryContract from "../Contracts/Config/Repository";

export function app(): ApplicationContract;

export function app(abstract_): any;

export function app(abstract_?): ApplicationContract | any {
    if (abstract_) {
        return Container.getInstance().make(abstract_);
    }

    return Container.getInstance().make('app');
}

export function app_path(...paths: string[]): string {
    return app().path(...paths);
}

export function base_path(...paths: string[]): string {
    return app().basePath(...paths);
}

export function env(key: string, default_: any = null): any {
    return process.env.hasOwnProperty(key) ? process.env[key] : default_;
}

export function config(key?: string, default_ = null): any {
    const config: RepositoryContract = app('config');

    return key ? config.get(key, default_) : config;
}