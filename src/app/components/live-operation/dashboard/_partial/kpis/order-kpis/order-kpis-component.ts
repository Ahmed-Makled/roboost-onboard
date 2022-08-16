import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OrderKpisViewModel } from './view-models/order-kpis.model';
import { DashBoardService } from '../../../dashboard.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { DashboardSearchViewModel } from '../../../view-models/dashboard-search.model';

@Component({
  selector: 'order-kpis',
  templateUrl: './order-kpis.component.html',
  styles: []
})

export class OrderKpisComponent implements OnInit, OnChanges {
  orderKpis: OrderKpisViewModel = new OrderKpisViewModel();
  page: CRUDIndexPage = new CRUDIndexPage();
  averageDeliveryTime: number = null;
  @Input() searchViewModel: DashboardSearchViewModel;
  
  constructor(private dashBoardService: DashBoardService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getAverageDeliveryTime();
  }

  ngOnInit(): void {
  }
  getAverageDeliveryTime() {
    this.page.isLoading = true;
    this.dashBoardService.getAvgDeliveryTime(this.searchViewModel).subscribe(response => {
      this.page.isLoading = false;
      if (response.Success)
        this.averageDeliveryTime = response.Data
    });
  }

ء
}