import ServiceProvider from "../Support/ServiceProvider";
import RedisManager from "./RedisManager";
import {RedisClient} from "redis";

export default class RedisServiceProvider extends ServiceProvider {
    register(): void {
        this.app.singleton('redis', app => {
            return new Proxy(new RedisManager(app), {
                get(target: RedisManager, p: PropertyKey): RedisManager | RedisClient {
                    return p in target ? target[p] : target.connection()[p];
                }
            });
        }, 'app');
    }
}