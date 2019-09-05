import { Command as CommanderCommand } from 'commander'
import Application from "../Contracts/Foundation/Application";

type Argument =  {
    required: boolean,
    name: string,
    variadic: string
}

export default abstract class Command {
    protected abstract signature: string;

    protected description: string;

    protected app: Application;

    private commander: CommanderCommand;

    private commandInitialized: boolean  = false;

    private _arguments: { [s: string]: string | any[] } = {};

    private _options: { [s: string]: string | any[] } = {};

    public init(app: Application, commander: CommanderCommand) {
        if (this.commandInitialized) {
            return;
        }

        this.app = app;

        this.commander = commander.command(this.signature, this.description);

        this.configure(this.commander);

        this.commander.action((...args: any[]) => {
            const command: CommanderCommand = args.pop();

            // Parse out arguments
            const argsLength: number = Math.min(command._args.length, args.length);

            for (let i = 0; i < argsLength; i++) {
                const arg: Argument = command._args[i];

                if (arg.variadic) {
                    this._arguments[arg.name] = args.slice(i);
                    break;
                }

                this._arguments[arg.name] = args[i];
            }

            // Parse out options
            for (let option of command.options) {
                const key = option.attributeName();
                this._options[key] = command[key];
            }

            this.handle();
        });

        this.commandInitialized = true;
    }

    protected configure(cmd: CommanderCommand): void {
        //
    }

    public abstract handle(): void;

    protected argument(key: string): any {
        return this._arguments.hasOwnProperty(key) ? this._arguments[key] : null;
    }

    protected arguments(): any {
        return this._arguments;
    }

    protected option(key: string): any {
        return this._options.hasOwnProperty(key) ? this._options[key] : null;
    }

    protected options(): any {
        return this._options;
    }
}