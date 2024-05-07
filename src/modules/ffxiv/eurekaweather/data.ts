import {MoneyFate} from "@/modules/ffxiv/eurekaweather/MoneyFate";
import EorzeaWeather from "eorzea-weather";
import {WEATHER_BLIZZARDS, WEATHER_FOG} from "@/modules/ffxiv/weather";
import {MoneyFateData} from "@/modules/ffxiv/eurekaweather/MoneyFateData";

export const fateData: Record<MoneyFate, MoneyFateData> = {
    [MoneyFate.KING_ARTHRO]: {
        zone: EorzeaWeather.ZONE_EUREKA_PAGOS,
        name: 'KA/Crab',
        weather: WEATHER_FOG,
    },
    [MoneyFate.COPYCAT_CASSIE]: {
        zone: EorzeaWeather.ZONE_EUREKA_PAGOS,
        name: 'Cassie',
        weather: WEATHER_BLIZZARDS,
    },
    [MoneyFate.SKOLL]: {
        zone: EorzeaWeather.ZONE_EUREKA_PYROS,
        name: 'Skoll',
        weather: WEATHER_BLIZZARDS,
    }
};
