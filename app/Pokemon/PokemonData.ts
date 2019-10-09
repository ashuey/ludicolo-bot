import * as fs from 'fs'
import * as https from 'https'
import Application from "../../framework/Contracts/Foundation/Application";

export default class PokemonData {
    protected app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public async bootstrap() {
        // const validCache = await this.cacheIsValid();s

        /*if (!validCache) {
            await this.update();
        }*/
    }

    public async update() {
        // await this.fetchFile("https://fight.pokebattler.com/pokemon", this.app.storagePath('app', 'pokemon', 'pokemon.json'));
    }

    protected hydrate() {
        //
    }
}