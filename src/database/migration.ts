import { Knex } from "knex";
import { Migration } from "@/common/Migration";
import { Application } from "@/common/Application";

export class MigrationSource implements Knex.MigrationSource<Migration> {
    protected migrations: Migration[];

    constructor(app: Application) {
        this.migrations = [];

        app.modules.forEach(([, module]) => {
            module.migrations.forEach(migration => {
                this.migrations.push(migration);
            })
        })
    }

    async getMigration(migration: Migration): Promise<Knex.Migration> {
        return new MigrationWrapper(migration);
    }

    getMigrationName(migration: Migration): string {
        return migration.name;
    }

    async getMigrations(): Promise<Migration[]> {
        return [...this.migrations];
    }

}

class MigrationWrapper implements Knex.Migration {
    protected inner: Migration;

    constructor(inner: Migration) {
        this.inner = inner;
    }

    up(knex: Knex) {
        console.log(`Running migration: ${this.inner.name}`)
        return this.inner.up(knex);
    }

    down(): never {
        throw new Error("Reversing migrations not supported");
    }
}
