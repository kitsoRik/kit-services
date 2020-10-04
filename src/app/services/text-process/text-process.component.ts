import { Component, OnInit } from '@angular/core';
import { debounce } from 'rxjs/operators';

@Component({
	selector: 'app-text-process',
	templateUrl: './text-process.component.html',
	styleUrls: ['./text-process.component.scss'],
})
export class TextProcessComponent implements OnInit {
	worker: Worker = null;

	private _text = localStorage.getItem('TEXT_PROCESS_TEXT') ?? '';
	private _processedText = '';

	private _functionText = localStorage.getItem('TEXT_PROCESS_FUNCTION') ?? '';

	get text(): string {
		return this._text;
	}

	set text(text: string) {
		this._text = text;
		localStorage.setItem('TEXT_PROCESS_TEXT', text);
	}

	get processedText(): string {
		return this._processedText;
	}

	set processedText(processedText: string) {
		this._processedText = processedText;
	}

	get functionText(): string {
		return `(function(text) {\n${this._functionText}\n})`;
	}

	set functionText(functionText: string) {
		this._functionText = /\(function\(text\) {\n(((\s*)|.*)*)\n}\)$/.exec(
			functionText
		)[1];
		localStorage.setItem('TEXT_PROCESS_FUNCTION', this._functionText);
	}

	constructor() {}

	ngOnInit(): void {
		this.worker = new Worker('./text-process.worker', {
			type: 'module',
		});

		this.worker.onmessage = ({ data }) => {
			if (data === null) {
				alert('LOOP');
				this.processedText = '';
			} else {
				this.processedText = data;
			}
		};

		this.processText();
	}

	processText(): void {
		this.worker.postMessage({
			text: this._text,
			fnText: this._functionText,
		});
	}
}
