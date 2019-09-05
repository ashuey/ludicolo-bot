import Command from "../../../Console/Command";
import Migrator from "../../../Contracts/Database/Migrator/Migrator";

export default abstract class BaseCommand extends Command {
    protected migrator: Migrator;

    constructor(migrator: Migrator) {
        super();
        this.migrator = migrator;
    }
}