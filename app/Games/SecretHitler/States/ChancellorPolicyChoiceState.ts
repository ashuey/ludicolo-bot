import State from "./State";
import {MessageEmbed} from "discord.js";
import SecretHitlerParty from "../Enums/SecretHitlerParty";

const A = "🇦".codePointAt(0);

export default class ChancellorPolicyChoiceState extends State {
    protected emojiMap = new Map<string, number>();

    get chancellor() {
        return this.game.getData().electedGovernment.getChancellor();
    }

    async init(): Promise<void> {
        this.on('discard_chancellor', this.discard);

        let descriptionText = "The president has provided you the following tiles:\n\n";

        this.game.getData().drawnTiles.forEach((tile, index) => {
            const emoji = String.fromCodePoint(A + this.emojiMap.size);

            descriptionText += `${emoji} ${tile.getPartyDescription()}\n`;

            this.emojiMap.set(emoji, index);
        })

        const message = await this.chancellor.send(new MessageEmbed()
            .setTitle('Legislative Session: Chancellor') // TODO: color
            .setDescription(`${descriptionText}\nPlease react with which policy you would like to DISCARD.`)
            .setFooter('You many not communicate with any other players, including the president.'));

        const collector = message.createReactionCollector((reaction, user) => this.chancellor.is(user, false));

        collector.on('collect', reaction => {
            const tile_index = this.emojiMap.get(reaction.emoji.name);

            if (typeof tile_index !== 'undefined') {
                collector.stop();
                this.game.emit('discard_chancellor', tile_index);
            }
        });
    }

    protected discard(tile_index: number) {
        const [tile] = this.game.getData().drawnTiles.splice(tile_index, 1);

        this.game.getData().policyDeck.discard(tile);

        const passedTile = this.game.getData().drawnTiles[0];

        switch (passedTile.getParty()) {
            case SecretHitlerParty.LIBERAL:
                this.passLiberalPolicy();
                break
            case SecretHitlerParty.FASCIST:
                this.passFascistPolicy();
                break;
            default:
                throw new Error('Unknown policy party');
        }
    }

    protected passLiberalPolicy() {
        //
    }

    protected passFascistPolicy() {
        //
    }
}