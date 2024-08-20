import {config} from "dotenv";
import * as process from "process";

config();


export class AppSettings {
    public secretKey: string
    public checkingUrl = "https://info.midpass.ru/api/request/"

    public checking: { interval: string, limit: number } = {
        interval: "1 hour",
        limit: 1
    }

    constructor() {
        this.secretKey = process.env.SECRET_KEY!
        this.checking.interval = process.env.CHECK_INTERVAL!
        this.checking.limit = Number(process.env.CHECK_LIMIT!)
    }
}

export const appSettings = new AppSettings()