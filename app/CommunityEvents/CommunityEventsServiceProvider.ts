import ServiceProvider from "../../framework/Support/ServiceProvider";
import CommunityEventsManager from "./CommunityEventsManager";

export default class CommunityEventsServiceProvider extends ServiceProvider {
    register() {
        this.app.singleton('community_events', app => {
            return new CommunityEventsManager();
        }, 'app')
    }

    async boot() {
        this.app.make('community_events').bootstrap();
    }
}