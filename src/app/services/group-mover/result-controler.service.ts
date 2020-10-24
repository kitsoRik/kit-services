import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

enum ProcessType {
	EachGroup,
	Global,
	Arguments,
}

@Injectable({
	providedIn: 'root',
})
export class ResultControlerService {
	private worker: Worker;

	private _isMatching: Boolean = true;
	private _isProccessing: Boolean = true;
	_isHighlighting$ = new BehaviorSubject<Boolean>(false);

	private _eachFunction: string = localStorage.getItem('EACH_FUNCTION') ?? '';
	private _eachFunctionError: any = null;

	private _globalFunction: string = '';
	private _globalFunctionError: any = null;

	private _argumentsPattern: string = '';

	private _regExpPattern: string =
		localStorage.getItem('REG_EXP_PATTERN') ?? '';
	private _textPattern: string = localStorage.getItem('TEXT_PATTERN') ?? '';

	private _flags: string[] = JSON.parse(localStorage.getItem('FLAGS')) ?? [];

	get regExpPattern(): string {
		return this._regExpPattern;
	}

	set regExpPattern(regExpPattern: string) {
		this._regExpPattern = regExpPattern;

		localStorage.setItem('REG_EXP_PATTERN', regExpPattern);
	}

	get flags(): string[] {
		return this._flags;
	}

	set flags(flags: string[]) {
		this._flags = flags;

		localStorage.setItem('FLAGS', JSON.stringify(flags));
	}

	get textPattern(): string {
		return this._textPattern;
	}

	set textPattern(textPattern: string) {
		this._textPattern = textPattern;

		localStorage.setItem('TEXT_PATTERN', textPattern);
	}

	get isMatching(): Boolean {
		return this._isMatching;
	}
	set isMatching(value: Boolean) {
		this._isMatching = value;
		if (value) this.processMatches();
	}

	get isProccessing(): Boolean {
		return this._isProccessing;
	}
	set isProccessing(value: Boolean) {
		this._isProccessing = value;
		if (value) this.proccessLast();
	}

	get isHighlighting$(): BehaviorSubject<Boolean> {
		return this._isHighlighting$;
	}
	get isHighlighting(): Boolean {
		return this._isHighlighting$.getValue();
	}
	set isHighlighting(value: Boolean) {
		this._isHighlighting$.next(value);
	}

	get eachFunction(): string {
		return this._eachFunction;
	}

	set eachFunction(value: string) {
		this._eachFunction = value;

		localStorage.setItem('EACH_FUNCTION', value);
	}

	get globalFunction(): string {
		return this._globalFunction;
	}

	set globalFunction(value: string) {
		this._globalFunction = value;

		localStorage.setItem('GLOBAL_FUNCTION', value);
	}

	get eachFunctionError(): any {
		return this._eachFunctionError;
	}
	get globalFunctionError(): any {
		return this._globalFunctionError;
	}

	matches$: BehaviorSubject<RegExpExecArray[]>;

	result$: BehaviorSubject<string>;

	processType: ProcessType = ProcessType.EachGroup;

	constructor() {
		this.matches$ = new BehaviorSubject<RegExpExecArray[]>([]);
		this.result$ = new BehaviorSubject<string>('');

		if (typeof Worker !== 'undefined') {
			// Create a new
			this.worker = new Worker('./result-controller.worker', {
				type: 'module',
			});
			this.worker.addEventListener('message', ({ data }) => {
				switch (data.type) {
					case 'FINISH_PROCESS_MATCHES': {
						this.matches$.next(data.matches);
						this.proccessLast();
						break;
					}
					case 'FINISH_PROCESS_EACH_FUNCTION':
					case 'FINISH_PROCESS_GLOBAL_FUNCTION':
					case 'FINISH_PROCESS_ARGUMENTS_PATTERN': {
						this.result$.next(data.result);
						this._eachFunctionError = null;
						this._globalFunctionError = null;
						break;
					}
					case 'ERROR_PROCESS_EACH_FUNCTION': {
						this._eachFunctionError = data.error;
						break;
					}
					case 'ERROR_PROCESS_GLOBAL_FUNCTION': {
						this._globalFunctionError = data.error;
						break;
					}
					case 'ERROR_PROCESS_ARGUMENTS_PATTERN': {
						break;
					}
					case 'LOOP_ERROR_PROCESS_EACH_FUNCTION':
					case 'LOOP_ERROR_PROCESS_GLOBAL_FUNCTION': {
						alert('LOOP');
						break;
					}
				}
			});
		} else {
			// Web Workers are not supported in this environment.
			// You should add a fallback so that your program still executes correctly.
		}
	}

	processMatches = () => {
		if (!this.isMatching) return;
		this.worker.postMessage({
			type: 'PROCESS_MATCHES',
			data: {
				regexp: this.regExpPattern,
				text: this.textPattern,
				flags: this.flags,
			},
		});
	};

	processEach() {
		this.processType = ProcessType.EachGroup;
		if (!this.isProccessing || !this.isMatching) return;

		if (this._eachFunction === '') return this.result$.next('');

		this.worker.postMessage({
			type: 'PROCESS_EACH_FUNCTION',
			data: {
				code: this._eachFunction,
				matches: this.matches$.getValue(),
			},
		});
	}

	processGlobal() {
		this.processType = ProcessType.Global;

		if (!this.isProccessing || !this.isMatching) return;

		if (this._globalFunction === '') return this.result$.next('');

		this.worker.postMessage({
			type: 'PROCESS_GLOBAL_FUNCTION',
			data: {
				code: this._globalFunction,
				matches: this.matches$.getValue(),
			},
		});
	}

	processArguments() {
		this.processType = ProcessType.Arguments;

		if (!this.isProccessing || !this.isMatching) return;

		if (this._argumentsPattern === '') return this.result$.next('');

		this.worker.postMessage({
			type: 'PROCESS_ARGUMENTS_PATTERN',
			data: {
				pattern: this._argumentsPattern,
				matches: this.matches$.getValue(),
			},
		});
	}

	proccessLast() {
		switch (this.processType) {
			case ProcessType.EachGroup:
				this.processEach();
				return;
			case ProcessType.Global:
				this.processGlobal();
				return;
			case ProcessType.Arguments:
				this.processArguments();
				return;
		}
	}
}
