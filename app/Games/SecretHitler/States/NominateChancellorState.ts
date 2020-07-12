import State from "./State";
import {PartialTextBasedChannelFields, User} from "discord.js";
import SecretHitlerPlayer from "../SecretHitlerPlayer";
import ElectionState from "./ElectionState";

const A = "🇦".codePointAt(0);

export default class NominateChancellorState extends State {
    get nominatedPresident(): SecretHitlerPlayer {
        return this.data.nominatedGovernment.getPresident();
    }

    init(): void {
        this.on('nominate', this.nominate);

        const candidates: Map<string, SecretHitlerPlayer> = this.determineCandidates();

        this.postPrompt(this.game, candidates);
    }

    protected determineCandidates(): Map<string, SecretHitlerPlayer> {
        const candidates = new Map<string, SecretHitlerPlayer>();

        this.data.players.forEach(player => {
            if (player.is(this.nominatedPresident)) {
                return;
            }

            if (!this.data.ignorePartyLimits && this.data.electedGovernment.has(player)) {
                return
            }

            const emoji = String.fromCodePoint(A + candidates.size);

            candidates.set(emoji, player);
        });

        return candidates;
    }

    protected async postPrompt(channel: PartialTextBasedChannelFields, candidates: Map<string, SecretHitlerPlayer>) {
        let messageText = `${this.nominatedPresident.getMember().user} please nominate a chancellor\n`;

        candidates.forEach((player, emoji) => {
            messageText += `\n${emoji}: ${player}`;
        });

        const message = await this.game.send(messageText);

        const collector = message.createReactionCollector((reaction, user: User) => this.nominatedPresident.is(user, false));

        collector.on('collect', r => {
            const player = candidates.get(r.emoji.name);

            if (player) {
                collector.stop();
                this.game.emit('nominate', player);
            }
        })

        for (let emoji of candidates.keys()) {
            await message.react(emoji);
        }
    }

    protected async nominate(player: SecretHitlerPlayer | string) {
        if (typeof player === "string") {
            player = this.game.getData().players[parseInt(player)];
        }

        this.game.getData().nominatedGovernment.setChancellor(player);

        await this.game.send(`President ${this.nominatedPresident} has nominated ${player} as their Chancellor.`);

        this.game.changeState(new ElectionState(this.game));
    }
}