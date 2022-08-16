import { Component, Inject, Input, LOCALE_ID, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripPerformaneViewModel } from './view-models/trip-perfotmance.model';
import { OrderPerformaneViewModel } from './view-models/order-perfotmance.model';
import * as HighCharts from 'highcharts';
import { formatDate } from '@angular/common';
import { DMTripLineChartViewModel } from './view-models/deliveryman-trips-linechart.model';
import { DMOrderLineChartViewModel } from './view-models/deliveryman-order-linecart.model';
import { OrderHomeService } from 'src/app/components/order/home/home.service';
import { TripService } from 'src/app/components/trip/home/home.service';
import { DeliverymanService } from '../../../home/deliveryman.service';
import { SharedService } from 'src/app/service/shared.service';
import { StatusUtilsService } from 'src/app/service/status.service';


@Component({
  selector: 'performance',
  templateUrl: './performance.component.html',
  // styleUrls: [ './performance.component.css']
})
export class PerformanceComponent implements OnInit, OnChanges {

  deliverymanID: number = 0
  totalDMTrips: number = 0
  totalBranchTrips: number = 0
  totalTripPercentage: number = 0
  totalDMOrders: number = 0
  totalBranchOrders: number = 0
  totalOrderPercentage: number = 0
  // tripNnumOfDays:number=30
  // orderNnumOfDays:number=30
  tripsPerfomanceData: TripPerformaneViewModel[] = []
  ordersPerfomanceData: OrderPerformaneViewModel[] = []
  tripData: DMTripLineChartViewModel[]
  tripDate: Date[] = [];
  tripStringDate: string[] = [];
  tripstatusList: string[] = [];
  tripSeries: HighCharts.SeriesOptionsType[] = [];
  orderData: DMOrderLineChartViewModel[]
  orderDate: Date[] = [];
  orderStringDate: string[] = [];
  orderStatusList: string[] = [];
  orderSeries: HighCharts.SeriesOptionsType[] = [];
  @Input() numOfDays: number

