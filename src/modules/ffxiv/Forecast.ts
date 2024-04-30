import EorzeaWeather from "eorzea-weather";

const ET_ONE_HOUR = 175 * 1000;
const ET_EIGHT_HOURS = 8 * ET_ONE_HOUR;

interface ForecastEntry {
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
        const startedAt = new Date(startTime);
        this.forecast.push({
            name: this.eorzeaWeather.getWeather(startedAt),
            startedAt,
        });
    }

    findNext(weather: string): ForecastEntry | undefined {
        return this.forecast.find(entry => entry.name.toLowerCase() === weather.toLowerCase());
    }

    protected getStartTime = (msec: number): number => {
        const bell = (msec / ET_ONE_HOUR) % 8;
        return (msec - Math.round(ET_ONE_HOUR * bell)) + ET_EIGHT_HOURS;
    };
}

