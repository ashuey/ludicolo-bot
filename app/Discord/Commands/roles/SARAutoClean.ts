import Command from "@ashuey/ludicolo-discord/lib/Command";
import {MessageEmbed} from "discord.js";
import * as _ from 'lodash';

export default class ListSARCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'sar-auto-clean',
            group: 'roles',
            memberName: 'sar-auto-clean',
            description: 'Removes deleted roles from the self-assignable role list',
            guildOnly: true,
            userPermissions: ['MANAGE_ROLES'],
        })
    }

    async handle(msg, args) {
        const guildSAR = await msg.guild.settings.get('sar', []);

        let guildSARLength = guildSAR.length;

        const newGuildSAR = _.filter(guildSAR, function (sar) {
            return !!msg.guild.roles.get(sar);
        });

        await msg.guild.settings.set('sar', newGuildSAR);

        guildSARLength = guildSARLength - newGuildSAR.length;

        const roles = guildSARLength == 1 ? 'role' : 'roles';

        return msg.embed(new MessageEmbed().setColor('GREEN').setTitle(`Removed ${guildSARLength} deleted ${roles} from the self-assignable roles list`));
    }
}