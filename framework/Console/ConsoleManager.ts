import Command from "./Command";
import { Command as Commander } from 'commander'
import * as _ from 'lodash';
import Application from '../Contracts/Foundation/Application'

export default class ConsoleManager {
    protected app: Application;

    protected commander: Commander;

    protected static bootstrappers: ((Application) => void)[] = [];

    constructor(app: Application) {
        this.app = app;
        this.commander = new Commander();

        this.bootstrap();
    }

    public run(argv: string[]): void {
        this.commander.parse(argv);
    }

    public static starting(callback: (Application) => void): void {
        ConsoleManager.bootstrappers.push(callback);
    }

    protected bootstrap(): void {
        for (const bootstrapper of ConsoleManager.bootstrappers) {
            bootstrapper(this);
        }
    }

    public add(commands: Command | Command[]): void {
        commands = _.castArray(commands);

        for (const command of commands) {
            command.init(this.app, this.commander);
        }
    }

    public resolve(commands: string | string[]): void {
        commands = _.castArray(commands);

        for (const command of commands) {
            this.add(this.app.make(command));
        }
    }
}