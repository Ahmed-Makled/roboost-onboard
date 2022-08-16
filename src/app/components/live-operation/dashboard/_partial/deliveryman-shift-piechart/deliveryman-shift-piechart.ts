import * as HighCharts from 'highcharts';
import { OnInit, Component, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DashBoardService } from '../../dashboard.service';
import { PieChartViewModel } from './view-models/pie-chart.model';
import { DeliverymanShiftPieChartViewModel } from './view-models/deliveryman-shift-pie-chart.model';
import { DashboardSearchViewModel } from '../../view-models/dashboard-search.model';
@Component({
  selector: 'deliveryman-shift-piechart',
  templateUrl: './deliveryman-shift-piechart.html',
  styleUrls: ['./deliveryman-shift-piechart.css']
})
export class DeliverymanPiechartComponent implements OnInit, OnChanges {
  title = 'Deliveryman Performace';
  name = "Performance"
  data: PieChartViewModel[] = []
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
    HighCharts.chart('dmpieChart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: ``

      },
      subtitle: {
        text: `<small> Total Duration = ${this.Total}</small>`
      },
      tooltip: {
        pointFormat: '{series.name}: <br>{point.percentage:.1f} %<br>Time: {point.y}'
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
    this.data = []
    this.dashBoardService.getDeliverymanShiftPieChart(this.searchViewModel).subscribe(response => {
      if (response.Success) {

        // if(this.data.length <= 0){
        var result = response.Data as DeliverymanShiftPieChartViewModel;
        this.data.push({ name: "Available", y: result.AvailableDuration, color: "#32cc3e" })
        this.data.push({ name: "Break", y: result.BreakDuration, color: "#ffc400" })
        this.data.push({ name: "OnDuty", y: result.OnDutyDuration, color: "#03A8FF" })
        this.data.push({ name: "Penalize", y: result.PenalizeDuration, color: "#525252" })
        this.Total = result.ShiftDuration;
        this.PieChartBinding();
        // }
      }


    });
  }
  // SetPieChartOption() {
  //   HighCharts.setOptions({
  //     colors:
  //      HighCharts.map(HighCharts.getOptions().colors, function (color) {
  //       return {
  //         radialGradient: {
  //           cx: 0.5,
  //           cy: 0.3,
  //           r: 0.7
  //         },
  //         stops: [
  //           [0, color],
  //           [1, HighCharts.color(color).brighten(-0.3).get('rgb')]
  //         ]
  //       };
  //     })
  //   });
  // }

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

