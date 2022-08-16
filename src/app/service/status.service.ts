import { Injectable } from '@angular/core';

import { TripStatus } from '../enum/trip-status';
import { DeliveryStatus } from '../enum/delivery-status';
import { TripRateOption } from '../enum/trip-rate-option';
import { OrderStatus } from '../enum/order-status.enum';
import { OrderRateOption } from '../enum/order-rate-option';
@Injectable({
  providedIn: 'root',
})
export class StatusUtilsService {
  constructor() { }

  getAgentStausColor(status: DeliveryStatus) {
    if (status == DeliveryStatus.NON) { return '#525252' }
    else if (status == DeliveryStatus.AVAILABLE) { return '#32cc3e' }
    else if (status == DeliveryStatus.ON_DUTY) { return '#03a8ff' }
    else if (status == DeliveryStatus.Break) { return '#ffc400' }
    else if (status == DeliveryStatus.OFF_DUTY) { return '#cc324c' }
    else if (status == DeliveryStatus.PENALIZED) { return '#1D1D1D' }
  }
  getTaskRateColors(status: any) {
    if (status == OrderRateOption.NOT_RATED) { return '#CDD1D5' }
    else if (status == OrderRateOption.EXCELLENT) { return '#009F42' }
    else if (status == OrderRateOption.GOOD) { return '#009DFF' }
    else if (status == OrderRateOption.LATE) { return '#FFE000' }
    else if (status == OrderRateOption.TOO_LATE) { return '#D50000' }
  }
  getTripRateColors(status: number) {
    if (status == TripRateOption.NOT_RATED) { return '#CDD1D5'; }
    else if (status == TripRateOption.EXCELLENT) { return '#009F42'; }
    else if (status == TripRateOption.GOOD) { return '#009DFF'; }
    else if (status == TripRateOption.LATE) { return '#FFE000'; }
    else if (status == TripRateOption.TOO_LATE) { return '#D50000'; }
  }
  getTripStatusName(status: TripStatus): string {
    switch (status) {
      case 1:
        return "CREATED"
      case 2:
        return "READY"
      case 3:
        return "SENT"
      case 4:
        return "ACCEPTED"
      case 5:
        return "DECLINED"
      case 6:
        return "IGNORED"
      case 10:
        return "STARTED"
      case 11:
        return "CANCELED"
      case 12:
        return "DELIVERED"
      case 13:
        return "COMPLETED"
      default:
        break;
    }
  }
  getTaskStatusList() {
    return [
      { background: "#009F421f", color: "#009F42", title: "system.delivered", ID: OrderStatus.DELIVERED },
      { background: "#D500001f", color: "#D50000", title: "system.cant-deliver", ID: OrderStatus.CAN_NOT_DELIVER },
      { background: "#E6E8EA", color: "#15171A", title: "system.ready", ID: OrderStatus.READY },
      { background: "#009DFF1f", color: "#009DFF", title: "system.on-trip", ID: OrderStatus.ADDED_TO_TRIP },
      { background: "#E6E8EA", color: "#15171A", title: "system.in-progress", ID: OrderStatus.CREATED },
      { background: "#E6E8EA", color: "#15171A", title: "system.new", ID: OrderStatus.New },
      { background: "#E6E8EA", color: "#15171A", title: "system.scheduled", ID: OrderStatus.SCHEDULED },
    ]
  }
}
