import {inject, injectable} from "inversify";
import {HttpAdapter} from "./http.adapter";
import {appSettings} from "../app.settings";
import {StatementStatusType} from "../entities/statments/types/statement.types";

@injectable()
export class HttpRepository {
    constructor(@inject(HttpAdapter) private httpAdapter: HttpAdapter) {
    }

    async getStatus(uid: string = "2000381022024051600008133"): Promise<StatementStatusType|null> {
        const res: ApiResponse | null = await this.httpAdapter.request(appSettings.checkingUrl + uid)
        console.log("uid", uid)
        console.log("res", res)
        if (res) {
            return {
                name: res.internalStatus.name,
                percent: res.internalStatus.percent
            }
        } else {
            return null
        }
    }
}

export type ApiResponse = {
    "uid": any
    "sourceUid": any
    "receptionDate": any
    "passportStatus": {
        "id": any
        "name": any
        "description": any
        "color": any
        "subscription": any
    },
    "internalStatus": {
        "name": string
        "percent": number
    },
    "clones": any
}