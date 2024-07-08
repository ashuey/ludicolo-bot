import {getAchievements, getMounts, LODESTONE_RESULT} from "@/modules/ffxiv/lodestone";
import fs from "fs";
import path from "path";
import {mockFetch} from "@/helpers/testing";

describe('lodestone', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('getAchievements', () => {
        const tests = [
            {
                name: "Returns achievements successfully",
                statusCode: 200,
                body: fs.readFileSync(path.resolve(__dirname, '__fixtures__', 'successResponse.html')),
                result: LODESTONE_RESULT.SUCCESS,
                achievements: ["3438","3499","3559","3566","3449","3523","3524","3503","3496","3522","3545","3546","3500","3495","3436","3521","3515","3544","828","3494","3514","3513","3520","933","3493","3543","3519","3542","3492","3511","3518","3540","3541","3512","3491","3517","3057","2874","2884","2891","2674","3418","3409","3417","3416","3062","3346","3410","3414","3293"],
            },
            {
                name: "Returns private when profile is private",
                statusCode: 403,
                body: fs.readFileSync(path.resolve(__dirname, '__fixtures__', 'privateResponse.html')),
                result: LODESTONE_RESULT.PRIVATE,
                achievements: [],
            },
            {
                name: "Returns not found when profile does not exist",
                statusCode: 404,
                body: fs.readFileSync(path.resolve(__dirname, '__fixtures__', 'noExistResponse.html')),
                result: LODESTONE_RESULT.NOT_FOUND,
                achievements: [],
            }
        ];

        test.each(tests)('$name', async ({ statusCode, body, result, achievements }) => {
            const fetchMock = mockFetch(statusCode, String(body));
            await expect(getAchievements('0')).resolves.toEqual([result, achievements]);
            expect(fetchMock).toHaveBeenCalledTimes(1);
        })
    });

    describe('getMounts', () => {
        const tests = [
            {
                name: "Returns mounts successfully",
                statusCode: 200,
                body: fs.readFileSync(path.resolve(__dirname, '__fixtures__', 'mountSuccess.html')),
                result: LODESTONE_RESULT.SUCCESS,
                mounts: ["Fat Chocobo","Coeurl","Ahriman","Behemoth","Griffin"],
            },
            {
                name: "Returns not found when profile does not exist",
                statusCode: 404,
                body: fs.readFileSync(path.resolve(__dirname, '__fixtures__', 'mountNoExist.html')),
                result: LODESTONE_RESULT.NOT_FOUND,
                mounts: [],
            }
        ];

        test.each(tests)('$name', async ({ statusCode, body, result, mounts }) => {
            const fetchMock = mockFetch(statusCode, String(body));
            await expect(getMounts('0')).resolves.toEqual([result, mounts]);
            expect(fetchMock).toHaveBeenCalledTimes(1);
        });
    })
})
