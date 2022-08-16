import { OnInit, Component, Inject, LOCALE_ID, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DashBoardService } from '../../dashboard.service';
import * as HighCharts from 'highcharts';
import { AVGDeliveryTimeByWeekLineChartViewModel } from './View-models/delivery-time-By-week-line-chart.model';
import { Point } from '../delivery-time-line-chart_eqbal/view-models/point-model';
import { DashboardSearchViewModel } from '../../view-models/dashboard-search.model';
@Component({
  selector: 'delivery-time-by-week-line-chart',
  templateUrl: './delivery-time-by-week-line-chart.component.html',
})
export class DeliveryTimeByWeekLineChartComponent implements OnInit, OnChanges {
  title = '';
  name = "Status"
  data: AVGDeliveryTimeByWeekLineChartViewModel[]
  stringWeeks: string[] = [];
  series: HighCharts.SeriesOptionsType[] = [];
  @Input() searchViewModel: DashboardSearchViewModel;
  @Input() private branchChange: EventEmitter<number>;
  constructor(private dashBoardService: DashBoardService,
    @Inject(LOCALE_ID) private locale: string) { }
  ngOnChanges(changes: SimpleChanges): void {
   
    this.GetData()
  }
  ngOnInit() {}
  lineChartBrowser() {
    HighCharts.chart('avg-by-week-container', {
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
      plotOptions: {
        series: {
        }
      },
      yAxis: {

      },

      xAxis: {
        categories: this.stringWeeks,
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
  GetData() {
    this.stringWeeks = []
    this.data = []
    this.series = []
    this.dashBoardService.getOrderAvgDeliveryTimeByWeek(this.searchViewModel).subscribe(response => {
      if (response.Success) {
        this.stringWeeks = []
        this.data = []
        this.series = []
        this.data = response.Data as AVGDeliveryTimeByWeekLineChartViewModel[];
        this.data.map(x => ({ Year: x.Year, week: x.Week })).forEach(i => {
          this.stringWeeks.push((this.stringWeeks.length + 1).toString())
        });
        let totalPoints: Point[] = [];
        totalPoints = this.data.map(val => ({
          y: val.AverageDeliveryDuration,
          NumberOfOrders: val.NumberOfOrders,
          color: "",
          SeriesName: " Avg Duration",
          NumberOfDeliverymen: null

        }));
        this.series.push({ name: "Avg Duration", data: totalPoints, type: "spline" })
        let dmAvgPoints: Point[] = this.data.map(val => ({
          y: val.AverageDeliveryManDuration,
          NumberOfOrders: val.NumberOfOrders,
          color: "",
          SeriesName: "Delivery Duration",
          NumberOfDeliverymen: null
        }));
        // let integrationAvgPoints: Point[] = this.data.map(val => ({
        //   y: val.AverageIntegrationDuration,
        //   NumberOfOrders: val.NumberOfOrders,
        //   color: "",
        //   SeriesName: " Integration Duration",
        //   NumberOfDeliverymen: null
        // }));
        let pindingeliveryPoints: Point[] = this.data.map(val => ({
          y: val.AveragePendingDuration,
          NumberOfOrders: val.NumberOfOrders,
          NumberOfDeliverymen: null,
          color: "",
          SeriesName: "Pending Duration"
        }));
        this.series.push({ name: "Delivery Duration", data: dmAvgPoints, type: "column", stacking: "normal", color: "#32cc3e" })
        this.series.push({ name: "Pending Duration", data: pindingeliveryPoints, type: "column", stacking: "normal", color: "#ffc400" })
        // this.series.push({ name: "Integration Duration ", data: integrationAvgPoints, type: "column", stacking: "normal", color: "#cc324c" })
        this.lineChartBrowser();
      }
    });
  }
 
}