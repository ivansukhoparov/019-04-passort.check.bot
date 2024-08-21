
import {Container} from "inversify";

// ADAPTERS:
import {PGAdapter} from "./base/pg.adapter";
import {HttpAdapter} from "./base/http.adapter";
import {TelegramAdapter} from "./base/telegram.adapter";
// REPOSITORIES:
import {UsersRepository} from "./entities/users/users.repository";
import {StatementsRepository} from "./entities/statments/statements.repository";
import {HttpRepository} from "./base/http.repository";
// COMMANDS:
import {ICommand} from "./base/Interfaces/interface.command";
import {CommandStart} from "./application/commands/command.start";
import {CommandAdd} from "./application/commands/command.add";
import {CommandBus} from "./base/command.bus";
// SERVICES:
import {TelegramServer} from "./infrastructire/telegram.server";
import {Checker} from "./application/checker/checker";
// APP:
import {App} from "./app";


export const container = new Container()
// ADAPTERS:
container.bind<TelegramAdapter>(TelegramAdapter).to(TelegramAdapter).inSingletonScope()
container.bind<HttpAdapter>(HttpAdapter).to(HttpAdapter).inSingletonScope()
container.bind<PGAdapter>(PGAdapter).to(PGAdapter).inSingletonScope()
// REPOSITORIES:
container.bind<UsersRepository>(UsersRepository).to(UsersRepository).inSingletonScope()
container.bind<StatementsRepository>(StatementsRepository).to(StatementsRepository).inSingletonScope()
container.bind<HttpRepository>(HttpRepository).to(HttpRepository).inSingletonScope()
// COMMANDS:
container.bind<ICommand>("ICommand").to(CommandStart).inSingletonScope()
container.bind<ICommand>("ICommand").to(CommandAdd).inSingletonScope()
// The command bus binding after all commands have been bound.
container.bind(CommandBus).to(CommandBus).inSingletonScope()
// SERVICES:
container.bind<TelegramServer>(TelegramServer).to(TelegramServer).inSingletonScope()
container.bind<Checker>(Checker).to(Checker).inSingletonScope()
// APP:
container.bind<App>(App).to(App).inSingletonScope()