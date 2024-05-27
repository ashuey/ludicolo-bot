import {ServiceProvider} from "@/modules/automod/ServiceProvider";
import * as console from "node:console";
import {FetchMessagesOptions, Message} from "discord.js";

export async function runCleanup(module: ServiceProvider) {
    console.log("RUNNING CLEANUP");
    const records = await module.cleanup.getAll();
    const now = new Date().getTime()

    for (const record of records) {
        try {
            const cutoff = now - record.maximum_age;
            const channel = await module.app.discord.channels.fetch(record.discord_id);

            if (!channel) {
                console.error(`Error while fetching channel: ${record.discord_id}`);
                continue;
            }

            if (!channel.isTextBased()) {
                console.error(`Channel ${record.discord_id} is not text-based`);
                continue;
            }

            if (channel.isDMBased()) {
                console.error(`Channel ${record.discord_id} is a DM channel`);
                continue;
            }

            const messagesToDelete: string[] = [];
            let deletableFiltered = 0;
            let before: string | undefined;

            do {
                const fetchOptions: FetchMessagesOptions = {
                    limit: 100,
                    cache: false,
                };

                if (before) {
                    fetchOptions.before = before;
                }

                const newMessages = await channel.messages.fetch(fetchOptions);

                if (newMessages.size === 0) {
                    break;
                }

                before = (newMessages.last() as Message<true>).id

                const deletable = newMessages
                    .filter(msg => msg.bulkDeletable);

                deletableFiltered = newMessages.size - deletable.size;

                deletable.forEach(msg => {
                    if (msg.createdTimestamp <= cutoff) {
                        messagesToDelete.push(msg.id);
                    }
                })
            } while (deletableFiltered === 0);

            console.log(`[${channel.guild.name}] cleaning up ${messagesToDelete.length} messages in ${channel.name}`)
            await channel.bulkDelete(messagesToDelete);
        } catch (e) {
            console.error(`Error while processing channel cleanup record (${record.id}): ${e}`);
        }
    }
}
