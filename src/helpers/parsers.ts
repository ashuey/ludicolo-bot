const spanRegex = /(\d+)\s*([a-zA-Z]+)/g;

const spanUnits: Record<string, number> = {
    'm': 60,
    'minute': 60,
    'minutes': 60,
    'h': 3600,
    'hour': 3600,
    'hours': 3600,
    'd': 86400,
    'day': 86400,
    'days': 86400,
    'w': 604800,
    'week': 604800,
    'weeks': 604800,
};

export class ParseError extends Error {}

export function parseHumanSpan(span: string): number {
    let time = 0;

    for (const match of span.matchAll(spanRegex)) {
        const unit = match[2] as string;
        const unitLength = spanUnits[unit.toLowerCase()];

        if (!unitLength) {
            throw new ParseError();
        }

        const qty = parseInt(match[1] as string);

        if (isNaN(qty)) {
            throw new ParseError();
        }

        time += unitLength * qty;
    }

    return time;
}
