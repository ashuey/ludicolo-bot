import { HexColorString } from "discord.js";

export const AirQualityColors: Readonly<Record<number, [HexColorString, string]>> = Object.freeze({
    1: ["#00e400", "🟢"], // Good
    2: ["#ffff00", "🟡"], // Moderate
    3: ["#ff7e00", "🟠"], // Unhealthy for Sensitive Groups
    4: ["#ff0000", "🔴"], // Unhealthy
    5: ["#8f3f97", "🟣"], // Very Unhealthy
    6: ["#7e0023", "⚠️"], // Hazardous
    7: ["#5e5e5e", "⚪"], // Unavailable
});
