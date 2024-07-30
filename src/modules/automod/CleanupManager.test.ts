import PocketBase from "pocketbase/cjs";
import AsyncLock from "async-lock";
import {CleanupManager} from "@/modules/automod/CleanupManager";
import {mockFetch} from "@/helpers/testing";

describe('CleanupManager', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    })

    it('gets channel entries', async () => {
        const discordId = '0298350298340234';

        const mock = mockFetch(200, {
            "page": 1,
            "perPage": 1,
            "totalPages": -1,
            "totalItems": -1,
            "items": [
                {
                    "id": "RECORD_ID",
                    "collectionId": "t2s2qdel611fqc5",
                    "collectionName": "automod_cleanup_channels",
                    "created": "2022-01-01 01:00:00.123Z",
                    "updated": "2022-01-01 23:59:59.456Z",
                    "discord_id": discordId,
                    "maximum_age": 123
                }
            ]
        });

        const mgr = new CleanupManager(new PocketBase(), new AsyncLock());

        await expect(mgr.get(discordId)).resolves.toBeDefined();

        expect(mock).toHaveBeenCalledTimes(1);
    });

    it('returns undefined when asked to get a channel with no entry', async () => {
        const discordId = '23094802938409234';

        const mock = mockFetch(200, {
            "page": 1,
            "perPage": 30,
            "totalPages": -1,
            "totalItems": -1,
            "items": [],
        });

        const mgr = new CleanupManager(new PocketBase(), new AsyncLock());

        await expect(mgr.get(discordId)).resolves.toBeUndefined();

        expect(mock).toHaveBeenCalledTimes(1);
    });

    it('should enable cleanup', async () => {
        const discordId = '892569254307207483';
        const age = 82800;

        const mock = mockFetch(200, {
            "page": 1,
            "perPage": 1,
            "totalPages": -1,
            "totalItems": -1,
            "items": []
        });

        mockFetch(200, {
            "id": "RECORD_ID",
            "collectionId": "t2s2qdel611fqc5",
            "collectionName": "automod_cleanup_channels",
            "created": "2022-01-01 01:00:00.123Z",
            "updated": "2022-01-01 23:59:59.456Z",
            "discord_id": discordId,
            "maximum_age": age
        });

        const mgr = new CleanupManager(new PocketBase(), new AsyncLock());
        await expect(mgr.enable(discordId, age)).resolves.toBe(true);

        expect(mock).toHaveBeenCalledTimes(2);

        const firstCalledUrl = new URL(String(mock.mock.calls[0]?.[0]), "https://localhost");
        expect(firstCalledUrl.pathname).toBe("/api/collections/automod_cleanup_channels/records");
        expect([...firstCalledUrl.searchParams.entries()]).toMatchObject([
            ["page", "1"],
            ["perPage", "1"],
            ["filter", `discord_id="${discordId}"`],
            ["skipTotal", "true"],
        ]);

        expect(mock.mock.calls[1]?.[0]).toEqual("/api/collections/automod_cleanup_channels/records");
        expect(mock.mock.calls[1]?.[1]?.method).toEqual("POST");
        expect(typeof mock.mock.calls[1]?.[1]?.body).toEqual("string");
        expect(JSON.parse(mock.mock.calls[1]?.[1]?.body as string)).toEqual({
            "discord_id": discordId,
            "maximum_age": age
        })
    });

    it('should update cleanup', async () => {
        const discordId = '892569254307207483';
        const recordId = "f823n3r0fn29o3fn";
        const age = 82800;

        const mock = mockFetch(200, {
            "page": 1,
            "perPage": 1,
            "totalPages": -1,
            "totalItems": -1,
            "items": [
                {
                    "id": recordId,
                    "collectionId": "t2s2qdel611fqc5",
                    "collectionName": "automod_cleanup_channels",
                    "created": "2022-01-01 01:00:00.123Z",
                    "updated": "2022-01-01 23:59:59.456Z",
                    "discord_id": discordId,
                    "maximum_age": 123
                }
            ]
        });

        mockFetch(200, {
            "id": "RECORD_ID",
            "collectionId": "t2s2qdel611fqc5",
            "collectionName": "automod_cleanup_channels",
            "created": "2022-01-01 01:00:00.123Z",
            "updated": "2022-01-01 23:59:59.456Z",
            "discord_id": discordId,
            "maximum_age": age
        });

        const mgr = new CleanupManager(new PocketBase(), new AsyncLock());
        await expect(mgr.enable(discordId, age)).resolves.toBe(false);

        expect(mock).toHaveBeenCalledTimes(2);

        expect(mock.mock.calls[1]?.[0]).toEqual(`/api/collections/automod_cleanup_channels/records/${recordId}`);
        expect(mock.mock.calls[1]?.[1]?.method).toEqual("PATCH");
        expect(typeof mock.mock.calls[1]?.[1]?.body).toEqual("string");
        expect(JSON.parse(mock.mock.calls[1]?.[1]?.body as string)).toEqual({
            "maximum_age": age
        })
    });

    it('should disable cleanup', async () => {
        const discordId = '920253450231864450';
        const recordId = 't2s2qdel611fqc5';

        const mock = mockFetch(200, {
            "page": 1,
            "perPage": 30,
            "totalPages": 1,
            "totalItems": 2,
            "items": [
                {
                    "id": recordId,
                    "collectionId": "t2s2qdel611fqc5",
                    "collectionName": "automod_cleanup_channels",
                    "created": "2022-01-01 01:00:00.123Z",
                    "updated": "2022-01-01 23:59:59.456Z",
                    "discord_id": discordId,
                    "maximum_age": 123
                }
            ]
        });
        mockFetch(204);

        const mgr = new CleanupManager(new PocketBase(), new AsyncLock());
        await expect(mgr.disable(discordId)).resolves.toBeUndefined()

        expect(mock).toHaveBeenCalledTimes(2);
        expect(mock.mock.calls[1]?.[0]).toEqual(`/api/collections/automod_cleanup_channels/records/${recordId}`);
    });
})
