import { OnInit, Component, Inject, LOCALE_ID, Input, EventEmitter, OnChanges, SimpleChanges, } from '@angular/core';
import { DashBoardService } from '../../dashboard.service';
import * as HighCharts from 'highcharts';
import { formatDate } from '@angular/common';
import { AVGDeliveryTimeChartByBranchHomeViewModel } from './View-models/delivery-time-line-chart-by-branch.model'
import { Point } from '../delivery-time-line-chart_eqbal/view-models/point-model';
import { DashboardSearchViewModel } from '../../view-models/dashboard-search.model';
@Component({
  selector: 'delivery-time-chart-by-branch',
  templateUrl: './delivery-time-line-chart-by-branch.component.html',
})
export class DeliveryTimeChartByBranchComponent implements OnInit, OnChanges {
  title = '';
  data: AVGDeliveryTimeChartByBranchHomeViewModel[] = [];
  sharedStringDate: any[] = [];
  branchesName: string[] = [];
  series: HighCharts.SeriesOptionsType[] = [];
  @Input() searchViewModel: DashboardSearchViewModel;
  @Input() private branchChange: EventEmitter<number>;

  constructor(
    private dashBoardService: DashBoardService,
    @Inject(LOCALE_ID) private locale: string
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.getData();
    // this.getData();
  }

  ngOnInit() {

  }

  lineChartBrowser() {
    HighCharts.chart('avg-by-branch', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
      },
      title: {
        text: this.title,
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function () {
          let numberOfOrders = (
            this.points[0].point as unknown as Point
          ).NumberOfOrders.toString();
          let res = `<table>`;
          let tr = `
          <tr >
          <td style="color: black" class="amp-5 bold"> Orders </td>
          <td style="text-align: right"><b>${numberOfOrders} </b></td>
          </tr>
         `;

          res = res.concat(tr);
          this.points.forEach((p) => {
            let point = p.point as unknown as Point;
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
        series: {},
      },
      yAxis: {},

      xAxis: {
        categories: this.branchesName,
        // title: { text: 'Day' },
        type: 'datetime',
        labels: {
          format: '{value:%Y-%m-%d}',
          rotation: 60,
          align: 'left',
        },
      },

      series: this.series,

      responsive: {
        rules: [
          {
            condition: {
              // maxWidth: 25,
            },
            chartOptions: {
              plotOptions: {
                column: {
                  pointWidth: 25,
                },
              },
            },
          },
        ],
      },
    });
  }

  getData() {
    this.dashBoardService
      .getOrderAvgDeliveryTimeByBranch(this.searchViewModel)
      .subscribe((response) => {
        if (response.Success) {
          this.data = response.Data as AVGDeliveryTimeChartByBranchHomeViewModel[];

          this.branchesName = [];
          this.series = [];

          this.data
            .map((x) => x.BranchName)
            .forEach((h) => {
              // this.date.push(h);
              this.branchesName.push(h);
            });
          // Total Count Of Trips
          let totalPoints: Point[] = [];

          totalPoints = this.data.map((val) => ({
            y: val.AverageDeliveryDuration,
            NumberOfOrders: val.NumberOfOrders,
            NumberOfDeliverymen: val.NumberOfDeliveryMen,

            color: '',
            SeriesName: ' Avg Duration',
          }));
          this.series.push({
            name: 'Avg Duration',
            data: totalPoints,
            type: 'spline',
          });
          let dmAvgPoints: Point[] = this.data.map((val) => ({
            y: val.AverageDeliveryManDuration,
            NumberOfOrders: val.NumberOfOrders,
            NumberOfDeliverymen: val.NumberOfDeliveryMen,

            color: '',
            SeriesName: 'Delivery Duration',
          }));
          let integrationAvgPoints: Point[] = this.data.map((val) => ({
            y: val.AverageIntegrationDuration,
            NumberOfOrders: val.NumberOfOrders,
            NumberOfDeliverymen: val.NumberOfDeliveryMen,

            color: '',
            SeriesName: 'Integration Duration',
          }));
          let pindingeliveryPoints: Point[] = this.data.map((val) => ({
            y: val.AveragePendingDuration,
            NumberOfOrders: val.NumberOfOrders,
            NumberOfDeliverymen: val.NumberOfDeliveryMen,

            color: '',
            SeriesName: 'Pending Duration',
          }));
          let ordernumbers: number[] = this.data.map(
            (x) => x.NumberOfOrders / 10
          );

          //  console.log(">>",dmAvgPoints)
          let waitingDurationPoint: Point[] = this.data.map((val) => ({
            y: val.WaitingDuration,
            NumberOfOrders: val.NumberOfOrders,
            NumberOfDeliverymen: val.NumberOfDeliveryMen,

            color: '',
            SeriesName: 'Waiting Duration',
          }));

          this.series.push({
            name: 'Delivery Duration',
            data: dmAvgPoints,
            type: 'column',
            stacking: 'normal',
            color: '#32cc3e',
          });
          if (!waitingDurationPoint.every((v) => v.y === 0))
            this.series.push({
              name: 'Waiting Duration ',
              data: waitingDurationPoint,
              type: 'column',
              stacking: 'normal',
              color: '#03A8FF',
            });
          this.series.push({
            name: 'Pending Duration',
            data: pindingeliveryPoints,
            type: 'column',
            stacking: 'normal',
            color: '#ffc400',
          });
          this.series.push({
            name: 'Integration Duration ',
            data: integrationAvgPoints,
            type: 'column',
            stacking: 'normal',
            color: '#CC324C',
          });
          this.lineChartBrowser();
        }
      });
  }


}
