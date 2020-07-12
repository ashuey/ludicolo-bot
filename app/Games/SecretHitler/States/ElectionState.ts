import State from "./State";
import SecretHitlerPlayer from "../SecretHitlerPlayer";
import {Message, MessageEmbed, ReactionCollector, User} from "discord.js";
import * as _ from "lodash";
import FailedElectionState from "./FailedElectionState";
import ChancellorPolicyChoiceState from "./ChancellorPolicyChoiceState";

interface PlayerBallot {
    message: Message;
    collector: ReactionCollector;
}

export default class ElectionState extends State {
    protected votes = new Map<SecretHitlerPlayer, boolean>();

    protected ballots: PlayerBallot[];

    get candidates() {
        return this.game.getData().nominatedGovernment;
    }

    async init(): Promise<void> {
        this.on('vote', (player, vote) => this.handleVote(player, vote));

        const ballotMessage = new MessageEmbed() // TODO: add color to embed
            .setTitle(`Election`)
            .setFooter("Your vote will be made public once all players have voted.")
            .setDescription('Please vote Yes (👍) or No (👎)')
            .addField('President', this.candidates.getPresident().getMember().displayName, true)
            .addField('Chancellor', this.candidates.getChancellor().getMember().displayName, true)

        this.ballots = await Promise.all(this.game.getData().players.map(player => {
            return this.sendPlayerBallot(player, ballotMessage);
        }))
    }

    protected async handleVote(player: SecretHitlerPlayer, vote: boolean) {
        this.votes.set(player, vote);

        if (this.votes.size == this.game.getData().players.length) {
            await this.endVoting();

            await this.endElection();
        }
    }

    protected async sendPlayerBallot(player: SecretHitlerPlayer, content: MessageEmbed): Promise<PlayerBallot> {
        const dmChannel = await player.getMember().user.createDM();

        const message = await dmChannel.send(content);

        const collector = message.createReactionCollector((reaction, user: User) => player.is(user));

        collector.on('collect', r => {
            switch (r.emoji.name) {
                case '👍':
                    this.game.emit('vote', player, true);
                    break;
                case '👎':
                    this.game.emit('vote', player, false);
                    break;
            }
        });

        await message.react('👍');
        await message.react('👎');

        return {
            message,
            collector
        }
    }

    protected async endVoting() {
        return Promise.all(this.ballots.map(async (ballot) => {
            ballot.collector.stop();
            return ballot.message.delete();
        }))
    }

    protected async endElection(): Promise<void> {
        let yeaVotes = 0;

        for (let vote of this.votes.values()) {
            if (vote) {
                yeaVotes += 1;
            }
        }

        const electionResult = (yeaVotes / this.votes.size) > 0.5;

        const yeaVoteLines: string[] = [];
        const neaVoteLines: string[] = [];

        _.shuffle(Array.from(this.votes.entries())).forEach(([player, vote]) => {
            if (vote) {
                yeaVoteLines.push(`+ ${player.getMember().displayName} voted YES`);
            } else {
                neaVoteLines.push(`- ${player.getMember().displayName} voted NO`);
            }
        });

        const votesMessage = "```diff\n" + yeaVoteLines.join("\n") + "\n" + neaVoteLines + "\\n```";

        if (electionResult) {
            await this.game.send(new MessageEmbed() // TODO: add color to embed
                .setTitle(`The election has passed. ${this.candidates.getPresident().getMember().displayName} and ${this.candidates.getChancellor().getMember().displayName} have been elected to government.`))

            await this.game.send(votesMessage);

            this.game.changeState(new ChancellorPolicyChoiceState(this.game));
        } else {
            await this.game.send(new MessageEmbed() // TODO: add color to embed
                .setTitle('The election has failed.'));

            await this.game.send(votesMessage);

            this.game.changeState(new FailedElectionState(this.game));
        }
    }
}