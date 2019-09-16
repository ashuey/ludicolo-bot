import ServiceProvider from "../Support/ServiceProvider";
import DatabaseManager from "./DatabaseManager";
import * as Knex from "knex";
import MigrateCommand from "./Console/Migrations/MigrateCommand";
import Migrator from "./Migrations/Migrator";
import MigrateMakeCommand from "./Console/Migrations/MigrateMakeCommand";
import Model from "./Mapper/Model";

export default class DatabaseServiceProvider extends ServiceProvider {
    register(): void {
        this.registerConnectionServices();
        this.registerMigrationServices();
        this.registerCommands();
    }

    protected registerConnectionServices(): void {
        this.app.singleton('db', app => {
            const manager = new Proxy(new DatabaseManager(app), {
                get(target: DatabaseManager, p: PropertyKey): DatabaseManager | Knex {
                    return p in target ? target[p] : target.connection()[p];
                }
            });

            Model.knex(manager.connection());

            return manager;
        }, 'app');
    }

    protected registerMigrationServices(): void {
        this.app.singleton('db.migrator', (app, db) => {
            return new Proxy(new Migrator(app, db), {
                get(target: Migrator, p: PropertyKey): Migrator | Knex.Migrator {
                    return p in target ? target[p] : target.call(p);
                }
            })
        }, 'app', 'db')
    }

    protected registerCommands(): void {
        this.app.singleton('command.migrate', MigrateCommand, 'db.migrator');
        this.app.singleton('command.migrate.make', MigrateMakeCommand, 'db.migrator');

        this.commands('command.migrate', 'command.migrate.make');
    }
}