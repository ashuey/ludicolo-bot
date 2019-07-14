import app from "./bootstrap/app";
import Kernel from "./framework/Contracts/Discord/Kernel";

const kernel: Kernel = app.make('kernel.discord');

kernel.startListening();