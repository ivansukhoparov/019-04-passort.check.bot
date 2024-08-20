import {inject, injectable} from "inversify";
import {ICommand} from "../../base/Interfaces/interface.command";
import {UsersRepository} from "../../entities/users/users.repository";
import {Message} from "node-telegram-bot-api";
import {UserCreateModel, UserType} from "../../entities/users/types/user.types";

@injectable()
export class CommandStart implements ICommand {
    name = "CommandStart"

    constructor(@inject(UsersRepository) protected readonly usersRepository: UsersRepository) {
    }

    async execute(input: Message):Promise<boolean> {
        // Check if there is this user in the system
        const user: UserType | null = await this.usersRepository.get("chatId", input.chat.id)

        if (user) {
            // If the user is in the system
            // Check activity status if the user:
            if (user.isActive) {
                // If the user is active, do nothing
                return true
            } else {
                // If the user is not active, change his status to active
                return await this.usersRepository.changeStatus(user.id, true)
            }
        } else {
            // If the user is not in the system
            const userCreateDto: UserCreateModel = {
                chatId: input.chat.id,
                firstName: input.chat.first_name ? input.chat.first_name : null,
                username: input.chat.username ? input.chat.username : null
            }
            // Add user to the system
            return await this.usersRepository.create(userCreateDto)
        }
    }
}