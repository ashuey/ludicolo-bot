import SecretHitlerPlayer from "../SecretHitlerPlayer";
import Government from "../Government";
import PolicyDeck from "../PolicyDeck";
import PolicyTile from "./PolicyTile";

export default interface SecretHitlerGameData {
    players: SecretHitlerPlayer[];

    electedGovernment: Government;

    nominatedGovernment: Government;

    liberalPoliciesPassed: number;

    fascistPoliciesPassed: number;

    ignorePartyLimits: boolean;

    policyDeck: PolicyDeck;

    drawnTiles: PolicyTile[];
}