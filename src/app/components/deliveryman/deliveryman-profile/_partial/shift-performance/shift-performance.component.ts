import { Component, Inject, Input, LOCALE_ID, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as HighCharts from 'highcharts';
import { OnDuutyViewModel } from './view-models/on-duty-view-model';
import { formatDate } from '@angular/common';
import { DeliverymanService } from '../../../home/deliveryman.service';
@Component({
  selector: 'shift-performance',
  templateUrl: './shift-performance.component.html',
})
export class ShiftPerformanceComponent implements OnInit, OnChanges {
  deliverymanID: number = 0
  @Input() numOfDays: number
  stringDate: string[] = [];
  series: HighCharts.SeriesOptionsType[] = [];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _deliverymanService: DeliverymanService,
    @Inject(LOCALE_ID) private locale: string
  ) { }
  ngOnChanges(): void {
    this.getOnDuty()
  }
  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.deliverymanID = +params.get("id");
        this.getOnDuty()
      }
    })
  }
  onDutyLineChartPopulation() {
    HighCharts.chart('onDutyContainers', {
      chart: {
        type: 'column'
      },
      xAxis: {
        categories: this.stringDate,
        type: 'datetime',
        title: {
          text: 'Date',
        },
        labels: {
          format: '{value:%Y-%m-%d}',
          rotation: 60,
          align: 'left'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'On Duty Time in Hours',
        },
      },
      // tooltip: {
      //   valueSuffix: ' millions'
      // },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
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
  getOnDuty() {
    let onDutyData: OnDuutyViewModel[] = [];
    let date: Date[] = [];
    this.series = [];
    this.stringDate = []
    this._deliverymanService.getDeliverymanOnDutyLineChart(this.deliverymanID, this.numOfDays).subscribe(res => {
      if (res.Success) {
        onDutyData = res.Data as OnDuutyViewModel[];
        onDutyData.forEach(res => {
          if (!(date.indexOf(res.Date) >= 0)) {
            date.push(res.Date)
            this.stringDate.push(formatDate(res.Date, 'MM/dd', this.locale))
          }
        });
        // Total Count Of branch Orders
        let dmPoints: number[] = [];
        date.forEach(d => {
          let point: number = 0
          var res = onDutyData.filter(i => i.Date == d).forEach(item => {
            dmPoints.push(item.OnDutyTime)
          })
        })
        this.series.push({ name: "onDutyTime", showInLegend: false, data: dmPoints, stacking: "normal", type: undefined, color: 'rgb(124, 181, 236)' })
        // count for Deliveryman Orders
      }
      this.onDutyLineChartPopulation();
    })
  }
  changeNumOfDays(numOfDays) {
    this.numOfDays = + numOfDays
    this.getOnDuty();
  }
}
