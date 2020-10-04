import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesRoutingModule } from './services-routing.module';
import { TextProcessComponent } from './text-process/text-process.component';

@NgModule({
	declarations: [TextProcessComponent],
	imports: [CommonModule, ServicesRoutingModule],
	exports: [],
	providers: [],
})
export class ServicesModule {}
