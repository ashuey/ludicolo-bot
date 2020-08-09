import * as express from 'express';
import validateSignature from "../app/Http/Middleware/validateSignture";
import * as passport from "passport";
import * as bodyParser from "body-parser";
import { app } from "@ashuey/ludicolo-framework/lib/Support/helpers";
import { CommandoClient } from "discord.js-commando";
import { isTextChannel } from "@ashuey/ludicolo-discord/lib/util";

const router = express.Router();

router.get('/auth/snapkit/callback', passport.authenticate('snapchat', (req, res) => {
    console.log('done with snapchat callback');
}));

router.get('/auth/snapkit/login/:id', validateSignature, (req, res, next) => {
    req.session.userId = req.params.id;
    passport.authenticate('snapchat', {}, (req, res) => {
        res.send('Authentication Successful');
    })(req, res, next);
});

router.post('/send_raid_command', bodyParser.json(), validateSignature, async (req, res) => {
    try {
        const client = await app<Promise<CommandoClient>>('discord.client');

        const channel = await client.channels.fetch('427924313635553291');

        if (!isTextChannel(channel)) {
            res.status(500).send('Not a text channel');
            return;
        }

        await channel.send(req.body.content);

        res.status(204).send('');
    } catch (e) {
        console.error(e);
        res.status(500).send('An error occurred');
    }
})

export default router;