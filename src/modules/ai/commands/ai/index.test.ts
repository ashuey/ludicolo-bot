import {AICommand} from "@/modules/ai/commands/ai/index";
import {UnknownSubcommandError} from "@/common/errors/UnknownSubcommandError";

describe('AICommand', () => {
    const mockApp = {};
    const mockHuggingFace = {};
    let cmd: AICommand;

    beforeEach(() => {
        cmd = new AICommand({
            huggingFace: mockHuggingFace as never,
            app: mockApp as never,
        });

        jest.restoreAllMocks();
        jest.resetAllMocks();
    })

    it('throws an UnknownSubcommandError if an invalid subcommand is passed', async () => {
        await expect(cmd.execute({
            deferReply: () => {},
            options: {
                getSubcommand: () => 'FakeCommand',
            }
        } as never)).rejects.toBeInstanceOf(UnknownSubcommandError);
    });
})
