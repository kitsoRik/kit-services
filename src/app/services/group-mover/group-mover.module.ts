import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WorkControlerService } from "./work-controler.service";
import { GroupMoverComponent } from "./group-mover.component";
import { InputPatternsComponent } from "./input-patterns/input-patterns.component";
import { InputResultPatternComponent } from "./input-result-pattern/input-result-pattern.component";
import { ResultViewerComponent } from "./result-viewer/result-viewer.component";
import { WorkControlerComponent } from "./work-controler/work-controler.component";
import { GroupsViewerComponent } from "./groups-viewer/groups-viewer.component";
import { GroupMoverService } from "./group-mover.service";
import { ResultControlerService } from "./result-controler.service";
import { CodemirrorModule, CodemirrorComponent } from "@ctrl/ngx-codemirror";
import { FormsModule } from "@angular/forms";
import { KitModule } from "src/kit/kit.module";
import { ComponentsModule } from 'src/components/components.module';

@NgModule({
	declarations: [
		GroupMoverComponent,
		InputPatternsComponent,
		InputResultPatternComponent,
		GroupsViewerComponent,
		ResultViewerComponent,
		WorkControlerComponent,
	],
	imports: [
		CommonModule,
		CodemirrorModule,
		FormsModule,
		KitModule,
		CodemirrorModule,
		ComponentsModule,
	],
	exports: [GroupMoverComponent],
	providers: [
		GroupMoverService,
		WorkControlerService,
		ResultControlerService,
	],
})
export class GroupMoverModule {}
