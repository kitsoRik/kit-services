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
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { MatcherService } from './matcher.service';
import { GroupMoverWasmService } from './group-mover-wasm.service';
import { NgWasmModule } from 'ng-wasm';

@NgModule({
	declarations: [
		GroupMoverComponent,
		InputPatternsComponent,
		InputResultPatternComponent,
		GroupsViewerComponent,
		ResultViewerComponent,
	],
	imports: [
		CommonModule,
		CodeWrapperModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		CodemirrorModule,
		NgWasmModule,
	],
	exports: [GroupMoverComponent],
	providers: [ResultControlerService, MatcherService, GroupMoverWasmService],
})
export class GroupMoverModule {
	constructor(private w: GroupMoverWasmService) {}
}
