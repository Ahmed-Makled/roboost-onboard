import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import * as HighCharts from 'highcharts';
import { OrdersPerformanceLineChartByMonth } from '../view-models/order-performance-by-month.model';
import { OrdersPerformanceLineChartByDay } from '../view-models/order-performance-by-day.model';
import { formatDate } from '@angular/common';
import { OrdersPerformancePieChart } from '../view-models/order-performance-pie-chart.model';
import { CallCenterService } from '../../../call-center.service';
import { SharedService } from 'src/app/service/shared.service';
import { StatusUtilsService } from 'src/app/service/status.service';
@Component({
  selector: 'order-performance',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class OrdersPerformanceComponent implements OnInit {
  title = '';
  name = "Performance"
  data: OrdersPerformancePieChart[]
  Total: number = 0
  dataMonth: OrdersPerformanceLineChartByMonth[]
  dataDays: OrdersPerformanceLineChartByDay[]
  date: Date[] = [];
  stringDate: string[] = [];
  month: Date[] = [];
  stringMonth: string[] = [];
  series: HighCharts.SeriesOptionsType[] = [];
  seriesMonth: HighCharts.SeriesOptionsType[] = [];
  seriesDay: HighCharts.SeriesOptionsType[] = [];
  isDayMode: boolean = false;
  sharedStringDate: any[] = []
  items: OrdersPerformancePieChart[] = [];
  modalRef: BsModalRef;
  customerID: number
  @Input() phoneSearch: string;
  index: number = 1;
  constructor(@Inject(LOCALE_ID) private locale: string,
    private activatedRoute: ActivatedRoute,
    private customerProfileService: CallCenterService,
    private _statusUtilsService: StatusUtilsService
  ) {
  }
  ngOnChanges(): void {
  }
  ngOnInit() {
    this.customerID = this.activatedRoute.snapshot.params['id']
    this.getDataDay()
    this.getDataMonth()
    this.getDataPieChart()
  }
  lineChartBrowser() {
    HighCharts.chart('avg-container', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
      },
      title: {
        text: this.title
      },
      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat: "<small class='amp-5 bold font-14px text-center d-block'>{point.x}</small><table>",
        pointFormat: '<tr><td style="color: {series.color}" class="amp-5 bold">{series.name}: </td>' +
          '<td style="text-align: right"><b>{point.y} Order</b></td></tr>',
        footerFormat: '</table>',
      },
      plotOptions: {
        series: {
        }
      },
      yAxis: {
        title: {
          text: 'Orders'
        }
      },
      xAxis: {
        categories: this.sharedStringDate,
        // title: { text: 'Day' },
        type: 'datetime',
        labels: {
          format: '{value:%Y-%m-%d}',
          rotation: 60,
          align: 'left'
        }
      },
      series: this.series,
      responsive: {
        rules: [{
          condition: {
            // maxWidth: 25,
          },
          chartOptions: {
            plotOptions: {
              column: {
                maxPointWidth: 25,
              }
            }
          }
        }]
      }
    });
  }
  tripPieChartBinding() {
    HighCharts.chart('pieCharts', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: ` ${this.title} `
      },
      xAxis: {
      },
      subtitle: {
        text: `<small> Total Orders = ${this.Total}</small>`
      },
      tooltip: {
        pointFormat: '{series.name}: <br>{point.percentage:.1f} %<br>Number: {point.y}'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>:<br>{point.percentage:.1f} %<br>Number: {point.y}',
          },
          showInLegend: true
        }
      },
      series: [{
        name: this.name,
        colorByPoint: true,
        type: undefined,
        data: this.data
      }]
    });
  }
  getDataDay() {
    this.seriesDay = []
    this.date = []
    this.stringDate = []
    this.customerProfileService.getCustomerOrdersLineChartByDay(this.customerID, this.phoneSearch).subscribe(response => {
      if (response.Success && response.Data != null) {
        this.dataDays = response.Data as OrdersPerformanceLineChartByDay[];
        this.date = []
        this.stringDate = []
        this.dataDays.map(x => x.Date).forEach(h => {
          this.date.push(h)
          this.stringDate.push(formatDate(h, 'MM/dd', this.locale))
        })
        let totalPoints: number[] = [];
        totalPoints = this.dataDays.map(x => x.Total)
        this.seriesDay.push({ name: "Total", data: totalPoints, type: "spline" })
        let excellentOrders: number[] = this.dataDays.map(x => x.ExcellentOrders);
        let goodOrders: number[] = this.dataDays.map(x => x.GoodOrders);
        let lateOrders: number[] = this.dataDays.map(x => x.LateOrders);
        let tooLateOrders: number[] = this.dataDays.map(x => x.TooLateOrders);
        this.seriesDay.push({ name: "Excellent", data: excellentOrders, type: "column", stacking: "normal", color: "#32cc3e" })
        this.seriesDay.push({ name: "Good", data: goodOrders, type: "column", stacking: "normal", color: "#03A8FF" })
        this.seriesDay.push({ name: "Late", data: lateOrders, type: "column", stacking: "normal", color: "#ffc400" })
        this.seriesDay.push({ name: "Too Late", data: tooLateOrders, type: "column", stacking: "normal", color: "#cc324c" })
      }
    });
  }
  getDataMonth() {
    this.seriesMonth = []
    this.month = []
    this.stringMonth = []
    this.customerProfileService.getCustomerOrdersLineChartByMonth(this.customerID, this.phoneSearch).subscribe(response => {
      if (response.Success && response.Data != null) {
        this.dataMonth = response.Data as OrdersPerformanceLineChartByMonth[];
        this.month = []
        this.stringMonth = []
        this.dataMonth.map(x => x.Date).forEach(h => {
          this.month.push(h)
          this.stringMonth.push(formatDate(h, 'yyyy-MM', this.locale))
        })
        let totalPoints: number[] = [];
        totalPoints = this.dataMonth.map(x => x.Total)
        this.seriesMonth.push({ name: "Total", data: totalPoints, type: "spline" })
        let excellentOrders: number[] = this.dataMonth.map(x => x.ExcellentOrders);
        let goodOrders: number[] = this.dataMonth.map(x => x.GoodOrders);
        let lateOrders: number[] = this.dataMonth.map(x => x.LateOrders);
        let tooLateOrders: number[] = this.dataMonth.map(x => x.TooLateOrders);
        this.seriesMonth.push({ name: "Excellent", data: excellentOrders, type: "column", stacking: "normal", color: "#32cc3e" })
        this.seriesMonth.push({ name: "Good", data: goodOrders, type: "column", stacking: "normal", color: "#03A8FF" })
        this.seriesMonth.push({ name: "Late", data: lateOrders, type: "column", stacking: "normal", color: "#ffc400" })
        this.seriesMonth.push({ name: "Too Late", data: tooLateOrders, type: "column", stacking: "normal", color: "#cc324c" })
        this.getChartMonth()
      }
    })
  }
  getChartMonth() {
    this.isDayMode = false
    this.sharedStringDate = this.stringMonth
    this.series = this.seriesMonth;
    this.lineChartBrowser();
  }
  getChartDay() {
    this.isDayMode = true
    this.sharedStringDate = this.stringDate
    this.series = this.seriesDay;
    this.lineChartBrowser();
  }
  getDataPieChart() {
    this.customerProfileService.getCustomerOrdersPieChart(this.customerID, this.phoneSearch).subscribe(response => {
      if (response.Success) {
        this.data = response.Data as OrdersPerformancePieChart[];
        if (this.data.length > 0)
          this.Total = this.data[0].Total
        else
          this.Total = 0;
        this.data.forEach(i => {
          i.color = this._statusUtilsService.getTaskRateColors(i.name)
        })
        this.tripPieChartBinding();
      }
    });
  }
}
