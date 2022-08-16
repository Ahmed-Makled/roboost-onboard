import { OnInit, Component, Inject, LOCALE_ID, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DashBoardService } from '../../dashboard.service';
import { OrderLineChartViewModel } from './View-models/orders-line-chart.model';
import * as HighCharts from 'highcharts';
import { formatDate } from '@angular/common';
import { OrderLineChartByHourViewModel } from './View-models/orders-line-chart-by-hour.model';
import { Point } from '../trips-line-chart/View-models/point-model';
import { OrderStatusPieChartViewModel } from '../order-status-piechart/View-models/order.model';
import { DashboardSearchViewModel } from '../../view-models/dashboard-search.model';
@Component({
  selector: 'orders-line-chart',
  templateUrl: './orders-line-chart.component.html',
})
export class OrderLineChartComponent implements OnInit, OnChanges {
  title = 'Orders Chart';
  name = "Status"
  // data: OrderLineChartViewModel[]
  statusList: string[] = [];
  dataDays: OrderLineChartViewModel[]
  dataHours: OrderLineChartByHourViewModel[]
  date: Date[] = [];
  sharedStringDate: any[] = []
  stringDate: string[] = [];
  hour: number[] = [];
  stringHour: string[] = [];
  series: HighCharts.SeriesOptionsType[] = [];
  seriesHour: HighCharts.SeriesOptionsType[] = [];
  seriesDay: HighCharts.SeriesOptionsType[] = [];
  isDayMode: boolean = true;
  pieData: OrderStatusPieChartViewModel[] = []
  pieTotal: number = 0
  chart;
  @Input() searchViewModel: DashboardSearchViewModel;

  refresh: EventEmitter<number> = new EventEmitter()

