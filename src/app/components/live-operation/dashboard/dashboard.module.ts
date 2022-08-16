import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { Routes, RouterModule } from '@angular/router';
import { KpisComponent } from './_partial/kpis/kpis.component';
import { OrderKpisComponent } from './_partial/kpis/order-kpis/order-kpis-component';
import { ExcellentOrdersComponent } from './_partial/kpis/excellent-order/excellent-orders-component';
import { NewCustomerComponent } from './_partial/kpis/new-customers/new-customers-component';
import { penddingOrdersComponent } from './_partial/kpis/pendding-order/pendding-orders-component';
import { RecentOrdersComponent } from './_partial/recent-orders/recent-orders.component';
import { TopDeliverymenComponent } from './_partial/top-deliverymen/top-deliverymen.component';
import { TopCustomerComponent } from './_partial/top-customer/top-customer.component';
import { OrdersStatusPiechartComponent } from './_partial/order-status-piechart/order-status-piechart';
import { TripLineChartComponent } from './_partial/trips-line-chart/trips-line-chart.component';
import { ReadyOrdersComponent } from './_partial/ready-orders/ready-orders.component';
import { OrderLineChartComponent } from './_partial/orders-line-chart/orders-line-chart.component';
import { TopItemsComponent } from './_partial/top-items/top-items.component';
import { DeliveryTimeLineChartComponent } from './_partial/delivery-time-line-chart/delivery-time-line-chart.component';
import { DeliveryTimeByHourLineChartComponent } from './_partial/delivery-time-by-hour-line-chart/delivery-time-by-hour-line-chart.component';
import { DeliverymanPiechartComponent } from './_partial/deliveryman-shift-piechart/deliveryman-shift-piechart';
import { DeliverymanCountOnShiftLineChartComponent } from './_partial/deliveryman-count-on-shift-time-line-chart/deliveryman-count-on-shift-time-line-chart.component';
import { DeliverymanShiftLineChartComponent } from './_partial/deliveryman-shift-line-chart/deliveryman-shift-line-chart.component';
import { DeliveryTimeByWeekLineChartComponent } from './_partial/delivery-time-by-week-line-chart/delivery-time-by-week-line-chart.component';
import { DeliveryTimeByWeekStaticLineChartComponent } from './_partial/delivery-time-by-week-static-line-chart/delivery-time-by-week-static-line-chart.component';
import { DeliveryTimeLineChartEqbalComponent } from './_partial/delivery-time-line-chart_eqbal/delivery-time-line-chart_eqbal.component';
import { DeliveryTimeChartByBranchComponent } from './_partial/delivery-time-line-chart-by-branch/delivery-time-line-chart-by-branch.component';
import { SharedModule } from '../../shared/shared.module';
import { DeliveredTasksComponent } from './_partial/kpis/delivered-tasks/delivered-tasks.component';

export const routes: Routes = [
  {path:'',component:IndexComponent},
]
@NgModule({
  imports: [
    CommonModule,RouterModule.forChild(routes),SharedModule,
    
  ],
  declarations: [IndexComponent
    ,KpisComponent
    ,OrderKpisComponent
    ,DeliveredTasksComponent
    ,ExcellentOrdersComponent
    ,NewCustomerComponent
    ,penddingOrdersComponent,
    RecentOrdersComponent,
    TopDeliverymenComponent,
    TopCustomerComponent,
    OrdersStatusPiechartComponent,
    TripLineChartComponent,
    ReadyOrdersComponent,
    OrderLineChartComponent,
    TopItemsComponent,
    DeliveryTimeLineChartComponent,
    DeliveryTimeByHourLineChartComponent,
    DeliveryTimeByWeekLineChartComponent,
    DeliveryTimeByWeekStaticLineChartComponent,
    DeliveryTimeLineChartEqbalComponent,
    DeliverymanShiftLineChartComponent,
    DeliverymanPiechartComponent,
    DeliverymanCountOnShiftLineChartComponent,
    DeliveryTimeChartByBranchComponent
  ]
})
export class DashboardModule { }
