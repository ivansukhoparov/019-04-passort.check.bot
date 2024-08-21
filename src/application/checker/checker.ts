import {inject, injectable} from "inversify";
import {StatementsRepository} from "../../entities/statments/statements.repository";
import {StatementCheckType, StatementStatusType} from "../../entities/statments/types/statement.types";
import {HttpRepository} from "../../base/http.repository";

@injectable()
export class Checker {
    constructor(@inject(StatementsRepository) private statementsRepository: StatementsRepository,
                @inject(HttpRepository) private apiRepository: HttpRepository) {
    }

    async start() {
        while (true) {
            const statements: Array<StatementCheckType> | null = await this.statementsRepository.getToCheck()
            console.log("statements",statements)
            if (statements && statements.length > 0) {
                for (let statement of statements) {
                    const gotInternalStatus: StatementStatusType | null = await this.apiRepository.getStatus(statement.uid)
                    console.log("gotInternalStatus",gotInternalStatus)
                    console.log("statement",statement)
                    if (gotInternalStatus
                        && (gotInternalStatus.percent !== statement.statusPercent || gotInternalStatus.name !== statement.statusName)) {
                        const updateDTO = {
                            id: statement.id,
                            statusName: gotInternalStatus.name,
                            statusPercent: gotInternalStatus.percent,
                        }
                        await this.statementsRepository.updateStatementStatus(updateDTO)
                        //TODO SENT NOTIFICATION ABOUT CHANGES
                    } else {
                        await this.statementsRepository.updateCheckedTime(statement.id)
                    }
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            } else {
                const oldestCheck = await this.statementsRepository.getFirstChecked()
                if (oldestCheck) {
                    const sleepTimer = (1000 * 60 * 60) - (new Date().getTime()) + (new Date(oldestCheck).getTime())
                    console.log("checker fall asleep for " + (sleepTimer/1000/60) + " min")
                    await new Promise(resolve => setTimeout(resolve, sleepTimer));
                } else {
                    console.log("checker fall asleep for " +  60 + " min")
                    await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 60));
                }
            }
        }
    }
}
