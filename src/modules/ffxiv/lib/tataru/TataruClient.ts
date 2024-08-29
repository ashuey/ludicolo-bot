import { WebSocket } from "ws";
import { logger } from "@/logger";
import { TataruRESTClient } from "@/modules/ffxiv/lib/tataru/TataruRESTClient";

const TEN_SECONDS = 10000;
const ONE_MINUTE = 60000;
const THREE_MINUTES = 180000;

export interface PriceSnipeEvent {
    world: string;
    worldId: number;
    itemName: string;
    itemId: number;
    hq: boolean;
    price: number;
    previousPrice: number;
    velocity: number;
    quantity: number;
    priceHome: number | null;
    avgPriceHome: number | null;
}

export type MarketEventHandler = (e: PriceSnipeEvent) => unknown;

export class TataruClient {
    static readonly ENDPOINT = "wss://ribbit.sh/ws";

    protected apiKey: string;

    protected ws: WebSocket | undefined;

    protected handlers: MarketEventHandler[] = [];

    protected _lastMessage = 0;

    protected _lastAlert = 0;

    protected _lastConnectionAttempt = 0;

    protected _lastError: string | undefined = undefined;

    public readonly REST: TataruRESTClient;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.REST = new TataruRESTClient(apiKey);
    }

    public connect() {
        if (this.ws) {
            throw new Error("Already connected!");
        }

        const ws = new WebSocket(TataruClient.ENDPOINT, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            }
        });
        this._lastConnectionAttempt = Date.now();
        this.ws = ws;

        ws.on('error', err => {
            this._lastError = String(err);
            logger.warn(`TataruClient Error: ${err}`);
        });

        ws.on('open', () => {
            logger.info(`Connected to ${ws.url}`);
            this._lastMessage = Date.now();
        })

        ws.on('message', data => {
            this._lastMessage = Date.now();
            this._lastAlert = Date.now();
            const parsed = JSON.parse(String(data));
            logger.trace({ message: parsed }, 'TataruClient: Message')
            this.handlers.forEach(handler => handler(parsed));
        });

        ws.on('close', () => {
            logger.error('TataruClient Closed!');
        });

        ws.on('pong', () => {
            logger.trace('TataruClient Pong!');
            this._lastMessage = Date.now();
        });
    }

    public onAlert(handler: MarketEventHandler) {
        this.handlers.push(handler);
    }

    public heartbeat() {
        // If no socket connection, or just connected, no need to check heartbeat
        if (!this.ws || (Date.now() - this._lastConnectionAttempt) < TEN_SECONDS) {
            return;
        }

        if ((Date.now() - this._lastMessage) > THREE_MINUTES) {
            logger.warn("TataruClient: No messages in over 3 minutes. Reconnecting...");
            this.cleanup();
            this.connect();
            return;
        }

        if ((Date.now() - this._lastMessage) > ONE_MINUTE) {
            logger.warn("TataruClient: No messages in over 1 minutes. Sending Ping...");
            this.ws.ping();
            return;
        }
    }

    public shutdown() {
        this.cleanup();
    }

    protected cleanup() {
        this.ws?.close();
        this._lastMessage = 0;
        this._lastAlert = 0;
        this._lastConnectionAttempt = 0;
        this.ws = undefined;
    }

    get lastConnectionAttempt() {
        return this._lastConnectionAttempt;
    }
    get lastAlert() {
        return this._lastAlert;
    }
    get lastMessage() {
        return this._lastMessage;
    }

    get lastError() {
        return this._lastError;
    }

    get readyState() {
        return this.ws?.readyState
    }
}
