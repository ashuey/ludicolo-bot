import Model from "@ashuey/ludicolo-framework/lib/Database/Mapper/Model";

export default class TradeOffer extends Model {
    public id: number;

    public user: string;

    public pokemon: string;
}