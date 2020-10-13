import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MaterialModule } from 'src/app/material/material.module';
import { IconsModule } from 'src/app/icons/icons.module';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
	declarations: [HeaderComponent],
	exports: [HeaderComponent],
	imports: [CommonModule, AppRoutingModule, MaterialModule, IconsModule],
})
export class HeaderModule {}
