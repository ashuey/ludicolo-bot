import * as crypto from 'crypto';
import { URL } from 'url';
import { Request } from 'express';
import * as moment from "moment";

export default class UrlSigner {
    protected key: string;

    protected algorithm: string;

    constructor(key: string, algorithm = 'sha256') {
        this.key = key;
        this.algorithm = algorithm;
    }

    public sign(url: string, expiration: moment.Moment | null = null): string {
        const parsedUrl = new URL(url);

        if (parsedUrl.searchParams.has('signature')) {
            throw new Error('"Signature" is a reserved parameter when generating signed URLs.');
        }

        if (expiration) {
            parsedUrl.searchParams.append('expires', expiration.unix().toString())
        }

        parsedUrl.searchParams.sort();

        const signature = this.hash(this.getHashableURL(parsedUrl));

        parsedUrl.searchParams.set('signature', signature);

        return parsedUrl.toString();
    }

    public hasValidSignature(request: Request): boolean {
        const parsedUrl = new URL(request.originalUrl, 'http://baseurl');
        return this.hasCorrectSignature(parsedUrl) && this.signatureHasNotExpired(parsedUrl);
    }

    public hasCorrectSignature(url: URL): boolean {
        const providedSignature = url.searchParams.get('signature');

        url.searchParams.delete('signature');

        url.searchParams.sort();

        const expectedSignature = this.hash(this.getHashableURL(url));

        return providedSignature === expectedSignature;
    }

    public signatureHasNotExpired(url: URL): boolean {
        if (!url.searchParams.has('expires')) {
            return true;
        }

        const expireVal = parseInt(url.searchParams.get('expires'));

        return moment.unix(expireVal).isSameOrAfter();
    }

    protected hash(hashablePath: string): string {
        return crypto.createHmac(this.algorithm, this.key)
            .update(hashablePath)
            .digest('hex');
    }

    protected getHashableURL(url: URL): string {
        return `${url.pathname}${url.search}`;
    }
}