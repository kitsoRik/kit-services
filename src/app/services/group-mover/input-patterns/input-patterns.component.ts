import {
	AfterViewInit,
	Component,
	ElementRef,
	OnInit,
	ViewChild,
} from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { TextMarker } from 'codemirror';
import { debounce } from 'debounce';
import { ResultControlerService } from '../result-controler.service';
import { CodeWrapperComponent } from 'src/shared/code-wrapper/code-wrapper.component';
import { canvasPainter } from './canvas-painter/canvas-painter';
import { FormControl } from '@angular/forms';
import { MatcherService } from '../matcher.service';

@Component({
	selector: 'app-input-patterns',
	templateUrl: './input-patterns.component.html',
	styleUrls: ['./input-patterns.component.scss'],
})
export class InputPatternsComponent implements OnInit, AfterViewInit {
	private _matchesLink: RegExpExecArray[] = [];

	private localMatches: RegExpExecArray[] = [];
	private markers: TextMarker[] = [];

	@ViewChild('textarea') textarea: ElementRef<HTMLTextAreaElement>;
	@ViewChild('codeMirror') codeMirror: ElementRef<CodemirrorComponent>;
	@ViewChild('textareaCanvas') textareaCanvas: ElementRef<HTMLCanvasElement>;

	private _canvasLeftOffset = 0;

	get canvasHeight(): number {
		return this.textarea?.nativeElement?.scrollHeight ?? 0;
	}

	get canvasWidth(): number {
		return this.textarea?.nativeElement?.scrollWidth ?? 0;
	}

	get canvasLeftOffset(): number {
		return this._canvasLeftOffset;
	}

	get regExpPattern(): string {
		return this.resultController.regExpPattern;
	}
	set regExpPattern(value: string) {
		this.resultController.regExpPattern = value;
	}

	get textPattern(): string {
		return this.resultController.textPattern;
	}
	set textPattern(value: string) {
		this.resultController.textPattern = value;
	}

	flagsControl = new FormControl();

	@ViewChild('textCM', { static: true }) textCM: CodeWrapperComponent;
	@ViewChild('regExpCM', { static: true }) regExpCM: CodemirrorComponent;

	constructor(
		private resultController: ResultControlerService,
		private matcher: MatcherService
	) {
		this.resultController.$textPattern.subscribe(() => {
			setTimeout(() => {
				this.canvasRender();
			}, 1);
		});

		this.resultController._isHighlighting$.subscribe((value) => {
			if (value) {
				this.marksAll();
			} else {
				this.clearAll();
			}
		});

		this.flagsControl.setValue(this.resultController.flags);

		this.flagsControl.valueChanges.subscribe((o) => {
			this.resultController.flags = o;
		});
	}

	ngOnInit() {
		this.setRegExpPattern();
		this.setTextPattern();
	}

	ngAfterViewInit() {
		const regExp = /1/g;

		this.textarea.nativeElement.addEventListener('scroll', (e) => {
			this.textareaCanvas.nativeElement.style.left = `-${this.textarea.nativeElement.scrollLeft}px`;
			this.textareaCanvas.nativeElement.style.top = `-${this.textarea.nativeElement.scrollTop}px`;
		});

		this.textarea.nativeElement.addEventListener(
			'scroll',
			debounce(
				(e) => {
					console.log(e);
					this.matcher.setMatchIndex(this.matcher.lastIndex - 1000);
					this.canvasRender();
				},
				100,
				false
			)
		);
	}

	canvasRender(): void {
		if (!this.textarea) return;
		canvasPainter(
			this.textareaCanvas.nativeElement,
			this.textarea.nativeElement,
			this.matcher
		);
	}

	setRegExpPattern = debounce(this.resultController.processMatches, 400);
	setTextPattern = debounce(this.resultController.processMatches, 400);

	marksAll() {
		this.clearAll();
		let index = 0;

		const groupColors = ['red', 'green', 'yellow', 'blue', 'gray'];

		this._matchesLink.forEach((match) => {
			match.forEach((v, i) => {
				if (!v) return;
				const nextIndex = this.textPattern.indexOf(v, index);

				const start = this.textCM.codeMirror.posFromIndex(nextIndex),
					end = this.textCM.codeMirror.posFromIndex(
						nextIndex + v.length
					);

				this.markers.push(
					this.textCM.codeMirror.markText(start, end, {
						css: `background-color: ${groupColors[i]}`,
					})
				);
				index = nextIndex + 1;
			});
		});
	}

	clearAll() {
		this.markers.forEach((m) => m.clear());
		this.markers = [];
	}
}
