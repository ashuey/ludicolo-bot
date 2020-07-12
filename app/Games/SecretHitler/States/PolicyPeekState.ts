import State from "./State";
import NominateChancellorState from "./NominateChancellorState";
import {Message, MessageEmbed} from "discord.js";
import * as _ from "lodash";

export default class PolicyPeekState extends State {
    get president() {
        return this.game.getData().electedGovernment.getPresident();
    }

    async init(): Promise<void> {
        this.on('ack', this.acknowledge);

        const tiles = this.game.getData().policyDeck.peek(3);

        let embedDescription: string = "The top 3 tiles of the policy deck are:\n";

        _.forEachRight(tiles, (tile => {
            embedDescription += `• ${tile.getPartyDescription()}\n`;
        }))

        // noinspection ES6MissingAwait
        this.game.send(new MessageEmbed() // TODO: Set color for embed
            .setTitle('Executive Action: Policy Peek')
            .setDescription(`${this.president} is looking at the top 3 tiles of the policy deck`))

        const message = await this.president.send(new MessageEmbed() // TODO: Set color for embed
            .setTitle('Executive Action: Policy Peek')
            .setDescription(embedDescription)
            .setFooter('Only you can see this information. React with 👍 to acknowledge'));

        const collector = message.createReactionCollector((reaction, user) =>
            reaction.emoji.name === '👍' && this.president.is(user, false));

        collector.on('collect', r => {
            this.game.emit('ack');
            collector.stop();
        })
    }

    protected acknowledge() {
        this.game.changeState(new NominateChancellorState(this.game));
    }
}