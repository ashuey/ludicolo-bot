import {InspireCommand} from "@/modules/inspire/commands/inspire";
import {inspiroBot} from "@/modules/inspire/inspirobot";

describe('InspireCommand', () => {
    it('builds the inspire command correctly', () => {
        const command = (new InspireCommand()).build();
        expect(command.toJSON().name).toBe('inspire');
    });

    it("test execute of InspireCommand for success", async () => {
        const inspireCommand = new InspireCommand();
        const mockInteraction = {
            reply: jest.fn(() => Promise.resolve()),
            user: {
                username: 'TEST-USERNAME'
            }
        };
        jest.spyOn(inspiroBot, 'newImage')
            .mockImplementation(() => Promise.resolve([true, 'SAMPLE-IMAGE-URL']));

        await inspireCommand.execute(mockInteraction as never);

        expect(mockInteraction.reply.mock.calls).toMatchSnapshot();
    });

    it("test execute of InspireCommand for failure", async () => {
        const inspireCommand = new InspireCommand();
        const mockInteraction = {
            reply: jest.fn(() => Promise.resolve()),
        };
        jest.spyOn(inspiroBot, 'newImage')
            .mockImplementation(() => Promise.resolve([false, new Error()]));

        await inspireCommand.execute(mockInteraction as never);

        expect(mockInteraction.reply.mock.calls).toMatchSnapshot();
    });
});
