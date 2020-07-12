import State from "./State";
import {pretendTypingFor} from "../../../Discord/helpers";
import AssignRolesState from "./AssignRolesState";

export default class IntroduceGameState extends State {
    async init(): Promise<void> {
        await Promise.all([
            this.game.silence(false),
            this.game.clearChat()
        ]);

        await this.game.send('Welcome to Secret Hitler!\n\n' +
            '*The year is 1932. The place is pre-WWII Germany. ' +
            'In Secret Hitler, players are German politicians ' +
            'attempting to hold a fragile Liberal government ' +
            'together and stem the rising tide of Fascism. ' +
            'Watch out though—there are secret Fascists among ' +
            'you, and one player is Secret Hitler.*');

        await pretendTypingFor(this.game.getTextChannel(), 2000);

        this.game.changeState(new AssignRolesState(this.game))
    }
}