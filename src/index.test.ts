import {ChatInputCommandInteraction, Client, Interaction, REST} from "discord.js";
import cron from "node-cron";
import { OpenAI } from "openai";
import {Application} from "./index";
import {Command} from "@/common/Command";
import {LockManager} from "@/LockManager";
import {ComponentHandler} from "@/common/ComponentHandler";

class TestApplication extends Application {
    testHandleInteractionCreate(interaction: Interaction): Promise<void> {
        return this.handleInteractionCreate(interaction);
    }
}

describe("Application", () => {
    const originalEnv = process.env;

    beforeAll(() => {
        process.env = new Proxy({}, {
            get: () => 'VALUE',
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    const serviceTests: [unknown, keyof Application][] = [
        [Client, 'discord'],
        [REST, 'rest'],
        [OpenAI, 'openai'],
        [LockManager, 'locks'],
    ];

    test.each(serviceTests)("should return a %p instance", (instance, prop) => {
        const app = new Application();
        const firstInstance = app[prop];
        const secondInstance = app[prop];
        expect(firstInstance).toBeInstanceOf(instance);
        expect(firstInstance).toBe(secondInstance);

    });

    it('REST returns a REST client even if discord has been initialized', () => {
        const app = new Application();
        app.discord;
        const instance = app.rest;
        expect(instance).toBeInstanceOf(REST);
    })

    it("should login to Discord", async () => {
        const app = new Application();
        const spy = jest.spyOn(app.discord, "login")
            .mockImplementation(() => Promise.resolve(''));
        await app.login();
        expect(spy).toHaveBeenCalledWith(app.config.discordToken);
    });

    test.skip("Performs first-time guild sync on login", async () => {
        // TODO
    });

    it("should start cron jobs for each module", () => {
        const app = new Application();
        const spy = jest.spyOn(cron, "schedule")
            .mockImplementation((() => {
            }) as never);
        app.startCron();
        app.modules.forEach(([, module]) => {
            if (module.scheduledTasks) {
                module.scheduledTasks.forEach(([expr, func]) => {
                    expect(spy).toHaveBeenCalledWith(expr, func);
                });
            }
        });
    });

    it("should execute command", async () => {
        const app = new TestApplication();
        expect(app.commands.size > 0).toBeTruthy();
        const command = app.commands.last() as Command;
        const interaction = {
            isChatInputCommand: () => true,
            commandName: command.build().name,
        } as ChatInputCommandInteraction;
        const spy = jest.spyOn(command, "execute")
            .mockImplementation(() => Promise.resolve());
        await app.testHandleInteractionCreate(interaction);
        expect(spy).toHaveBeenCalledWith(interaction);
    });

    it("should handle an interaction", async () => {
        const app = new TestApplication();
        expect(app.componentHandlers.size > 0).toBeTruthy();
        const [handlerId, handler] = [...app.componentHandlers.entries()].findLast(() => true) as [string, ComponentHandler];
        const interaction = {
            isChatInputCommand: () => false,
            isMessageComponent: () => true,
            customId: `com://${handlerId}`,
        } as never;
        const spy = jest.spyOn(handler, "handle")
            .mockImplementation(() => Promise.resolve());
        await app.testHandleInteractionCreate(interaction);
        expect(spy).toHaveBeenCalledWith(interaction);
    });

    it("fails silently if an interaction has no custom ID", async () => {
        const app = new TestApplication();
        const interaction = {
            isChatInputCommand: () => false,
            isMessageComponent: () => true,
            customId: "",
        } as never;
        await expect(app.testHandleInteractionCreate(interaction)).resolves.toBeUndefined();
    });

    it("should send an error message if a command does not exist", async () => {
        const app = new TestApplication();
        const interaction = {
            isChatInputCommand: () => true,
            reply: jest.fn(() => Promise.resolve()),
            commandName: "DOES-NOT-EXIST",
        } as unknown as ChatInputCommandInteraction;
        await app.testHandleInteractionCreate(interaction);
        expect(interaction.reply).toHaveBeenCalledTimes(1);
    });

});
