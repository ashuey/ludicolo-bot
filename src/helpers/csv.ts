import { Readable } from "node:stream";
import type { ReadableStream } from "node:stream/web";
import { Options, parse } from "csv-parse";

export function parserFromResponse(response: Response, options?: Options) {
    if (response.body === null) {
        throw new Error("Response body was empty");
    }

    const parser = parse(options);

    // These type conversions are nonsense. Blame the Node.js stream types.
    const rStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
    rStream.pipe(parser as unknown as NodeJS.WritableStream);

    return parser;
}
