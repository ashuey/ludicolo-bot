import StrictRecordModel from "@/common/models/StrictRecordModel";
import {JSONValue} from "@/common/JSONValue";

export interface Guild extends StrictRecordModel {
    discord_id: string;
    settings: JSONValue;
}
