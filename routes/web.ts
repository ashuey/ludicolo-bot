import * as express from 'express';
import validateSignature from "../app/Http/Middleware/validateSignture";
import * as passport from "passport";

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

router.get('/test', (req, res) => {
   res.send(`Your ID is: ${req.session.userId}`);
});

export default router;