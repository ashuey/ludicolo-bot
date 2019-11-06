import BitmojiManager from "./BitmojiManager";
import ServiceProvider from "@ashuey/ludicolo-framework/lib/Support/ServiceProvider";

export default class BitmojiServiceProvider extends ServiceProvider {
    register() {
        this.app.singleton('bitmoji', () => {
            return new BitmojiManager();
        });
    }
}