export interface iCodeError {
    text: string;
}

export class CodeError implements iCodeError {
    constructor(public text: string) { }
}