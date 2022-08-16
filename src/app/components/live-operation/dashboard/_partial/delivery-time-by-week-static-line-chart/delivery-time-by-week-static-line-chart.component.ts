import { OnInit, Component, Inject, LOCALE_ID, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DashBoardService } from '../../dashboard.service';
import * as HighCharts from 'highcharts';
import { Point } from '../delivery-time-line-chart_eqbal/view-models/point-model';
@Component({
  selector: 'delivery-time-by-week-static-line-chart',
  templateUrl: './delivery-time-by-week-static-line-chart.component.html',
})
export class DeliveryTimeByWeekStaticLineChartComponent implements OnInit, OnChanges {
  title = '';
  name = "Status"
  stringWeeks: string[] = [];
  series: HighCharts.SeriesOptionsType[] = [];

  @Input() private branchChange: EventEmitter<number>;
  constructor(private dashBoardService: DashBoardService,
    @Inject(LOCALE_ID) private locale: string) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.GetSataticData();
    // this.GetData()
  }
  ngOnInit() {
    this.GetSataticData();

  }

  StaticlineChartBrowser() {
    HighCharts.chart('avg-by-week-static-container', {
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
          let res = `<table>`;
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
  GetSataticData() {
    this.series = []
    this.stringWeeks = []
    var data: number[] = [53, 40, 38, 38, 36, 35, 34, 33, 32, 30.5, 29, 28, 28, 29, 29, 28, 27, 29]
    data.forEach(i => {
      this.stringWeeks.push((this.stringWeeks.length + 1).toString())
    })
    let dmAvgPoints: Point[] = data.map(val => ({
      y: val,
      NumberOfOrders: 0,
      color: "",
      SeriesName: "Delivery Duration",
      NumberOfDeliverymen: null
    }));
    this.series.push({ name: "Delivery Duration", data: dmAvgPoints, type: "column", stacking: "normal", color: "#32cc3e" })
    this.StaticlineChartBrowser()
  }
}