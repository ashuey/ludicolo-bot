import Bootstrapper from "../../Contracts/Foundation/Bootstrapper";
import Application from "../../Contracts/Foundation/Application";
import Repository from "../../Config/Repository";
import RepositoryContract from "../../Contracts/Config/Repository";
import * as fs from "fs";
import * as path from "path";
import * as _ from "lodash";

export default class LoadConfiguration implements Bootstrapper {
    public async bootstrap(app: Application) {
        const config = new Repository();

        app.instance('config', config);

        this.loadConfigurationFiles(app, config)
    }

    protected loadConfigurationFiles(app: Application, repository: RepositoryContract) {
        const files = this.getConfigurationFiles(app);

        _.forEach(files, (path, key) => {
            repository.set(key, require(path).default);
        });
    }

    // noinspection JSMethodCanBeStatic
    protected getConfigurationFiles(app: Application): object {
        const configPath = app.configPath();

        const files = fs.readdirSync(configPath);

        const targetFiles: object = {};

        for (const file of files) {
            const ext = path.extname(file).toLowerCase();

            if (ext === ".js" || ext === ".json") {
                const key = path.basename(file, ext);

                const fullPath = path.join(configPath, file);

                targetFiles[key] = fullPath;
            }
        }

        return targetFiles;
    }
}