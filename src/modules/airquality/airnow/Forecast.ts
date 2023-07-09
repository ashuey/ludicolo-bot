import { Category } from "@/modules/airquality/airnow/Category";

export interface Forecast {
    DateIssue: string;
    DateForecast: string;
    ReportingArea: string;
    StateCode: string;
    Latitude: number;
    Longitude: number;
    ParameterName: string;
    AQI: number;
    Category: Category;
    ActionDay: boolean;
    Discussion: string;
}
