import Game from "../Game";
import State from "../StateMachine/State";
import {ColorResolvable, GuildMember, MessageEmbed} from "discord.js";
import PolicyDeck from "./PolicyDeck";
import SecretHitlerGameData from "./Types/SecretHitlerGameData";
import Government from "./Government";
import IntroduceGameState from "./States/IntroduceGameState";
import Counter from "../Types/Counter";
import SecretHitlerParty from "./Enums/SecretHitlerParty";
import {Map as ImmutableMap} from "immutable";

export default class SecretHitler extends Game {
    protected data: SecretHitlerGameData;

    static readonly colors = ImmutableMap<string | SecretHitlerParty, ColorResolvable>([
        [SecretHitlerParty.LIBERAL, 'BLUE'],
        [SecretHitlerParty.FASCIST, 'RED']
    ]);

    constructor(host: GuildMember) {
        super(host, {
            color: undefined,
            maxPlayers: 5,
            minPlayers: 10,
            title: "Secret Hitler",
            voiceChannel: true
        });

        this.registerGlobalListeners();

        this.initializeGameData();
    }

    initializeGameData() {
        this.data = {
            drawnTiles: [],
            players: [],
            electedGovernment: new Government(this),
            nominatedGovernment: new Government(this),
            liberalPoliciesPassed: 0,
            fascistPoliciesPassed: 0,
            ignorePartyLimits: false,
            policyDeck: new PolicyDeck()
        }
    }

    protected registerGlobalListeners() {
        this.on('reshuffle', async (counter: Counter<SecretHitlerParty>) => {
            // TODO: Add color to embed
            return this.send(new MessageEmbed().setTitle(`Deck shuffled: ${counter.get(SecretHitlerParty.LIBERAL) || 0} liberal and ${counter.get(SecretHitlerParty.FASCIST) || 0} fascist policies.`));
        });
    }

    getStartState(): State {
        return new IntroduceGameState(this);
    }

    getData(): SecretHitlerGameData {
        return this.data;
    }

    isSmallGame() {
        return this.data.players.length < 7;
    }

    dumpState(): object {
        return Object.assign(super.dumpState(), {
            data: this.data
        });
    }
}