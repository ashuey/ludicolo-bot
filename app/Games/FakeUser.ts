import {DMChannel, GuildMember, PartialTextBasedChannelFields, Snowflake, TextChannel, User} from "discord.js";
import PartialUser from "./PartialUser";

let nextUser: number = 1;

export default class FakeUser implements PartialUser {
    protected owner: GuildMember;

    protected fakeUserId: number;

    public readonly id: Snowflake;

    public readonly bot: boolean = true;

    protected fakeDMChannel?: TextChannel;

    constructor(owner: GuildMember) {
        this.fakeUserId = nextUser;
        nextUser += 1;
        this.owner = owner;
        this.id = `f${this.fakeUserId}`;
    }

    async createDM(): Promise<PartialTextBasedChannelFields> {
        if (!this.fakeDMChannel) {
            this.fakeDMChannel = await this.owner.guild.channels.create(`fake-user-${this.fakeUserId}-dm`, { type: 'text' });
        }

        return this.fakeDMChannel;
    }

    public toString() {
        return `Fake User ${this.fakeUserId}`;
    }
}