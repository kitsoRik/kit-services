import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GroupMoverComponent } from './group-mover/group-mover.component';
import { GroupMoverModule } from './group-mover/group-mover.module';

const routes: Routes = [{ path: '/services', children: [{ path: '/group-mover', component: GroupMoverComponent }] }];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), GroupMoverModule],
	exports: [RouterModule],
})
export class ServicesRoutingModule {}
