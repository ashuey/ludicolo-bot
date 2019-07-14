import Bootstrapper from "../../Contracts/Foundation/Bootstrapper";
import Application from "../../Contracts/Foundation/Application";

export default class BootProviders implements Bootstrapper {
    bootstrap(app: Application) {
        app.boot();
    }
}