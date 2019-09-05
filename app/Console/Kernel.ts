import ConsoleKernel from "../../framework/Console/Kernel";
import * as path from "path";

export default class Kernel extends ConsoleKernel {
    protected commands() {
        this.load(path.join(__dirname, 'Commands'));
    }
}