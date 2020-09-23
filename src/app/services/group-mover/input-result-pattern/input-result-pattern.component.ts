import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CodemirrorComponent } from "@ctrl/ngx-codemirror";
import { ResultControlerService } from "../result-controler.service";
import { WorkControlerService } from "../work-controler.service";
import { CodeWrapperComponent } from 'src/components/code-wrapper/code-wrapper.component';

@Component({
	selector: "app-input-result-pattern",
	templateUrl: "./input-result-pattern.component.html",
	styleUrls: ["./input-result-pattern.component.scss"],
})
export class InputResultPatternComponent implements AfterViewInit {
	@ViewChild("eachCodeCM", { static: false })
	eachCodeCM: CodeWrapperComponent;
	@ViewChild("globalCodeCM", { static: false })
	globalCodeCM: CodeWrapperComponent;
	@ViewChild("argumentsCM", { static: false })
	argumentsCM: CodeWrapperComponent;

	get eachCodePattern(): string {
		return `function(match, index) {\n\t${this.workController.currentWork.eachFunction}\n}`;
	}
	set eachCodePattern(pattern: string) {
		this.workController.currentWork.eachFunction = /function\(match, index\) {\n\t(((\s*)|.*)*)\n}$/.exec(
			pattern
		)[1];
	}

	get eachFunctionError(): string {
		return this.resultController.eachFunctionError;
	}

	get globalCodePattern(): string {
		return `function(matches) {\n\t${this.workController.currentWork.globalFunction}\n}`;
	}
	set globalCodePattern(pattern: string) {
		if (!pattern.startsWith("function")) return;
		this.workController.currentWork.globalFunction = /function\(matches\) {\n\t(((\s*)|.*)*)\n}$/.exec(
			pattern
		)[1];
	}

	get argumentsPattern(): string {
		return this.workController.currentWork.argumentsPattern;
	}
	set argumentsPattern(pattern: string) {
		this.workController.currentWork.argumentsPattern = pattern;
	}

	private _tabIndex: number = 0;

	get tabIndex(): number {
		return this._tabIndex;
	}
	set tabIndex(value: number) {
		this._tabIndex = value;
	}

	constructor(
		private resultController: ResultControlerService,
		private workController: WorkControlerService,
		private activated: ActivatedRoute
	) {}

	ngAfterViewInit() {
		this.eachCodeCM.codeMirror.on("beforeChange", (instance, obj) => {
			if (obj.origin === "setValue") return;
			if (obj.from.line === 0 || obj.from.line === instance.lastLine())
				obj.cancel();
		});
		this.eachCodeCM.codeMirror.markText(
			{ line: 0, ch: 0 },
			this.eachCodeCM.codeMirror.posFromIndex(26),
			{ readOnly: true }
		);
		this.eachCodeCM.codeMirror.markText(
			this.eachCodeCM.codeMirror.posFromIndex(26),
			this.eachCodeCM.codeMirror.posFromIndex(28),
			{ readOnly: true }
		);

		this.globalCodeCM.codeMirror.on("beforeChange", (instance, obj) => {
			if (obj.origin === "setValue") return;
			if (obj.from.line === 0 || obj.from.line === instance.lastLine())
				obj.cancel();
		});
		this.globalCodeCM.codeMirror.markText(
			this.globalCodeCM.codeMirror.posFromIndex(0),
			this.globalCodeCM.codeMirror.posFromIndex(21),
			{ readOnly: true }
		);

		this.globalCodeCM.codeMirror.markText(
			this.globalCodeCM.codeMirror.posFromIndex(21),
			this.globalCodeCM.codeMirror.posFromIndex(23),
			{ readOnly: true }
		);
	}

	setEachFunctionText() {
		this.resultController.processEach();
	}

	setGlobalFunctionText() {
		this.resultController.processGlobal();
	}

	setArgumentsText() {
		this.resultController.processArguments();
	}

	changeTab(index: number) {
		this.tabIndex = index;

		switch (index) {
			case 0:
				this.setEachFunctionText();
				break;
			case 1:
				this.setGlobalFunctionText();
				break;
			case 2:
				this.setArgumentsText();
				break;
		}
	}
}
