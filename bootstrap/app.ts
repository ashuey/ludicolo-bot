import Application from "../framework/Foundation/Application";
import Kernel from "../app/Discord/Kernel";
import * as path from "path";
import DiscordServiceProvider from "../framework/Discord/DiscordServiceProvider";

const app = new Application(path.resolve(__dirname, "../"));

app.register(new DiscordServiceProvider(app));

app.singleton('kernel.discord', Kernel, 'app', 'discord.client');

export default app;