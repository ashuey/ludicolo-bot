import * as passport from "passport";
import SnapchatStrategy from "passport-snapchat";
import BitmojiUser from "../BitmojiUser";
import BitmojiManager from "../Bitmoji/BitmojiManager";
import ServiceProvider from "@ashuey/ludicolo-framework/lib/Support/ServiceProvider";
import {updateOrInsert} from "@ashuey/ludicolo-framework/lib/Database/util";
import {config} from "@ashuey/ludicolo-framework/lib/Support/helpers";
import * as url from 'url';
import * as refresh from 'passport-oauth2-refresh';
import OAuth2Strategy = require("passport-oauth2");

export default class AuthServiceProvider extends ServiceProvider {
    register() {
        //
    }

    async boot(): Promise<void> {
        let bitmojiUserData: object;
        const bitmojiManager = this.app.make<BitmojiManager>('bitmoji');

        // For some reason TS doesn't recognize SnapchatStrategy as a vaild Strategy.
        // We'll fix this here with a type assertion.
        const authStrategy = <OAuth2Strategy><unknown>(new SnapchatStrategy({
            authorizationURL: 'https://accounts.snapchat.com/accounts/oauth2/auth',
            tokenURL: 'https://accounts.snapchat.com/accounts/oauth2/token',
            clientID: config('services.snapchat.clientID'),
            clientSecret: config('services.snapchat.clientSecret'),
            callbackURL: url.resolve(config('http.url'), '/auth/snapkit/callback'),
            scope: ['https://auth.snapchat.com/oauth2/api/user.display_name', 'https://auth.snapchat.com/oauth2/api/user.bitmoji.avatar'],
            profileFields: ['id', 'displayName', 'bitmoji'],
            passReqToCallback: true
        }, function (req, accessToken, refreshToken, profile, cb) {
            if (!req.session.userId) {
                throw new Error("Missing userID");
            }

            bitmojiUserData = {
                access_token: accessToken,
                refresh_token: refreshToken,
                display_name: profile.displayName,
                snapchat_id: profile.id,
                bitmoji_id: profile.bitmoji.avatarId,
                bitmoji_avatar: profile.bitmoji.avatarUrl
            };

            updateOrInsert('bitmoji_users', {
                user: req.session.userId
            }, bitmojiUserData).then(async () => {
                bitmojiUserData['user'] = req.session.userId;
                const bitmojiUser = BitmojiUser.fromJson(bitmojiUserData);
                await bitmojiManager.stashUser(bitmojiUser);
                cb(null, bitmojiUser);
            });
        }));

        passport.use(authStrategy);
        refresh.use(authStrategy);
    }
}