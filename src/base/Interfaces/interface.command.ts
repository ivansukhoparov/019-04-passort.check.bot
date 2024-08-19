export interface ICommand {
    name:string
    execute(param: any): any | Promise<any>
}