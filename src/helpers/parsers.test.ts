import {parseHumanSpan} from "@/helpers/parsers";

describe('parsers', () => {
    describe('parseHumanSpan', () => {
        const tests: [string, number][] = [
            ['25m', 1500],
            ['1Minute', 60],
            ['23 minutes', 1380],
            ['22 H', 79200],
            ['21hour', 75600],
            ['20Hours', 72000],
            ['19 d', 1641600],
            ['1 Day', 86400],
            ['17days', 1468800],
            ['3W', 1814400],
            ['2 week', 1209600],
            ['1 Weeks', 604800],
            ['16h43m', 60180],
            ['15hour 34minute', 56040],
            ['10hours14hours', 86400],
            ['8d3d11h', 990000],
            ['6day7 h', 543600],
            ['4 days5hours', 363600],
            ['1w2d12h', 820800],
            ['1week 3day', 864000],
            ['1weeks2days', 777600],
        ]

        test.each(tests)("parses %p correctly", (span, expected) => {
            expect(parseHumanSpan(span)).toBe(expected);
        })
    })
})
