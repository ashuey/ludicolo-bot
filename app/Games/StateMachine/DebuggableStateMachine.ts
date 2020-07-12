import StateMachine from "./index";
import State from "./State";

export default function DebuggableStateMachine<T extends Constructor<StateMachine>>(BaseClass: T) {
    return class extends BaseClass {
        protected knownStates = new Map<string, Constructor<State>>();

        registerState(...states: Constructor<State>[]) {
            states.forEach(state => {
                this.knownStates.set(state.name, state);
            });
        }

        public getKnownStates(): string[] {
            return Array.from(this.knownStates.keys());
        }

        public pushStateByName(name: string) {
            this.changeState(this.constructState(this.knownStates.get(name)));
        }

        protected constructState(state: Constructor<State>): State {
            return new state();
        }
    }
}