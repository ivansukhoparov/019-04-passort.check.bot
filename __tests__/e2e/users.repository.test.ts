import 'reflect-metadata';
import {container} from "../../src/composition.root";
import {UsersRepository} from "../../src/entities/users/users.repository";
import {PGAdapter} from "../../src/base/pg.adapter";
import {UserCreateModel, UserType, UserUpdateModel} from "../../src/entities/users/types/user.types";

const createUserDto: UserCreateModel = {
    chatId: 415684656516518,
    firstName: "IVAN",
    username: "@ivan123",
}

const updateUserDto:UserUpdateModel={
    chatId:createUserDto.chatId,
    firstName: "PETR",
    username: "@p123",
}

describe("User repo tests", () => {
    const usersRepository: UsersRepository = container.resolve<UsersRepository>(UsersRepository)
    const pgAdapter: PGAdapter = container.resolve<PGAdapter>(PGAdapter)

    beforeAll(async () => {
        await pgAdapter.init()
        pgAdapter.query(`TRUNCATE TABLE "users_statements", "users", "statements"`)
    })

    it(" create user method should return false if data is incorrect", async () => {
        // @ts-ignore
        await usersRepository.create({...createUserDto,chatId: "d"}).then((res) => expect(res).toBeFalsy())
    })

    it(" create user method should return true if data is correct and get correct user", async () => {
        await usersRepository.create(createUserDto).then((res) => expect(res).toBeTruthy())
        await usersRepository.get("chatId", createUserDto.chatId).then((res) => {
            expect(res).toEqual({
                id: expect.any(String),
                isActive: true,
                ...createUserDto
            })
        })
    })

    it(" changeStatus method should return false if chatId is incorrect ", async () => {
        await usersRepository.changeStatus(234234, false).then((res) => expect(res).toBeFalsy())

    })

    it(" changeStatus method should return true if data is correct and get correct user", async () => {
        await usersRepository.changeStatus(createUserDto.chatId, false).then((res) => expect(res).toBeTruthy())
        await usersRepository.get("chatId", createUserDto.chatId).then((res) => {
            expect(res).toEqual({
                id: expect.any(String),
                isActive: false,
                ...createUserDto
            })
        })
        await usersRepository.changeStatus(createUserDto.chatId, true).then((res) => expect(res).toBeTruthy())
        await usersRepository.get("chatId", createUserDto.chatId).then((res) => {
            expect(res).toEqual({
                id: expect.any(String),
                isActive: true,
                ...createUserDto
            })
        })
    })

    it(" update method should return false if chatId is incorrect ", async () => {
        await usersRepository.update({...createUserDto, chatId:123}).then((res) => expect(res).toBeFalsy())
    })

    it(" changeStatus method should return true if data is correct and get correct user", async () => {
        await usersRepository.update(updateUserDto).then((res) => expect(res).toBeTruthy())
        await usersRepository.get("chatId", updateUserDto.chatId).then((res) => {
            expect(res).toEqual({
                id: expect.any(String),
                isActive: true,
                ...updateUserDto
            })
        })
    })

})