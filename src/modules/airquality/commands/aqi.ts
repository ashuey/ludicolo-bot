import { bold, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { AirQualityColors } from "@/modules/airquality/airnow/colors";
import { AirNowProvider } from "@/modules/airquality/AirNowProvider";
import { Command } from "@/common/Command";
import { Forecast } from "@/modules/airquality/airnow/Forecast";
import { Observation } from "@/modules/airquality/airnow/Observation";
import { betterPollutantNames } from "@/modules/airquality/airnow/pollutants";
import {logger} from "@/logger";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export class AQICommand implements Command {
    // TODO: Don't hardcode this
    static readonly DEFAULT_ZIP = 14614;

    protected module: AirNowProvider

    constructor(module: AirNowProvider) {
        this.module = module;
    }

    build() {
        return (new SlashCommandBuilder())
            .setName('aqi')
            .setDescription('Gets the current Air Quality Index for a location')
            .addIntegerOption(option =>
                option.setName('zip_code')
                    .setDescription('5-digit ZIP Code')
                    .setMinValue(10000)
                    .setMaxValue(99999))
    }

    async execute(interaction: ChatInputCommandInteraction) {
        const zip = interaction.options.getInteger('zip_code') ?? AQICommand.DEFAULT_ZIP;

        const response = (new EmbedBuilder())
            .setFooter({ text: "Data provided by AirNow.gov" });

        const current = await this.getCurrentObservations(zip);
        let now = dayjs();

        if (current) {
            now = now.tz(current.LocalTimeZone);
        }

        const [today, tomorrow] = await Promise.all([
            this.getForecast(zip, now),
            this.getForecast(zip, now.add(1, 'day')),
        ])

        let title = "Air Quality";
        let aqi = 'Unavailable';
        let primaryPollutant = 'Unavailable';
        let todayStr = 'Unavailable';
        let tomorrowStr = 'Unavailable';
        let currentCategory = 'Unavailable';

        if (current) {
            const color = AirQualityColors[current.Category.Number];

            // Add location to the title
            title = title + ` in ${current.ReportingArea}`;
            currentCategory = `${color ? `${color[1]} ` : ''} ${current.Category.Name}`

            // Get the timestamp of the observation
            const timestamp = dayjs.tz(
                `${current.DateObserved.trim()} ${current.HourObserved}`,
                'YYYY-MM-DD HH',
                current.LocalTimeZone
            ).toDate();

            const pollutantKey = current.ParameterName.toLowerCase().trim();

            aqi = String(current.AQI);
            primaryPollutant = betterPollutantNames[pollutantKey] ?? current.ParameterName;

            response
                .setTimestamp(timestamp)
                .setColor(color ? color[0] : null);
        }

        if (today) {
            const emoji = AirQualityColors[today.Category.Number];
            todayStr = `${emoji ? emoji[1] : ''} ${today.Category.Name}`.trim();
        }

        if (tomorrow) {
            const emoji = AirQualityColors[tomorrow.Category.Number];
            tomorrowStr = `${emoji ? emoji[1] : ''} ${tomorrow.Category.Name}`.trim();
        }

        response
            .setTitle(title)
            .setDescription(currentCategory)
            .addFields(
                {
                    name: 'Air Quality Index',
                    value: aqi,
                    inline: true,
                },
                {
                    name: 'Primary Pollutant',
                    value: primaryPollutant,
                    inline: true,
                },
                {
                    name: 'Forecast',
                    value: `${bold('Today:')} ${todayStr}\n${bold('Tomorrow:')} ${tomorrowStr}`,
                },
            );

        return interaction.reply({embeds: [response]});
    }

    protected async getCurrentObservations(zip: number): Promise<Observation|null> {
        const [obResult, observations] = await this.module.airNow.currentObservation(String(zip));

        if (!obResult) {
            logger.warn(`Error getting air quality observations: ${observations}`);

            return null;
        }

        let observation: Observation | null = null;

        observations.forEach(o => {
            if (observation === null || o.AQI > observation.AQI) {
                observation = o;
            }
        })

        return observation;
    }

    protected async getForecast(zip: number, date: dayjs.Dayjs): Promise<Forecast|null> {
        const dateString = date.format('YYYY-MM-DD');
        const [fResult, forecasts] = await this.module.airNow.forecasts(String(zip), dateString);

        if (!fResult) {
            logger.warn(`Error getting air quality forecasts for ${dateString}: ${forecasts}`);

            return null;
        }

        const forecastsForDate = forecasts.filter(f =>
            f.DateForecast.toLowerCase().trim() === dateString
        );

        let forecast: Forecast | null = null;

        forecastsForDate.forEach(f => {
            if (forecast === null || f.AQI > forecast.AQI) {
                forecast = f;
            }
        })

        return forecast;
    }
}
