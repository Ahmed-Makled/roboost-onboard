import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OrderKpisViewModel } from './view-models/order-kpis.model';
import { DashBoardService } from '../../../dashboard.service';
import { AVGDeliveryTimeLineChartViewModel } from '../../delivery-time-line-chart/View-models/delivery-time-line-chart.model';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { DashboardSearchViewModel } from '../../../view-models/dashboard-search.model';

@Component({
  selector: 'delivered-tasks',
  templateUrl: './delivered-tasks.component.html',
  styles: []
})

export class DeliveredTasksComponent implements OnInit, OnChanges {
  item: OrderKpisViewModel = new OrderKpisViewModel();
  page: CRUDIndexPage = new CRUDIndexPage();
  @Input() searchViewModel: DashboardSearchViewModel;
  
  constructor(private dashBoardService: DashBoardService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getData();
  }

  ngOnInit(): void {
  }

  getData() {
    this.page.isLoading = true;
    this.dashBoardService.getOrderKpis(this.searchViewModel).subscribe(response => {
      this.page.isLoading = false;
      if (response.Success) {
        this.item = response.Data as OrderKpisViewModel;
      }
    });
  }


}