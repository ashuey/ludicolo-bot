import StrictRecordModel from "@/common/models/StrictRecordModel";

export interface AutomodCleanupChannel extends StrictRecordModel {
    discord_id: string;
    maximum_age: number;
}