  constructor(private dashBoardService: DashBoardService
    , @Inject(LOCALE_ID) private locale: string) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.GetData()
    this.GetDataByHour()
  }

  ngOnInit() {
    //this.GetData();

  }

  lineChartBrowser() {
    this.chart = HighCharts.chart('containers', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        //  type: 'spline'
      },
      title: {
        text: ""
      },


      plotOptions: {

      },
      yAxis: {
        title: {
          text: 'Number of Orders'
        }
      },
      //   tooltip: {
      //     shared: true,
      //     useHTML: true,
      //     headerFormat: "<small  class='amp-5 bold font-14 text-center d-block'>{point.key}</small><table>",
      //     pointFormat: '<tr><td style="color:{series.color}" class="amp-5 bold ">{series.name}: </td>' +
      //         '<td style="text-align: right"><b>{point.y} Orders</b></td></tr>',
      //     footerFormat: '</table>',
      // //     formatter: function() {
      // // ;
      // //       // return "<small></small><table>"+
      // //       // "<tr><td style='color: {series.color}'>{series.name}: </td>"+
      // //       // "<td style='text-align: right'><b>{point.y} Minutes</b></td></tr>"+
      // //       // "</table>";
      // //     }


      // },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function () {
          let res = `<small class='amp-5 bold font-14 text-center d-block'>${this.x}</small><table>`;
          this.points.forEach(p => {
            let point = p.point as unknown as Point
            let x;
            if (point.SeriesName != "Total")
              x = `<tr ><td style="color: ${point.color}" class="amp-5 bold"> ${point.SeriesName} </td>
             <td style="text-align: right"><b>${point.y} Orders (${point.Percentage??0} %)</b></td></tr>`;
            else
              x = `<tr ><td style="color: ${point.color}" class="amp-5 bold"> ${point.SeriesName} </td>
             <td style="text-align: right"><b>${point.y} Orders</b></td></tr>`;
            res = res.concat(x);
          });
          res += '</table>'
          res = res.concat('</table>');

          return res;
        },
      },
      xAxis: {
        categories: this.sharedStringDate,
        // categories:this.date,
        title: { text: 'Date' },
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

  GetData() {
    this.refresh.emit(1)
    this.dashBoardService.getOrdersLineChart(this.searchViewModel).subscribe(response => {
      if (response.Success) {
        this.seriesDay = []
        this.dataDays = []

        this.stringDate = []
        this.date = []
        this.dataDays = response.Data as OrderLineChartViewModel[];

        this.dataDays.forEach(res => {

          if (!(this.date.indexOf(res.Date) >= 0)) {
            this.date.push(res.Date)
            this.stringDate.push(formatDate(res.Date, 'MM/dd', this.locale))

          }
          if (!this.statusList.includes(res.StatusName)) {
            this.statusList.push(res.StatusName)
          }

        });

        let totalPoints: Point[] = [];

        this.date.forEach(d => {
          let point: number = 0
          var res = this.dataDays.filter(i => i.Date == d).forEach(item => {
            point += item.OrdersCount;
          })
          totalPoints.push({ y: point, SeriesName: "Total", Percentage: 100, color: "blue", hour: 0, Date: d })
        })
        this.seriesDay.push({ name: "Total", data: totalPoints, type: "spline" })

        this.statusList.forEach(status => {
          let points: Point[] = []
          this.date.forEach(d => {
            if (!this.dataDays.some(i => i.Date == d && i.StatusName == status)) {
              points.push({ y: 0, SeriesName: status, Percentage: 0, color: this.getColor(status), Date: d, hour: 0 })
            }
            else {
              var res = this.dataDays.filter(i => i.Date == d && i.StatusName == status)
              points.push({ y: res[0].OrdersCount, SeriesName: status, Percentage: 0, color: this.getColor(status), Date: d, hour: 0 })

            }
          });
          points.forEach(p => {
            let pointY=totalPoints.find(x => x.Date == p.Date).y;
            p.Percentage =pointY? + ((p.y / pointY) * 100).toFixed(0) : 0;
          })
          this.seriesDay.push({ name: status, data: points, type: "column", stacking: "normal", color: this.getColor(status) })

        });

        this.getChartDay();
        this.getPieData();

      }

    });
  }
  GetDataByHour() {

    this.dashBoardService.getOrdersLineChartByHour(this.searchViewModel).subscribe(response => {
      if (response.Success) {
        this.seriesHour = []
        this.dataDays = []
        this.stringHour = []
        this.hour = []
        this.dataHours = response.Data as OrderLineChartByHourViewModel[];

        this.dataHours.forEach(res => {

          if (!(this.hour.indexOf(res.Hour) >= 0)) {
            this.hour.push(res.Hour)
            this.stringHour.push(this.getTimeFormat(res.Hour))

          }
          if (!this.statusList.includes(res.StatusName)) {
            this.statusList.push(res.StatusName)
          }

        });

        let totalPoints: Point[] = [];

        this.hour.forEach(h => {
          let point: number = 0
          var res = this.dataHours.filter(i => i.Hour == h).forEach(item => {
            point += item.OrdersCount;
          })
          totalPoints.push({ y: point, SeriesName: "Total", Percentage: 100, color: "blue", hour: h, Date: null })
        })
        this.seriesHour.push({ name: "Total", data: totalPoints, type: "spline" })

        this.statusList.forEach(status => {
          let points: Point[] = []
          this.hour.forEach(d => {
            if (!this.dataHours.some(i => i.Hour == d && i.StatusName == status)) {
              points.push({ y: 0, SeriesName: status, Percentage: 0, color: this.getColor(status), Date: null, hour: d })
            }
            else {
              var res = this.dataHours.filter(i => i.Hour == d && i.StatusName == status)
              points.push({ y: res[0].OrdersCount, SeriesName: status, Percentage: 0, color: this.getColor(status), Date: null, hour: d })
            }
          });
          points.forEach(p => {
            p.Percentage = + ((p.y / totalPoints.find(x => x.hour == p.hour).y) * 100).toFixed(0)
          })
          this.seriesHour.push({ name: status, data: points, type: "column", stacking: "normal", color: this.getColor(status) })

        });

        this.lineChartBrowser();

      }

    });
  }
  getColor(statusName: string): string {
    // return '#FF0000'
    let color: string
    switch (statusName) {
      case "TOO LATE":
        color = '#CC324C'

        break;
      case "LATE":
        color = '#ffc400'
        break;

      case "GOOD":
        color = '#03A8FF'
        break;

      case "EXCELLENT":
        color = '#32cc3e';
        break;

      case "NOT_RATED":
        color = '#525252'
        break;


    }
    return color;

  }
  getTimeFormat(hour: number): string {
    var time = new Date()
    time.setHours(hour)
    return time.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true }).toUpperCase();
  }
  getChartHour() {
    this.isDayMode = false
    this.sharedStringDate = this.stringHour
    this.series = this.seriesHour;
    setTimeout(() => {
      this.lineChartBrowser();

    }, 100);
  }
  getChartDay() {
    this.isDayMode = true
    this.sharedStringDate = this.stringDate
    this.series = this.seriesDay;
    setTimeout(() => {
      this.lineChartBrowser();
      this.PieChartBinding();
    }, 100);
  }

  PieChartBinding() {

    HighCharts.chart('pieChart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: ` ${this.title} `

      },
      subtitle: {
        text: `<small> Total Order = ${this.pieTotal}</small>`
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
        data: this.pieData
      }]
    });
  }

  getPieData() {
    this.pieData = []
    this.dataDays.forEach(res => {
      if (!this.pieData.map(x => x.name).includes(res.StatusName)) {
        var y = this.dataDays.filter(x => x.StatusName == res.StatusName)
          .map(i => i.OrdersCount)
          .reduce(function (a, b) { return a + b; })
        this.pieData.push({ name: res.StatusName, y: y, Total: 0, color: this.getColor(res.StatusName) })
      }
    })
    this.pieTotal = this.pieData.map(x => x.y).reduce(function (a, b) { return a + b; });
    this.PieChartBinding();
  }


}