import { Knex } from "knex";
import { Application } from "@/common/Application";
import { Module } from "@/common/Module";

export class MigrationSource implements Knex.MigrationSource<[string, string]> {
    protected app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    async getMigrations() {
        const migrations: [string, string][] = [];

        this.app.modules.forEach(([moduleName, module]) => {
            if (module.migrations) {
                module.migrations.forEach(([migrationName,]) => {
                    migrations.push([moduleName, migrationName]);
                })
            }
        });

        return migrations;
    }

    getMigrationName([moduleName, migrationName]: [string, string]): string {
        return `${moduleName}::${migrationName}`;
    }

    async getMigration([moduleName, migrationName]: [string, string]): Promise<Knex.Migration> {
        const module = this.getModule(moduleName);
        const up = this.getMigrationFromModule(module, migrationName);
        return {
            up,
            down: async () => {}
        }
    }

    protected getModule(moduleName: string): Module {
        for (const [iModuleName, module] of this.app.modules) {
            if (iModuleName === moduleName) {
                return module;
            }
        }

        throw new Error(`Module ${moduleName} not found`);
    }

    protected getMigrationFromModule(module: Module, migrationName: string): Knex.Migration['up'] {
        if (module.migrations) {
            for (const [iMigrationName, migration] of module.migrations) {
                if (iMigrationName === migrationName) {
                    return migration;
                }
            }
        }

        throw new Error(`Migration ${migrationName} not found`);
    }
}
