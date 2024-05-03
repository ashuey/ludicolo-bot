import EorzeaWeather from "eorzea-weather";

const ET_ONE_HOUR = 175 * 1000;
const ET_EIGHT_HOURS = 8 * ET_ONE_HOUR;

export interface ForecastEntry {
    name: string;
    startedAt: Date;
}

export class Forecast {
    protected readonly eorzeaWeather: EorzeaWeather;

    protected forecast: ForecastEntry[] = [];

    constructor(zone: string) {
        this.eorzeaWeather = new EorzeaWeather(zone);
        this.refresh();
    }

    refresh() {
        const now = new Date();
        const startTime = this.getStartTime(now.getTime());
        this.forecast = [];
        for (let time = startTime - (ET_EIGHT_HOURS * 6); time < (startTime + (ET_EIGHT_HOURS * 6)); time += ET_EIGHT_HOURS) {
            const startedAt = new Date(time);
            this.forecast.push({
                name: this.eorzeaWeather.getWeather(new Date(time)),
                startedAt,
            });
        }
    }

    findNext(weather: string): ForecastEntry | undefined {
        const now = new Date();

        return this.forecast.find((entry, idx) =>
            entry.name.toLowerCase() === weather.toLowerCase()
            && entry.startedAt > now
            && entry.name !== this.forecast[idx - 1]?.name
        );
    }

    current(): string {
        return this.eorzeaWeather.getWeather(new Date());
    }

    protected getStartTime = (msec: number): number => {
        const bell = (msec / ET_ONE_HOUR) % 24;
        return msec - Math.round(ET_ONE_HOUR * bell);
    };
}


