import {inject, injectable} from "inversify";
import {PGAdapter} from "../../base/pg.adapter";

import {UserCreateModel, UserUpdateModel} from "../../types/user.types";


@injectable()
export class UsersRepository {
    constructor(@inject(PGAdapter) protected db: PGAdapter) {
    }

    async create(createDto:UserCreateModel) {
        const res = await this.db.query(`
        INSERT INTO "users" ("chatId", "firstName", "username")
        VALUES ($1,$2,$3),
        `,
            [createDto.chatId, createDto.firstName,createDto.username])

        return res.rowCount===1
    }

    async changeStatus(chatId:number, status:boolean){
        const res = await this.db.query(`
        UPDATE "users" 
        SET "isActive" = $1
        WHERE "chatId" = $2
        `,
            [chatId, status])

        return res.rowCount === 1
    }

    async update(updateDto:UserUpdateModel){
        const res = await this.db.query(`
        UPDATE "users" 
        SET "firstName" = $1, "username" = $2
        WHERE "chatId" = $3
        `,
            [updateDto.firstName, updateDto.username,updateDto.chatId])
        return res.rowCount === 1
    }


}