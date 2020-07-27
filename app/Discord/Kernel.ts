import { default as DiscordKernel } from "@ashuey/ludicolo-discord/lib/Kernel"
import * as path from 'path'
import UnownLetterArgumentType from "./Types/UnownLetterArgumentType";

export default class Kernel extends DiscordKernel {
    protected groups(): string[][] {
        return [
            ['events', 'Event Management'],
            ['roles', 'Self-Assignable Roles'],
            ['quotes', 'Quote Database'],
            ['pokemongo', 'Pokemon GO Info Commands'],
            ['bitmoji', 'Bitmoji'],
            ['games', 'Games'],
            ['administration', 'Administration'],
            ['misc', 'Miscellaneous'],
            ['pogotrading', 'Pokemon GO Trading']
        ]
    }

    protected commands() {
        this.registerDefaults();
        this.client.registry.registerType(UnownLetterArgumentType);

        this.load(path.join(__dirname, 'Commands'));
        this.load(this.app.path('Modules', 'PokemonTrading', 'Commands'));
    }
}
