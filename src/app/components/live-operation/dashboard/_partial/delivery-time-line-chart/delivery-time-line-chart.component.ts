import {OnInit,Component,Inject,LOCALE_ID,Input,EventEmitter,OnChanges,SimpleChanges,} from '@angular/core';
import { DashBoardService } from '../../dashboard.service';
import * as HighCharts from 'highcharts';
import { formatDate } from '@angular/common';
import { AVGDeliveryTimeLineChartViewModel } from './View-models/delivery-time-line-chart.model';
import { AVGDeliveryTimeByHourLineChartViewModel } from '../delivery-time-by-hour-line-chart/View-models/delivery-time-by-hour-line-chart.model';
import { Point } from '../delivery-time-line-chart_eqbal/view-models/point-model';
import { DashboardSearchViewModel } from '../../view-models/dashboard-search.model';
@Component({
  selector: 'delivery-time-line-chart',
  templateUrl: './delivery-time-line-chart.component.html',
})
export class DeliveryTimeLineChartComponent implements OnInit, OnChanges {
  title = '';
  name = 'Status';
  dataDays: AVGDeliveryTimeLineChartViewModel[];
  dataHours: AVGDeliveryTimeByHourLineChartViewModel[];
  date: Date[] = [];
  sharedStringDate: any[] = [];
  stringDate: string[] = [];
  hour: number[] = [];
  stringHour: string[] = [];
  series: HighCharts.SeriesOptionsType[] = [];
  seriesHour: HighCharts.SeriesOptionsType[] = [];
  seriesDay: HighCharts.SeriesOptionsType[] = [];
  isDayMode: boolean = true;
  @Input() searchViewModel: DashboardSearchViewModel;

  @Input() private branchChange: EventEmitter<number>;

  constructor(
    private dashBoardService: DashBoardService,
    @Inject(LOCALE_ID) private locale: string
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.GetData();
    this.getData();
  }

  ngOnInit() {
    // this.GetData();
    // this.GetDataa()
  }

