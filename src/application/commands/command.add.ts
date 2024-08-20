import {inject, injectable} from "inversify";
import {ICommand} from "../../base/Interfaces/interface.command";
import {Message} from "node-telegram-bot-api";
import {StatementsRepository} from "../../entities/statments/statements.repository";
import {StatementCreateTypes} from "../../entities/statments/types/statement.types";

@injectable()
export class CommandAdd implements ICommand {
    name = "CommandAdd"
    constructor(@inject(StatementsRepository) protected readonly statementsRepository: StatementsRepository) {
    }

    async execute(input: Message): Promise<string> {
        const command: Array<string> = input.text!.split(" ")
        const uid: string = command[1]
        const name: string = command[2]

        // UID VALIDATION:
        // Check count of command parts
        if (command.length !== 3) {
            return "error message: Команда должна быть в формате \"/add 0000000000000000000000000 Name\" имя должно вводится без пробелов"
            //TODO error message: Команда должна быть в формате "/add 0000000000000000000000000 Name" имя должно вводится без пробелов
        }

        // Check the uid format
        if (!isValidUid(uid)) {
            return "error message: Идентификатор заявления должен состоять из 25 цыфр"
            //TODO error message: Идентификатор заявления должен состоять из 25 цыфр
        }

        // Get the statement
        const statement = await this.statementsRepository.get("uid", uid)

        // Check if the statement with this the uid is already exist in the system
        if (statement) {

            if (statement.isActive) {
                // Check the active status if exist
                const isBinded = true// await this.statementsRepository.bindWithUser(name, uid, input.chat.id)
                if (isBinded) {
                    return "notification message: Идентификатор успешно привязан, состояние на момент последней проверки statement?.internalStatus?"
                }else{
                    //TODO do additional check if uid binded with user but user subscribe is false
                    return "error message: Идентификатор уже привязан, состояние на момент последней проверки statement?.internalStatus?"
                }
                //TODO error message: Идентификатор уже привязан, состояние на момент последней проверки statement?.internalStatus?
            } else {
                // If it is not active - send explanation message
                return "notification message: Работа с зявлением звершена. Состояние statement?.internalStatus?.name"
                //TODO notification message: Работа с зявлением звершена. Состояние statement?.internalStatus?.name
            }

        } else {
            // Create new one if does not exist
            const newStatement: StatementCreateTypes = {
                chatId: input.chat.id,
                uid: uid,
                name: name
            }
            const isCreated = await this.statementsRepository.create(newStatement)
            if (isCreated) {
                return "waitung"
                //TODO execute command that request to api and check status
                //TODO this command must check status, compare it with exisit and send notification if status changed
            } else {
                return "error message: Не получилось добавить заявление в систему, проверьте данные или повторите попытку позже"
                //TODO error message: Не получилось добавить заявление в систему, проверьте данные или повторите попытку позже
            }
        }
    }
}


function isValidUid(input:string) {
    const regex = /^\d{25}$/;
    return regex.test(input);
}