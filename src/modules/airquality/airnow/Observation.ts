import { Category } from "@/modules/airquality/airnow/Category";

export interface Observation {
    DateObserved: string
    HourObserved: number
    LocalTimeZone: string
    ReportingArea: string
    StateCode: string
    Latitude: number
    Longitude: number
    ParameterName: string
    AQI: number
    Category: Category
}
