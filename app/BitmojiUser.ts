import Model from "@ashuey/ludicolo-framework/lib/Database/Mapper/Model";
import {Snowflake} from "discord.js";

export default class BitmojiUser extends Model {
    public user: Snowflake;

    public access_token: string;

    public refresh_token: string;

    public display_name: string;

    public snapchat_id: string;

    public bitmoji_id: string;

    public bitmoji_avatar: string;

    static get idColumn() {
        return 'user';
    }
}