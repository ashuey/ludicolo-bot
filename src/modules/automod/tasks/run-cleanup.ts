import {ServiceProvider} from "@/modules/automod/ServiceProvider";
import {FetchMessagesOptions, Message} from "discord.js";
import {logger} from "@/logger";

export async function runCleanup(module: ServiceProvider) {
    logger.info("Running Cleanup");
    const records = await module.cleanup.getAll();
    const now = new Date().getTime()

    for (const record of records) {
        try {
            const cutoff = now - record.maximum_age;
            const channel = await module.app.discord.channels.fetch(record.discord_id);

            if (!channel) {
                logger.error(`Error while fetching channel: ${record.discord_id}`);
                continue;
            }

            if (!channel.isTextBased()) {
                logger.error(`Channel ${record.discord_id} is not text-based`);
                continue;
            }

            if (channel.isDMBased()) {
                logger.error(`Channel ${record.discord_id} is a DM channel`);
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

            logger.info(`[${channel.guild.name}] cleaning up ${messagesToDelete.length} messages in ${channel.name}`);
            const messageBatches = [];
            while (messagesToDelete.length > 0) {
                messageBatches.push(messagesToDelete.splice(0, 100));
            }
            for (const [batchNo, batch] of messageBatches.entries()) {
                logger.debug(`[${channel.guild.name}] Batch ${batchNo + 1}: ${batch.length} messages to delete`);
                await channel.bulkDelete(batch);
            }
        } catch (e) {
            logger.error(`Error while processing channel cleanup record (${record.id}): ${e}`);
        }
    }
}
