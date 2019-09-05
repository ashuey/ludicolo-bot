import DatabaseManager from "../../Contracts/Database/DatabaseManager";
import { MigratorConfig } from "knex";
import Application from "../../Contracts/Foundation/Application";
import {MigratorBase, MigratorMakeCommand} from "../../Contracts/Database/Migrator/Migrator";
import * as path from 'path';

export default class Migrator implements MigratorBase {
    protected app: Application;

    protected db: DatabaseManager;

    constructor(app: Application, db: DatabaseManager) {
        this.app = app;
        this.db = db;
    }

    protected getConfig(config?: MigratorConfig): MigratorConfig {
        config = config || {};

        const default_config = {
            directory: this.app.databasePath('migrations'),
            tableName: this.app.make('config').get('database.migrations', 'migrations'),
            loadExtensions: ['.js']
        };

        return Object.assign(default_config, config);
    }

    public rollback(all?: boolean): Promise<any> {
        return this.db.migrate.rollback(this.getConfig(), all);
    }

    public make(name: string, config?: MigratorMakeCommand): Promise<string> {
        return this.db.migrate.make(name, this.getConfig(config));
    }

    public stubPath(): string {
        return path.join(__dirname, 'stubs');
    }

    public call(p: PropertyKey) {
        return (config?: MigratorConfig) => {
            return this.db.migrate[p](this.getConfig(config));
        }
    }
}