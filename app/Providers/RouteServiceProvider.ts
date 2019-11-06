import {Express} from "express";
import ServiceProvider from "@ashuey/ludicolo-framework/lib/Support/ServiceProvider";

export default class RouteServiceProvider extends ServiceProvider {
    async boot(): Promise<void> {
        const express = this.app.make<Express>('http');
        express.use('/', require("../../routes/web").default);
    }
}