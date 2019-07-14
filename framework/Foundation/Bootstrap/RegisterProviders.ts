import Bootstrapper from "../../Contracts/Foundation/Bootstrapper";
import Application from "../../Contracts/Foundation/Application";

export default class RegisterProviders implements Bootstrapper {
    bootstrap(app: Application) {
        app.registerConfiguredProviders();
    }
}