  lineChartBrowser() {
    HighCharts.chart('avg-container', {
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
        categories: this.sharedStringDate,
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
    this.dashBoardService.getOrderAvgDeliveryTime(this.searchViewModel).subscribe((response) => {
        if (response.Success) {
          this.dataDays = response.Data as AVGDeliveryTimeLineChartViewModel[];
          this.seriesDay = [];
          this.date = [];
          this.stringDate = [];

          this.dataDays
            .map((x) => x.Date)
            .forEach((h) => {
              this.date.push(h);
              this.stringDate.push(formatDate(h, 'MM/dd', this.locale));
            });
          // Total Count Of Trips
          let totalPoints: Point[] = [];

          totalPoints = this.dataDays.map((val) => ({
            y: val.AverageDeliveryDuration,
            NumberOfOrders: val.NumberOfOrders,
            NumberOfDeliverymen: val.NumberOfDeliveryMen,

            color: '',
            SeriesName: ' Avg Duration',
          }));
          this.seriesDay.push({
            name: 'Avg Duration',
            data: totalPoints,
            type: 'spline',
          });
          let dmAvgPoints: Point[] = this.dataDays.map((val) => ({
            y: val.AverageDeliveryManDuration,
            NumberOfOrders: val.NumberOfOrders,
            NumberOfDeliverymen: val.NumberOfDeliveryMen,

            color: '',
            SeriesName: 'Delivery Duration',
          }));
          let integrationAvgPoints: Point[] = this.dataDays.map((val) => ({
            y: val.AverageIntegrationDuration,
            NumberOfOrders: val.NumberOfOrders,
            NumberOfDeliverymen: val.NumberOfDeliveryMen,

            color: '',
            SeriesName: 'Integration Duration',
          }));
          let pindingeliveryPoints: Point[] = this.dataDays.map((val) => ({
            y: val.AveragePendingDuration,
            NumberOfOrders: val.NumberOfOrders,
            NumberOfDeliverymen: val.NumberOfDeliveryMen,

            color: '',
            SeriesName: 'Pending Duration',
          }));
          let ordernumbers: number[] = this.dataDays.map(
            (x) => x.NumberOfOrders / 10
          );

          //  console.log(">>",dmAvgPoints)
          let waitingDurationPoint: Point[] = this.dataDays.map((val) => ({
            y: val.WaitingDuration,
            NumberOfOrders: val.NumberOfOrders,
            NumberOfDeliverymen: val.NumberOfDeliveryMen,

            color: '',
            SeriesName: 'Waiting Duration',
          }));

          this.seriesDay.push({
            name: 'Delivery Duration',
            data: dmAvgPoints,
            type: 'column',
            stacking: 'normal',
            color: '#32cc3e',
          });
          if (!waitingDurationPoint.every((v) => v.y === 0))
            this.seriesDay.push({
              name: 'Waiting Duration ',
              data: waitingDurationPoint,
              type: 'column',
              stacking: 'normal',
              color: '#03A8FF',
            });
          this.seriesDay.push({
            name: 'Pending Duration',
            data: pindingeliveryPoints,
            type: 'column',
            stacking: 'normal',
            color: '#ffc400',
          });
          this.seriesDay.push({
            name: 'Integration Duration ',
            data: integrationAvgPoints,
            type: 'column',
            stacking: 'normal',
            color: '#CC324C',
          });
          this.getChartDay();
        }
      });
  }
  GetData() {
    this.dashBoardService
      .getOrderAvgDeliveryTimeByHour(this.searchViewModel)
      .subscribe((response) => {
        if (response.Success) {
          this.dataHours =
            response.Data as AVGDeliveryTimeByHourLineChartViewModel[];
          this.hour = [];
          this.stringHour = [];
          this.seriesHour = [];
          this.dataHours
            .map((x) => x.Hour)
            .forEach((h) => {
              this.hour.push(h);
              this.stringHour.push(this.getTimeFormat(h));
            });
          let totalPoints: Point[] = [];

          totalPoints = this.dataHours.map((val) => ({
            y: val.AverageDeliveryDuration,
            NumberOfOrders: val.NumberOfOrders,
            color: '',
            SeriesName: ' Avg Duration',
            NumberOfDeliverymen: null,
          }));
          this.seriesHour.push({
            name: 'Avg Duration',
            data: totalPoints,
            type: 'spline',
          });
          let dmAvgPoints: Point[] = this.dataHours.map((val) => ({
            y: val.AverageDeliveryManDuration,
            NumberOfOrders: val.NumberOfOrders,
            color: '',
            SeriesName: 'Delivery Duration',
            NumberOfDeliverymen: null,
          }));
          let integrationAvgPoints: Point[] = this.dataHours.map((val) => ({
            y: val.AverageIntegrationDuration,
            NumberOfOrders: val.NumberOfOrders,
            color: '',
            SeriesName: ' Integration Duration',
            NumberOfDeliverymen: null,
          }));
          let pindingeliveryPoints: Point[] = this.dataHours.map((val) => ({
            y: val.AveragePendingDuration,
            NumberOfOrders: val.NumberOfOrders,
            NumberOfDeliverymen: null,
            color: '',
            SeriesName: 'Pending Duration',
          }));
          let ordernumbers: number[] = this.dataHours.map(
            (x) => x.NumberOfOrders / 10
          );
          let waitingDurationPoint: Point[] = this.dataHours.map((val) => ({
            y: val.WaitingDuration,
            NumberOfOrders: val.NumberOfOrders,
            NumberOfDeliverymen: null,
            color: '',
            SeriesName: 'Waiting Duration',
          }));
          this.seriesHour.push({
            name: 'Delivery Duration',
            data: dmAvgPoints,
            type: 'column',
            stacking: 'normal',
            color: '#32cc3e',
          });

          if (!waitingDurationPoint.every((v) => v.y === 0))
            this.seriesHour.push({
              name: 'Waiting Duration ',
              data: waitingDurationPoint,
              type: 'column',
              stacking: 'normal',
              color: '#03A8FF',
            });

          this.seriesHour.push({
            name: 'Pending Duration',
            data: pindingeliveryPoints,
            type: 'column',
            stacking: 'normal',
            color: '#ffc400',
          });

          this.seriesHour.push({
            name: 'Integration Duration ',
            data: integrationAvgPoints,
            type: 'column',
            stacking: 'normal',
            color: '#CC324C',
          });
        }
      });
  }
  getTimeFormat(hour: number): string {
    var time = new Date();
    time.setHours(hour);
    return time
      .toLocaleTimeString('en-US', { hour: '2-digit', hour12: true })
      .toUpperCase();
  }
  getChartHour() {
    this.isDayMode = false;
    this.sharedStringDate = this.stringHour;
    this.series = this.seriesHour;
    this.lineChartBrowser();
  }
  getChartDay() {
    this.isDayMode = true;
    this.sharedStringDate = this.stringDate;
    this.series = this.seriesDay;
    this.lineChartBrowser();
  }
}
