import CommunityEvent from "../CommunityEvent";

export default class CommunityEventsManager {
    protected trackedEvents: CommunityEvent[] = [];

    protected hasBeenBootstrapped: boolean = false;

    public trackEvent(event: CommunityEvent) {
    }

    public bootstrap() {
        this.hasBeenBootstrapped = true;
    }

    public hasBeen
}