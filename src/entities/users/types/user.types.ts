export  type UserType = {
    id:string
    chatId: number
    firstName: string | undefined
    username: string | undefined
    isActive: boolean
}

export type UserCreateModel = {
    chatId: number
    firstName: string|null
    username: string|null
}

export type UserUpdateModel = {
    chatId: number
    firstName: string
    username: string
}