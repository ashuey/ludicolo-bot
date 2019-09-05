import app from "./bootstrap/app"
import Kernel from "./app/Discord/Kernel";

app.singleton('kernel.discord', Kernel, 'app');

const kernel: Kernel = app.make('kernel.discord');

kernel.bootstrap().then(() => {
    kernel.startListening();
});