import UrlSigner from "../Http/UrlSigner";
import ServiceProvider from "@ashuey/ludicolo-framework/lib/Support/ServiceProvider";

export default class UrlSignerServiceProvider extends ServiceProvider {

    register() {
        this.app.singleton('url_signer', config => {
            return new UrlSigner(config.get('app.key'));
        }, 'config')
    }
}