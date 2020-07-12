import {PartialTextBasedChannelFields, Snowflake} from "discord.js";

export default interface PartialUser {
    id: Snowflake;
    bot: boolean;
    createDM(): Promise<PartialTextBasedChannelFields>;
    deleteDM(): Promise<PartialTextBasedChannelFields>;
}