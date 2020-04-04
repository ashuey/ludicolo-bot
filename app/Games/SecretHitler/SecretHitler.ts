import Game from "../Game";
import SecretHitlerGameState from "./SecretHitlerGameState";
import {GuildMember, Snowflake, User} from "discord.js";
import * as _ from "lodash";
import PartialUser from "../PartialUser";

interface PlayerData {
    user: PartialUser,
    role: SecretHitlerRole,
    dead: boolean
}

export default class SecretHitler extends Game {

    protected gameState: SecretHitlerGameState = 0;

    protected playerData: { [key: string]: PlayerData } = {};

    protected hitler: Snowflake;

    protected smallGame: boolean;

    constructor(host: GuildMember) {
        super(host, {
            color: undefined,
            maxPlayers: 5,
            minPlayers: 10,
            title: "Secret Hitler",
            voiceChannel: true
        });
    }

    protected createNewPlayer(user: PartialUser, role: SecretHitlerRole): PlayerData {
        return {
            user,
            role,
            dead: false
        }
    }

    public async start(): Promise<void> {
        const players = _.shuffle<PartialUser>(Array.from(this.players.values()));

        const fascistCount = Math.ceil((players.length - 4) / 2);

        this.smallGame = players.length < 7;

        // Pick a Hitler
        const hitler = players.pop();
        this.hitler = hitler.id;
        this.playerData[hitler.id] = this.createNewPlayer(hitler, SecretHitlerRole.HITLER);

        // Pick Fascists
        for (let i = 0; i < fascistCount; i++) {
            const fascist = players.pop();
            this.playerData[fascist.id] = this.createNewPlayer(fascist, SecretHitlerRole.FASCIST);
        }

        // Assign Liberals
        players.forEach(player => {
            this.playerData[player.id] = this.createNewPlayer(player, SecretHitlerRole.LIBERAL);
        })
    }

    public async assignRoles(): Promise<void[]> {
        const promises = Object.values<PlayerData>(this.playerData).map(async playerData => {
            const dmChannel = await playerData.user.createDM();
            await dmChannel.send(`Welcome to Secret Hitler!\nYour role is: **${this.getRoleDescription(playerData.role)}\n`);

            if (playerData.role === SecretHitlerRole.FASCIST || (this.smallGame && playerData.role === SecretHitlerRole.HITLER)) {
                await dmChannel.send(`Hitler: HITLER\nFascists: FASCISTS`)
            }
        });

        return Promise.all(promises);
    }

    protected getRoleDescription(role: SecretHitlerRole): string {
        switch (role) {
            case SecretHitlerRole.FASCIST:
                return "Fascist";
            case SecretHitlerRole.HITLER:
                return "Hitler";
            case SecretHitlerRole.LIBERAL:
                return "Liberal";
            default:
                return "Unknown";
        }
    }
}