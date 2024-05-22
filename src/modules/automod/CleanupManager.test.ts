import {CleanupManager} from "@/modules/automod/CleanupManager";
import PocketBase from "pocketbase/cjs";
import {mockFetch} from "@/helpers/testing";

describe('CleanupManager', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    })

    it('should enable cleanup', async () => {
        const discordId = '892569254307207483';
        const age = 82800;

        const mock = mockFetch(200, {
            "id": "RECORD_ID",
            "collectionId": "t2s2qdel611fqc5",
            "collectionName": "automod_cleanup_channels",
            "created": "2022-01-01 01:00:00.123Z",
            "updated": "2022-01-01 23:59:59.456Z",
            "discord_id": discordId,
            "maximum_age": age
        });

        const mgr = new CleanupManager(new PocketBase());
        await expect(mgr.enable(discordId, age)).resolves.toBeUndefined();

        expect(mock).toHaveBeenCalledTimes(1);
        expect(mock.mock.calls[0]?.[0]).toEqual("/api/collections/automod_cleanup_channels/records");
        expect(mock.mock.calls[0]?.[1]?.method).toEqual("POST");
        expect(typeof mock.mock.calls[0]?.[1]?.body).toEqual("string");
        expect(JSON.parse(mock.mock.calls[0]?.[1]?.body as string)).toEqual({
            "discord_id": discordId,
            "maximum_age": age
        })
    });

    it('should handle 400 errors on enable', async () => {
        const discordId = '466125665125907669';
        const age = 7200;

        const mock = mockFetch(400, {
            "code": 400,
            "message": "Failed to create record.",
            "data": {
                "discord_id": {
                    "code": "validation_required",
                    "message": "Missing required value."
                }
            }
        });

        const mgr = new CleanupManager(new PocketBase());
        await expect(mgr.enable(discordId, age)).rejects.toThrow();

        expect(mock).toHaveBeenCalledTimes(1);
    });

    it('should handle 403 errors on enable', async () => {
        const discordId = '935758346719099930';
        const age = 100800;

        const mock = mockFetch(403, {
            "code": 403,
            "message": "You are not allowed to perform this request.",
            "data": {}
        });

        const mgr = new CleanupManager(new PocketBase());
        await expect(async () => {
            await mgr.enable(discordId, age);
        }).rejects.toThrow();

        expect(mock).toHaveBeenCalledTimes(1);
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

        const mgr = new CleanupManager(new PocketBase());
        await expect(mgr.disable(discordId)).resolves.toBeUndefined()

        expect(mock).toHaveBeenCalledTimes(2);
        expect(mock.mock.calls[1]?.[0]).toEqual(`/api/collections/automod_cleanup_channels/records/${recordId}`);
    });
})
