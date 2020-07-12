import {EventEmitter} from "events";

export default function EventEmitterMixin<T extends Constructor>(BaseClass: T) {
    return class extends BaseClass implements EventEmitter {
        private eventBus: EventEmitter = new EventEmitter();

        addListener(event: string | symbol, listener: (...args: any[]) => void): this {
            this.eventBus.addListener(event, listener);
            return this;
        }

        emit(event: string | symbol, ...args: any[]): boolean {
            return this.eventBus.emit(event, ...args);
        }

        eventNames(): Array<string | symbol> {
            return this.eventBus.eventNames();
        }

        getMaxListeners(): number {
            return this.eventBus.getMaxListeners();
        }

        listenerCount(type: string | symbol): number {
            return this.eventBus.listenerCount(type);
        }

        listeners(event: string | symbol): Function[] {
            return this.eventBus.listeners(event);
        }

        off(event: string | symbol, listener: (...args: any[]) => void): this {
            this.eventBus.off(event, listener);
            return this;
        }

        on(event: string | symbol, listener: (...args: any[]) => void): this {
            this.eventBus.on(event, listener);
            return this;
        }

        once(event: string | symbol, listener: (...args: any[]) => void): this {
            this.eventBus.once(event, listener);
            return this;
        }

        prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
            this.eventBus.prependListener(event, listener);
            return this;
        }

        prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
            this.eventBus.prependOnceListener(event, listener);
            return this;
        }

        rawListeners(event: string | symbol): Function[] {
            return this.eventBus.rawListeners(event);
        }

        removeAllListeners(event?: string | symbol): this {
            this.eventBus.removeAllListeners(event);
            return this;
        }

        removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
            this.eventBus.removeListener(event, listener);
            return this;
        }

        setMaxListeners(n: number): this {
            this.eventBus.setMaxListeners(n);
            return this;
        }
    }
}