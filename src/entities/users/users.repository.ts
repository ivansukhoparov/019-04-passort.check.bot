import {inject, injectable} from "inversify";
import {PGAdapter} from "../../base/pg.adapter";

import {UserCreateModel, UserType, UserUpdateModel} from "../../types/user.types";
import {QueryResult} from "pg";
import {PassportFile} from "node-telegram-bot-api";


@injectable()
export class UsersRepository {
    constructor(@inject(PGAdapter) protected db: PGAdapter) {
    }

    async create(createDto: UserCreateModel):Promise<boolean> {
        try {
            const res = await this.db.query(`
                INSERT INTO "users" ("chatId", "firstName", "username")
                VALUES ($1,$2,$3);
                `,
                [createDto.chatId, createDto.firstName, createDto.username])

            return res.rowCount === 1
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async changeStatus(chatId: number, status: boolean):Promise<boolean> {
      try  {
            const res = await this.db.query(`
                UPDATE "users" 
                SET "isActive" = $1
                WHERE "chatId" = $2
                `,
                [ status,chatId])

            return res.rowCount === 1
        } catch (err){
          console.log(err)
          return false
      }
    }

    async update(updateDto: UserUpdateModel):Promise<boolean> {
       try {
            const res = await this.db.query(`
                UPDATE "users" 
                SET "firstName" = $1, "username" = $2
                WHERE "chatId" = $3
                `,
                [updateDto.firstName, updateDto.username, updateDto.chatId])
            return res.rowCount === 1
        }catch (err){
           console.log(err)
           return false
       }
    }

    async get(filterName: string, filterValue: string | number): Promise<UserType | null> {
        try {
            const res: QueryResult<UserType> = await this.db.query(`
                SELECT "id", "chatId", "firstName", "username", "isActive"
                FROM "users"
                WHERE "${filterName}" = $1
                `,
                [filterValue])

            return {
                ...res.rows[0],
                chatId: +res.rows[0].chatId
            }

        } catch (err) {
            console.log(err)
            return null
        }

    }
}
