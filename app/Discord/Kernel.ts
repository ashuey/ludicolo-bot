import { default as DiscordKernel } from "../../framework/Discord/Kernel"
import * as path from 'path'

export default class Kernel extends DiscordKernel {
    protected groups(): string[][] {
        return [
            ['events', 'Event Management'],
            ['roles', 'Self-Assignable Roles'],
            ['quotes', 'Quote Database'],
            ['pokemongo', 'Pokemon GO Info Commands']
        ]
    }

    protected commands() {
        this.registerDefaults();

        this.load(path.join(__dirname, 'Commands'));
    }
}
