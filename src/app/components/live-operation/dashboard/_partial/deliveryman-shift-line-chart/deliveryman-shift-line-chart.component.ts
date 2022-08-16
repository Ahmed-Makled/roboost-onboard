import { OnInit, Component, Inject, LOCALE_ID, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DashBoardService } from '../../dashboard.service';
import * as HighCharts from 'highcharts';
import { formatDate } from '@angular/common';
import { DeliverymanShiftLineChartViewModel } from './view-models/deliveryman-shift-line-chart.model';
import { DeliverymanShiftLineChartByHourViewModel } from './view-models/deliveryman-shift-line-chart-by-hour.model';
import { DashboardSearchViewModel } from '../../view-models/dashboard-search.model';
@Component({
  selector: 'deliveryman-shift-line-chart',
  templateUrl: './deliveryman-shift-line-chart.component.html',
})
export class DeliverymanShiftLineChartComponent implements OnInit, OnChanges {
  // title = 'Orders Chart';
  name = "Status"
  // data: OrderLineChartViewModel[]
  statusList: string[] = [];
  dataDays: DeliverymanShiftLineChartViewModel[] = []
  dataHours: DeliverymanShiftLineChartByHourViewModel[] = []
  date: Date[] = [];
  sharedStringDate: any[] = []
  stringDate: string[] = [];
  hour: number[] = [];
  stringHour: string[] = [];
  series: HighCharts.SeriesOptionsType[] = [];
  seriesHour: HighCharts.SeriesOptionsType[] = [];
  seriesDay: HighCharts.SeriesOptionsType[] = [];
  isDayMode: boolean = true;

  chart;
  @Input() searchViewModel: DashboardSearchViewModel;
  refresh: EventEmitter<number> = new EventEmitter()

  constructor(private dashBoardService: DashBoardService
    , @Inject(LOCALE_ID) private locale: string) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.GetData(0)
    this.GetDataByHour()
  }

  ngOnInit() {
    //this.GetData();

  }

  lineChartBrowser() {
    this.chart = HighCharts.chart('dmLineChart', {
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
          text: 'Hours'
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
        // formatter: function () {
        //   let res = `<small class='amp-5 bold font-14 text-center d-block'>${this.x}</small><table>`;
        //   this.points.forEach(p => {
        //     let point = p.point as unknown as Point
        //     let x;
        //     if (point.SeriesName != "Total")
        //       x = `<tr ><td style="color: ${point.color}" class="amp-5 bold"> ${point.SeriesName} </td>
        //        <td style="text-align: right"><b>${point.y} Orders (${point.Percentage} %)</b></td></tr>`;
        //     else
        //       x = `<tr ><td style="color: ${point.color}" class="amp-5 bold"> ${point.SeriesName} </td>
        //        <td style="text-align: right"><b>${point.y} Orders</b></td></tr>`;
        //     res = res.concat(x);
        //   });
        //   res += '</table>'
        //   res = res.concat('</table>');

        //   return res;
        // },
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

  GetData(x) {
    if (+x == 1)
      this.refresh.emit(1)
    this.dashBoardService.getDeliverymanShiftLineChart(this.searchViewModel).subscribe(response => {
      if (response.Success) {
        this.dataDays = response.Data as DeliverymanShiftLineChartViewModel[];
        this.seriesDay = []
        this.date = []
        this.stringDate = []
        this.dataDays.map(x => x.Date).forEach(d => {
          this.date.push(d)
          this.stringDate.push(formatDate(d, 'MM/dd', this.locale))
        })

        this.dataDays.map(x => x.Date).forEach(h => {
          this.date.push(h)
          this.stringDate.push(formatDate(h, 'MM/dd', this.locale))
        })
        // Total Count Of Trips
        let totalPoints: number[] = [];

        totalPoints = this.dataDays.map(x => x.ShiftDuration)
        this.seriesDay.push({ name: "Shift Duration", data: totalPoints, type: "spline" })

        let dmOnDutyPoints: number[] = this.dataDays.map(x => x.OnDutyDuration);
        let dmAvailablePoints: number[] = this.dataDays.map(x => x.AvailableDuration);
        let dmBreakPoints: number[] = this.dataDays.map(x => x.BreakDuration);
        let dmPenalizePoints: number[] = this.dataDays.map(x => x.PenalizeDuration);


        this.seriesDay.push({ name: "On Duty Duration", data: dmOnDutyPoints, type: "column", stacking: "normal", color: "#03A8FF" })
        this.seriesDay.push({ name: "Available Duration", data: dmAvailablePoints, type: "column", stacking: "normal", color: "#32cc3e" })
        this.seriesDay.push({ name: "Break Duration ", data: dmBreakPoints, type: "column", stacking: "normal", color: "#ffc400" })
        this.seriesDay.push({ name: "Penalize Duration ", data: dmPenalizePoints, type: "column", stacking: "normal", color: "#525252" })


        this.getChartDay();
      }

    });
  }
  GetDataByHour() {

    this.dashBoardService.getDeliverymanShiftByHourLineChart(this.searchViewModel).subscribe(response => {
      if (response.Success) {
        this.seriesHour = []
        this.dataDays = []
        this.stringHour = []
        this.hour = []
        this.dataHours = response.Data as DeliverymanShiftLineChartByHourViewModel[];
        this.dataHours.map(x => x.Hour).forEach(d => {
          this.hour.push(d)
          this.stringHour.push(this.getTimeFormat(d))
        })
        // Total Count Of Trips
        let totalPoints: number[] = [];

        totalPoints = this.dataHours.map(x => x.ShiftDuration)
        this.seriesHour.push({ name: "Shift Duration", data: totalPoints, type: "spline" })

        let dmOnDutyPoints: number[] = this.dataHours.map(x => x.OnDutyDuration);
        let dmAvailablePoints: number[] = this.dataHours.map(x => x.AvailableDuration);
        let dmBreakPoints: number[] = this.dataHours.map(x => x.BreakDuration);
        let dmPenalizePoints: number[] = this.dataHours.map(x => x.PenalizeDuration);


        this.seriesHour.push({ name: "On Duty Duration", data: dmOnDutyPoints, type: "column", stacking: "normal", color: "#03A8FF" })
        this.seriesHour.push({ name: "Available Duration", data: dmAvailablePoints, type: "column", stacking: "normal", color: "#32cc3e" })
        this.seriesHour.push({ name: "Break Duration ", data: dmBreakPoints, type: "column", stacking: "normal", color: "#ffc400" })
        this.seriesHour.push({ name: "Penalize Duration ", data: dmPenalizePoints, type: "column", stacking: "normal", color: "#525252" })


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
    this.isDayMode = true
    this.sharedStringDate = this.stringHour
    this.series = this.seriesHour;

    setTimeout(() => {
      this.lineChartBrowser();

    }, 100);
  }
  getChartDay() {
    this.isDayMode = false
    this.sharedStringDate = this.stringDate
    this.series = this.seriesDay;
    setTimeout(() => {
      this.lineChartBrowser();

    }, 100);
  }

}