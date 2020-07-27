import DatabaseManager from "@ashuey/ludicolo-framework/lib/Contracts/Database/DatabaseManager";
import { Guild, User } from "discord.js";
import TradeOffer from "../../../TradeOffer";

export default class UnownTradingService {
    protected db: DatabaseManager;

    constructor(db: DatabaseManager) {
        this.db = db;
    }

    public async offerMany(user: User, letters: Set<string>) {
        return Promise.all([...letters]
            .map(letter => this.offer(user, letter)));
    }

    public async offer(user: User, letter: string) {
        const attributes = {
            user: user.id,
            pokemon: `unown_${letter}`
        }

        const result = await TradeOffer.query().findOne(attributes);

        if (!result) {
            return TradeOffer.query().insert(attributes);
        }
    }

    public async deleteOfferMany(user: User, letters: Set<string>): Promise<number> {
        return TradeOffer.query()
            .delete()
            .where('user', user.id)
            .whereIn('pokemon', [...letters]);
    }

    public async getLetters(user: User): Promise<string[]> {
        const offers = await TradeOffer.query()
            .where('user', user.id)
            .where('pokemon', 'like', 'unown_%')
            .column('pokemon');

        const letters = offers.map(offer => {
            return offer.pokemon.substring(6).toUpperCase();
        });

        return letters.sort();
    }

    public async findLetter(guild: Guild, letter: string): Promise<string[]> {
        const offers = await TradeOffer.query()
            .where('pokemon', `unown_${letter}`)
            .column('user');

        const users: string[] = [];

        await Promise.all(offers.map(async offer => {
            const member = await guild.members.resolve(offer.user);

            if (member) {
                users.push(member.displayName);
            }
        }));

        return users;
    }
}