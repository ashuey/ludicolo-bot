import axios from "axios";
import { Result } from "@/common/Result";
import { AtomFeed } from "@/modules/djtrivia/Atom";
import dayjs from "dayjs";
import { load } from "cheerio";

export interface DJTriviaHint {
    published: dayjs.Dayjs,
    title: string,
    content: string
}

export class DJTrivia {
    static readonly ENDPOINT = "https://cod.djtrivia.com/feeds/posts/default?alt=json";

    protected readonly http;

    constructor() {
        this.http = axios.create({
            timeout: 2000,
            validateStatus: () => true,
        });
    }

    public async getLatest(): Promise<Result<DJTriviaHint>> {
        const result = await this.http.get<AtomFeed>(DJTrivia.ENDPOINT);

        if (result.status < 200 || result.status >= 300) {
            return [false, new Error(`HTTP Error ${result.status}`)];
        }

        const latest = result.data.feed.entry[0];

        if (!latest) {
            return [false, new Error('No entries found')];
        }

        const content = load(latest.content.$t.replaceAll('&nbsp;', ' '));

        return [true, {
            published: dayjs(latest.published.$t),
            title: latest.title.$t,
            content: content('p').text(),
        }];
    }
}

export const djTrivia = new DJTrivia();
