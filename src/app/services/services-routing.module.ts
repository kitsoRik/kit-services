import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TextProcessComponent } from './text-process/text-process.component';

const routes: Routes = [
	{
		path: 'services',
		children: [
			{
				path: 'text-process',
				component: TextProcessComponent,
			},
		],
	},
];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ServicesRoutingModule {}
