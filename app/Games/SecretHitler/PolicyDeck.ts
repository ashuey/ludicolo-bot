import PolicyTile from "./Types/PolicyTile";
import SecretHitlerParty from "./Enums/SecretHitlerParty";
import * as _ from "lodash";
import {EventEmitter} from "events";
import NonDiscardablePolicyTile from "./Types/NonDiscardablePolicyTile";
import Counter from "../Types/Counter";

export default class PolicyDeck extends EventEmitter {
    protected deck: PolicyTile[];

    protected discard_: PolicyTile[];

    constructor() {
        super();
        this.reset();
    }

    public reset() {
        const unshuffled = []
        this.discard_ = [];

        for (let i = 0; i < 6; i++) {
            unshuffled.push(new PolicyTile(SecretHitlerParty.LIBERAL));
        }

        for (let i = 0; i < 11; i++) {
            unshuffled.push(new PolicyTile(SecretHitlerParty.FASCIST));
        }

        this.deck = _.shuffle(unshuffled);
    }

    protected require(count: number) {
        if (count > this.deck.length) {
            this.reshuffle();
        }
    }

    public reshuffle() {
        this.deck = _(this.deck).concat(this.discard_).shuffle().value();
        this.discard_ = [];

        const tileCount = new Counter<SecretHitlerParty>();

        this.deck.forEach(tile => {
            tileCount.increase(tile.getParty());
        })

        this.emit('reshuffle', tileCount);
    }

    public draw(count: number = 1): PolicyTile[] {
        const result: PolicyTile[] = [];

        this.require(count);

        for (let i = 0; i < count; i++) {
            result.push(this.deck.pop());
        }

        return result;
    }

    public discard(...tiles: PolicyTile[]) {
        for (let tile of tiles) {
            this.discard_.push(tile);
        }
    }

    public peek(count: number): NonDiscardablePolicyTile[] {
        this.require(count);

        return _.takeRight(this.deck, count);
    }
}