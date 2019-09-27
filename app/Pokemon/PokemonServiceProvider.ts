import ServiceProvider from "../../framework/Support/ServiceProvider";
import PokemonData from "./PokemonData";

export default class PokemonServiceProvider extends ServiceProvider {
    register() {
        this.app.singleton('pokemon', async app => {
            const instance = new PokemonData(app);
            await instance.bootstrap();
            return instance;
        }, 'app')
    }
}