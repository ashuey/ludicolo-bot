import PocketBase from "pocketbase/cjs";

export type RecordService<M> = ReturnType<typeof PocketBase.prototype.collection<M>>;
