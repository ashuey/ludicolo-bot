import * as Knex from "knex";

export interface DatabaseManagerBase {}

type DatabaseManager = DatabaseManagerBase & Knex;

export default DatabaseManager