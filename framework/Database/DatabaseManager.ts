import Application from "../Contracts/Foundation/Application";
import {DatabaseManagerBase} from "../Contracts/Database/DatabaseManager";
import * as Knex from "knex";

export default class DatabaseManager implements DatabaseManagerBase {
    protected app: Application;

    protected connections: { [s: string]: Knex } = {};

    constructor(app: Application) {
        this.app = app;
    }

    public connection(name?: string): Knex {
        name = this.parseConnectionName(name);

        if (!this.connections.hasOwnProperty(name)) {
            this.connections[name] = this.makeConnection(name);
        }

        return this.connections[name];
    }

    protected parseConnectionName(name?: string): string {
        return name ? name : this.getDefaultConnection();
    }

    protected makeConnection(name: string): Knex {
        const config: object = this.configuration(name);

        const client: string = config['driver'];

        return Knex({
            client: client,
            connection: config
        });
    }

    protected configuration(name: string): object {
        const connections: object = this.app.make('config').get('database.connections');

        if (!connections.hasOwnProperty(name)) {
            throw new Error(`Database ${name} not configured.`);
        }

        return connections[name];
    }

    public getDefaultConnection(): string {
        return this.app.make('config').get('database.default');
    }
}