import { Injectable } from '@angular/core';
import { ResultControlerService } from './result-controler.service';
import { WorkControlerService } from './work-controler.service';

@Injectable({
	providedIn: 'root'
})
export class GroupMoverService {

	constructor(
		public resultController: ResultControlerService,
		public workController: WorkControlerService
	) {
		this.workController.resultController = resultController;
		this.resultController.workController = workController;
	}
}
