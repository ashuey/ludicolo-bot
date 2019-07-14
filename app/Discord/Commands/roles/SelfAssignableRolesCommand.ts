import Command from "../../../../framework/Discord/Command";

export default class SelfAssignableRolesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'sar',
            group: 'roles',
            memberName: 'sar',
            description: 'TBA'
        })
    }

    async run(msg, args) {
        return msg.reply("Hello World");
    }
}