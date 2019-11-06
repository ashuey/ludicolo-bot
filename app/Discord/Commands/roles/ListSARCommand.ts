import Command from "@ashuey/ludicolo-discord/lib/Command";
import {RichEmbed} from "discord.js";
import * as _ from 'lodash';

export default class ListSARCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'list-sar',
            aliases: ['lsar'],
            group: 'roles',
            memberName: 'list-sar',
            description: 'Lists all self-assignable roles',
            guildOnly: true
        })
    }

    async handle(msg, args) {
        const guildSAR = await msg.guild.settings.get('sar', []);

        const sarcount = guildSAR.length;

        const sars = _.map(guildSAR, sar => {
            const role = msg.guild.roles.get(sar);
            if (role) {
                return role.name;
            } else {
                return "[DELETED ROLE]";
            }
        });

        const sars_list = sars.join("\n");

        const are_is = sarcount == 1 ? 'is' : 'are';

        const roles = sarcount == 1 ? 'role' : 'roles';

        return msg.embed(new RichEmbed().setColor('GREEN').setTitle(`There ${are_is} ${sarcount} self assignable ${roles}`).setDescription(sars_list));
    }
}