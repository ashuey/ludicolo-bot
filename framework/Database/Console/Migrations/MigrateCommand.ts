import BaseCommand from "./BaseCommand";

export default class MigrateCommand extends BaseCommand {
    protected signature: string = "migrate";

    async handle(): Promise<void> {
        await this.migrator.latest();
    }
}