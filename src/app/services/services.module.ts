import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesRoutingModule } from './services-routing.module';
import { TextProcessModule } from './text-process/text-process.module';

@NgModule({
	declarations: [],
	imports: [CommonModule, ServicesRoutingModule, TextProcessModule],
	exports: [],
	providers: [],
})
export class ServicesModule {}
