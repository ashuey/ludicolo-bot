import Application from "@ashuey/ludicolo-framework/lib/Contracts/Foundation/Application";

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