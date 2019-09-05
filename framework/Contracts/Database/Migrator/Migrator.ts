import {MigratorConfig} from "knex";

export interface MigratorBase {
    stubPath(): string;
}

export interface MigratorMakeCommand extends MigratorConfig {
    variables?: object
}

interface KnexMigrator {
    make(name: string, config?: MigratorMakeCommand): Promise<string>;
    latest(config?: MigratorConfig): Promise<any>;
    rollback(config?: MigratorConfig, all?: boolean): Promise<any>;
    status(config?: MigratorConfig): Promise<number>;
    currentVersion(config?: MigratorConfig): Promise<string>;
    up(config?: MigratorConfig): Promise<any>;
    down(config?: MigratorConfig): Promise<any>;
}

type Migrator = MigratorBase & KnexMigrator;

export default Migrator