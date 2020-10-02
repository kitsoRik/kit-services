import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeWrapperComponent } from './code-wrapper.component';
import { CodeWrapperErrorsComponent } from './code-wrapper-errors/code-wrapper-errors.component';
import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { MonacoEditorModule } from 'ngx-monaco-editor';

@NgModule({
	declarations: [CodeWrapperComponent, CodeWrapperErrorsComponent],
	imports: [CommonModule, FormsModule, CodemirrorModule, MonacoEditorModule],
	exports: [CodeWrapperComponent, CodeWrapperErrorsComponent],
	providers: [],
})
export class CodeWrapperModule {}
