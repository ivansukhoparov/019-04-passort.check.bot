export type StatementTypes = {
    id:string
    uid: string
    name: string
    internalStatus: StatementStatusType | null
    checkedAt: Date,
    createdAt:Date,
    isActive:boolean
}

export type StatementCheckType = {
    id:string
    uid: string
    statusPercent:number
    statusName:string
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