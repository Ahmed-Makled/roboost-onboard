import { Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DashboardSearchViewModel } from '../../view-models/dashboard-search.model';

@Component({
  selector: 'kpis',
  templateUrl: './kpis.component.html',
  styles: [
  ]
})
export class KpisComponent implements OnInit ,OnChanges {
  @Input() searchViewModel: DashboardSearchViewModel;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    
  }

}