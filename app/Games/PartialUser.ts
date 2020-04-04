import {DMChannel, PartialTextBasedChannelFields, Snowflake, User} from "discord.js";

export default interface PartialUser {
    id: Snowflake;
    bot: boolean;
    createDM(): Promise<PartialTextBasedChannelFields>;
}