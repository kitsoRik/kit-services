import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubIconComponent } from './github-icon/github-icon.component';

@NgModule({
	declarations: [GithubIconComponent],
	exports: [GithubIconComponent],
	imports: [CommonModule],
})
export class IconsModule {}
