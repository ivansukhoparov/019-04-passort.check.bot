import {config} from "dotenv";
import * as process from "process";
import {injectable} from "inversify";

config();


export class AppSettings {
    public secretKey: string

    public checking: { interval: string, limit: number }

    constructor() {
        this.secretKey = process.env.SECRET_KEY!
        this.checking.interval = process.env.CHECK_INTERVAL!
        this.checking.limit = Number(process.env.CHECK_LIMIT!)
    }
}

export const appSettings = new AppSettings()