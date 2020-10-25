import { Injectable } from '@angular/core';
import { delay } from './input-patterns/canvas-painter/render-positions';
import { ResultControlerService } from './result-controler.service';

@Injectable({
	providedIn: 'root',
})
export class MatcherService {
	private lastMatch: RegExpExecArray;
	private regExp: RegExp;
	private text: string = '';
	lastIndex: number = 0;

	constructor(private resultController: ResultControlerService) {
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
				console.log(regExp);
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
		this.lastMatch = this.regExp.exec(this.resultController.textPattern);

		return this.lastMatch;
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
