import {DMChannel, GuildMember, PartialTextBasedChannelFields, Snowflake, TextChannel, User} from "discord.js";
import PartialUser from "./PartialUser";
import PartialGuildMember from "./PartialGuildMember";

let nextUser: number = 1;

export const fakeMembers: FakeGuildMember[] = [];

export default class FakeGuildMember implements PartialGuildMember {
    user: FakeUser;

    constructor(owner: GuildMember) {
        this.user = new FakeUser(owner);
        fakeMembers.push(this);
    }

    get displayName(): string {
        return this.user.toString();
    }
}

class FakeUser implements PartialUser {
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

    async createDM(): Promise<TextChannel> {
        if (!this.fakeDMChannel) {
            this.fakeDMChannel = await this.owner.guild.channels.create(`fake-user-${this.fakeUserId}-dm`, {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: this.owner.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL']
                    },
                    {
                        id: this.owner.id,
                        allow: ['VIEW_CHANNEL']
                    }
                ]
            });
        }

        return this.fakeDMChannel;
    }

    async deleteDM(): Promise<TextChannel> {
        if (this.fakeDMChannel) {
            return this.fakeDMChannel.delete();
        }
    }

    public toString() {
        return `Fake User ${this.fakeUserId}`;
    }

    public getOwner(): GuildMember {
        return this.owner;
    }
}