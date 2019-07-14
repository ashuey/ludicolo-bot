import Bootstrapper from "../../Contracts/Foundation/Bootstrapper";
import Application from "../../Contracts/Foundation/Application";
import * as dotenv from 'dotenv'

export default class LoadEnvironmentVariables implements Bootstrapper {
    bootstrap(app: Application) {
        dotenv.config({
            path: app.environmentFilePath()
        })
    }
}