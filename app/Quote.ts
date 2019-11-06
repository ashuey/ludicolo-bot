import Model from "@ashuey/ludicolo-framework/lib/Database/Mapper/Model";

export default class Quote extends Model {
    public id: number;

    public guild: string;

    public creator: string;

    public name: string;

    public text: string;
}