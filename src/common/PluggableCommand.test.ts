import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder
} from "discord.js";
import {PluggableCommand} from "@/common/PluggableCommand";
import {Subcommand} from "@/common/Subcommand";
import {SubcommandGroup} from "@/common/SubcommandGroup";
import {UnknownSubcommandError} from "@/common/errors/UnknownSubcommandError";

abstract class MockPluggableCommand extends PluggableCommand {
    getSubcommands() {
        return this.subcommands;
    }

    getSubcommandGroups() {
        return this.subcommandGroups;
    }

    testRegisterSubcommand(subcommand: Subcommand) {
        this.registerSubcommand(subcommand);
    }

    testRegisterSubcommandGroup(subcommandGroup: SubcommandGroup) {
        this.registerSubcommandGroup(subcommandGroup);
    }
}

class MockSubcommandOne implements Subcommand {
    readonly name = "mock-subcommand-one";

    build(): SlashCommandSubcommandBuilder {
        return (new SlashCommandSubcommandBuilder())
            .setDescription('This is subcommand one');
    }

    async execute(){}
}

class MockSubcommandTwo implements Subcommand {
    readonly name = "mock-subcommand-two";

    build(): SlashCommandSubcommandBuilder {
        return (new SlashCommandSubcommandBuilder())
            .setDescription('This is subcommand two');
    }

    async execute(){}
}

class MockSubcommandGroup implements SubcommandGroup {
    readonly name = "mock-subcommand"

    readonly subcommands: Subcommand[] = [
        new MockSubcommandTwo(),
    ]

    build(): SlashCommandSubcommandGroupBuilder {
        return (new SlashCommandSubcommandGroupBuilder())
            .setDescription('This is a subcommand group');
    }
}

class MockFullPluggableCommand extends MockPluggableCommand {
    constructor() {
        super();

        this.registerSubcommand(new MockSubcommandOne());
        this.registerSubcommandGroup(new MockSubcommandGroup());
    }

    buildRoot(): SlashCommandBuilder {
        return (new SlashCommandBuilder())
            .setName('mock-pluggable-command')
            .setDescription('This is a command with subcommands');
    }
}

class MockEmptyPluggableCommand extends MockPluggableCommand {
    buildRoot(): SlashCommandBuilder {
        return (new SlashCommandBuilder());
    }
}

describe("PluggableCommand", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('matches command JSON snapshot', () => {
        const pluggable = new MockFullPluggableCommand();

        const comparableCommand = (new SlashCommandBuilder())
            .setName('mock-pluggable-command')
            .setDescription('This is a command with subcommands')
            .addSubcommandGroup(grp => grp
                .setName('mock-subcommand')
                .setDescription('This is a subcommand group')
                .addSubcommand(cmd => cmd
                    .setName('mock-subcommand-two')
                    .setDescription('This is subcommand two')))
            .addSubcommand(cmd => cmd
                .setName('mock-subcommand-one')
                .setDescription('This is subcommand one'));

        expect(pluggable.build().toJSON()).toEqual(comparableCommand.toJSON());
    });

    test('register new subcommand', () => {
        const pluggable = new MockEmptyPluggableCommand();
        const subcommand = new MockSubcommandOne();

        expect(pluggable.getSubcommands().has(subcommand.name)).toBe(false);

        pluggable.testRegisterSubcommand(subcommand);

        expect(pluggable.getSubcommands().has(subcommand.name)).toBe(true);
    })

    test('register new subcommand group', () => {
        const pluggable = new MockEmptyPluggableCommand();
        const subcommandGroup = new MockSubcommandGroup();

        expect(pluggable.getSubcommandGroups().has(subcommandGroup.name)).toBe(false);

        pluggable.testRegisterSubcommandGroup(subcommandGroup);

        expect(pluggable.getSubcommandGroups().has(subcommandGroup.name)).toBe(true);
    })

    test('execute matched subcommand', async () => {
        const pluggable = new MockFullPluggableCommand();

        const interaction = {
            options: {
                getSubcommand: () => 'mock-subcommand-one',
                getSubcommandGroup: () => null,
            }
        } as ChatInputCommandInteraction

        const executeMock = jest.spyOn(MockSubcommandOne.prototype, 'execute');

        await pluggable.execute(interaction);

        expect(executeMock).toHaveBeenCalledTimes(1);
    });

    test('execute matched group subcommand', async () => {
        const pluggable = new MockFullPluggableCommand();

        const interaction = {
            options: {
                getSubcommand: () => 'mock-subcommand-two',
                getSubcommandGroup: () => 'mock-subcommand',
            }
        } as ChatInputCommandInteraction

        const executeMock = jest.spyOn(MockSubcommandTwo.prototype, 'execute');

        await pluggable.execute(interaction);

        expect(executeMock).toHaveBeenCalledTimes(1);
    });

    test('execute matched group subcommand', async () => {
        const pluggable = new MockFullPluggableCommand();

        const interaction = {
            options: {
                getSubcommand: () => 'mock-subcommand-two',
                getSubcommandGroup: () => 'mock-subcommand',
            }
        } as ChatInputCommandInteraction

        const executeMock = jest.spyOn(MockSubcommandTwo.prototype, 'execute');

        await pluggable.execute(interaction);

        expect(executeMock).toHaveBeenCalledTimes(1);
    });

    test('error if subcommand does not exist', async () => {
        const pluggable = new MockFullPluggableCommand();

        const interaction = {
            options: {
                getSubcommand: () => 'non-existent-subcommand',
                getSubcommandGroup: () => null,
            }
        } as ChatInputCommandInteraction

        await expect(pluggable.execute(interaction)).rejects.toBeInstanceOf(UnknownSubcommandError);
    });

    test('error if group does not exist', async () => {
        const pluggable = new MockFullPluggableCommand();

        const interaction = {
            options: {
                getSubcommand: () => 'mock-subcommand-two',
                getSubcommandGroup: () => 'non-existent-group',
            }
        } as ChatInputCommandInteraction

        await expect(pluggable.execute(interaction)).rejects.toBeInstanceOf(UnknownSubcommandError);
    });

    test('error if grouped subcommand does not exist', async () => {
        const pluggable = new MockFullPluggableCommand();

        const interaction = {
            options: {
                getSubcommand: () => 'non-existent-subcommand',
                getSubcommandGroup: () => 'mock-subcommand',
            }
        } as ChatInputCommandInteraction

        await expect(pluggable.execute(interaction)).rejects.toBeInstanceOf(UnknownSubcommandError);
    });

    test('error if command exists but in an un-selected group', async () => {
        const pluggable = new MockFullPluggableCommand();

        const interaction = {
            options: {
                getSubcommand: () => 'mock-subcommand-two',
                getSubcommandGroup: () => null,
            }
        } as ChatInputCommandInteraction

        expect(pluggable.getSubcommandGroups().get('mock-subcommand')?.subcommands.has('mock-subcommand-two'))
            .toBe(true);

        await expect(pluggable.execute(interaction)).rejects.toBeInstanceOf(UnknownSubcommandError);
    });

    test('error if command exists not in the selected group', async () => {
        const pluggable = new MockFullPluggableCommand();

        const interaction = {
            options: {
                getSubcommand: () => 'mock-subcommand-one',
                getSubcommandGroup: () => 'mock-subcommand',
            }
        } as ChatInputCommandInteraction

        expect(pluggable.getSubcommands().has('mock-subcommand-one')).toBe(true);

        await expect(pluggable.execute(interaction)).rejects.toBeInstanceOf(UnknownSubcommandError);
    });
})
