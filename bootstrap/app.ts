import Application from "../framework/Foundation/Application";
import Kernel from "../app/Discord/Kernel";
import * as path from "path";

const app = new Application(path.resolve(__dirname, "../"));

app.singleton('kernel.discord', Kernel, 'app');

export default app;