import { EmbedBuilder } from "discord.js";

export function swedishChefEmbed(recipeTitle: string, messageContent: string) {
    return new EmbedBuilder()
        .setTitle(`Recipe for ${recipeTitle}`)
        .setThumbnail('https://i.imgur.com/pWZxLsa.jpg')
        .setDescription(messageContent);
}

export function chefUriangerEmbed(recipeTitle: string, messageContent: string) {
    return new EmbedBuilder()
        .setTitle(`Recipe for ${recipeTitle}`)
        .setThumbnail('https://i.imgur.com/RQShrpT.png')
        .setDescription(messageContent);
}
