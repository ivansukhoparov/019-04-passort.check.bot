
import {Container} from "inversify";
import {PGAdapter} from "./base/pg.adapter";


export const container = new Container()

container.bind<PGAdapter>(PGAdapter).to(PGAdapter).inSingletonScope()