import { WebSocket } from "ws";
import { logger } from "@/logger";

const TEN_SECONDS = 10000;
const TWO_MINUTES = 120000;

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
}

export type MarketEventHandler = (e: PriceSnipeEvent) => unknown;

export class TataruClient {
    static readonly ENDPOINT = "wss://ribbit.sh/ws";

    protected apiKey: string;

    protected ws: WebSocket | undefined;

    protected handlers: MarketEventHandler[] = [];

    protected lastMessage: number | undefined;

    protected lastConnectionAttempt = 0;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
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
        this.lastConnectionAttempt = Date.now();
        this.ws = ws;

        ws.on('error', err => logger.warn(`TataruClient Error: ${err}`));

        ws.on('open', () => {
            logger.info(`Connected to ${ws.url}`);
        })

        ws.on('message', data => {
            this.lastMessage = Date.now()
            const parsed = JSON.parse(String(data));
            this.handlers.forEach(handler => handler(parsed));
        });

        ws.on('close', () => {
            logger.error('TataruClient Closed!');
        });
    }

    public onAlert(handler: MarketEventHandler) {
        this.handlers.push(handler);
    }

    public isConnected() {
        return !!this.ws && this.ws.readyState === WebSocket.OPEN
            && (this.lastMessage === undefined || (Date.now() - this.lastMessage <= TWO_MINUTES));
    }

    public refresh() {
        if (!this.isConnected() && (Date.now() - this.lastConnectionAttempt) > TEN_SECONDS) {
            logger.debug(`TataruClient disconnected. Attempting to reconnect...`);
            this.close();
            this.connect();
        }
    }

    public close() {
        this.ws?.close();
        this.ws = undefined;
    }
}
