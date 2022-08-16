import * as HighCharts from 'highcharts';
import { OnInit, Component, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DashBoardService } from '../../dashboard.service';
import { OrderStatusPieChartViewModel } from './View-models/order.model';
import { DashboardSearchViewModel } from '../../view-models/dashboard-search.model';
@Component({
  selector: 'order-status-piechart',
  templateUrl: './order-status-piechart.html',
  styleUrls: ['./order-status-piechart.css']
})
export class OrdersStatusPiechartComponent implements OnInit, OnChanges {
  title = 'Order Performace';
  name = "Performance"
  data: OrderStatusPieChartViewModel[]
  Total: number = 0
  @Input() searchViewModel: DashboardSearchViewModel;
  @Input() private refresh: EventEmitter<number>;
  constructor(private dashBoardService: DashBoardService) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.getData()
  }

  ngOnInit() {
    // this.SetPieChartOption()
    //this.getData();
    this.refresh.subscribe(branchID => {

      this.getData()
    });
  }
  PieChartBinding() {


    HighCharts.chart('pieChart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: ` ${this.title} `

      },
      subtitle: {
        text: `<small> Total Order = ${this.Total}</small>`
      },
      tooltip: {
        pointFormat: '{series.name}: <br>{point.percentage:.1f} %<br>Number: {point.y}'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>:<br>{point.percentage:.1f} %<br>Number: {point.y}',
          },
          showInLegend: true
        }
      },
      series: [{
        name: this.name,
        colorByPoint: true,
        type: undefined,
        data: this.data
      }]
    });
  }

  getData() {
    this.dashBoardService.getOrderStatusPieData(this.searchViewModel).subscribe(response => {
      if (response.Success) {

        this.data = response.Data as OrderStatusPieChartViewModel[];
        if (this.data.length > 0)
          this.Total = this.data[0].Total;
        else
          this.Total = 0;
        this.data.forEach(i => {
          i.color = this.getColor(i.name)
        })
        this.PieChartBinding();
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

}

