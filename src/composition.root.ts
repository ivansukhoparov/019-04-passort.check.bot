
import {Container} from "inversify";
import {AppSettings} from "./app.settings";
import {PGAdapter} from "./base/pg.adapter";
import {UsersRepository} from "./entities/users/users.repository";
import {StatementsRepository} from "./entities/statments/statements.repository";



export const container = new Container()

container.bind<PGAdapter>(PGAdapter).to(PGAdapter).inSingletonScope()
container.bind<UsersRepository>(UsersRepository).to(UsersRepository).inSingletonScope()
container.bind<StatementsRepository>(StatementsRepository).to(StatementsRepository).inSingletonScope()