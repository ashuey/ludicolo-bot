import { Command } from "commander";
import { Application } from "@/index";
import { MigrationSource } from "@/database/migration";

export const migrate = (new Command('migrate'))
    .action(async () => {
        const app = new Application();

        await app.db.migrate.latest({
            migrationSource: new MigrationSource(app)
        });

        console.log("✔ Completed migration");

        await app.db.destroy();
    });
