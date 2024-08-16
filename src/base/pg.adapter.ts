import {Client, QueryConfig, QueryConfigValues} from 'pg'
import {injectable} from "inversify";

@injectable()
export class PGAdapter {
    private client: Client

    constructor() {
        this.client = new Client({
            user: 'postgres',
            password: 'sa',
            host: 'localhost',
            port: 5432,
            database: 'Passport_Check',
        })
    }

    async init() {
        try {
            await this.client.connect();
            console.log("Подключение к базе данных успешно установлено!");
        } catch (error) {
            console.error("Ошибка при подключении к базе данных:", error);
        }
    }

    async query(queryTextOrConfig: string | QueryConfig<any>, values?: QueryConfigValues<any>,) {
        if (values) return await this.client.query(queryTextOrConfig, values)
        else return await this.client.query(queryTextOrConfig)
    }


    async close() {
        await this.client.end()
    }

}
