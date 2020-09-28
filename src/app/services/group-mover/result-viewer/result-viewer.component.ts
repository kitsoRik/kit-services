import { Component } from '@angular/core';
import { ResultControlerService } from '../result-controler.service';

@Component({
  selector: 'app-result-viewer',
  templateUrl: './result-viewer.component.html',
  styleUrls: ['./result-viewer.component.scss']
})
export class ResultViewerComponent {

  result: string;

  constructor(private resultController: ResultControlerService) {
    this.resultController.result$.subscribe(result => {
      this.result = result;
    });
  }
}