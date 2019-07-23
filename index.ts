import Kernel from "./app/Discord/Kernel";
import app from "./bootstrap/app"

const kernel: Kernel = app.make('kernel.discord');

kernel.bootstrap().then(() => {
    console.log('ready to listen')
    kernel.startListening();
});