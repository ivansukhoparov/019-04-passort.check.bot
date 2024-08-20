import 'reflect-metadata';
import {UsersRepository} from "../../src/entities/users/users.repository";
import {PGAdapter} from "../../src/base/pg.adapter";
import {UserCreateModel} from "../../src/entities/users/types/user.types";
import {StatementCreateTypes} from "../../src/entities/statments/types/statement.types";
import {StatementsRepository} from "../../src/entities/statments/statements.repository";

const User_1: UserCreateModel = {
    chatId: 123456789,
    firstName: "IVAN",
    username: "@ivan123",
}

const User_2: UserCreateModel = {
    chatId: 987654321,
    firstName: "ARTEM",
    username: "@dima3123",
}

const User_3: UserCreateModel = {
    chatId: 987454320,
    firstName: "MARGO",
    username: "@dgogog3123",
}

const Statement_1 = (chatId = 123456789): StatementCreateTypes => {
    return {
        chatId: chatId,
        name: "Im-IVAN",
        uid: "2000381022024051600008131",
    }
}

const Statement_2 = (chatId = 987654321): StatementCreateTypes => {
    return {
        chatId: chatId,
        name: "Im-ARTEM",
        uid: "2000381022024051600008130",
    }
}

const pgAdapter = new PGAdapter()
const usersRepository = new UsersRepository(pgAdapter)
const statementsRepository = new StatementsRepository(pgAdapter)


// const usersRepository: UsersRepository = container.resolve<UsersRepository>(UsersRepository)
// const statementsRepository: StatementsRepository = container.resolve<StatementsRepository>(StatementsRepository)
// const pgAdapter: PGAdapter = container.resolve<PGAdapter>(PGAdapter)

const getIds = async () => {
    const _1_usersId = (await pgAdapter.query(`
            SELECT "id" FROM "users"
            WHERE "firstName" = 'IVAN'
        `)).rows[0].id
    const _2_usersId = (await pgAdapter.query(`
            SELECT "id" FROM "users"
            WHERE "firstName" = 'ARTEM'
        `)).rows[0].id
    const _3_usersId = (await pgAdapter.query(`
            SELECT "id" FROM "users"
            WHERE "firstName" = 'MARGO'
        `)).rows[0].id
    const _1_statementId = (await pgAdapter.query(`
            SELECT "id" FROM "statements"
            WHERE "uid" = '2000381022024051600008131'
        `)).rows[0].id
    const _2_statementId = (await pgAdapter.query(`
            SELECT "id" FROM "statements"
            WHERE "uid" = '2000381022024051600008130'
        `)).rows[0].id
    return {_1_usersId, _2_usersId, _3_usersId, _1_statementId, _2_statementId}
}

