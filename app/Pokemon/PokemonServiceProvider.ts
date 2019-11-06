import PokemonData from "./PokemonData";
import ServiceProvider from "@ashuey/ludicolo-framework/lib/Support/ServiceProvider";

export default class PokemonServiceProvider extends ServiceProvider {
    register() {
        this.app.singleton('pokemon', async app => {
            const instance = new PokemonData(app);
            await instance.bootstrap();
            return instance;
        }, 'app')
    }
}