import { default as DiscordKernel } from "../../framework/Discord/Kernel"
import * as path from 'path'

export default class Kernel extends DiscordKernel {
    protected groups(): string[][] {
        return [
            ['roles', 'Self-Assignable Roles']
        ]
    }

    protected commands() {
        this.registerDefaults();

        this.load(path.join(__dirname, 'Commands'));
    }
}
