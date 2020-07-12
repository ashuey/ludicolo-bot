import PartialGuildMember from "../PartialGuildMember";
import SecretHitlerRole from "./Enums/SecretHitlerRole";
import PartialUser from "../PartialUser";
import {APIMessage, Message, MessageAdditions, MessageOptions, SplitOptions, StringResolvable} from "discord.js";
import FakeGuildMember from "../FakeGuildMember";

type ComparablePlayer = SecretHitlerPlayer | PartialGuildMember | PartialUser;

function isUser(player: ComparablePlayer): player is PartialUser {
    return player instanceof Object && (!player.hasOwnProperty('user')) && player.hasOwnProperty('id');
}

function isGuildMember(player: ComparablePlayer): player is PartialGuildMember {
    return player instanceof Object && player.hasOwnProperty('user') && player.hasOwnProperty('displayName');
}

function isGamePlayer(player: ComparablePlayer): player is SecretHitlerPlayer {
    return player instanceof SecretHitlerPlayer;
}

export default class SecretHitlerPlayer {
    protected member: PartialGuildMember;

    protected role: SecretHitlerRole;

    protected dead: boolean;

    protected nextPlayer: SecretHitlerPlayer;

    constructor(member: PartialGuildMember, role: SecretHitlerRole) {
        this.member = member;
        this.role = role;
    }

    public getMember(): PartialGuildMember {
        return this.member;
    }

    public getRole(): SecretHitlerRole {
        return this.role;
    }

    public getDead(): boolean {
        return this.dead;
    }

    public setDead(value: boolean): this {
        this.dead = value;
        return this;
    }

    public toString(): string {
        return this.member.displayName;
    }

    public is(player: ComparablePlayer, strict: boolean = true): boolean {
        if (!player) {
            return false;
        }

        const member = this.getMember();

        if (isUser(player)) {
            // If not strict mode and this user is fake, check against owner.
            if (!strict && member instanceof FakeGuildMember && player.id === member.user.getOwner().user.id) {
                return true;
            }

            return player.id === this.member.user.id;
        }

        if (isGuildMember(player)) {
            // If not strict mode and user is fake, check against owner.
            if (!strict && member instanceof FakeGuildMember && player.user.id === member.user.getOwner().user.id) {
                return true;
            }

            return player.user.id === member.user.id;
        }

        if (isGamePlayer(player)) {
            return player.getMember().user.id === member.user.id
        }

        return false;
    }

    send(options: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions | APIMessage): Promise<Message>;
    send(options: (MessageOptions & { split: true | SplitOptions; content: StringResolvable }) | APIMessage): Promise<Message[]>;
    send(content: StringResolvable, options?: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
    send(content: StringResolvable, options?: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
    async send(content: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions | APIMessage | (MessageOptions & { split: true | SplitOptions; content: StringResolvable }) | StringResolvable, options?: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions | (MessageOptions & { split: true | SplitOptions })): Promise<Message | Message[]> {
        return (await this.member.user.createDM()).send(content, options);
    }
}