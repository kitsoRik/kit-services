import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { WorkControlerService } from "./work-controler.service";

enum ProcessType {
	EachGroup,
	Global,
	Arguments,
}

@Injectable({
	providedIn: "root",
})
export class ResultControlerService {
	private worker: Worker;

	private _isMatching: Boolean = true;
	private _isProccessing: Boolean = true;
	_isHighlighting$ = new BehaviorSubject<Boolean>(false);

	private _eachFunctionError: any = null;
	private _globalFunctionError: any = null;

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

	get eachFunctionError(): any {
		return this._eachFunctionError;
	}
	get globalFunctionError(): any {
		return this._globalFunctionError;
	}

	_workController: WorkControlerService;
	get workController(): WorkControlerService {
		return this._workController;
	}
	set workController(workController: WorkControlerService) {
		this._workController = workController;
		workController.currentWork$.subscribe((currentWork) => {
			this.proccessLast();
		});
	}

	matches$: BehaviorSubject<RegExpExecArray[]>;

	result$: BehaviorSubject<string>;

	processType: ProcessType = ProcessType.EachGroup;

	constructor() {
		this.matches$ = new BehaviorSubject<RegExpExecArray[]>([]);
		this.result$ = new BehaviorSubject<string>("");

		if (typeof Worker !== "undefined") {
			// Create a new
			this.worker = new Worker("./result-controller.worker", {
				type: "module",
			});
			this.worker.addEventListener("message", ({ data }) => {
				switch (data.type) {
					case "FINISH_PROCESS_MATCHES": {
						this.matches$.next(data.matches);
						this.proccessLast();
						break;
					}
					case "FINISH_PROCESS_EACH_FUNCTION":
					case "FINISH_PROCESS_GLOBAL_FUNCTION":
					case "FINISH_PROCESS_ARGUMENTS_PATTERN": {
						this.result$.next(data.result);
						this._eachFunctionError = null;
						this._globalFunctionError = null;
						break;
					}
					case "ERROR_PROCESS_EACH_FUNCTION": {
						this._eachFunctionError = data.error;
						break;
					}
					case "ERROR_PROCESS_GLOBAL_FUNCTION": {
						this._globalFunctionError = data.error;
						break;
					}
					case "ERROR_PROCESS_ARGUMENTS_PATTERN": {
						break;
					}
					case "LOOP_ERROR_PROCESS_EACH_FUNCTION":
					case "LOOP_ERROR_PROCESS_GLOBAL_FUNCTION": {
						alert("LOOP");
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
			type: "PROCESS_MATCHES",
			data: {
				regexp: this.workController.currentWork.regExpPattern,
				text: this.workController.currentWork.textPattern,
			},
		});
	};

	processEach() {
		this.processType = ProcessType.EachGroup;

		if (!this.isProccessing || !this.isMatching) return;

		if (this.workController.currentWork.eachFunction === "")
			return this.result$.next("");

		this.worker.postMessage({
			type: "PROCESS_EACH_FUNCTION",
			data: {
				code: this.workController.currentWork.eachFunction,
				matches: this.matches$.getValue(),
			},
		});
	}

	processGlobal() {
		this.processType = ProcessType.Global;

		if (!this.isProccessing || !this.isMatching) return;

		if (this.workController.currentWork.globalFunction === "")
			return this.result$.next("");

		this.worker.postMessage({
			type: "PROCESS_GLOBAL_FUNCTION",
			data: {
				code: this.workController.currentWork.globalFunction,
				matches: this.matches$.getValue(),
			},
		});
	}

	processArguments() {
		this.processType = ProcessType.Arguments;

		if (!this.isProccessing || !this.isMatching) return;

		if (this.workController.currentWork.argumentsPattern === "")
			return this.result$.next("");

		this.worker.postMessage({
			type: "PROCESS_ARGUMENTS_PATTERN",
			data: {
				pattern: this.workController.currentWork.argumentsPattern,
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
