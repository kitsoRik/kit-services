import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ViewChild,
	AfterViewInit,
	ContentChild,
} from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { DiffEditorComponent } from 'ngx-monaco-editor';
import { editor } from 'monaco-editor';

@Component({
	selector: 'app-code-wrapper',
	templateUrl: './code-wrapper.component.html',
	styleUrls: ['./code-wrapper.component.scss'],
})
export class CodeWrapperComponent {
	title: string = 'kit-services';
	editorOptions: any = {
		theme: 'vs-dark',
		language: 'typescript',
		autoClosingBrackets: 'always',
		autoClosingQuotes: 'always',
		formatOnType: true,
		highlightActiveIndentGuide: true,
	};
	editorRef: editor.ICodeEditor;

	@ViewChild('editor') editor: DiffEditorComponent;

	@Input('type') private _type: 'js' | 'regexp' = 'js';
	@Input('viewOnly') _viewOnly: boolean = false;

	get type(): 'js' | 'regexp' {
		return this._type;
	}
	set type(type: 'js' | 'regexp') {
		this._type = type;
	}

	@Input('code') code: string = '';
	@Input('readOnly') readOnly: boolean = false;

	@Input('placeholder') placeholder: string = '';

	@Output('codeChange') codeChange: EventEmitter<string> = new EventEmitter<
		string
	>();

	@ViewChild('codeMirror', { static: false })
	private _codeMirror: CodemirrorComponent;

	get codeMirror(): CodeMirror.EditorFromTextArea {
		return this._codeMirror ? this._codeMirror.codeMirror : null;
	}

	constructor() {}

	async onInitEditor(editor, editorId): Promise<void> {
		this.editorRef = editor;
	}

	onCodeChange(code: string): void {
		this.codeChange.emit(code);
	}
}
