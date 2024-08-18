export type StatementTypes = {
    id:string
    uid: string
    name: string
    internalStatus: StatementStatusType | null
    lastCheck: Date
}

export type StatementStatusType = {
    name: string
    percent: number
}

export type StatementCreateTypes = {
    chatId:number
    uid: string
    name: string
}

export type StatementUpdateTypes = {
    id: string
    statusName: string
    statusPercent: number
}