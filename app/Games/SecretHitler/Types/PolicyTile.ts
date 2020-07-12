import SecretHitlerParty from "../Enums/SecretHitlerParty";
import NonDiscardablePolicyTile from "./NonDiscardablePolicyTile";
import Describer from "../Describer";

export default class PolicyTile implements NonDiscardablePolicyTile {
    protected party: SecretHitlerParty;

    public discardable: true;

    constructor(party: SecretHitlerParty) {
        this.party = party;
    }

    getParty(): SecretHitlerParty {
        return this.party;
    }

    getPartyDescription(): string {
        return Describer.describeParty(this.getParty());
    }

    toString(): string {
        return this.getPartyDescription();
    }

    peek(): NonDiscardablePolicyTile {
        return this;
    }
}