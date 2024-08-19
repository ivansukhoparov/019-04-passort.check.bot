import {injectable, multiInject} from "inversify";
import {ICommand} from "./Interfaces/interface.command";

@injectable()
export class CommandBus {

    constructor(@multiInject("ICommand") private commands: Array<ICommand>) {
    }

    // command<T extends ICommand>(command: T):T {
    //     return this.commands.find((c: ICommand) => c instanceof command) as T
    // }

    command<T extends ICommand>(command: string):T {
        return this.commands.find((c: ICommand) => c.name ===  command) as T
    }
}