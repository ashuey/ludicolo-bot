import ServiceProvider from "../../framework/Support/ServiceProvider";

export default class PokemonServiceProvider extends ServiceProvider {
    register() {
        this.app.singleton('pokemon', async app => {

        }, 'app')
    }
}