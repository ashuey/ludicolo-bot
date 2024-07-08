import { JSDOM } from "jsdom";
import {logger} from "@/logger";

const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const userAgentMobile = "Mozilla/5.0 (iPhone; CPU OS 10_15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Mobile/14E304 Safari/605.1.15";
const achievementIdRegex = /lodestone\/character\/\d*\/achievement\/detail\/(\d*)\//;

export enum LODESTONE_RESULT {
    SUCCESS,
    ERROR,
    PRIVATE,
    NOT_FOUND,
}

export async function getAchievements(characterId: string): Promise<[LODESTONE_RESULT, string[]]> {
    try {
        const response = await fetch(`https://na.finalfantasyxiv.com/lodestone/character/${characterId}/achievement/`, {
            headers: {
                'user-agent': userAgent
            }
        });
        const body = await response.text();
        if (response.status === 403 && body.includes('You do not have permission to view this page.')) {
            return [LODESTONE_RESULT.PRIVATE, []];
        }

        if (response.status === 404 && body.includes('The page you are searching for has either been removed, or the designated URL address is incorrect')) {
            logger.warn(`Error ${response.status} while fetching achievements for ${characterId}`);
            return [LODESTONE_RESULT.NOT_FOUND, []];
        }

        if (response.status !== 200) {
            logger.warn(`Error ${response.status} while fetching achievements for ${characterId}`);
            return [LODESTONE_RESULT.ERROR, []];
        }

        const { document } = new JSDOM(body).window;
        const nodes = document.querySelectorAll('.ldst__achievement .entry');
        const achievements = [...nodes].map((node, idx) => {
            const idNode = node.querySelector('.entry__achievement');

            if (!idNode) {
                throw new Error(`Could not find ID node in achievement (Character: ${characterId}, Index: ${idx})`);
            }

            const link = idNode.getAttribute('href');

            if (!link) {
                throw new Error(`ID node had no href attribute (Character: ${characterId}, Index: ${idx})`);
            }

            const regexResult = achievementIdRegex.exec(link);

            if (!regexResult || !regexResult[1]) {
                throw new Error(`Could not extract achievement ID from link: ${link}`);
            }

            return regexResult[1];
        });

        return [LODESTONE_RESULT.SUCCESS, achievements];
    } catch (e) {
        logger.error(e);
        return [LODESTONE_RESULT.ERROR, []];
    }
}

export async function getMounts(characterId: string): Promise<[LODESTONE_RESULT, string[]]> {
    try {
        const response = await fetch(`https://na.finalfantasyxiv.com/lodestone/character/${characterId}/mount/`, {
            headers: {
                'user-agent': userAgentMobile
            }
        });
        const body = await response.text();

        if (response.status === 404 && body.includes('The page you are searching for has either been removed, or the designated URL address is incorrect')) {
            logger.warn(`Error ${response.status} while fetching achievements for ${characterId}`);
            return [LODESTONE_RESULT.NOT_FOUND, []];
        }

        if (response.status !== 200) {
            logger.warn(`Error ${response.status} while fetching mounts for ${characterId}`);
            return [LODESTONE_RESULT.ERROR, []];
        }

        const {document} = new JSDOM(body).window;
        const nodes = document.querySelectorAll('.mount__list__item');
        const mounts = [...nodes].map((node, idx) => {
            const nameNode = node.querySelector('.mount__name');

            if (!nameNode) {
                throw new Error(`Could not find name node in mount (Character: ${characterId}, Index: ${idx})`);
            }

            const name = nameNode.textContent;

            if (!name) {
                throw new Error(`Name node had no text content (Character: ${characterId}, Index: ${idx})`);
            }

            return name;
        });

        return [LODESTONE_RESULT.SUCCESS, mounts];
    } catch (e) {
        logger.error(e);
        return [LODESTONE_RESULT.ERROR, []];
    }
}
