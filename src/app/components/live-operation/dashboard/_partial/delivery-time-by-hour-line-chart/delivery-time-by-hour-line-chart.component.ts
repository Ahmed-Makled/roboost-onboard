import { OnInit, Component, Inject, LOCALE_ID, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DashBoardService } from '../../dashboard.service';
import * as HighCharts from 'highcharts';
import { AVGDeliveryTimeByHourLineChartViewModel } from './View-models/delivery-time-by-hour-line-chart.model';
import { Point } from '../delivery-time-line-chart_eqbal/view-models/point-model';
import { DashboardSearchViewModel } from '../../view-models/dashboard-search.model';
@Component({
  selector: 'delivery-time-by-hour-line-chart',
  templateUrl: './delivery-time-by-hour-line-chart.component.html',
})
export class DeliveryTimeByHourLineChartComponent implements OnInit, OnChanges {
  title = 'Operation Chart';
  name = "Status"
  data: AVGDeliveryTimeByHourLineChartViewModel[]
  hour: number[] = [];
  stringHour: string[] = [];
  statusList: string[] = [];
  series: HighCharts.SeriesOptionsType[] = [];
  @Input() searchViewModel: DashboardSearchViewModel;




  constructor(private dashBoardService: DashBoardService,
    @Inject(LOCALE_ID) private locale: string) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.GetData();
  }

  ngOnInit() {



    // this.GetDataa()
  }
  lineChartBrowser() {
    HighCharts.chart('avg-container', {
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
        formatter: function () {
          let numberOfOrders = (this.points[0].point as unknown as Point).NumberOfOrders.toString()
          let numberOfDeliverymen = (this.points[0].point as unknown as Point).NumberOfDeliverymen.toString()
          let res = `<table>`;
          let tr = `
          <tr >
          <td style="color: black" class="amp-5 bold"> Orders </td>
          <td style="text-align: right"><b>${numberOfOrders} </b></td>
          </tr>
          <tr >
          <td style="color: black" class="amp-5 bold"> Deliverymen </td>
          <td style="text-align: right"><b>${numberOfDeliverymen} </b></td>
          </tr>`;
          res = res.concat(tr);
          this.points.forEach(p => {
            let point = p.point as unknown as Point
            let tr = `<tr >
            <td style="color: ${point.color}" class="amp-5 bold"> ${point.SeriesName} </td>
               <td style="text-align: right"><b>${point.y} Minutes</b></td></tr>`;
            res = res.concat(tr);
          });
          // res += '</table>'
          res = res.concat('</table>');

          return res;
        },
      },
      //   tooltip: {
      //      shared: true,
      //       useHTML: true,
      //       headerFormat: "<small class='amp-5 bold font-14 text-center d-block'>{point.x}</small><table>",

      //     // formatter: function() {

      //     //     // return 'Extra data: <b>' + this.point.y + '</b>';
      //     //     console.log(this.points[].NumberOfOrders)
      //     //     return this.point.NumberOfOrders;
      //     // },

      //         //  footerFormat: '</table>',

      // },

      //   tooltip: {


      //     shared: true,
      //     useHTML: true,

      //     headerFormat: "<small class='amp-5 bold font-14 text-center d-block'>{point.NumberOfOrders}</small><table>",
      //     pointFormat: '<tr><td style="color: {series.color}" class="amp-5 bold">{series.name}: </td>' +
      //         '<td style="text-align: right"><b>{point.y} Minutes</b></td></tr>',
      //     footerFormat: '</table>',


      // },
      plotOptions: {
        series: {
        }
      },
      yAxis: {

      },

      xAxis: {
        categories: this.stringHour,
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
                pointWidth: 25,
              }
            }
          }
        }]
      }
    });

  }
  //   lineChartBrowser() {
  //     HighCharts.chart('averagebydatecontainer', {
  //       chart: {
  //         plotBackgroundColor: null,
  //         plotBorderWidth: null,
  //         plotShadow: false,
  //         //type: 'spline'
  //       },
  //       title: {
  //         text: this.title
  //       },
  //     //   tooltip: {
  //     //     valueSuffix: 'Minutes',
  //     //    // backgroundColor:"red"
  //     // },
  //   //   tooltip: {
  //   //     formatter: function() {
  //   //         return 'The value for <b>' + this.x + '</b> is <b>' + this.y + '</b>, in series '+ this.series.name;
  //   //     }
  //   // },
  //   tooltip: {
  //     shared: true,
  //     useHTML: true,
  //     headerFormat: "<small>{point.key}</small><table>",
  //     pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
  //         '<td style="text-align: right"><b>{point.y} Minutes</b></td></tr>',
  //     footerFormat: '</table>',

  // },


  //       plotOptions: {
  //         series: {

  //         }
  //       },
  //       yAxis: {
  //         title: {
  //           text: 'Average Delivery Time'
  //         }
  //       },

  //       xAxis: {
  //         categories: this.stringHour,
  //         // title: { text: 'Day' },
  //         type: 'datetime',
  //         labels: {
  //           format: '{value:%Y-%m-%d}',
  //           rotation: 300,
  //         //  align: 'left'
  //         }
  //       },


  //       series: this.series
  //     });

  //   }
  // GetDataa() {
  //   this.dashBoardService.getAverageDeliveryTime(this.branchID).subscribe(response => {
  //     console.log('dd',response)

  //     if (response.Success) {
  //     }
  //   });
  // }
  GetData() {
    this.dashBoardService.getOrderAvgDeliveryTimeByHour(this.searchViewModel)
      .subscribe(response => {
        if (response.Success) {
          this.data = response.Data as AVGDeliveryTimeByHourLineChartViewModel[];
          this.hour = []
          this.stringHour = []
          this.series = []
          this.data.map(x => x.Hour).forEach(h => {
            this.hour.push(h)
            this.stringHour.push(this.getTimeFormat(h))
          })
          let totalPoints: Point[] = [];

          totalPoints = this.data.map(val => ({
            y: val.AverageDeliveryDuration,
            NumberOfOrders: val.NumberOfOrders,
            color: "",
            SeriesName: " Avg Duration",
            NumberOfDeliverymen: val.NumberOfDeliverymen
          }));
          this.series.push({ name: "Avg Duration", data: totalPoints, type: "spline" })
          let dmAvgPoints: Point[] = this.data.map(val => ({
            y: val.AverageDeliveryManDuration,
            NumberOfOrders: val.NumberOfOrders,
            color: "",
            SeriesName: "Delivery Duration",
            NumberOfDeliverymen: val.NumberOfDeliverymen



          }));
          let integrationAvgPoints: Point[] = this.data.map(val => ({
            y: val.AverageIntegrationDuration,
            NumberOfOrders: val.NumberOfOrders,
            color: "",
            SeriesName: "Pending Duration",
            NumberOfDeliverymen: val.NumberOfDeliverymen



          }));
          let pindingeliveryPoints: Point[] = this.data.map(val => ({
            y: val.AveragePendingDuration,
            NumberOfOrders: val.NumberOfOrders,
            NumberOfDeliverymen: val.NumberOfDeliverymen,

            color: "",
            SeriesName: "Integration Duration"
          }));

          //  console.log(">>",dmAvgPoints)

          this.series.push({ name: "Delivery Duration", data: dmAvgPoints, type: "column", stacking: "normal", color: "#32cc3e" })

          this.series.push({ name: "Pending Duration", data: pindingeliveryPoints, type: "column", stacking: "normal", color: "#ffc400" })

          this.series.push({ name: "Integration Duration ", data: integrationAvgPoints, type: "column", stacking: "normal", color: "#cc324c" })
          this.lineChartBrowser()

        }
      });
  }
  // .subscribe(response => {
  //   if (response.Success) {

  //     this.data = response.Data as AVGDeliveryTimeByHourLineChartViewModel[];
  //     // this.data.forEach(res => {
  //     //   if (!(this.hour.indexOf(res.Hour) >= 0)) {
  //     //     this.hour.push(res.Hour)
  //     //     this.stringHour.push(res.Hour.toString())
  //     //   }
  //     // });
  //     this.series = []
  //     this.hour =[]
  //      this.stringHour = []
  //      this.series=[]
  //     this.data.map(x => x.Hour).forEach(h => {
  //       this.hour.push(h)
  //       this.stringHour.push(this.getTimeFormat(h))
  //     })
  //    // console.log(this.stringHour)
  //     // Total Count Of Trips
  //     let totalPoints: number[] = [];
  //     // this.hour.forEach(d => {
  //     //   let point: number = 0
  //     //   var res = this.data.filter(i => i.Hour == d).forEach(item => {
  //     //     point += item.AverageDeliveryDuration;
  //     //   })
  //     //   totalPoints.push(point)
  //     // })
  //     totalPoints = this.data.map(x=>x.AverageDeliveryDuration)
  //     this.series.push({ name: "Avg Duration", data: totalPoints, type: "spline" })

  //     let dmAvgPoints: number[] = this.data.map(x=>x.AverageDeliveryManDuration);
  //     let integrationAvgPoints: number[] = this.data.map(x=>x.AverageIntegrationDuration);
  //     let pindingeliveryPoints: number[] = this.data.map(x=>x.AveragePendingDuration);
  //     let ordernumbers: number[] = this.data.map(x=>x.NumberOfOrders);


  //     this.series.push({ name: "Delivery Duration", data: dmAvgPoints, type: "column", stacking:"normal" , color:"#32cc3e"})

  //     this.series.push({ name: "Pending Duration", data: pindingeliveryPoints, type: "column", stacking:"normal" , color:"#ffc400" })

  //     this.series.push({ name: "Integration Duration ", data: integrationAvgPoints, type: "column", stacking:"normal", color:"#cc324c" })

  //     // this.series.push({ name: "Number Of Orders ", data: ordernumbers, type: "spline", color:"#cc324c" })


  //     // let points: {}[] = []
  //     //   this.hour.forEach(d => {
  //     //     if (!this.data.some(i => i.Hour == d )) { points.push(res[0].TotalAverageDeliveryTime); }
  //     //     else {
  //     //       var res = this.data.filter(i => i.Hour == d )
  //     //       points.push(res[0].TotalAverageDeliveryTime )
  //     //     }
  //     //   });
  //     //   this.series.push({ name: "Total Avg Time", data: points, type: "spline" })


  //    //   console.log(points)
  //     this.lineChartBrowser();

  //   }

  // });
  //}
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
}