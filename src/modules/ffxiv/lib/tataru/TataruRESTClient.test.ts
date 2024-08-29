import fs from "fs";
import path from "path";
import { TataruRESTClient } from "@/modules/ffxiv/lib/tataru/TataruRESTClient";
import { mockFetch } from "@/helpers/testing";

describe('Tataru_RESTClient', () => {
    test('allPrices', async () => {
        const mockBody = fs.readFileSync(path.resolve(__dirname, '__fixtures__', 'allPrices.csv'))
        const mock = mockFetch(200, String(mockBody));
        const client = new TataruRESTClient('crabweather');
        await expect(client.allPrices()).resolves.toEqual({
            "10": {
                "40": {
                    nq: [77, 55, 85490],
                    hq: [null, null, null],
                },
                "54": {
                    nq: [49, 51, 66315],
                    hq: [null, null, null],
                },
                "57": {
                    nq: [null, null, null],
                    hq: [null, null, null],
                },
            },
            "44000": {
                "40": {
                    nq: [911, 1713, 220],
                    hq: [1998, 6888, 19],
                },
                "54": {
                    nq: [1789, 1596, 187],
                    hq: [2750, 3442, 49],
                },
                "57": {
                    nq: [null, 1473, 148],
                    hq: [1600, 1473, 148],
                },
            }
        });
        expect(mock).toHaveBeenCalledTimes(1);
    }, 20000)
})
