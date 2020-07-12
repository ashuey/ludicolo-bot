import {TextBasedChannelFields} from "discord.js";
import {sleep} from "../helpers";

export async function pretendTypingFor(channel: TextBasedChannelFields, timeout: number) {
    // noinspection ES6MissingAwait
    channel.startTyping();
    await sleep(timeout);
    channel.stopTyping();
}