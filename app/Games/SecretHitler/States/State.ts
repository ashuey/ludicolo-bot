import OriginalState from "../../StateMachine/State";
import SecretHitler from "../index";
import SecretHitlerGameData from "../Types/SecretHitlerGameData";

export default abstract class State extends OriginalState {
    protected game: SecretHitler;

    constructor(game: SecretHitler) {
        super();
        this.game = game;
    }

    get data(): SecretHitlerGameData {
        return this.game.getData();
    }
}