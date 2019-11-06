import {Snowflake, User} from "discord.js";
import BitmojiUser from "../BitmojiUser";
import BitmojiManagerUser from "./BitmojiManagerUser";
import UrlSigner from "../Http/UrlSigner";
import {app, config} from "@ashuey/ludicolo-framework/lib/Support/helpers";
import * as url from 'url';

export default class BitmojiManager {
    protected userCache: { [key: string]: BitmojiManagerUser } = {};

    protected urlSigner: UrlSigner;

    constructor() {
        this.urlSigner = app<UrlSigner>('url_signer');
    }


    /**
     * Retrieve a BitmojiManagerUser from the cache or false on cache miss.
     * @param {Snowflake} user_id
     */
    protected getCachedUser(user_id: Snowflake): BitmojiManagerUser | false {
        if (this.userCache.hasOwnProperty(user_id)) {
            return this.userCache[user_id];
        }

        return false;
    }

    /**
     * Cache a BitmojiManagerUser in all applicable caches
     * @param {Snowflake} userId
     * @param {BitmojiManagerUser} user
     */
    protected cacheUser(userId: Snowflake, user: BitmojiManagerUser): void {
        this.userCache[userId] = user;
    }

    /**
     * Create, hydrate, and cache a BitmojiManagerUser given a BitmojiUser from the database.
     *
     * @param {BitmojiUser} bitmojiUser
     */
    public async stashUser(bitmojiUser: BitmojiUser): Promise<BitmojiManagerUser | false> {
        const bitmojiManagerUser = new BitmojiManagerUser(bitmojiUser);

        const bootstrapResult = await bitmojiManagerUser.bootstrap();

        if (!bootstrapResult) {
            return false;
        }

        this.cacheUser(bitmojiUser.user, bitmojiManagerUser);

        return bitmojiManagerUser;
    }

    /**
     * Given a Discord User object, return a hydrated BitmojiManagerUser or false on failure
     *
     * @param {User} user The Discord user to match
     */
    public async getByDiscordUser(user: User): Promise<BitmojiManagerUser | false> {
        const userId: Snowflake = user.id;

        const cachedBitmojiManagerUser = this.getCachedUser(userId);

        if (cachedBitmojiManagerUser) {
            return cachedBitmojiManagerUser;
        }

        const bitmojiUser = await BitmojiUser.query().findById(userId);

        if (!bitmojiUser) {
            return false;
        }

        return this.stashUser(bitmojiUser);
    }

    public async sendSetup(user: User): Promise<void> {
        const dm = await user.createDM();
        const baseUrl =  url.resolve(config('http.url'), `/auth/snapkit/login/${user.id}`);
        const authUrl = this.urlSigner.sign(baseUrl);
        await dm.send(`In order to use Bitmoji, you need to setup your account first. Click here to login:\n${authUrl}`);
    }
}