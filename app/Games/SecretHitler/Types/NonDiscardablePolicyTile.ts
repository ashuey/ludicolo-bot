import PolicyTile from "./PolicyTile";

/**
 * This type prevents accidental discarding of peeked tiles, which would unintentionally
 * introduce extra tiles into the game. This is a compile-time check. No runtime checks
 * are performed.
 */
type NonDiscardablePolicyTile = Omit<PolicyTile, 'discardable'>

export default NonDiscardablePolicyTile;