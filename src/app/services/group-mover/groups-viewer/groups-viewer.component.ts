import { Component } from '@angular/core';
import { Group } from '../group.model';
import { GroupMoverService } from '../group-mover.service';
import { ResultControlerService } from '../result-controler.service';

@Component({
	selector: 'app-groups-viewer',
	templateUrl: './groups-viewer.component.html',
	styleUrls: ['./groups-viewer.component.scss']
})
export class GroupsViewerComponent {

	get hasPrev(): Boolean { return this.groupIndex > 0; }
	get hasNext(): Boolean { return this.groupIndex < this.matches.length - 1; }

	fullMatchGroup: Group;
	groups: Group[];
	groupIndex: number = 0;
	matches: RegExpExecArray[];

	constructor(private resultController: ResultControlerService) {
		this.resultController.matches$.subscribe(matches => {
			this.matches = matches;
			this.setGroup();
		});
	}

	setGroup() {
		if (this.matches.length === 0) return this.clear();

		this.groups = []
		if (this.matches.length <= this.groupIndex)
			this.groupIndex = this.matches.length - 1;
		else if (this.groupIndex === -1) this.groupIndex = 0;

		if (this.groupIndex === -1) return;

		const match = this.matches[this.groupIndex];

		if (!match) return;


		this.fullMatchGroup = new Group(0, match[0]);
		for (let i = 1; i < match.length; i++) {
			this.groups.push(new Group(i, match[i]));
		}
	}

	clear() {
		this.fullMatchGroup = null;
		this.groups = [];
	}

	prev(): void {
		this.groupIndex--;
		this.setGroup();
	}

	next(): void {
		this.groupIndex++;
		this.setGroup();
	}
}
