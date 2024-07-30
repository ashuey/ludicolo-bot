import { pino } from "pino";

let level = "trace";
let transport = undefined;

if (process.env["NODE_ENV"] === "development") {
    transport = pino.transport({
        target: 'pino-pretty'
    })
}

if (process.env["NODE_ENV"] === "test") {
    level = "silent";
}

export const logger = pino({
    level,
}, transport);
