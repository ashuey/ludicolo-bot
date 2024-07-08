import { swedishChefEmbed } from './embeds';

describe('swedishChefEmbed', () => {
    it("should return a MessageEmbed object with the provided title and message content", () => {
        const recipeTitle = "Swedish Meatballs";
        const messageContent = "A delicious recipe for Swedish meatballs...";

        const result = swedishChefEmbed(recipeTitle, messageContent);

        expect(result.toJSON().title).toBe(`Recipe for ${recipeTitle}`);
        expect(result.toJSON().thumbnail?.url).toBeDefined();
        expect(result.toJSON().description).toBe(messageContent);
    });
});
