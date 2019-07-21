import Application from "../framework/Foundation/Application";
import Kernel from "../app/Discord/Kernel";
import * as path from "path";
import DiscordServiceProvider from "../framework/Discord/DiscordServiceProvider";

export default (async function() {
    const app = new Application(path.resolve(__dirname, "../"));

    app.singleton('kernel.discord', Kernel, 'app', 'discord.client');

    await app.register(new DiscordServiceProvider(app));

    return app;
})();