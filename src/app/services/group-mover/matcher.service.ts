import { Injectable } from '@angular/core';
import { GroupMoverWasmService } from './group-mover-wasm.service';
import { delay } from './input-patterns/canvas-painter/render-positions';
import { ResultControlerService } from './result-controler.service';

@Injectable({
	providedIn: 'root',
})
export class MatcherService {
	private lastMatch: RegExpExecArray;
	private regExp: RegExp;
	private regExpText: string;
	private text: string = '';
	lastIndex: number = 0;

	constructor(
		private resultController: ResultControlerService,
		private wasm: GroupMoverWasmService
	) {
		this.resultController.$textPattern.subscribe((text) => {
			let changedIndex;

			for (let i = 0; i < text.length; i++) {
				if (text[i] !== this.text[i]) {
					changedIndex = i;
					break;
				}
			}

			this.text = text;
			this.regExp = new RegExp(
				this.regExp,
				this.reduceFlags(this.resultController.flags)
			);

			this.regExp.lastIndex =
				changedIndex > 8500 ? changedIndex - 8500 : 0;
		});
		this.resultController.$regExpPattern.subscribe((regExp) => {
			try {
				this.regExpText = regExp;
				const lastIndex = this.regExp?.lastIndex ?? 0;
				this.regExp = new RegExp(
					regExp,
					this.reduceFlags(this.resultController.flags)
				);
				this.regExp.lastIndex = lastIndex;
			} catch (e) {}
		});
		this.resultController.$flags.subscribe((flags) => {
			this.regExp = new RegExp(this.regExp, this.reduceFlags(flags));
		});
	}

	getNextMatch(): any {
		try {
			let result;
			this.lastMatch = this.regExp.exec(
				this.resultController.textPattern
			);
			result = this.lastMatch;

			if (this.lastMatch) {
				const tempPayload = this.wasm.getMatch(
					// throw error if not found
					this.lastMatch[0].toLowerCase(),
					this.regExpText.toLocaleLowerCase(),
					''
				);

				const groups: any = [];
				let tempLastIndex = 0;

				for (let i = 0; i < tempPayload.groupsLength; i++) {
					const semiIndex = tempPayload.groupsIndexes.indexOf(
						',',
						tempLastIndex
					);
					const doublePointerIndex = tempPayload.groupsIndexes.indexOf(
						':',
						tempLastIndex
					);

					const indexStr = tempPayload.groupsIndexes.slice(
						tempLastIndex,
						doublePointerIndex
					);
					const sizeStr = tempPayload.groupsIndexes.slice(
						doublePointerIndex + 1,
						semiIndex
					);

					groups.push({
						index: parseInt(indexStr, 10),
						size: parseInt(sizeStr, 10),
					});

					tempLastIndex = semiIndex + 1;
				}

				result.groupsIndexes = groups;
			}

			return result;
		} catch (e) {
			return null;
		}
	}

	setMatchIndex(index: number): void {
		this.lastIndex = index;
		this.regExp.lastIndex = index;
	}

	getMatchIndex() {
		return this.regExp.lastIndex;
	}

	private reduceFlags = (flags: string[]) => {
		return [...flags, 'g', 'i'].reduce((prev, flag) => prev + flag, '');
	};
}
