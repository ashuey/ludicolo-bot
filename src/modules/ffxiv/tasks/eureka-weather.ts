import {ApplicationProvider} from "@/common/ApplicationProvider";
import EorzeaWeather from "eorzea-weather";
import {Forecast} from "@/modules/ffxiv/Forecast";
import * as console from "node:console";
import {ForecastEntry} from "@/modules/ffxiv/weather/ForecastEntry";

// TODO: This whole thing is kind of a mess

const CHANNEL_ID = "1234701925698506792"; // TODO: Don't hardcode this
//  const CHANNEL_ID = "1107395046900236388"; // DEV

export const TWENTY_MINUTES = 20 * 60 * 1000;


let lastSentCrab = 0;
let lastSentCassie = 0;
let lastSentSkoll = 0;

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
        await channel.send({
            content: `[PAGOS] Next KA/Crab weather (Fog) is <t:${arthroTimestamp}:R> (<t:${arthroTimestamp}>)`,
            files: ['embeds/crabmap.png']
        }).catch(err => {
            console.error(err);
        });
        lastSentCrab = nextKingArthro.startedAt.getTime();
    }

    if (nextCassie && forecastIsAlertable(nextCassie, lastSentCassie)) {
        //console.log('sending cass');
        const cassieTimestamp = Math.floor(nextCassie.startedAt.getTime() / 1000);
        await channel.send({
            content: `[PAGOS] Next Cassie weather (Blizzards) is <t:${cassieTimestamp}:R> (<t:${cassieTimestamp}>)`,
            files: ['embeds/cassiemap.png']
        }).catch(err => {
            console.error(err);
        });
        lastSentCassie = nextCassie.startedAt.getTime();
    }

    if (nextSkoll && forecastIsAlertable(nextSkoll, lastSentSkoll)) {
        //console.log('sending skoll');
        const skollTimestamp = Math.floor(nextSkoll.startedAt.getTime() / 1000);
        await channel.send({
            content: `[PYROS] Next Skoll weather (Blizzards) is <t:${skollTimestamp}:R> (<t:${skollTimestamp}>)`,
            files: ['embeds/skollmap.png']
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
