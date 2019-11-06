import {RequestHandler, NextFunction, Request, Response} from "express";
import UrlSigner from "../UrlSigner";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";

const validateSignature: RequestHandler = function(req: Request, res: Response, next: NextFunction): any {
    const urlSigner = app<UrlSigner>('url_signer');

    if (!urlSigner.hasValidSignature(req)) {
        res.status(403);
        res.send();
        return;
    }

    next();
};

export default validateSignature;