import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';

@Component({
	selector: 'app-code-wrapper',
	templateUrl: './code-wrapper.component.html',
	styleUrls: ['./code-wrapper.component.scss'],
})
export class CodeWrapperComponent {
	@Input('type') _type: 'js' | 'regexp' = 'js';
	@Input('viewOnly') _viewOnly: Boolean = false;

	@Input('code') code: string = '';
	@Input('readOnly') readOnly: Boolean = false;

	@Input('placeholder') placeholder: string = '';

	@Output('codeChange') codeChange = new EventEmitter<string>();

	@ViewChild('codeMirror', { static: false })
	_codeMirror: CodemirrorComponent;

	get codeMirror(): CodeMirror.EditorFromTextArea {
		return this._codeMirror ? this._codeMirror.codeMirror : null;
	}

	constructor() {}

	onCodeChange(code: string) {
		this.codeChange.emit(code);
	}
}
