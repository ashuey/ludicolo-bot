import {Command} from "@/common/Command";
import {ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder} from "discord.js";
import {GuildOnlyError} from "@/common/errors/GuildOnlyError";
import {fmtError} from "@/helpers/formatters";
import {getAchievements, getMounts, LODESTONE_RESULT} from "@/modules/ffxiv/lodestone";
import {logger} from "@/logger";
import {allowedGuilds, ffxivUsers} from "@/modules/ffxiv/users";

const finishedMsq = new Set<string>();

const checkpoints: [string, string][] = [
    ['3517', 'Level 91 Dungeon'],
    ['3491', 'Level 91 Achievement'],
    ['3518', 'Level 93 Dungeon'],
    ['3492', 'Level 93 Achievement'],
    ['3519', 'Level 95 Dungeon'],
    ['3493', 'Level 95 Achievement'],
    ['3520', 'Level 97 Dungeon'],
    ['3494', 'Level 97 Achievement'],
    ['3495', 'Level 99 Achievement'],
    ['3496', 'Finished MSQ'],
];

const symPrivate = Symbol();

async function getData(guild: Guild): Promise<[string, string[]][]> {
    let lodestoneCalls = 0;
    const playerData: [string | null | typeof symPrivate, string][] = [];
    const lastCheckpointIndex = checkpoints.length - 1;
    const [lastCheckpointId,] = checkpoints[lastCheckpointIndex] as [string, string];

    for (const [discordId, ffId] of Object.entries(ffxivUsers)) {
        let displayName = discordId;
        try {
            const guildMember = await guild.members.fetch(discordId);
            displayName = guildMember.displayName;
        } catch {
            const discordUser = await guild.client.users.fetch(discordId);
            displayName = discordUser.displayName;
        }

        if (finishedMsq.has(ffId)) {
            logger.debug(`Cached: MSQ finished for ${displayName}`);

            playerData.push([lastCheckpointId, displayName]);
            continue;
        }

        const [achievementResult, achievementData] = await getAchievements(ffId);
        lodestoneCalls += 1;

        if (achievementResult === LODESTONE_RESULT.PRIVATE) {
            logger.debug(`Achievement data is private for ${displayName}`);
            const [mountResult, mountData] = await getMounts(ffId);
            lodestoneCalls += 1;

            if (mountResult === LODESTONE_RESULT.SUCCESS && mountData.includes('Alpaca')) {
                logger.debug(`Found Alpaca in mount inventory of ${displayName}. Setting as finished MSQ`);
                finishedMsq.add(ffId);
                playerData.push([lastCheckpointId, displayName]);
                continue;
            }


            playerData.push([symPrivate, displayName]);
            continue;
        }

        if (achievementResult !== LODESTONE_RESULT.SUCCESS) {
            logger.error(`Failed to fetch achievements for ${displayName}`);
            continue;
        }

        let highest = -1;
        for(const achievement of achievementData) {
            const idx = checkpoints.findIndex(([achId, ]) => achId === achievement);
            if (idx > highest) {
                highest = idx;
            }
        }

        if (highest === lastCheckpointIndex) {
            finishedMsq.add(ffId);
            logger.debug(`${displayName} has completed the MSQ`);
        }

        const highestCheckpoint = highest >= 0 ? (checkpoints[highest] as [string, string])[0] : null;

        playerData.push([highestCheckpoint, displayName]);
    }

    const result: [string, string[]][] = [
        ['Before First Dungeon', playerData.filter(([highestCheckpoint,]) => highestCheckpoint === null).map(([,displayName]) => displayName)]
    ]

    checkpoints.forEach(([achId, achName]) => {
        result.push([achName, playerData.filter(([highestCheckpoint,]) => highestCheckpoint === achId).map(([,displayName]) => displayName)]);
    });

    logger.debug(`Made ${lodestoneCalls} calls to The Lodestone to prepare MSQ command data.`)

    return result;
}

export class MsqCommand implements Command {
    build() {
        return (new SlashCommandBuilder())
            .setName('msq')
            .setDescription('Shows MSQ status');
    }

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.inGuild()) {
            throw new GuildOnlyError();
        }

        const guild = interaction.guild as Guild;

        if (!allowedGuilds.has(guild.id)) {
            return interaction.reply({
                content: fmtError("Not allowed in this guild."),
                ephemeral: true
            });
        }

        await interaction.deferReply();

        const data = await getData(guild);

        const embed = new EmbedBuilder()
            .setTitle("MSQ Tracker")
            .addFields(data.map(([header, names]) => ({
                name: header,
                value: (names.length ? names.join("\n") + '\n' : '') + '‎ ',
                inline: true
            })))
            .setFooter({
                text: "Based on Achievement Data. Users with private achievements not included. Data may lag by several hours.",
            });

        return interaction.followUp({ embeds: [embed] });
    }
}
