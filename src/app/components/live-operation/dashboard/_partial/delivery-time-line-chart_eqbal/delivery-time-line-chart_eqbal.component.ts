import { OnInit, Component, Inject, LOCALE_ID, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DashBoardService } from '../../dashboard.service';
import * as HighCharts from 'highcharts';
import { AVGDeliveryTimeLineChartViewModel } from './view-models/delivery-time-line-chart.model';
import { Point } from './view-models/point-model';
@Component({
  selector: 'delivery-time-line-chart_eqbal',
  templateUrl: './delivery-time-line-chart_eqbal.component.html',
})
export class DeliveryTimeLineChartEqbalComponent implements OnInit, OnChanges {
  title = '';
  name = "Status"
  dataDays: AVGDeliveryTimeLineChartViewModel[]
  date: Date[] = [];
  sharedStringDate: any[] = []
  stringDate: string[] = [];

  series: HighCharts.SeriesOptionsType[] = [];
  seriesDay: HighCharts.SeriesOptionsType[] = [];
  isDayMode: boolean = true;


  @Input() private branchChange: EventEmitter<number>;


  constructor(private dashBoardService: DashBoardService,
    @Inject(LOCALE_ID) private locale: string) { }
    
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
    this.getData();

    // this.GetData();

    // this.GetDataa()
  }

  lineChartBrowser() {
    HighCharts.chart('avg-eqbal-container', {
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
        formatter: function () {
          let numberOfOrders = (this.points[0].point as unknown as Point).NumberOfOrders.toString()
          let res = `<table>`;
          let tr = `
          <tr >
          <td style="color: black" class="amp-5 bold"> Orders </td>
          <td style="text-align: right"><b>${numberOfOrders} </b></td>
          </tr>
         `;

          // if ((this.points[0].point as unknown as Point).NumberOfDeliverymen != null) {
          //   let numberOfDeliverymen = (this.points[0].point as unknown as Point).NumberOfDeliverymen.toString()
          //   tr = tr.concat(`<tr >
          //   <td style="color: black" class="amp-5 bold"> Deliverymen </td>
          //   <td style="text-align: right"><b>${numberOfDeliverymen} </b></td>
          //   </tr>`)
          // }
          res = res.concat(tr);
          this.points.forEach(p => {
            let point = p.point as unknown as Point
            let tr = `<tr >
            <td style="color: ${point.color}" class="amp-5 bold"> ${point.SeriesName} </td>
               <td style="text-align: right"><b>${point.y} Minutes</b></td></tr>`;
            res = res.concat(tr);
          });
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
                pointWidth: 15,
              }
            }
          }
        }]
      }
    });

  }

  getData() {
    this.dashBoardService.getOrderAvgDeliveryTimeForEqbal().subscribe(response => {
      if (response.Success) {
        this.dataDays = response.Data as AVGDeliveryTimeLineChartViewModel[];
        this.dataDays = this.dataDays.sort((a, b) => (a.AverageDeliveryDuration > b.AverageDeliveryDuration ? -1 : 1));
        this.seriesDay = []
        this.date = []
        this.stringDate = []

        this.dataDays.forEach(i => {
          this.stringDate.push((this.stringDate.length + 1).toString())
        });
        // Total Count Of Trips
        let totalPoints: Point[] = [];

        totalPoints = this.dataDays.map(val => ({
          y: val.AverageDeliveryDuration,
          NumberOfOrders: val.NumberOfOrders,
          NumberOfDeliverymen: val.NumberOfDeliveryMen,

          color: "",
          SeriesName: " Avg Duration"

        }));
        this.seriesDay.push({ name: "Avg Duration", data: totalPoints, type: "spline" })
        let dmAvgPoints: Point[] = this.dataDays.map(val => ({
          y: val.AverageDeliveryDuration,
          NumberOfOrders: val.NumberOfOrders,
          NumberOfDeliverymen: val.NumberOfDeliveryMen,

          color: "",
          SeriesName: "Delivery Duration"


        }));
        // let integrationAvgPoints: Point[] = this.dataDays.map(val => ({
        //   y: val.AverageIntegrationDuration,
        //   NumberOfOrders: val.NumberOfOrders,
        //   NumberOfDeliverymen: val.NumberOfDeliveryMen,

        //   color: "",
        //   SeriesName: "Integration Duration"


        // }));
        // let pindingeliveryPoints: Point[] = this.dataDays.map(val => ({
        //   y: val.AveragePendingDuration,
        //   NumberOfOrders: val.NumberOfOrders,
        //   NumberOfDeliverymen: val.NumberOfDeliveryMen,

        //   color: "",
        //   SeriesName: "Pending Duration"
        // }));
        let ordernumbers: number[] = this.dataDays.map(x => x.NumberOfOrders / 10);

        //  console.log(">>",dmAvgPoints)

        this.seriesDay.push({ name: "Delivery Duration", data: dmAvgPoints, type: "column", stacking: "normal", color: "#32cc3e" })

        // this.seriesDay.push({ name: "Pending Duration", data: pindingeliveryPoints, type: "column", stacking: "normal", color: "#ffc400" })

        // this.seriesDay.push({ name: "Integration Duration ", data: integrationAvgPoints, type: "column", stacking: "normal", color: "#cc324c" })

        // let totalPoints: number[] = [];
        // // this.hour.forEach(d => {
        // //   let point: number = 0
        // //   var res = this.data.filter(i => i.Hour == d).forEach(item => {
        // //     point += item.AverageDeliveryDuration;
        // //   })
        // //   totalPoints.push(point)
        // // })
        // totalPoints = this.dataDays.map(x=>x.AverageDeliveryDuration)
        // this.seriesDay.push({ name: "Avg Duration", data: totalPoints, type: "spline" })

        // let dmAvgPoints: number[] = this.dataDays.map(x=>x.AverageDeliveryManDuration);
        // let integrationAvgPoints: number[] = this.dataDays.map(x=>x.AverageIntegrationDuration);
        // let pindingeliveryPoints: number[] = this.dataDays.map(x=>x.AveragePendingDuration);
        // let ordernumbers: number[] = this.dataDays.map(x=>x.NumberOfOrders/10);


        // this.seriesDay.push({ name: "Delivery Duration", data: dmAvgPoints, type: "column", stacking:"normal" , color:"#32cc3e"})

        // this.seriesDay.push({ name: "Pending Duration", data: pindingeliveryPoints, type: "column", stacking:"normal" , color:"#ffc400" })

        // this.seriesDay.push({ name: "Integration Duration ", data: integrationAvgPoints, type: "column", stacking:"normal", color:"#cc324c" })


        this.getChartDay()
      }

    });
  }

  getTimeFormat(hour: number): string {
    var time = new Date()
    time.setHours(hour)
    return time.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true }).toUpperCase();
  }

  getChartDay() {
    this.isDayMode = true
    this.sharedStringDate = this.stringDate
    this.series = this.seriesDay;
    this.lineChartBrowser();
  }
}