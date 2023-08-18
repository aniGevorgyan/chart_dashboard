import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() selectCount: EventEmitter<number> = new EventEmitter<number>();
  @Output() combineChart: EventEmitter<string> = new EventEmitter<string>();


  public productCount: number[] = [
    10,
    20,
    50,
    100
  ];
  public combineChartType = [
    'Category Stock With Rating',
    'Price With Product Stock',
  ];

  setProductCount(event: any) {
    if (event.target.value === 0) {
      return;
    }
    this.selectCount.emit(event.target.value)
  }

  setCombineType(event: any) {
    if (event.target.value === '-1') {
      return;
    }
    this.combineChart.emit(event.target.value)
  }
}
