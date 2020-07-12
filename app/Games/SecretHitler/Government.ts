import SecretHitlerPlayer from "./SecretHitlerPlayer";
import SecretHitler from "./index";
import * as _ from "lodash";

export default class Government {
    protected game: SecretHitler;

    protected presidentIndex: number;

    protected chancellor: SecretHitlerPlayer;

    constructor(game: SecretHitler, presidentIndex?: number, chancellor?: SecretHitlerPlayer) {
        this.game = game;

        if (presidentIndex) {
            this.setPresidentIndex(presidentIndex);
        }

        if (chancellor) {
            this.setChancellor(chancellor);
        }
    }

    getPresident(): SecretHitlerPlayer | null {
        return _.get(this.game.getData().players, this.presidentIndex, null);
    }

    getPresidentIndex(): number {
        return this.presidentIndex;
    }

    setPresidentIndex(presidentIndex: number): this {
        this.presidentIndex = presidentIndex;
        return this;
    }

    getChancellor(): SecretHitlerPlayer | null {
        return this.chancellor ? this.chancellor : null;
    }

    setChancellor(chancellor: SecretHitlerPlayer): this {
        this.chancellor = chancellor;
        return this;
    }

    advancePresident(): this {
        this.presidentIndex = this.presidentIndex ? (this.presidentIndex + 1) % this.game.getData().players.length : 0;

        if (this.getPresident().getDead()) {
            this.advancePresident();
        }

        return this;
    }

    resetChancellor(): this {
        this.chancellor = null;
        return this;
    }

    toString(): string {
        return `President: ${this.getPresident()}, Chancellor: ${this.getChancellor()}`;
    }

    has(player: SecretHitlerPlayer): boolean {
        return player.is(this.getPresident()) || player.is(this.getChancellor());
    }
}