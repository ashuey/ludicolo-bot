import dayjs from "dayjs";
import {JSDOM} from "jsdom";
import { Result } from "@/common/Result";
import { AtomFeed } from "@/modules/djtrivia/Atom";

export interface DJTriviaHint {
    published: dayjs.Dayjs,
    title: string,
    content: string
}

export class DJTrivia {
    static readonly ENDPOINT = "https://cod.djtrivia.com/feeds/posts/default?alt=json";

    public async getLatest(): Promise<Result<DJTriviaHint>> {
        const result = await fetch(DJTrivia.ENDPOINT, { signal: AbortSignal.timeout(5000) });

        if (result.status < 200 || result.status >= 300) {
            return [false, new Error(`HTTP Error ${result.status}`)];
        }

        const body: AtomFeed = await result.json();

        const latest = body.feed.entry[0];

        if (!latest) {
            return [false, new Error('No entries found')];
        }

        const dom = new JSDOM(latest.content.$t.replaceAll('&nbsp;', ' '));
        const node = dom.window.document.querySelector('p');

        if (!node) {
            return [false, new Error('Entry body did not contain expected markup')];
        }

        return [true, {
            published: dayjs(latest.published.$t),
            title: latest.title.$t,
            content: node.textContent ?? '',
        }];
    }
}

export const djTrivia = new DJTrivia();
