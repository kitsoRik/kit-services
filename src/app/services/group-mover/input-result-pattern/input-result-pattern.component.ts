import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CodeWrapperComponent } from 'src/shared/code-wrapper/code-wrapper.component';
import { ResultControlerService } from '../result-controler.service';
import { editor } from 'monaco-editor';

@Component({
	selector: 'app-input-result-pattern',
	templateUrl: './input-result-pattern.component.html',
	styleUrls: ['./input-result-pattern.component.scss'],
})
export class InputResultPatternComponent implements AfterViewInit {
	@ViewChild('codeWrapper', { static: false })
	codeWrapper: CodeWrapperComponent;

	get eachCodePattern(): string {
		return `(function(match, index) {\n${this.resultController.eachFunction}\n})`;
	}
	set eachCodePattern(pattern: string) {
		this.resultController.eachFunction = /\(function\(match, index\) {\n(((\s*)|.*)*)\n}\)$/.exec(
			pattern
		)[1];
		this.resultController.processEach();
	}

	get eachFunctionError(): string {
		return this.resultController.eachFunctionError;
	}

	get globalCodePattern(): string {
		return `function(matches) {\n${this.resultController.globalFunction}\n}`;
	}
	set globalCodePattern(pattern: string) {
		this.resultController.globalFunction = /\(function\(matches\) {\n(((\s*)|.*)*)\n}\)$/.exec(
			pattern
		)[1];
	}

	argumentsPattern: string = '';

	private _tabIndex: number = 0;

	get tabIndex(): number {
		return this._tabIndex;
	}
	set tabIndex(value: number) {
		this._tabIndex = value;
	}

	constructor(private resultController: ResultControlerService) {}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.codeWrapper.editorRef.onKeyDown((e) => {
				const forbiddenEditLines: number[] = [
					1,
					this.codeWrapper.editorRef.getModel().getLineCount(),
				];

				if (
					forbiddenEditLines.includes(
						this.codeWrapper.editorRef.getPosition().lineNumber
					) &&
					![15, 16, 17, 18].includes(e.keyCode)
				) {
					e.preventDefault();
					e.stopPropagation();
				}
			});
		}, 1000);
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
			case 1:
				this.setGlobalFunctionText();
				break;
			case 2:
				this.setArgumentsText();
				break;
		}
	}
}
