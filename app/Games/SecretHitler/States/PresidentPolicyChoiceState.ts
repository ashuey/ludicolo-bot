import State from "./State";
import {MessageEmbed} from "discord.js";
import ChancellorPolicyChoiceState from "./ChancellorPolicyChoiceState";

const A = "🇦".codePointAt(0);

export default class PresidentPolicyChoiceState extends State {
    protected emojiMap = new Map<string, number>();

    get president() {
        return this.game.getData().electedGovernment.getPresident();
    }

    async init(): Promise<void> {
        this.game.getData().drawnTiles = this.game.getData().policyDeck.draw(3);

        this.on('discard', this.discard);

        let descriptionText = "You have drawn the following tiles:\n\n";

        this.game.getData().drawnTiles.forEach((tile, index) => {
            const emoji = String.fromCodePoint(A + this.emojiMap.size);

            descriptionText += `${emoji} ${tile.getPartyDescription()}\n`;

            this.emojiMap.set(emoji, index);
        })

        const message = await this.president.send(new MessageEmbed() // TODO: color
            .setTitle('Legislative Session: President')
            .setDescription(`${descriptionText}\nPlease react with which policy you would like to DISCARD.`)
            .setFooter('You many not communicate with any other players, including the chancellor.'));

        const collector = message.createReactionCollector((reaction, user) => this.president.is(user, false));

        collector.on('collect', reaction => {
            const tile_index = this.emojiMap.get(reaction.emoji.name);

            if (typeof tile_index !== 'undefined') {
                collector.stop();
                this.game.emit('discard', tile_index);
            }
        })

        for (let emoji of this.emojiMap.keys()) {
            await message.react(emoji);
        }
    }

    protected async discard(tile_index: number) {
        const [tile] = this.game.getData().drawnTiles.splice(tile_index, 1);

        this.game.getData().policyDeck.discard(tile);

        this.game.changeState(new ChancellorPolicyChoiceState(this.game));
    }
}