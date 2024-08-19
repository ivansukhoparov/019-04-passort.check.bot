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

            const statementIdRaw = await this.db.query(`
                    INSERT INTO "statements" ("uid")
                    VALUES ($1)
                    RETURNING "id";`,
                [createDto.uid])

            await this.db.query(`
                INSERT INTO "users_statements" ("name", "statementId", "userId")
                VALUES ($1,
                        (SELECT "id" FROM "statements" WHERE "uid" = $2),
                        (SELECT "id" FROM "users" WHERE "chatId" = $3)
                        );
                `,
                [createDto.name, createDto.uid, createDto.chatId])

            await this.db.query(`COMMIT;`)

            return statementIdRaw.rows[0].id
        } catch (err) {
            try {
                await this.db.query(`ROLLBACK;`)
            } catch (err) {
                console.log(err)
                return null
            }
            console.log(err)
            return null
        }
    }

    async get(filterName: string, filterValue: string | number): Promise<StatementTypes | null> {
        try {
            const res: QueryResult<StatementTypes> = await this.db.query(`
                SELECT *
                FROM "statements"
                WHERE "${filterName}" = $1
                `,
                [filterValue])
            if (res.rows.length === 0) return null
            else return res.rows[0]
        } catch (err) {
            console.log(err)
            return null
        }
    }

    async bindWithUser(name: string, statementId: string, userId: string): Promise<boolean> {
        try {
            const res = await this.db.query(`
                INSERT INTO "users_statements" ("name", "statementId", "userId")
                VALUES ($1,$2,$3);
                `,
                [name, statementId, userId])

            return res.rowCount === 1
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async getToCheck(count: number = 1, interval: string = '1 hour') {
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

    async getFirstChecked():Promise<Date|null> {
        try {
            const res = await this.db.query(`
            SELECT "checkedAt" FROM "statements"
            WHERE "isActive" = true 
            ORDER BY "checkedAt" DESC
            LIMIT 1
            `)
            if (res.rows.length>0){
                return res.rows[0].checkedAt;
            }else {
                return null
            }
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

    async updateCheckedTime(id: string) {
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

    async changeSubscriptionStatus(statementId: string, userId:string, status:boolean) {
        try {
            const res = await this.db.query(`
               UPDATE "users_statements"
               SET "subscription" = $1
               WHERE "statementId" = $2 AND "userId"=$3
                `,
                [status, statementId, userId])
            return res.rows
        } catch (err) {
            console.log(err)
            return null
        }
    }

    async getUsersByStatement(statementId: string) {
        try {
            const res = await this.db.query(`
                SELECT "u"."id" AS "userId", "u_s"."statementId" AS "statementId", "u"."chatId", "u_s"."name"
                FROM "users_statements" "u_s"
                LEFT JOIN "users" "u" ON "u_s"."userId" = "u"."id"
                WHERE "u_s"."statementId" = $1 AND "u_s"."subscription" = true;
                `,
                [statementId])
            return res.rows
        } catch (err) {
            console.log(err)
            return null
        }
    }


}


