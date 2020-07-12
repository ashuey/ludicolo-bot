import {MessageEmbed, MessageEmbedOptions} from "discord.js";

export default class InfoMessageEmbed extends MessageEmbed {
    constructor(data?: MessageEmbed | MessageEmbedOptions) {
        super(data);
        this.setColor('AQUA');
    }
}