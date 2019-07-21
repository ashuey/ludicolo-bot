import ServiceProvider from "../Support/ServiceProvider";
import DatabaseManager from "./DatabaseManager";
import * as Knex from "knex";

export default class DatabaseServiceProvider extends ServiceProvider {
    register(): void {
        this.registerConnectionServices();
    }

    protected registerConnectionServices(): void {
        this.app.singleton('db', app => {
            return new Proxy(new DatabaseManager(app), {
                get(target: DatabaseManager, p: PropertyKey): DatabaseManager | Knex {
                    return p in target ? target[p] : target.connection()[p];
                }
            })
        }, 'app');
    }
}