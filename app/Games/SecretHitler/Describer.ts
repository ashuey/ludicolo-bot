import SecretHitlerParty from "./Enums/SecretHitlerParty";

const Describer = {
    describeParty(party: SecretHitlerParty, withEmoji: boolean = false): string {
        switch (party) {
            case SecretHitlerParty.LIBERAL:
                return `${withEmoji ? '⚖' : ''}Liberal`;
            case SecretHitlerParty.FASCIST:
                return `${withEmoji ? '😈' : ''}Fascist`;
        }
    }
}

export default Describer;