import {inject, injectable} from "inversify";
import {PGAdapter} from "../../base/pg.adapter";
import {StatementCreateTypes, StatementUpdateTypes} from "./types/statement.types";

@injectable()
export class StatementsRepository {
    constructor(@inject(PGAdapter) private db: PGAdapter) {

    }

    async create(createDto: StatementCreateTypes) {
        try {
            await this.db.query(`BEGIN;`)

            const res = await this.db.query(`
                SELECT "id" FROM "statements"
                WHERE "uid" = $1`,
                [createDto.uid])

            if (res.rows.length === 0) {
                await this.db.query(`
                    INSERT INTO "statements" ("uid")
                    VALUES ($1);
                    `,
                    [createDto.uid])
            }

            await this.db.query(`
                INSERT INTO "users_statements" ("name", "statementId", "userId")
                VALUES ($1,
                        (SELECT "id" FROM "statements" WHERE "uid" = $2),
                        (SELECT "id" FROM "users" WHERE "chatId" = $3)
                        );
                `,
                [createDto.name, createDto.uid, createDto.chatId])

            await this.db.query(`COMMIT;`)

            return true
        } catch (err) {
            try {
                await this.db.query(`ROLLBACK;`)
            } catch (err) {
                console.log(err)
                return false
            }
            console.log(err)
            return false
        }
    }

    async getToCheck(count: number = 1, interval:string = '1 hour') {
        try {
            const res = await this.db.query(`
            SELECT "id", "uid", "statusPercent" FROM "statements"
            WHERE "isActive" = true 
            AND ("checkedAt" < NOW() - INTERVAL '${interval}' OR "checkedAt" IS NULL)
            ORDER BY "checkedAt" ASC
            LIMIT ${count}
            `)
            return res.rows
        } catch (err) {
            console.log(err)
            return null
        }
    }

    async getFirstChecked() {
        try {
            const res = await this.db.query(`
            SELECT "checkedAt" FROM "statements"
            WHERE "isActive" = true 
            ORDER BY "checkedAt" DESC
            LIMIT 1
            `)
            return res.rows
        } catch (err) {
            console.log(err)
            return null
        }
    }

    async updateStatementStatus(updateDto: StatementUpdateTypes) {
        try {
            const res = await this.db.query(`
            UPDATE "statements"
            SET "statusName" = $1, "statusPercent" = $2, "checkedAt" = NOW()
            WHERE "id" = $3`,
                [updateDto.statusName, updateDto.statusPercent, updateDto.id])
            return res.rowCount === 1
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async updateCheckedTime(id:string) {
        try {
            const res = await this.db.query(`
            UPDATE "statements"
            SET "checkedAt" = NOW()
            WHERE "id" = $1`,
                [id])
            return res.rowCount === 1
        } catch (err) {
            console.log(err)
            return false
        }
    }

    //TODO
    async getUsersPairedToStatement (statementId:string){

    }


}


