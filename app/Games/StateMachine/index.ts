import State from "./State";
import {EventEmitter} from "events";

export default class StateMachine extends EventEmitter {
    protected currentState: State;

    protected running: boolean;

    constructor(initialState: State) {
        super();
        this.changeState(initialState);
        this.running = true;
    }

    changeState(state: State): void {
        if (this.currentState) {
            this.currentState.cleanup();
        }
        
        this.currentState = state;

        state.init();
    }

    emit(event: string | symbol, ...args): boolean | undefined {
        if (this.running) {
            const gameEmit = super.emit(event, ...args)
            return this.currentState.emit(event, ...args) || gameEmit;
        }
    }
}