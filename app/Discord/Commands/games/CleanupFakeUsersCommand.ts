import {CommandoMessage, CommandoClient} from "discord.js-commando";
import Command from "@ashuey/ludicolo-discord/lib/Command";
import {fakeMembers} from "../../../Games/FakeGuildMember";

export default class CleanupFakeUsersCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'cleanup-fake-users',
            aliases: ['cleanup-fake', 'cleanupfakeusers', 'cleanupfake'],
            group: 'games',
            memberName: 'cleanup-fake-users',
            description: 'Cleans up fake user DM channels',
            guildOnly: true,
            ownerOnly: true,
        });
    }

    async handle(msg: CommandoMessage): Promise<null> {
        await Promise.all(fakeMembers.map(async fakeGuildMember => {
            return fakeGuildMember.user.deleteDM();
        }));

        return null;
    }
}