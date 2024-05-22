import {mockFetch} from "@/helpers/testing";
import {GuildConfigManager} from "@/common/guildConfig/GuildConfigManager";
import PocketBase from "pocketbase/cjs";
import {JSONValue} from "@/common/JSONValue";

class GuildConfigManagerTest extends GuildConfigManager {
    testGetGuildRecord(guildId: string) {
        return this.getGuildRecord(guildId)
    }
}

function mockGuildFetch(guildId: string, settings: JSONValue = null) {
    return mockFetch(200, {
            "page": 1,
            "perPage": 1,
            "totalItems": -1,
            "totalPages": -1,
            "items": [{
                "collectionId": "4x1zocqp68e9ex3",
                "collectionName": "guilds",
                "created": "2024-05-04 15:50:01.263Z",
                "discord_id": guildId,
                "id": "5nfgnopeipmdg4f",
                "settings": settings,
                "updated": "2024-05-04 15:50:01.264Z"
            }]
        }
    );
}

describe('GuildConfigManager', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('get', () => {
        describe('returns the correct values', () => {
            const valueTests: [string, string, JSONValue][] = [
                ["string", "23487209387409", "stringValue"],
                ["number", "92083094802423", 9382830],
                ["null", "28809480239434", null],
                ["boolean", "94893083098403", true],
                ["array", "72874902809380", ['apple', 'orange', 'banana']],
                ["object", "48908320938403", { 'dog': 'woof', 'cat': 49, 'hedgehog': false }],
            ]

            test.each(valueTests)("returns the stored value of type %p", async (type, guildId, testValue) => {
                const testKey = `${type}Key`
                mockGuildFetch(guildId, { [testKey]: testValue });

                const gcm = new GuildConfigManager(new PocketBase());
                await expect(gcm.get(guildId, testKey)).resolves.toEqual(testValue);
            });
        });

        it('returns undefined when guild does not exist', async () => {
            mockFetch(200, {
                "page": 1,
                "perPage": 1,
                "totalItems": -1,
                "totalPages": -1,
                "items": [],
            });

            const gcm = new GuildConfigManager(new PocketBase());
            await expect(gcm.get("10000000", "foo")).resolves.toBeUndefined();
        });

        describe('returns undefined when guild settings are null or invalid', () => {
            const tests: [string, string, JSONValue][] = [
                ["the root object can't be null", "890834029384", null],
                ["the root object can't be a string", "02909128309", "rootObject"],
            ]

            test.each(tests)("%p", async (_, guildId, rootValue) => {
                mockGuildFetch(guildId, rootValue);

                const gcm = new GuildConfigManager(new PocketBase());
                await expect(gcm.get(guildId, "keyThatDoesntExist")).resolves.toBeUndefined();
            })
        });

        it('returns undefined when the key does not exist', async () => {
            const guildId = "209838828374092";
            mockGuildFetch(guildId, { 'apple': 'mac', 'microsoft': 'pc' });

            const gcm = new GuildConfigManager(new PocketBase());
            await expect(gcm.get(guildId, 'linux')).resolves.toBeUndefined();
        });
    });

    describe("getGuildRecord", () => {
        it('passes all the proper parameters to the upstream', async () => {
            const guildId = "172820309409348909";

            const mock = mockGuildFetch(guildId);

            const gcm = new GuildConfigManagerTest(new PocketBase());

            await expect(gcm.testGetGuildRecord(guildId)).resolves.toBeDefined();

            expect(mock).toHaveBeenCalledTimes(1);

            const calledUrl = new URL(String(mock.mock.calls[0]?.[0]), "https://localhost");
            expect(calledUrl.pathname).toBe("/api/collections/guilds/records");
            expect([...calledUrl.searchParams.entries()]).toMatchObject([
                ["page", "1"],
                ["perPage", "1"],
                ["filter", `discord_id="${guildId}"`],
                ["skipTotal", "true"],
            ]);
        });

        it('fetches a guild record correctly', async () => {
            const guildId = "283920309409348903";

            mockGuildFetch(guildId);

            const gcm = new GuildConfigManagerTest(new PocketBase());
            const result = await gcm.testGetGuildRecord(guildId);

            expect(result).toMatchObject({discord_id: guildId, settings: null});
        });

        it('returns undefined for non-existent guilds', async () => {
            const guildId = "824920303909348903";

            mockFetch(200, {
                "page": 1,
                "perPage": 1,
                "totalItems": -1,
                "totalPages": -1,
                "items": []
            });

            const gcm = new GuildConfigManagerTest(new PocketBase());
            const result = await gcm.testGetGuildRecord(guildId);

            expect(result).toBeUndefined();
        });

        it('throws an error for upstream 400 errors', async () => {
            const guildId = "283920309409348903";

            const mock = mockFetch(400, {
                "code": 400,
                "message": "Something went wrong while processing your request. Invalid filter.",
                "data": {}
            });

            const gcm = new GuildConfigManagerTest(new PocketBase());

            await expect(gcm.testGetGuildRecord(guildId)).rejects.toThrow();
            expect(mock).toHaveBeenCalledTimes(1);
        });

        it('throws an error for upstream 403 errors', async () => {
            const guildId = "283920309409348903";

            const mock = mockFetch(403, {
                "code": 403,
                "message": "Only admins can access this action.",
                "data": {}
            });

            const gcm = new GuildConfigManagerTest(new PocketBase());

            await expect(gcm.testGetGuildRecord(guildId)).rejects.toThrow();
            expect(mock).toHaveBeenCalledTimes(1);
        });
    });
})
