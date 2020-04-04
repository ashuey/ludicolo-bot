import BitmojiUser from "../BitmojiUser";
import Axios, {AxiosInstance} from "axios";
import Sticker from "./types/Sticker";
import * as Fuse from "fuse.js";
import * as _ from 'lodash';
import * as refresh from 'passport-oauth2-refresh';

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

    protected fuse: Fuse<Sticker, Fuse.FuseOptions<Sticker>>;

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
            await this.fetchData();
            return true;
        } catch (e) {
            // Continue
        }

        this.log(`Failed to fetch data, attempting refresh`);
        try {
            const newToken: string = await (new Promise(((resolve, reject) => {
                // @ts-ignore
                refresh.requestNewAccessToken('snapchat', this.bitmojiUser.refresh_token, (err, accessToken, refreshToken) => {
                    if (err) {
                        reject(err);
                    }

                    this.log("Got new token");
                    resolve(accessToken);
                });
            })));

            this.log("Re-saving user");
            this.bitmojiUser = await BitmojiUser
                .query()
                .patchAndFetchById(this.bitmojiUser.user, {
                    access_token: newToken
                });

            this.axios.defaults.headers['authorization'] = `Bearer ${newToken}`;

            await new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 10)
            });

            await this.fetchData();
            return true;
        } catch (e) {
            this.log("Error while bootstrapping user:", e);
            return false;
        }
    }

    protected async fetchData(): Promise<void> {
        const responseData = await this.axios.post('/me', {
            query: bitmojiQuery
        });
        this.log("Received response from bitmoji server");
        const bitmojiData = JSON.parse(responseData.data.data.me.bitmoji.packs);
        await this.hydrate(bitmojiData);
    }

    public async hydrate(bitmojiData):Promise<void> {
        this.avatarId = bitmojiData.auth.avatar_id;

        this.bitmojiUser = await BitmojiUser
            .query()
            .patchAndFetchById(this.bitmojiUser.user, {
                bitmoji_id: this.avatarId
            });

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
        const matches = this.fuse.search<Sticker, false, false>(query);
        this.log("Did a search");
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

    protected log(...msg: string[]): void {
        console.log(`[Bitmoji] {${this.bitmojiUser.display_name}}`, ...msg);
    }
}