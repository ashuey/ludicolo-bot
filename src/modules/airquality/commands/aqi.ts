import { Command } from "@/common/Command";
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { AirNowProvider } from "@/modules/airquality/AirNowProvider";
import { fmtError } from "@/helpers/formatters";
import { AirQualityColors } from "@/modules/airquality/airnow/colors";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

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

        const results = await this.module.airNow.currentObservation(String(zip));
        const ob = results.find(o => o.ParameterName.toLowerCase().trim() === 'pm2.5');

        if (!ob) {
            return interaction.reply({
                content: fmtError("No data available for that ZIP code"),
                ephemeral: true,
            });
        }

        const timestamp = dayjs.tz(
            `${ob.DateObserved.trim()} ${ob.HourObserved}`,
            'YYYY-MM-DD HH',
            ob.LocalTimeZone
        ).toDate();

        const response = (new EmbedBuilder())
            .setTitle(`Current Air Quality in ${ob.ReportingArea}: ${ob.Category.Name}`)
            .setFooter({ text: "Data provided by AirNow.gov" })
            .setColor(AirQualityColors[ob.Category.Number] ?? null)
            .setTimestamp(timestamp)
            .addFields(
                { name: 'Air Quality Index', value: String(ob.AQI)}
            );

        return interaction.reply({embeds: [response]});
    }
}
