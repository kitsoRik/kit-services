import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupMoverComponent } from './group-mover.component';
import { InputPatternsComponent } from './input-patterns/input-patterns.component';
import { InputResultPatternComponent } from './input-result-pattern/input-result-pattern.component';
import { ResultViewerComponent } from './result-viewer/result-viewer.component';
import { GroupsViewerComponent } from './groups-viewer/groups-viewer.component';
import { ResultControlerService } from './result-controler.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CodeWrapperModule } from 'src/shared/code-wrapper/code-wrapper.module';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
	declarations: [
		GroupMoverComponent,
		InputPatternsComponent,
		InputResultPatternComponent,
		GroupsViewerComponent,
		ResultViewerComponent,
	],
	imports: [CommonModule, CodeWrapperModule, FormsModule, ReactiveFormsModule, MaterialModule],
	exports: [GroupMoverComponent],
	providers: [ResultControlerService],
})
export class GroupMoverModule { }
