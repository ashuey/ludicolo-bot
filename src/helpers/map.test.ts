import {recordGetOrMake} from "@/helpers/map";

describe('recordGetOrMake', () => {
    it('returns existing values', () => {
        const record: Record<string, number> = { 'carrot': 317, 'apple': 405 };

        const value = recordGetOrMake(record, 'carrot', () => 528);

        expect(value).toEqual(317);
        expect(record).toEqual({ 'carrot': 317, 'apple': 405 });
    });

    it('creates non-existent values', () => {
        const record: Record<string, number> = { 'carrot': 698, 'apple': 729 };

        const value = recordGetOrMake(record, 'potato', () => 834);

        expect(value).toEqual(834);
        expect(record).toEqual({ 'carrot': 698, 'apple': 729, 'potato': 834 });
    })
});
