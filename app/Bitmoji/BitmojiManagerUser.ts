import BitmojiUser from "../BitmojiUser";
import Axios, {AxiosInstance} from "axios";
import Sticker from "./types/Sticker";
import * as Fuse from "fuse.js";
import * as _ from 'lodash';

const bitmojiQuery = `{
    me{
        bitmoji{
            packs(page: "bitmoji-app")
        }
    }
}`;

export default class BitmojiManagerUser {
    protected bitmojiUser: BitmojiUser;

    protected axios: AxiosInstance;

    protected stickers: Sticker[] = [];

    protected avatarId: string;

    protected fuse: Fuse<Sticker>;

    constructor(bitmojiUser: BitmojiUser) {
        this.bitmojiUser = bitmojiUser;

        this.axios = Axios.create({
            baseURL: 'https://api.snapkit.com/v1',
            method: 'post',
            headers: {
                authorization: `Bearer ${bitmojiUser.access_token}`
            }
        });
    }

    public async bootstrap(): Promise<boolean> {
        try {
            const responseData = await this.axios.post('/me', {
                query: bitmojiQuery
            });
            console.log("[Bitmoji] Received response from bitmoji server");
            const bitmojiData = JSON.parse(responseData.data.data.me.bitmoji.packs);
            this.hydrate(bitmojiData);
            return true;
        } catch (e) {
            console.log("[Bitmoji] Error while bootstrapping user:", e);
            return false;
        }
    }

    public hydrate(bitmojiData) {
        this.avatarId = bitmojiData.auth.avatar_id;
        const lastpack = bitmojiData.packs[bitmojiData.packs.length - 1];
        for (let sticker of lastpack.stickers) {
            this.stickers.push(sticker);
        }

        this.fuse = new Fuse(this.stickers, {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "tags"
            ]
        });
    }

    public search(query: string): Sticker[] {

        const matches = this.fuse.search(query);
        console.log("Did a search");
        return matches;
    }

    public findBitmoji(query: string): Sticker | undefined {
        for (let sticker of this.stickers) {
            if (!sticker.capabilities.includes('FRIENDS') && sticker.tags.includes(query.toLowerCase())) {
                return sticker;
            }
        }

        const results = this.search(query);
        return _(results).filter(s => {
            return !s.capabilities.includes('FRIENDS');
        }).head();
    }

    public findFriendmoji(query: string): Sticker | undefined {
        for (let sticker of this.stickers) {
            if (sticker.capabilities.includes('FRIENDS') && sticker.tags.includes(query.toLowerCase())) {
                return sticker;
            }
        }

        const results = this.search(query);
        return _(results).filter(s => {
            return s.capabilities.includes('FRIENDS');
        }).head();
    }
}