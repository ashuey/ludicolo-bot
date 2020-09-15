import ServiceProvider from "@ashuey/ludicolo-framework/lib/Support/ServiceProvider";
import { CommandoClient, CommandoGuild } from "discord.js-commando";
import { Guild, MessageEmbed } from "discord.js";
import { isTextChannel } from "@ashuey/ludicolo-discord/lib/util";
import { CronJob } from "cron";
import UnownTradingService from "../Modules/PokemonTrading/Services/UnownTradingService";
import * as url from 'url';
import { config } from "@ashuey/ludicolo-framework/lib/Support/helpers";
import UrlSigner from "../Http/UrlSigner";
import ScreeningReminder from "../ScreeningReminder";
import * as moment from "moment";
import "moment-timezone";

function isCommandoGuild(guild: Guild): guild is CommandoGuild {
    return guild.hasOwnProperty('settings');
}

export default class AppServiceProvider extends ServiceProvider {

    register() {
        this.app.singleton('unown', UnownTradingService, 'db');

        new CronJob('00 09 * * *', async () => {
            console.log('Running COVID reminder');

            const reminderEmbed = new MessageEmbed()
                .setTitle('Daily Health Screen Reminder')
                .setDescription('Please complete the Daily Health Screen at https://dailyhealth.rit.edu\n\nThanks for helping to keep our community safe!')
                .setColor('#e54142');

            const client = await this.app.make<Promise<CommandoClient>>('discord.client');

            await Promise.all(client.guilds.cache.map(async guild => {
                if (isCommandoGuild(guild)) {
                    console.log('Checking covid reminder for guild', guild.name);

                    const reminderChannelId = await guild.settings.get('screening_reminder_channel');
                    const reminderRoleId = await guild.settings.get('screening_reminder_role');

                    if (reminderChannelId && reminderRoleId) {
                        const reminderChannel = guild.channels.resolve(reminderChannelId);
                        const reminderRole = guild.roles.resolve(reminderRoleId);

                        if (isTextChannel(reminderChannel)) {
                            console.log('Sending covid reminder to', reminderChannel.name);
                            return reminderChannel.send(`${reminderRole}`, reminderEmbed);
                        }
                    }
                }
            }));
        }, null, true, 'America/New_York');


        new CronJob('0 * * * *', async () => {
            const now = moment().tz('America/New_York');

            if (now.hour() < 9) {
                console.log("Too early for v2 COVID reminders, exiting");
                return;
            }

            console.log('Running v2 COVID reminder');

            const client = await this.app.make<Promise<CommandoClient>>('discord.client');
            const urlSigner = this.app.make<UrlSigner>('url_signer');

            const screeningReminders = await ScreeningReminder.query();

            for (let screeningReminder of screeningReminders) {
                if (screeningReminder.completed_at != null) {
                    const localCompletedAt = moment.utc(screeningReminder.completed_at).tz('America/New_York');

                    if (localCompletedAt.isSame(now, 'day')) {
                        continue;
                    }
                }

                const user = await client.users.fetch(screeningReminder.user);

                if (!user) {
                    console.log(`Invalid screening reminder record for ${screeningReminder.user}, skipping`);
                    continue;
                }

                const baseUrl = url.resolve(config('http.url'), `/do_health_check/${user.id}`);
                const authUrl = urlSigner.sign(baseUrl, moment().endOf('day'));

                const reminderEmbed = new MessageEmbed()
                    .setTitle('Daily Health Screen Reminder')
                    .setDescription(`Please complete the Daily Health Screen at ${authUrl}\n\nThanks for helping to keep our community safe!`)
                    .setColor('#e54142');

                user.send(reminderEmbed);
            }

        }, null, true, 'America/New_York');
    }

    async boot(): Promise<void> {
        const urlSigner = this.app.make<UrlSigner>('url_signer')
        const baseUrl =  url.resolve(config('http.url'), `/send_raid_command`);
        const raidReportUrl = urlSigner.sign(`${baseUrl}?version=6LwK6Pk7`);
        console.log(`Raid Reporting Webhook: ${raidReportUrl}`)
    }
}