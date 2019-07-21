import DatabaseManager from "../Contracts/Database/DatabaseManager";
import {app} from "../Support/helpers";

export async function updateOrInsert(table, attributes, values = {}): Promise<void> {
    const db: DatabaseManager = app('db');

    return db.transaction(async trx => {
        const result = await trx.table(table).where(attributes);

        if (result.length > 0) {
            await trx.table(table).where(attributes).update(values);
        } else {
            const combined = { ...attributes, ...values };

            await trx.table(table).insert(combined);
        }
    })
}