import { Injectable, Inject, forwardRef } from "@angular/core";
import { GroupMoverService } from "./group-mover.service";
import { ResultControlerService } from "./result-controler.service";
import { BehaviorSubject } from "rxjs";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

export interface iWork {
	id: number;
	name: string;
	regExpPattern: string;
	textPattern: string;
	eachFunction: string;
	globalFunction: string;
	argumentsPattern: string;
}

export interface iWorkExtend extends iWork {
	savedType: "unsaved" | "local" | "global";
}

@Injectable({
	providedIn: "root",
})
export class WorkControlerService {
	get works(): iWork[] {
		return [...this.unSavedWorks, ...this.localWorks, ...this.globalWorks];
	}

	private _currentWork$: BehaviorSubject<iWork>;

	resultController: ResultControlerService;

	currentWorkId: number = -1;

	unSavedWorks: iWork[] = [
		{
			id: -1,
			name: "Custom",
			regExpPattern: "",
			textPattern: "",
			eachFunction: "",
			globalFunction: "",
			argumentsPattern: "",
		},
	];

	localWorks: iWork[] = [];
	globalWorks: iWork[] = [];

	get currentWorkExtend(): iWorkExtend {
		const work: iWork = this.currentWork$.getValue();
		return {
			...work,
			savedType: this.unSavedWorks.find((w) => w === work)
				? "unsaved"
				: this.globalWorks.find((w) => w === work)
				? "global"
				: "local",
		};
	}

	get currentWork(): iWork {
		return this.currentWork$.getValue();
	}

	get currentWork$(): BehaviorSubject<iWork> {
		return this._currentWork$;
	}

	constructor(private apollo: Apollo) {
		this._currentWork$ = new BehaviorSubject<iWork>(
			this.unSavedWorks.find((w) => w.id === this.currentWorkId)
		);

		this.loadWorksFromLocal();
		this.loadWorksFromGlobal();
	}

