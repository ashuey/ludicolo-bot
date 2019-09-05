import app from "./bootstrap/app"
import Kernel from "./app/Console/Kernel";
import Quote from "./app/Quote";

app.singleton('kernel.console', Kernel, 'app');

const kernel: Kernel = app.make('kernel.console');

kernel.bootstrap().then(() => {
    const t = new Quote();
    t.testFunc();
    kernel.handle(process.argv);
});