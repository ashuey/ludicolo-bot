import State from "./StateMachine/State";
import Game from "./Game";

export default class LobbyState extends State {
    protected game: Game;

    constructor(game: Game) {
        super();
        this.game = game;
    }

    init(): void {
        this.on('startGame', () => {
            this.game.changeState(this.game.getStartState());
        })
    }
}