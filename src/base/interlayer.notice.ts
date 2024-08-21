
export class InterlayerNotice<T> {
    data:T
    code:number = 0

    constructor(data:T, code?:number) {
        this.data = data
    }
}