  constructor(
    private activatedRoute: ActivatedRoute,
    private _deliverymanService: DeliverymanService,
    private _tripService: TripService,
    private _statusUtilsService: StatusUtilsService,

    @Inject(LOCALE_ID) private locale: string
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit()
    this.getTripPerformanceData();
    this.getOrderPerformanceData()
    this.GetTripLineChartData()
    this.getOrderLineChartData();
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.deliverymanID = +params.get("id");
      }
    })
  }

  getTripPerformanceData() {
    this.totalTripPercentage = 0
    this.totalDMTrips = 0
    this.totalBranchTrips = 0
    this._deliverymanService.getTripPerformanceData(this.deliverymanID, this.numOfDays).subscribe(res => {
      if (res.Success) {
        this.tripsPerfomanceData = res.Data;
        this.totalDMTrips = this.tripsPerfomanceData[0]?.Total;
        this.totalBranchTrips = this.tripsPerfomanceData[0]?.BranchTotal
        this.totalTripPercentage = (this.tripsPerfomanceData[0]?.Total / this.tripsPerfomanceData[0]?.BranchTotal) * 100
        this.tripsPerfomanceData.forEach(item => {
          item.Color = this._tripService.getColors(item.Rate)
        })
      }
    })
  }
  getOrderPerformanceData() {
    this.totalOrderPercentage = 0
    this.totalDMOrders = 0
    this.totalBranchOrders = 0
    this.orderStringDate = []
    this._deliverymanService.getOrderPerformanceData(this.deliverymanID, this.numOfDays).subscribe(res => {
      if (res.Success) {
        this.ordersPerfomanceData = res.Data;
        this.totalDMOrders = this.ordersPerfomanceData[0]?.Total;
        this.totalBranchOrders = this.ordersPerfomanceData[0]?.BranchTotal
        this.totalOrderPercentage = (this.ordersPerfomanceData[0]?.Total / this.ordersPerfomanceData[0]?.BranchTotal) * 100
        this.ordersPerfomanceData.forEach(item => {
          item.Color = this._statusUtilsService.getTaskRateColors(item.Rate)
        })
        this.tripLineChartPopulation()
      }
    })
  }

  tripLineChartPopulation() {
    HighCharts.chart('tripContainers', {
      chart: {
        type: 'spline'
      },
      title: {
        text: "Deliveryman Trips"
      },
      xAxis: {
        categories: this.tripStringDate,
        type: 'datetime',
        labels: {
          format: '{value:%Y-%m-%d}',
          rotation: 60,
          align: 'left'
        }

      },
      yAxis: {
        min: 0,
        title: {
          text: 'Number Of Trips',
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
      series: this.tripSeries,
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

  orderLineChartPopulation() {
    HighCharts.chart('orderContainers', {
      chart: {
        type: 'column'
      },
      title: {
        text: "Agent Tasks"
      },
      xAxis: {
        categories: this.orderStringDate,
        type: 'datetime',
        labels: {
          format: '{value:%Y-%m-%d}',
          rotation: 60,
          align: 'left'
        }

      },
      yAxis: {
        min: 0,
        title: {
          text: 'Number Of Orders',
        },
        labels: {
          formatter: function () {
            return this.value.toString();
          }
        }
      },

      // tooltip: {
      //   valueSuffix: ' millions'
      // },
      plotOptions: {
        spline: {
          marker: {
            radius: 4,
            lineColor: '#666666',
            lineWidth: 1
          }
        }
      },
      series: this.orderSeries,
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

  GetTripLineChartData() {
    this.tripSeries = []
    this.tripStringDate = []
    this._deliverymanService.getDMTripsLineChart(this.deliverymanID, this.numOfDays).subscribe(response => {
      if (response.Success) {

        this.tripData = response.Data as DMTripLineChartViewModel[];
        this.tripStringDate = []
        this.tripDate = []
        this.tripData.forEach(res => {

          if (!(this.tripDate.indexOf(res.Date) >= 0)) {
            this.tripDate.push(res.Date)

            this.tripStringDate.push(formatDate(res.Date, 'MM/dd', this.locale))

          }
          if (!this.tripstatusList.includes(res.StatusName)) {
            this.tripstatusList.push(res.StatusName)
          }

        });

        // Total Count Of Trips
        let totalPoints: number[] = [];
        this.tripDate.forEach(d => {
          let point: number = 0
          var res = this.tripData.filter(i => i.Date == d).forEach(item => {
            point += item.TripsCount;
          })
          totalPoints.push(point)
        })
        this.tripSeries.push({ name: "Total", data: totalPoints, type: "spline" })
        // count for each Status
        this.tripstatusList.forEach(status => {
          let points: {}[] = []
          this.tripDate.forEach(d => {
            if (!this.tripData.some(i => i.Date == d && i.StatusName == status)) { points.push(0); }
            else {
              var res = this.tripData.filter(i => i.Date == d && i.StatusName == status)
              points.push(res[0].TripsCount)
            }
          });
          this.tripSeries.push({ name: status, data: points, type: "column", stacking: "normal", color: this.getColor(status), })

        });
        this.tripLineChartPopulation();

      }

    });
  }

  getOrderLineChartData() {
    this.orderSeries = []
    this._deliverymanService.getDeliverymanOrdersLineChart(this.deliverymanID, this.numOfDays).subscribe(response => {
      if (response.Success) {
        this.orderData = response.Data as DMOrderLineChartViewModel[];
        this.orderStringDate = []
        this.orderDate = []
        this.orderData.forEach(res => {
          if (!(this.orderDate.indexOf(res.Date) >= 0)) {
            this.orderDate.push(res.Date)
            this.orderStringDate.push(formatDate(res.Date, 'MM/dd', this.locale))
          }
        });
        // Total Count Of branch Orders
        let dmPoints: number[] = [];
        this.orderDate.forEach(d => {
          let point: number = 0
          var res = this.orderData.filter(i => i.Date == d).forEach(item => {
            dmPoints.push(item.OrdersDeliverymanCount)
          })
        })
        this.orderSeries.push({ name: "Deliveryman Total Order", data: dmPoints, type: undefined })
        // count for Deliveryman Orders

        // let points:number[] = []
        //   this.orderDate.forEach(d => {
        //     if (!this.orderData.some(i => i.Date == d )) { points.push(0); }
        //     else {
        //       var res = this.orderData.filter(i => i.Date == d )
        //       points.push(res[0].OrdersBranchCount )
        //     }
        //   });
        //   this.orderSeries.push({ name: "Branch Total Order", data: points, type: undefined })
      }

      this.orderLineChartPopulation();
    }
    )
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
}



