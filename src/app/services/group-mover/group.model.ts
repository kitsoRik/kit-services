export interface iGroup {
    number: number;
    text: string;
}

export class Group implements iGroup {
    constructor(public number: number, public text: string) { }
}