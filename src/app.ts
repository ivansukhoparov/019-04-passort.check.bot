import {inject, injectable} from "inversify";
import {PGAdapter} from "./base/pg.adapter";
import {container} from "./composition.root";
import {TelegramServer} from "./infrastructire/telegram.server";
import {Checker} from "./application/checker/checker";

@injectable()
export class App{

    constructor(@inject(PGAdapter) private pgAdapter:PGAdapter,
                @inject(TelegramServer) private telegramServer:TelegramServer,
                @inject(Checker) private checker:Checker) {
    }

    async init() {

    }

    async start(){
        await this.pgAdapter.init()
        this.telegramServer.init()
        await this.init()
        this.telegramServer.start();
        this.checker.start()
    }
}
