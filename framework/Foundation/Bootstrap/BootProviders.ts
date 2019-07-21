import Bootstrapper from "../../Contracts/Foundation/Bootstrapper";
import Application from "../../Contracts/Foundation/Application";

export default class BootProviders implements Bootstrapper {
    async bootstrap(app: Application): Promise<void> {
        await app.boot();
    }
}