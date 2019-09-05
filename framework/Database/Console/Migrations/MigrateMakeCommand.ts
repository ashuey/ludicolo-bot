import BaseCommand from "./BaseCommand";
import {isString} from 'lodash';
import * as path from 'path';

export default class MigrateMakeCommand extends BaseCommand {
    protected signature: string = "make:migration <name>";

    protected configure(cmd): void {
        cmd.option("--create <table>");
        cmd.option("--table <table>");
    }

    async handle(): Promise<void> {
        const name: string = this.argument('name');

        let table: string|null = this.option('table');

        const create: string|false = this.option('create');

        if (!table && isString(create)) {
            table = create;
        }

        await this.migrator.make(name, {
            stub: path.join(this.migrator.stubPath(), 'migration.stub'),
            variables: {
                create: !!create,
                table: table
            }
        });
    }
}