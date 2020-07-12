import Game from "../Game";
import {GuildMember, MessageAdditions, MessageEmbed, User} from "discord.js";
import * as _ from "lodash";
import PolicyTile from "./Types/PolicyTile";
import SecretHitlerParty from "./Enums/SecretHitlerParty";
import SecretHitlerPlayer from "./SecretHitlerPlayer";

const A = "🇦".codePointAt(0);

interface Government {
    president: SecretHitlerPlayer,
    chancellor: SecretHitlerPlayer
}

interface ElectionResult {
    result: boolean;
    votes: boolean[];
}

interface NextLivingPlayerResult {
    player: SecretHitlerPlayer,
    index: number;
}

export default class SecretHitlerOld extends Game {
    getStartState() {
        return null;
    }

    protected playerData: SecretHitlerPlayer[];

    protected hitler: SecretHitlerPlayer;

    protected fascists: SecretHitlerPlayer[] = [];

    protected smallGame: boolean;

    protected liberalPoliciesPassed: number = 0;

    protected fascistPoliciesPassed: number = 0;

    protected lastGovernment: Government;

    protected electionTracker: number = 0;

    constructor(host: GuildMember) {
        super(host, {
            color: undefined,
            maxPlayers: 5,
            minPlayers: 10,
            title: "Secret Hitler",
            voiceChannel: true
        });
    }

    /**
     * Start the game. Resolves when the game has concluded.
     */
    public async start(): Promise<void> {
    }


    protected async electGovernment(ignorePartyLimits: boolean = false): Promise<Government> {
        let currentPresidentIndex = this.lastGovernment ? this.playerData.indexOf(this.lastGovernment.president) : null;

        while (true) {
            const nextPresident = this.getNextLivingPlayer(currentPresidentIndex);
            currentPresidentIndex = nextPresident.index;
            await this.textChannel.send(`The next presidential candidate is ${nextPresident.player.getMember().displayName}`);
            const nextChancellor = await this.getChancellor(nextPresident.player, ignorePartyLimits);

            const candidateGovernment: Government = {
                president: nextPresident.player,
                chancellor: nextChancellor
            }

            const electionResult = await this.getElectionResults(candidateGovernment);

            if (electionResult.result) {
                return candidateGovernment;
            }

            // Unsuccessful election
            this.electionTracker += 1

            if (this.electionTracker >= 3) {
                await this.textChannel.send("Too many failed elections. The country has been thrown into chaos!");
                // TODO: Enact Policy

                this.electionTracker = 0;
                ignorePartyLimits = true;
            }
        }
    }

    protected async getChancellor(president: SecretHitlerPlayer, ignorePartyLimits: boolean): Promise<SecretHitlerPlayer> {
        const candidates = new Map<string, SecretHitlerPlayer>();

        let messageText = `${president.getMember().user} please nominate a chancellor\n`;

        this.playerData.forEach(player => {
            if (player == president) {
                return;
            }

            if (!ignorePartyLimits && this.lastGovernment) {
                if (player == this.lastGovernment.president) {
                    return;
                }

                if (player == this.lastGovernment.chancellor) {
                    return;
                }
            }

            const emoji = String.fromCodePoint(A + candidates.size);

            candidates.set(emoji, player);

            messageText += `\n${emoji}: ${player}`;
        });


        const message = await this.textChannel.send(messageText);

        const collectorPromise = new Promise<SecretHitlerPlayer>(resolve => {
            const collector = message.createReactionCollector((reaction, user: User) => user.id == president.getMember().user.id);

            collector.on('collect', r => {
                const player = candidates.get(r.emoji.name);

                if (player) {
                    resolve(player);
                }
            })
        });

        for (let emoji of candidates.keys()) {
            await message.react(emoji);
        }

        const chancellor = await collectorPromise;

        await message.delete();

        await this.textChannel.send(`President ${president} has nominated ${chancellor} as their Chancellor.`);

        return chancellor;
    }

    protected async getElectionResults(candidates: Government): Promise<ElectionResult> {
        const embed = new MessageEmbed() // TODO: Add color to embed
            .setTitle(`You must vote for the election of president **${candidates.president}** and chancellor **${candidates.chancellor}**`)
            .setFooter("Your vote will be made public");

        const votes = await Promise.all(this.playerData.map(player => {
            return this.getPlayerVote(player, embed);
        }));

        const totalPlayers = this.playerData.length;

        const yeaVotes = _.reduce(votes, (sum, vote) => {
            return vote ? sum + 1 : sum;
        }, 0);

        const result = (yeaVotes / totalPlayers) > 0.5;

        return {
            result,
            votes
        }
    }

    protected async getPlayerVote(player: SecretHitlerPlayer, content: MessageAdditions): Promise<boolean> {
        const dmChannel = await player.getMember().user.createDM();

        const message = await dmChannel.send(content);

        const collectorPromise = new Promise<boolean>(resolve => {
            const collector = message.createReactionCollector((reaction, user: User) => !user.bot);

            collector.on('collect', r => {
                switch (r.emoji.name) {
                    case '👍':
                        collector.stop();
                        resolve(true);
                        break;
                    case '👎':
                        collector.stop();
                        resolve(false);
                        break;
                }
            })
        });

        await message.react('👍');
        await message.react('👎');

        const vote = await collectorPromise;

        await message.delete();

        return vote;
    }

    protected getNextLivingPlayer(currentIndex?: number): NextLivingPlayerResult {
        const newIndex = (currentIndex ? currentIndex + 1 : 0) % this.playerData.length;
        const newPlayer = this.playerData[newIndex];

        return newPlayer.getDead() ? this.getNextLivingPlayer(newIndex) : {
            player: newPlayer,
            index: newIndex
        };
    }

    protected async enactPolicy(policyTile: PolicyTile, actor?: SecretHitlerPlayer) {
        switch (policyTile.getParty()) {
            case SecretHitlerParty.FASCIST:
                this.fascistPoliciesPassed += 1;
                break;
            case SecretHitlerParty.LIBERAL:
                this.liberalPoliciesPassed += 1;
                break;
            default:
                throw new Error("Invalid tile party, unable to change game state.");
        }
        await this.textChannel.send(`A **${policyTile.getPartyDescription()}** policy has been enacted${actor ? ` by ${actor}` : ''}!`);

        // TODO: Special Powers
    }
}