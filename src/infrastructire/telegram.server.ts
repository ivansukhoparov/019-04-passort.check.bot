import TelegramBot, {Message} from "node-telegram-bot-api";
import {appSettings} from "../app.settings";
import {inject, injectable} from "inversify";
import {CommandBus} from "../base/command.bus";
import {CommandStart} from "../application/commands/command.start";
import {CommandAdd} from "../application/commands/command.add";

@injectable()
export class TelegramServer {
    private bot: TelegramBot

    constructor(@inject(CommandBus) protected readonly commandBus: CommandBus) {
        this.bot = new TelegramBot(appSettings.secretKey, {polling: true});
    }

    init() {

    }

    start() {
        this.bot.on('message', (msg: Message) => {
            const msgText = msg.text
            if (msg.text !== undefined) {
                if (msg.text[0] === "/") {
                    this.commandsHandler(msg)
                } else {
                    const chatId = msg.chat.id;
                    // send a message to the chat acknowledging receipt of their message
                    this.bot.sendMessage(chatId, 'Received your message');
                }
            }
        });
    }

    async commandsHandler(msg: Message) {
        //if (msg.text === undefined) return

        const command: string = msg.text!.split(" ")[0]
        const chatId = msg.chat.id

        switch (command) {
            case "/start":
                const res = await this.commandBus.command<CommandStart>("CommandStart").execute(msg)
                if (res){
                    this.bot.sendMessage(chatId, "wellcome");
                }else {
                    this.bot.sendMessage(chatId, "Something goes wrong, please restart bot");
                }
                break
            case "/add":
                const ss = await this.commandBus.command<CommandAdd>("CommandAdd").execute(msg)
                this.bot.sendMessage(chatId, `${ss}`);
                break
            default:
                break
        }

    }


}