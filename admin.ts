import app from "./bootstrap/app"
import Kernel from "./app/Console/Kernel";

app.singleton('kernel.console', Kernel, 'app');

const kernel: Kernel = app.make('kernel.console');

kernel.bootstrap().then(async () => {
    kernel.handle(process.argv);
});