import ServiceProvider from "@ashuey/ludicolo-framework/lib/Support/ServiceProvider";
import { CommandoClient, CommandoGuild } from "discord.js-commando";
import { Guild, MessageEmbed } from "discord.js";
import { isTextChannel } from "@ashuey/ludicolo-discord/lib/util";
import { CronJob } from "cron";

function isCommandoGuild(guild: Guild): guild is CommandoGuild {
    return guild.hasOwnProperty('settings');
}

export default class AppServiceProvider extends ServiceProvider {

    register() {
        console.log('Registered covid CRON');

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
    }
}