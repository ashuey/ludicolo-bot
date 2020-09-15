import Model from "@ashuey/ludicolo-framework/lib/Database/Mapper/Model";

export default class ScreeningReminder extends Model {
    public id: number;

    public user: string;

    public completed_at: Date | null;
}