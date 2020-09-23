import { Component } from "@angular/core";
import { WorkControlerService, iWorkExtend } from "../work-controler.service";
import { Apollo } from "apollo-angular";

import { iWork } from "../work-controler.service";
import { ResultControlerService } from "../result-controler.service";

@Component({
	selector: "app-work-controler",
	templateUrl: "./work-controler.component.html",
	styleUrls: ["./work-controler.component.scss"],
})
export class WorkControlerComponent {
	get isMatching(): Boolean {
		return this.resultController.isMatching;
	}
	set isMatching(value: Boolean) {
		this.resultController.isMatching = value;
	}

	get isProccessing(): Boolean {
		return this.resultController.isProccessing;
	}
	set isProccessing(value: Boolean) {
		this.resultController.isProccessing = value;
	}

	get isHighlighting(): Boolean {
		return this.resultController.isHighlighting;
	}
	set isHighlighting(value: Boolean) {
		this.resultController.isHighlighting = value;
	}

	get value(): string {
		console.log(this.workController.currentWork.id.toString());
		return this.workController.currentWork.id.toString();
	}
	get options(): any[] {
		console.log(
			this.workController.works.map(({ id, name }) => ({
				value: id.toString(),
				text: name,
			}))
		);
		return this.workController.works.map(({ id, name }) => ({
			value: id.toString(),
			text: name,
		}));
	}

	get currentWork(): iWorkExtend {
		return this.workController.currentWorkExtend;
	}

	constructor(
		private workController: WorkControlerService,
		private resultController: ResultControlerService,
		private apollo: Apollo
	) {}

	changeWork(value: number) {
		this.workController.setWork(value);
	}

	add() {
		const name = prompt("Name?", "");

		if (!name) {
			alert("ERROR");
			return;
		}

		this.workController.add(name);
	}

	saveCurrentToGlobal = this.workController.saveCurrentToGlobal;
	saveCurrentToLocal = this.workController.saveCurrentToLocal;

	save = this.workController.save;

	removeLocal() {}

	removeGlobal() {}

	copyToNew = () => {
		const name = prompt("Name?", "");

		if (!name) {
			alert("ERROR");
			return;
		}

		const {
			regExpPattern,
			textPattern,
			eachFunction,
			globalFunction,
			argumentsPattern,
		}: iWork = this.currentWork;

		this.workController.add(
			name,
			regExpPattern,
			textPattern,
			eachFunction,
			globalFunction,
			argumentsPattern
		);
	};

	remove = this.workController.remove;

	prs() {
		return "0";
	}
}
