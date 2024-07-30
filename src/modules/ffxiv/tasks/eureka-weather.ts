import {EmbedBuilder, TextBasedChannel} from "discord.js";
import EorzeaWeather from "eorzea-weather";
import {ApplicationProvider} from "@/common/ApplicationProvider";
import {Forecast} from "@/modules/ffxiv/Forecast";
import {ForecastEntry} from "@/modules/ffxiv/weather/ForecastEntry";
import {fateData} from "@/modules/ffxiv/eurekaweather/data";
import {MoneyFate} from "@/modules/ffxiv/eurekaweather/MoneyFate";
import {logger} from "@/logger";

const zoneNames = {
    [EorzeaWeather.ZONE_EUREKA_PAGOS]: 'Eureka Pagos',
    [EorzeaWeather.ZONE_EUREKA_PYROS]: 'Eureka Pyros',
}

const CHANNEL_ID = "1243567403313528912"; // TODO: Don't hardcode this
//const CHANNEL_ID = "1107395046900236388"; // DEV

export const ONE_MINUTE = 60 * 1000;
export const TWENTY_MINUTES = 20 * ONE_MINUTE;
export const TWO_HOURS = TWENTY_MINUTES * 6;

const lastSent: Record<MoneyFate, number> = {
    [MoneyFate.SKOLL]: 0,
    [MoneyFate.COPYCAT_CASSIE]: 0,
    [MoneyFate.KING_ARTHRO]: 0,
};

export function resetLastSent() {
    lastSent[MoneyFate.SKOLL] = 0;
    lastSent[MoneyFate.KING_ARTHRO] = 0;
    lastSent[MoneyFate.COPYCAT_CASSIE] = 0;
}

async function sendNmAlert(channel: TextBasedChannel, fate: MoneyFate) {
    const thisFateData = fateData[fate];
    const forecast = new Forecast(thisFateData.zone);
    const nextWindow = forecast.findNext(thisFateData.weather);

    if (nextWindow && forecastIsAlertable(nextWindow, lastSent[fate])) {
        const timestamp = Math.floor(nextWindow.startedAt.getTime() / 1000);
        const previous = forecast.findPrevious(nextWindow);
        const previousEnd = forecast.findPrevious(nextWindow, false);

        const timeDiff = previous ? nextWindow.startedAt.getTime() - previous.startedAt.getTime() : Infinity;
        const previousWarning = timeDiff < TWO_HOURS
            ? `⚠️ Last spawn ${Math.floor(timeDiff / ONE_MINUTE)}m earlier\n\n`
            : '';

        const endTimeDiff = previousEnd ? nextWindow.startedAt.getTime() - Forecast.getEndTime(previousEnd).getTime() : Infinity;
        const freeWindowMessage = endTimeDiff > TWO_HOURS
            ? `✅ Guaranteed Spawn. Last window ended ${previous ? `${Math.floor(endTimeDiff / ONE_MINUTE)}m` : 'Over 6 hours'} earlier\n\n`
            : '';

        const zoneName = zoneNames[thisFateData.zone] ?? '';

        await channel.send({
            embeds: [
                (new EmbedBuilder()
                // eslint-disable-next-line no-irregular-whitespace
                .setTitle(`${thisFateData.emoji} ${thisFateData.emoji} ${thisFateData.emoji}  ${thisFateData.name} Spawn Window ${thisFateData.emoji} ${thisFateData.emoji} ${thisFateData.emoji}`)
                // eslint-disable-next-line no-irregular-whitespace
                .setDescription(`🕛  <t:${timestamp}:R> (<t:${timestamp}:t>)\n\n${freeWindowMessage}${previousWarning}🗺  ${zoneName}  —  ${thisFateData.aetherite}`)
                .setColor(thisFateData.color))
            ]
        }).catch(err => {
            logger.error(err);
        });
        lastSent[fate] = nextWindow.startedAt.getTime();
    }
}

export async function sendEurekaWeather(module: ApplicationProvider) {
    const channel = await module.app.discord.channels.fetch(CHANNEL_ID)
        .catch(err => {
            logger.error(`Error while fetching eureka weather channel: ${err}`);
        });

    if (!channel) {
        logger.warn(`Channel for Eureka weather was not found`);
        return;
    }

    if (!channel.isTextBased()) {
        logger.warn(`Channel for Eureka weather is not text-based: ${channel.name}`);
        return;
    }

    await sendNmAlert(channel, MoneyFate.KING_ARTHRO);
    await sendNmAlert(channel, MoneyFate.SKOLL);
    await sendNmAlert(channel, MoneyFate.COPYCAT_CASSIE);
}

export function forecastIsAlertable(forecastEntry: ForecastEntry, lastSent: number): boolean {
    if (lastSent === forecastEntry.startedAt.getTime()) {
        return false;
    }

    // noinspection RedundantIfStatementJS
    if ((forecastEntry.startedAt.getTime() - (new Date).getTime()) > TWENTY_MINUTES) {
        return false;
    }

    return true;
}
