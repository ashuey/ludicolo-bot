import State from "./State";
import NominateChancellorState from "./NominateChancellorState";

export default class AssignPresidentState extends State {
    async init(): Promise<void> {
        const newPresident = this.game.getData().nominatedGovernment
            .advancePresident()
            .resetChancellor()
            .getPresident();

        await this.game.send(`The next presidential candidate is ${newPresident.getMember().displayName}`);

        this.game.changeState(new NominateChancellorState(this.game));
    }
}