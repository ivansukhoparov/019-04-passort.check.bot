import 'reflect-metadata';
import {PGAdapter} from "../../src/base/pg.adapter";

describe("PGAdapter tests", () => {
    const pgAdapter = new PGAdapter()

    beforeAll(async () => {
        await pgAdapter.init()
    })

    it("test the query method", async () => {
        // create new table "test"
        await pgAdapter.query(`
            CREATE TABLE public.test
            (
                id uuid NOT NULL DEFAULT gen_random_uuid(),
                value character varying NOT NULL,
                PRIMARY KEY (id)
            );
        `)

        // add new record
       const newRecord = await pgAdapter.query(`
        INSERT INTO public.test(value)
        VALUES ($1);
        `, ["OK"])

        expect(newRecord.rowCount).toBe(1)
       // console.log(newRecord)
        // read record

        const res = await pgAdapter.query(`
        SELECT * FROM public.test
        `)

        expect(res.rows[0].value).toBe("OK")

        // delete table after test
        await pgAdapter.query(`
           DROP TABLE IF EXISTS public.test;
        `)

    })
})