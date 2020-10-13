import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MaterialModule } from 'src/app/material/material.module';
import { IconsModule } from 'src/app/icons/icons.module';

@NgModule({
	declarations: [HeaderComponent],
	exports: [HeaderComponent],
	imports: [CommonModule, MaterialModule, IconsModule],
})
export class HeaderModule {}
