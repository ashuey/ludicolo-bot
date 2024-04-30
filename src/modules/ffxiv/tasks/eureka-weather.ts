import {ApplicationProvider} from "@/common/ApplicationProvider";
import EorzeaWeather from "eorzea-weather";
import {Forecast} from "@/modules/ffxiv/Forecast";
import * as console from "node:console";

// TODO: This whole thing is kind of a mess

const CHANNEL_ID = "1234701925698506792"; // TODO: Don't hardcode this

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

    if (nextKingArthro && lastSentCrab !== nextKingArthro.startedAt.getTime()) {
        const arthroTimestamp =Math.floor(nextKingArthro.startedAt.getTime() / 1000);
        await channel.send(
            `Next KA/Crab weather (Fog) is <t:${arthroTimestamp}:R> (<t:${arthroTimestamp}>)`
        );
        lastSentCrab = nextKingArthro.startedAt.getTime();
    }

    if (nextCassie && lastSentCassie !== nextCassie.startedAt.getTime()) {
        const cassieTimestamp = Math.floor(nextCassie.startedAt.getTime() / 1000);
        await channel.send(
            `Next Cassie weather (Blizzards) is <t:${cassieTimestamp}:R> (<t:${cassieTimestamp}>)`
        );
        lastSentCassie = nextCassie.startedAt.getTime();
    }

    if (nextSkoll && lastSentSkoll !== nextSkoll.startedAt.getTime()) {
        const skollTimestamp = Math.floor(nextSkoll.startedAt.getTime() / 1000);
        await channel.send(
            `Next Skoll weather (Blizzards) is <t:${skollTimestamp}:R> (<t:${skollTimestamp}>)`
        );
        lastSentSkoll = nextSkoll.startedAt.getTime();
    }
}
