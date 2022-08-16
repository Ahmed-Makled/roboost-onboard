import { OnInit, Component, Inject, LOCALE_ID, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DashBoardService } from '../../dashboard.service';
import * as HighCharts from 'highcharts';
import { formatDate } from '@angular/common';
import { DeliverymanCountOnShiftChartViewModel } from './View-models/deliveryman-count-on-shift-time-line-chart.model';
import { DashboardSearchViewModel } from '../../view-models/dashboard-search.model';
@Component({
  selector: 'deliveryman-count-on-shift-time-line-chart',
  templateUrl: './deliveryman-count-on-shift-time-line-chart.component.html',
})
export class DeliverymanCountOnShiftLineChartComponent implements OnInit, OnChanges {
  title = '';
  name = "Status"
  // dataDays: DeliverymanCountOnShiftChartViewModel[]
  dataHours: DeliverymanCountOnShiftChartViewModel[]
  date: Date[] = [];
  sharedStringDate: any[] = []
  stringDate: string[] = [];
  hour: number[] = [];
  stringHour: string[] = [];
  series: HighCharts.SeriesOptionsType[] = [];
  seriesHour: HighCharts.SeriesOptionsType[] = [];
  seriesDay: HighCharts.SeriesOptionsType[] = [];
  isDayMode: boolean = true;
  @Input() searchViewModel: DashboardSearchViewModel;

  @Input() private branchChange: EventEmitter<number>;


  constructor(private dashBoardService: DashBoardService,
    @Inject(LOCALE_ID) private locale: string) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.GetData();
    //this.getData();
  }

  ngOnInit() {

  }

  lineChartBrowser() {
    HighCharts.chart('count-container', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        //  type: 'spline'
      },
      title: {
        text: this.title
      },

      tooltip: {
        shared: true,
        useHTML: true,
        
        headerFormat: "<small  class='amp-5 bold font-14 text-center d-block'>{point.key}</small><table>",
        pointFormat: '<tr><td style="color:{series.color}" class="amp-5 bold">{series.name}: </td>' +
          '<td style="text-align: left"><b> {point.y} </b></td></tr>',
        footerFormat: '</table>',
        //     formatter: function() {
        // ;
        //       // return "<small></small><table>"+
        //       // "<tr><td style='color: {series.color}'>{series.name}: </td>"+
        //       // "<td style='text-align: right'><b>{point.y} Minutes</b></td></tr>"+
        //       // "</table>";
        //     }


      },
      plotOptions: {
        series: {

        }
      },
      yAxis: {

      },

      xAxis: {
        categories: this.sharedStringDate,
        // title: { text: 'Day' },
        type: 'datetime',
        labels: {
          format: '{value:%Y-%m-%d}',
          rotation: 60,
          align: 'left',
          padding: 0,

        }
      },


      series: this.series,
      responsive: {
        rules: [{
          condition: {
            maxWidth: 10,

          },
          chartOptions: {
            plotOptions: {
              column: {
                pointWidth: 10,
              }
            }
          }
        }]
      }
    });

  }
  // GetDataa() {
  //   this.dashBoardService.getAverageDeliveryTime(this.branchID).subscribe(response => {
  //     console.log('dd',response)

  //     if (response.Success) {
  //     }
  //   });
  // }
  GetData() {

    this.dashBoardService.getDeliverymanOnShiftByHour(this.searchViewModel).subscribe(response => {
      if (response.Success) {
        this.dataHours = response.Data as DeliverymanCountOnShiftChartViewModel[];
        this.seriesDay = []
        this.date = []
        this.stringDate = []
        this.dataHours.map(x => x.Hour).forEach(d => {
          this.stringDate.push(this.getTimeFormat(d))
        })
        //  console.log(this.dataHours)
        // Total Count Of Trips
        let totalPoints: number[] = [];
      
        totalPoints = this.dataHours.map(x => x.DeliverymenCount)
        let dmAvgPoints: number[] = this.dataHours.map(x => x.OrderCount);
        this.seriesDay.push({ name: "Orders Count", data: dmAvgPoints, type: "column", color: "#FB7D45", pointPadding: 0 ,tooltip:{valueSuffix:" Order"}})
        // this.seriesDay.push({ name: "", data: dmAvgPoints, type: "spline", pointPadding: 0 })
        this.seriesDay.push({ name: "Deliverymen Count", data: totalPoints, type: "column", color: "#005D8E", pointPadding: 0 ,tooltip:{valueSuffix:" Deliveryman"}})
        // this.seriesDay.push({ name: "", data: totalPoints, type: "spline", pointPadding: 0 })

        this.getChartDay();
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
    this.lineChartBrowser();
  }
  getChartDay() {
    this.isDayMode = false
    this.sharedStringDate = this.stringDate
    this.series = this.seriesDay;
    this.lineChartBrowser();
  }
}