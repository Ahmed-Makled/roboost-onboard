import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TaskUtilsService } from 'src/app/components/dispatch/page/service/task/task.utils';
import { DispatchService } from '../../dispatch.service';
import { OrderKpiViewModel, TripKpiViewModel } from './view-models/kpi.model';

@Component({
  selector: 'app-kpai-board',
  templateUrl: './kpai.component.html',
  styleUrls: ['./kpai.component.css']
})

export class KpaiOnboardingComponent implements OnInit  ,OnChanges{
  @Input() orderKpi: OrderKpiViewModel 
  @Input() tripKpi: TripKpiViewModel 
  @Input() isKpisSearching: boolean = true
  kpai:any



  constructor(
    public _taskUtils:TaskUtilsService,
    public _dispatchService: DispatchService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // this.initializePage()
  }

  ngOnInit(): void {
  }

  initializePage() {
    this.kpai = [
    //   {
    //   title: "kpis.avg-delivery-time",
    //   color: "b500",
    //   colorCounter: "white",
    //   bg: "b500",
    //   icon: null,
    //   counter: this.orderKpi.AvgDeliveryTime,
    //   border: "bc-b500"
    // },
    // {
    //   title: "order.total",
    //   color: "b500",
    //   colorCounter: "b500",
    //   bg: "b50",
    //   icon: null,
    //   counter: this.orderKpi.TotalOrders,
    // },
    // {
    //   title: "dispatch.urgent",
    //   color: "g900",
    //   colorCounter: "white",
    //   bg: "o500",
    //   icon: "shield_exclamation_solid.svg",
    //   counter: this.orderKpi.UrgentdOrders,
    //   border: null


    // },
    // {
    //   title: "order.scheduled.scheduled",
    //   color: "g900",
    //   colorCounter: "white",
    //   bg: "p500",
    //   icon: "calender_alt_solid.svg",
    //   counter: this.orderKpi.ScheduledOrders,
    //   border: null

    // },
    // {
    //   title: "system.pending",
    //   color: "g900",
    //   colorCounter: "g900",
    //   bg: "g100",
    //   icon: null,
    //   counter: this.orderKpi.PendingOrders,
    //   border: null

    // },
    // {
    //   title: "kpis.paused-orders",
    //   color: "g900",
    //   colorCounter: "g900",
    //   bg: "y500",
    //   icon: "pause_circle_solid.svg",
    //   counter: this.orderKpi.PausedOrders,
    //   border: null

    // },
    // {
    //   title: "kpis.on-way",
    //   color: "g900",
    //   colorCounter: "white",
    //   bg: "lb500",
    //   icon: "bike.svg",
    //   counter: this.orderKpi.OnWayOrders,
    //   border: null

    // },
    // {
    //   title: "system.delivered",
    //   color: "g600",
    //   colorCounter: "white",
    //   bg: "gr600",
    //   icon: null,
    //   counter: this.orderKpi.DeliveredOrders,
    //   border: null

    // },
    // {
    //   title: "kpis.cancelled-orders",
    //   color: "g900",
    //   colorCounter: "white",
    //   bg: "r500",
    //   icon: "times_circle_solid.svg",
    //   counter: this.orderKpi.CanceledOrders,
    //   border: null

    // },
    // {
    //   title: "trip.trip-performance.excellent-trips",
    //   color: "g900",
    //   colorCounter: "white",
    //   bg: "gr600",
    //   icon: null,
    //   counter: this.tripKpi?.ExcellentTrips,
    //   border: null,
    //   subValue:"%"

    // }
    ]
  }
}

