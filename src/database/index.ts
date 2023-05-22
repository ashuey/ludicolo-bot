import { Knex } from "knex";

export function getKnexConfig(dbUrl: string): Knex.Config {
    const connectionUrl = new URL(dbUrl);

    switch (connectionUrl.protocol) {
        case "sqlite:":
            return {
                client: 'sqlite',
                connection: {
                    filename: connectionUrl.host,
                },
                migrations: {
                    tableName: 'migrations'
                }
            }
        case "pg:":
            return {
                client: 'pg',
                connection: dbUrl,
                migrations: {
                    tableName: 'migrations'
                }
            }
    }

    throw new Error("Invalid or unsupported database protocol")
}
