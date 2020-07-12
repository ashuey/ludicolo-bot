import {EventEmitter} from "events";

export default abstract class State extends EventEmitter {
    init(): void {
        // No Init Action
    }

    cleanup(): void {
        // No Cleanup Actions
    }
}