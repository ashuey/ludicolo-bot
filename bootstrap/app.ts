import Kernel from "../app/Discord/Kernel";
import * as path from "path";
import Application from "@ashuey/ludicolo-framework/lib/Foundation/Application";

const app = new Application(path.resolve(__dirname, "../"));

app.singleton('kernel.discord', Kernel, 'app');

export default app;