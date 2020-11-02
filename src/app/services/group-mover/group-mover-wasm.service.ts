import { Injectable } from '@angular/core';
import { NgWasmService } from 'ng-wasm';

type GroupMoverServiceType = {
	getMatch: (text: string, regexp: string, flags: string) => Match;
	extractMatchGroup: (groups: any, index: number) => void;
};

type Match = {
	text: string;
	index: number;
	groupsLength: number;
	groupsIndexes: string;
};

@Injectable({
	providedIn: 'root',
})
export class GroupMoverWasmService extends NgWasmService<
	GroupMoverServiceType
> {
	constructor() {
		super('GroupMoverModule', 'group-mover.js');
	}

	getMatch = (text: string, regexp: string, flags: string) => {
		return this.module.getMatch(text, regexp, flags);
	};
}
