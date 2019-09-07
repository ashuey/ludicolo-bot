import app from "./bootstrap/app"
import Kernel from "./app/Console/Kernel";
import Quote from "./app/Quote";

app.singleton('kernel.console', Kernel, 'app');

const kernel: Kernel = app.make('kernel.console');

kernel.bootstrap().then(() => {
    console.log(Quote.tableName);
    //kernel.handle(process.argv);
});