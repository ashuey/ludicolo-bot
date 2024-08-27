import { WebSocket } from "ws";
import { logger } from "@/logger";

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
}

export type MarketEventHandler = (e: PriceSnipeEvent) => unknown;

export class TataruClient {
    static readonly ENDPOINT = "wss://ribbit.sh/ws";

    protected apiKey: string;

    protected ws: WebSocket | undefined;

    protected handlers: MarketEventHandler[] = [];

    protected lastMessage = 0;

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
            this.lastMessage = Date.now();
        })

        ws.on('message', data => {
            this.lastMessage = Date.now()
            const parsed = JSON.parse(String(data));
            logger.trace({ message: parsed }, 'TataruClient: Message')
            this.handlers.forEach(handler => handler(parsed));
        });

        ws.on('close', () => {
            logger.error('TataruClient Closed!');
        });

        ws.on('pong', () => {
            logger.trace('TataruClient Pong!');
            this.lastMessage = Date.now();
        });
    }

    public onAlert(handler: MarketEventHandler) {
        this.handlers.push(handler);
    }

    public heartbeat() {
        // If no socket connection, or just connected, no need to check heartbeat
        if (!this.ws || (Date.now() - this.lastConnectionAttempt) < TEN_SECONDS) {
            return;
        }

        if ((Date.now() - this.lastMessage) > THREE_MINUTES) {
            logger.warn("TataruClient: No messages in over 3 minutes. Reconnecting...");
            this.cleanup();
            this.connect();
            return;
        }

        if ((Date.now() - this.lastMessage) > ONE_MINUTE) {
            logger.warn("TataruClient: No messages in over 1 minutes. Sending Ping...");
            this.ws.ping();
            return;
        }
    }

    protected cleanup() {
        this.ws?.close();
        this.lastMessage = 0;
        this.lastConnectionAttempt = 0;
        this.ws = undefined;
    }
}
