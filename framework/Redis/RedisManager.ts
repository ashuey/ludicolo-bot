import {RedisManagerBase} from "../Contracts/Redis/RedisManager";
import Application from "../Contracts/Foundation/Application";
import {RedisClient, createClient} from "redis";

export default class RedisManager implements RedisManagerBase {
    protected app: Application;

    protected connections: { [s: string]: RedisClient } = {};

    constructor(app: Application) {
        this.app = app;
    }

    public connection(name?: string): RedisClient {
        name = this.parseConnectionName(name);

        if (!this.connections.hasOwnProperty(name)) {
            this.connections[name] = this.makeConnection(name);
        }

        return this.connections[name];
    }

    protected parseConnectionName(name?: string): string {
        return name ? name : 'default';
    }

    protected makeConnection(name: string): RedisClient {
        const config: object = this.configuration(name);

        return createClient(config);
    }

    protected configuration(name: string): object {
        const connections: object = this.app.make('config').get('database.redis');

        if (!connections.hasOwnProperty(name)) {
            throw new Error(`Redis connection ${name} not configured.`)
        }

        return connections[name]
    }
}