import {MoneyFate} from "@/modules/ffxiv/eurekaweather/MoneyFate";
import EorzeaWeather from "eorzea-weather";
import {WEATHER_BLIZZARDS, WEATHER_FOG} from "@/modules/ffxiv/weather";
import {MoneyFateData} from "@/modules/ffxiv/eurekaweather/MoneyFateData";

export const fateData: Record<MoneyFate, MoneyFateData> = {
    [MoneyFate.KING_ARTHRO]: {
        zone: EorzeaWeather.ZONE_EUREKA_PAGOS,
        name: 'King Arthro',
        weather: WEATHER_FOG,
        emoji: '🦀',
        color: '#ff7400'
    },
    [MoneyFate.COPYCAT_CASSIE]: {
        zone: EorzeaWeather.ZONE_EUREKA_PAGOS,
        name: 'Copycat Cassie',
        weather: WEATHER_BLIZZARDS,
        emoji: '🪴',
        color: '#ade61c'
    },
    [MoneyFate.SKOLL]: {
        zone: EorzeaWeather.ZONE_EUREKA_PYROS,
        name: 'Skoll',
        weather: WEATHER_BLIZZARDS,
        emoji: '🐺',
        color: '#71A3D6'
    }
};