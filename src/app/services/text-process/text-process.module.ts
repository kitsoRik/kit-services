import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextProcessComponent } from './text-process.component';
import { FormsModule } from '@angular/forms';
import { CodeWrapperModule } from 'src/shared/code-wrapper/code-wrapper.module';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
	declarations: [TextProcessComponent],
	imports: [CommonModule, FormsModule, CodeWrapperModule, MaterialModule],
})
export class TextProcessModule {}
