import {ApplicationProvider} from "@/common/ApplicationProvider";
import EorzeaWeather from "eorzea-weather";
import {Forecast} from "@/modules/ffxiv/Forecast";
import * as console from "node:console";
import {ForecastEntry} from "@/modules/ffxiv/weather/ForecastEntry";
import {ColorResolvable, EmbedBuilder} from "discord.js";
import {fateData} from "@/modules/ffxiv/eurekaweather/data";
import {MoneyFate} from "@/modules/ffxiv/eurekaweather/MoneyFate";

// TODO: This whole thing is kind of a mess

const CHANNEL_ID = "1234701925698506792"; // TODO: Don't hardcode this
//const CHANNEL_ID = "1107395046900236388"; // DEV

export const TWENTY_MINUTES = 20 * 60 * 1000;


let lastSentCrab = 0;
let lastSentCassie = 0;
let lastSentSkoll = 0;

function getEmbed(emoji: string, boss: string, ts: number, world: string, tp: string, color: ColorResolvable) {
    return new EmbedBuilder()
        .setTitle(`${emoji}  ${boss} Spawn Window`)
        .setDescription(`🕛  <t:${ts}:R> (<t:${ts}:t>)\n\n\n🗺  ${world}  —  ${tp}`)
        .setColor(color);
}

export async function sendEurekaWeather(module: ApplicationProvider) {
    const channel = await module.app.discord.channels.fetch(CHANNEL_ID)
        .catch(err => {
            console.error(`Error while fetching eureka weather channel: ${err}`);
        });

    if (!channel) {
        console.warn(`Channel for Eureka weather was not found`);
        return;
    }

    if (!channel.isTextBased()) {
        console.warn(`Channel for Eureka weather is not text-based: ${channel.name}`);
        return;
    }

    const pagosForecast = new Forecast(EorzeaWeather.ZONE_EUREKA_PAGOS);
    const pyrosForecast = new Forecast(EorzeaWeather.ZONE_EUREKA_PYROS);

    const nextKingArthro = pagosForecast.findNext("fog");
    const nextCassie = pagosForecast.findNext("blizzards");
    const nextSkoll = pyrosForecast.findNext("blizzards");

    if (nextKingArthro && forecastIsAlertable(nextKingArthro, lastSentCrab)) {
        //console.log('sending ka');
        const arthroTimestamp = Math.floor(nextKingArthro.startedAt.getTime() / 1000);
        const arthroData = fateData[MoneyFate.KING_ARTHRO];
        await channel.send({
            embeds: [
                getEmbed(arthroData.emoji, arthroData.name, arthroTimestamp, "Eureka Pagos", "Geothermal Studies", arthroData.color)
            ]
        }).catch(err => {
            console.error(err);
        });
        lastSentCrab = nextKingArthro.startedAt.getTime();
    }

    if (nextCassie && forecastIsAlertable(nextCassie, lastSentCassie)) {
        //console.log('sending cass');
        const cassieTimestamp = Math.floor(nextCassie.startedAt.getTime() / 1000);
        const cassieData = fateData[MoneyFate.COPYCAT_CASSIE];
        await channel.send({
            embeds: [
                getEmbed(cassieData.emoji, cassieData.name, cassieTimestamp, "Eureka Pagos", "Gravitational Studies", cassieData.color)
            ]
        }).catch(err => {
            console.error(err);
        });
        lastSentCassie = nextCassie.startedAt.getTime();
    }

    if (nextSkoll && forecastIsAlertable(nextSkoll, lastSentSkoll)) {
        //console.log('sending skoll');
        const skollTimestamp = Math.floor(nextSkoll.startedAt.getTime() / 1000);
        const skollData = fateData[MoneyFate.SKOLL];
        await channel.send({
            embeds: [
                getEmbed(skollData.emoji, skollData.name, skollTimestamp, "Eureka Pyros", "Northpoint", skollData.color)
            ]
        }).catch(err => {
            console.error(err);
        });
        lastSentSkoll = nextSkoll.startedAt.getTime();
    }
}

export function forecastIsAlertable(forecastEntry: ForecastEntry, lastSent: number): boolean {
    if (lastSent === forecastEntry.startedAt.getTime()) {
        return false;
    }

    if ((forecastEntry.startedAt.getTime() - (new Date).getTime()) > TWENTY_MINUTES) {
        return false;
    }

    return true;
}
