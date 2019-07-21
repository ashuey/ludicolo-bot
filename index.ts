//import app from "./bootstrap/app";
import Kernel from "./app/Discord/Kernel";
import Application from "./framework/Foundation/Application";
import * as path from "path";
import DiscordServiceProvider from "./framework/Discord/DiscordServiceProvider";

const app = new Application(path.resolve(__dirname, ""));

app.singleton('kernel.discord', Kernel, 'app', 'discord.client');

app.register(new DiscordServiceProvider(app)).then(() => {
    const kernel: Kernel = app.make('kernel.discord');

    kernel.bootstrap().then(() => {
        console.log('ready to listen')
        kernel.startListening();
    });
});