	loadWorksFromLocal() {
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key.startsWith("WORKS")) {
				const work: iWork = JSON.parse(localStorage.getItem(key));
				this.localWorks.push(work);
			}
		}
	}

	loadWorksFromGlobal() {
		this.apollo
			.watchQuery({
				query: getGroupMoversQuery,
			})
			.valueChanges.subscribe(
				({
					data: {
						currentUser: { groupMovers },
					},
				}: any) => {
					this.globalWorks = groupMovers;
					console.log(this.globalWorks);
				}
			);
	}

	setWork(id: number) {
		const workIndex = this.works.findIndex((w) => w.id === +id);
		if (workIndex === -1) throw new Error("Unknmown identifier");

		this.currentWork$.next(this.works[workIndex]);

		this.resultController.processMatches();
	}

	add = (
		name: string,
		regExpPattern: string = "",
		textPattern: string = "",
		eachFunction: string = "",
		globalFunction: string = "",
		argumentsPattern: string = ""
	): iWork => {
		const id = this.unSavedWorks.length;
		const work: iWork = {
			id,
			name,
			regExpPattern,
			argumentsPattern,
			eachFunction,
			globalFunction,
			textPattern,
		};

		this.unSavedWorks.push(work);

		this._currentWork$.next(work);

		return work;
	};

	save = () => {
		switch (this.currentWorkExtend.savedType) {
			case "global": {
				const {
					id,
					regExpPattern,
					textPattern,
					eachFunction,
					globalFunction,
					argumentsPattern,
				}: iWork = this.currentWork;
				this.apollo
					.mutate({
						mutation: saveMutation,
						variables: {
							id,
							regExpPattern,
							eachFunction,
							textPattern,
							globalFunction,
							argumentsPattern,
						},
					})
					.subscribe((o) => {
						alert("SAVED!");
						console.log(o);
					});
				break;
			}
			case "local": {
				localStorage.setItem(
					`WORKS_${this.currentWork.id}`,
					JSON.stringify(this.currentWork)
				);
			}
			default: {
				throw new Error("Unknown saved type");
			}
		}
	};

	saveCurrentToLocal = () => {
		let id = 0;

		while (localStorage.getItem(`WORKS_${id}`)) {
			id++;
		}
		const work = this.currentWork;

		this.unSavedWorks = this.unSavedWorks.filter(
			(w) => w.id !== this.currentWork.id
		);

		work.id = id;

		localStorage.setItem(`WORKS_${id}`, JSON.stringify(this.currentWork));
		this.localWorks.push(work);
		alert("SAVED!");
	};

	saveCurrentToGlobal = () => {
		const work: iWork = this.currentWork;
		const {
			name,
			regExpPattern,
			textPattern,
			eachFunction,
			globalFunction,
			argumentsPattern,
		}: iWork = work;
		this.apollo
			.mutate({
				mutation: saveNewMutation,
				variables: {
					name,
					regExpPattern,
					eachFunction,
					textPattern,
					globalFunction,
					argumentsPattern,
				},
			})
			.subscribe((result) => {
				const {
					saveGroupMover: { id },
				}: any = result.data;
				alert("SAVED!");
				this.unSavedWorks = this.unSavedWorks.filter(
					(w) => w.id !== work.id
				);
				work.id = id;
				this.globalWorks.push(work);
			});
	};

	remove = () => {
		switch (this.currentWorkExtend.savedType) {
			case "global": {
				const { id }: iWork = this.currentWork;
				this.apollo
					.mutate({
						mutation: removeMutation,
						variables: {
							id,
						},
					})
					.subscribe((o) => {
						this.globalWorks = this.globalWorks.filter(
							(w) => w.id !== id
						);
						this.setWork(-1);

						alert("REMOVED!");
					});
				break;
			}
			case "local": {
				localStorage.removeItem(`WORKS_${this.currentWork.id}`);
				this.localWorks = this.localWorks.filter(
					(w) => w.id !== this.currentWork.id
				);
				this.setWork(-1);

				alert("REMOVED!");
				break;
			}
			case "unsaved": {
				if (this.currentWork.id === -1)
					return alert("Error, delete custom not provide");

				this.unSavedWorks = this.unSavedWorks.filter(
					(w) => w.id !== this.currentWork.id
				);
				this.setWork(-1);

				alert("REMOVED!");
				break;
			}
		}
	};
}

const saveNewMutation = gql`
	mutation saveGroupMover(
		$name: string!
		$regExpPattern: string!
		$textPattern: string!
		$eachFunction: string!
		$globalFunction: string!
		$argumentsPattern: string!
	) {
		saveGroupMover(
			name: $name
			regExpPattern: $regExpPattern
			textPattern: $textPattern
			eachFunction: $eachFunction
			globalFunction: $globalFunction
			argumentsPattern: $argumentsPattern
		) {
			id
			regExpPattern
			textPattern
			eachFunction
			globalFunction
			argumentsPattern
		}
	}
`;

const saveMutation = gql`
	mutation saveGroupMover(
		$id: ID!
		$regExpPattern: string!
		$eachFunction: string!
		$textPattern: string!
		$globalFunction: string!
		$argumentsPattern: string!
	) {
		saveGroupMover(
			id: $id
			regExpPattern: $regExpPattern
			textPattern: $textPattern
			eachFunction: $eachFunction
			globalFunction: $globalFunction
			argumentsPattern: $argumentsPattern
		) {
			id
			regExpPattern
			textPattern
			eachFunction
			globalFunction
			argumentsPattern
		}
	}
`;

const removeMutation = gql`
	mutation removeGroupMover($id: ID!) {
		removeGroupMover(id: $id)
	}
`;

const getGroupMoversQuery = gql`
	query {
		currentUser {
			id
			groupMovers {
				id
				name
				regExpPattern
				textPattern
				eachFunction
				globalFunction
				argumentsPattern
			}
		}
	}
`;
