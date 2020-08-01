import SecretHitler from "../index";
import PartialGuildMember from "../../PartialGuildMember";
import * as _ from "lodash";
import SecretHitlerPlayer from "../SecretHitlerPlayer";
import SecretHitlerRole from "../Enums/SecretHitlerRole";
import NominateChancellorState from "./NominateChancellorState";
import State from "./State";
import AssignPresidentState from "./AssignPresidentState";

export default class AssignRolesState extends State {
    constructor(game: SecretHitler) {
        super(game);
    }

    async init(): Promise<void> {
        const players = _.shuffle<PartialGuildMember>(Array.from(this.game.getPlayers().values()));

        const playerData: SecretHitlerPlayer[] = [];

        const fascistCount = Math.ceil((players.length - 4) / 2);

        // Pick a Hitler
        const member = players.pop();
        playerData.push(new SecretHitlerPlayer(member, SecretHitlerRole.HITLER));

        // Pick Fascists
        for (let i = 0; i < fascistCount; i++) {
            const member = players.pop();
            playerData.push(new SecretHitlerPlayer(member, SecretHitlerRole.FASCIST));
        }

        // Assign Liberals
        players.forEach(player => {
            playerData.push(new SecretHitlerPlayer(player, SecretHitlerRole.LIBERAL));
        });

        // Shuffle players and save play order
        this.data.players = _.shuffle(playerData);

        // Send players their roles
        await this.sendRolesToPlayers();

        await this.game.send('Each of you have been sent your role in a DM. Please look at them now. Keep your identity secret.');

        // Unsilence the chat
        await this.game.unsilence();

        // Advance game to the first election
        this.game.changeState(new AssignPresidentState(this.game))
    }

    protected async sendRolesToPlayers(): Promise<void> {
        let hitler: string;
        let fascists: string[] = [];

        this.data.players.forEach(player => {
            if (player.getRole() === SecretHitlerRole.HITLER) {
                hitler = player.getMember().displayName;
            }

            if (player.getRole() === SecretHitlerRole.FASCIST) {
                fascists.push(player.getMember().displayName);
            }
        });

        const promises = Object.values<SecretHitlerPlayer>(this.data.players).map(async playerData => {
            const dmChannel = await playerData.getMember().user.createDM();
            await dmChannel.send(`Welcome to Secret Hitler!\nYour role is: **${this.getRoleDescription(playerData.getRole())}**`);

            if (playerData.getRole() === SecretHitlerRole.FASCIST || (this.game.isSmallGame() && playerData.getRole() === SecretHitlerRole.HITLER)) {
                return dmChannel.send(`\n\nHitler: ${hitler}\nFascists: ${fascists.join(', ')}`)
            }

            if (playerData.getRole() === SecretHitlerRole.HITLER) {
                return dmChannel.send(`There are ${fascists.length} other fascists in this game. You do not know their identity, but they know yours.`)
            }
        });

        await Promise.all(promises);
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