describe("Statements repo tests", () => {

    beforeAll(async () => {

        await pgAdapter.init()
        pgAdapter.query(`TRUNCATE TABLE "users_statements", "users", "statements"`)

        await usersRepository.create(User_1).then((res) => expect(res).toBeTruthy())
        await usersRepository.create(User_2).then((res) => expect(res).toBeTruthy())
        await usersRepository.create(User_3).then((res) => expect(res).toBeTruthy())
    })

    it("- Shouldn't record to db new statement and add it to relation table for 2 users if chatId incorrect", async () => {
        await statementsRepository.create(Statement_1(123)).then((res) => expect(res).toBe(null))
        await statementsRepository.create(Statement_2(123)).then((res) => expect(res).toBe(null))

        await pgAdapter.query(`
        SELECT * FROM "statements"`).then((res) => {
            expect(res.rows.length).toBe(0)
        })
        await pgAdapter.query(`
        SELECT * FROM "users_statements"`).then((res) => {
            expect(res.rows.length).toBe(0)
        })
    })

    it("+ Should record to db new statement and add it to relation table for 2 users", async () => {
        await statementsRepository.create(Statement_1()).then((res) => expect(res).toEqual(expect.any(String)))

        await pgAdapter.query(`
                SELECT * FROM "statements"
                `)
            .then((res) => {
                expect(res.rows).toEqual([
                    {
                        id: expect.any(String),
                        uid: "2000381022024051600008131",
                        statusName: null,
                        statusPercent: null,
                        checkedAt: null,
                        createdAt: expect.any(Date),
                        isActive: true
                    }
                ])
            })
        await pgAdapter.query(`
                SELECT * FROM "users_statements"
                `)
            .then((res) => {
                expect(res.rows.length).toEqual(1)
            })


        await statementsRepository.create(Statement_2()).then((res) => expect(res).toEqual(expect.any(String)))
        await pgAdapter.query(`
                SELECT * FROM "statements"`)
            .then((res) => {
                expect(res.rows).toEqual([
                    {
                        id: expect.any(String),
                        uid: "2000381022024051600008131",
                        statusName: null,
                        statusPercent: null,
                        checkedAt: null,
                        createdAt: expect.any(Date),
                        isActive: true
                    },
                    {
                        id: expect.any(String),
                        uid: "2000381022024051600008130",
                        statusName: null,
                        statusPercent: null,
                        checkedAt: null,
                        createdAt: expect.any(Date),
                        isActive: true
                    }
                ])
            })
        await pgAdapter.query(`
                SELECT * FROM "users_statements"
                `)
            .then((res) => {
                expect(res.rows.length).toEqual(2)
            })
    })

    it("- Shouldn't record the statements again for the same users", async () => {
        await statementsRepository.create(Statement_1()).then((res) => expect(res).toBe(null))
        await statementsRepository.create(Statement_2()).then((res) => expect(res).toBe(null))

        await pgAdapter.query(`
                SELECT * FROM "statements"`)
            .then((res) => {
                expect(res.rows).toEqual([
                    {
                        id: expect.any(String),
                        uid: "2000381022024051600008131",
                        statusName: null,
                        statusPercent: null,
                        checkedAt: null,
                        createdAt: expect.any(Date),
                        isActive: true
                    },
                    {
                        id: expect.any(String),
                        uid: "2000381022024051600008130",
                        statusName: null,
                        statusPercent: null,
                        checkedAt: null,
                        createdAt: expect.any(Date),
                        isActive: true
                    }
                ])
            })
        await pgAdapter.query(`
                SELECT * FROM "users_statements"
                `)
            .then((res) => {
                expect(res.rows.length).toEqual(2)
            })
    })

    it("+ Should return first created statement and update first created statement", async () => {
        const statement = await statementsRepository.getToCheck()

        expect(statement).toEqual([{
            id: expect.any(String),
            statusName: null,
            uid: "2000381022024051600008131",
            statusPercent: null,
        }])

        if (statement !== null) {
            const res = await statementsRepository.updateStatementStatus({
                id: statement[0].id,
                statusName: "received",
                statusPercent: 80
            }).then((res) => {
                expect(res).toBe(true)
            })

            await pgAdapter.query(`
                SELECT * FROM "statements"
                WHERE "id" = '${statement[0].id}'`)
                .then((res) => {
                    expect(res.rows).toEqual([
                        {
                            id: expect.any(String),
                            uid: "2000381022024051600008131",
                            statusName: "received",
                            statusPercent: 80,
                            checkedAt: expect.any(Date),
                            createdAt: expect.any(Date),
                            isActive: true
                        }
                    ])
                })
        }
    })


    it("+ Should return second created statement after previous statement has been updated and update only last update time", async () => {
        const statement = await statementsRepository.getToCheck()

        expect(statement).toEqual([{
            id: expect.any(String),
            uid: "2000381022024051600008130",
            statusName: null,
            statusPercent: null,
        }])

        if (statement !== null) {
            const res = await statementsRepository.updateCheckedTime(statement[0].id)
                .then((res) => {
                    expect(res).toBe(true)
                })

            await pgAdapter.query(`
                SELECT * FROM "statements"
                WHERE "id" = '${statement[0].id}'`)
                .then((res) => {
                    expect(res.rows).toEqual([
                        {
                            id: expect.any(String),
                            uid: "2000381022024051600008130",
                            statusName: null,
                            statusPercent: null,
                            checkedAt: expect.any(Date),
                            createdAt: expect.any(Date),
                            isActive: true
                        }
                    ])
                })
        }
    })

    it("+ Should return fist created statement after second update", async () => {
        const statement = await statementsRepository.getToCheck(1, "1 millisecond")

        expect(statement).toEqual([{
            id: expect.any(String),
            uid: "2000381022024051600008131",
            statusPercent: 80,
            statusName: "received"
        }])

        if (statement !== null) {

            await pgAdapter.query(`
                SELECT * FROM "statements"
                WHERE "id" = '${statement[0].id}'`)
                .then((res) => {
                    expect(res.rows).toEqual([
                        {
                            id: expect.any(String),
                            uid: "2000381022024051600008131",
                            statusName: "received",
                            statusPercent: 80,
                            checkedAt: expect.any(Date),
                            createdAt: expect.any(Date),
                            isActive: true
                        }
                    ])
                })
        }
    })

    it(" getFirstChecked should return the oldest statements", async () => {
        const statement = await statementsRepository.getFirstChecked()
        const checkedTime = await pgAdapter.query(`
                SELECT * FROM "statements"
                WHERE "uid" = '2000381022024051600008130'`)

        expect(statement).toEqual(
            checkedTime.rows[0].checkedAt
        )
    })

    it("+ Should return all statements in correct order", async () => {
        const statement = await statementsRepository.getToCheck(100, "1 millisecond")

        expect(statement).toEqual([
            {
                id: expect.any(String),
                uid: "2000381022024051600008131",
                statusPercent: 80,
                statusName: "received",
            }, {
                id: expect.any(String),
                uid: "2000381022024051600008130",
                statusPercent: null,
                statusName: null
            },
        ])
    })

    it("+ should return correct pairs for users-statements", async () => {
        const {_1_usersId, _2_usersId, _3_usersId, _1_statementId, _2_statementId} = await getIds()


        const pairs = await pgAdapter.query(`
        SELECT * FROM "users_statements"`)

        expect(pairs.rows).toEqual([
            {
                id: expect.any(String),
                userId: _1_usersId,
                statementId: _1_statementId,
                subscription: true,
                name: "Im-IVAN"
            }, {
                id: expect.any(String),
                userId: _2_usersId,
                statementId: _2_statementId,
                subscription: true,
                name: "Im-ARTEM"
            },
        ])
    })


    it("+ should add pair for another users-statements and return correct pairs for users-statements", async () => {

        const {_1_usersId, _2_usersId, _3_usersId, _1_statementId, _2_statementId} = await getIds()

        await statementsRepository.bindWithUser("he-IVAN", _1_statementId, _2_usersId).then((res) => expect(res).toBe(true))
        await statementsRepository.bindWithUser("he-ARTEM", _2_statementId, _1_usersId).then((res) => expect(res).toBe(true))

        const pairs = await pgAdapter.query(`
        SELECT * FROM "users_statements"`)

        expect(pairs.rows).toEqual([
            {
                id: expect.any(String),
                userId: _1_usersId,
                statementId: _1_statementId,
                subscription: true,
                name: "Im-IVAN"
            }, {
                id: expect.any(String),
                userId: _2_usersId,
                statementId: _2_statementId,
                subscription: true,
                name: "Im-ARTEM"
            }, {
                id: expect.any(String),
                userId: _2_usersId,
                statementId: _1_statementId,
                subscription: true,
                name: "he-IVAN"
            }, {
                id: expect.any(String),
                userId: _1_usersId,
                statementId: _2_statementId,
                subscription: true,
                name: "he-ARTEM"
            },
        ])
    })


    it("Should return 2 users that has been subscribed to the statement ", async () => {
        const {_1_usersId, _2_usersId, _3_usersId, _1_statementId, _2_statementId} = await getIds()

        const res = await statementsRepository.getUsersByStatement(_1_statementId)

        expect(res).toEqual([
            {
                userId: _1_usersId,
                statementId: _1_statementId,
                chatId: User_1.chatId,
                name: "Im-IVAN"
            }, {
                userId: _2_usersId,
                statementId: _1_statementId,
                chatId: User_2.chatId,
                name: "he-IVAN"
            }
        ])
    })

    it("Should change status to false ", async () => {
        const {_1_usersId, _2_usersId, _3_usersId, _1_statementId, _2_statementId} = await getIds()

        await statementsRepository.changeSubscriptionStatus(_1_statementId, _2_usersId, false)
        const res = await statementsRepository.getUsersByStatement(_1_statementId)

        expect(res).toEqual([
            {
                userId: _1_usersId,
                statementId: _1_statementId,
                chatId: User_1.chatId,
                name: "Im-IVAN"
            }
        ])

        await pgAdapter.query(`
        SELECT "subscription"
        FROM "users_statements"
        WHERE "userId" = '${_2_usersId}' AND "statementId" = '${_1_statementId}'`).then((res) => {
            expect(res.rows[0].subscription).toBe(false)
        })
    })

    it("+ should correctly bind new user with exist uid", async () => {
        const {_1_usersId, _2_usersId, _3_usersId, _1_statementId, _2_statementId} = await getIds()

        await statementsRepository.bindWithUser("he-IVAN", _1_statementId, _2_usersId).then((res) => expect(res).toBe(false))
        await statementsRepository.bindWithUser("he-ARTEM", _2_statementId, _1_usersId).then((res) => expect(res).toBe(false))

        const pairs = await pgAdapter.query(`
        SELECT * FROM "users_statements"`)

        expect(pairs.rows).toEqual([
            {
                id: expect.any(String),
                userId: _1_usersId,
                statementId: _1_statementId,
                subscription: true,
                name: "Im-IVAN"
            }, {
                id: expect.any(String),
                userId: _2_usersId,
                statementId: _2_statementId,
                subscription: true,
                name: "Im-ARTEM"
            },
            {
                id: expect.any(String),
                userId: _1_usersId,
                statementId: _2_statementId,
                subscription: true,
                name: "he-ARTEM"
            },
            {
                id: expect.any(String),
                userId: _2_usersId,
                statementId: _1_statementId,
                subscription: false,
                name: "he-IVAN"
            },
        ])
    })
})


