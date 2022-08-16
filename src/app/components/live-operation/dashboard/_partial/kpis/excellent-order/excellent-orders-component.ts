import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { DashBoardService } from '../../../dashboard.service';
import { DashboardSearchViewModel } from '../../../view-models/dashboard-search.model';
import { ExcellentOrdersViewModel } from './excellent-orders-kpi.model';

@Component({
  selector: 'excellent-orders',
  templateUrl: './excellent-orders.component.html',
  styles: []
})
export class ExcellentOrdersComponent implements OnInit, OnChanges {
  page: CRUDIndexPage = new CRUDIndexPage();
  loaded: boolean = false;
  @Input() searchViewModel: DashboardSearchViewModel;
  constructor(
    private _dashBoardService: DashBoardService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.getData();
  }
  result: ExcellentOrdersViewModel = new ExcellentOrdersViewModel();
  ngOnInit(): void {
    this.page.isLoading = false
    //this.getData();


  }

  getData() {
    this._dashBoardService.getExcellentOrders(this.searchViewModel).subscribe(res => {
      if (res.Data) {
        this.page.isLoading = true
        this.result = res.Data
      }
    })
  }
  isPositive() {
    return this.result.ExcellentOrdersCountPercentage >= 0;
  }
}