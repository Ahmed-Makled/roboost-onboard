import { Injectable } from '@angular/core';
import { AgentUtilsService } from 'src/app/service/agent/agent.utils';
import { DummyDataService } from 'src/app/service/dummy-data.service';
import { SharedService } from 'src/app/service/shared.service';
import { OnboardingDispatchService } from '../../onboarding.service';
import { SpecialTripViewModel } from '../../view-models/dispatch-create.model';
import { DispatchAgentViewModel, DispatchTripViewModel } from '../../view-models/dispatch.model';
import { TaskUtilsService } from '../task/task.utils';
import { TripDataService } from './trip.data';
import { TripUtilsService } from './trip.utils';


@Injectable({
  providedIn: 'root',
})

export class TripActionService {

  constructor(
    private _dispatchService: OnboardingDispatchService,
    public _tripService: TripDataService,
    private _sharedService: SharedService,
    private _taskUtils: TaskUtilsService,
    public _tripUtils: TripUtilsService,
    private _agentUtils: AgentUtilsService,
    private DummyDataService :DummyDataService

  ) { }

  getRunningTrips(callback) {
    // this._tripService.getRunningTrips(this._dispatchService.searchViewModel).subscribe((res) => {
    //   if (res.Success) {
    //     this._dispatchService.trips = res.Data
    //     this._dispatchService.trips.filter(i => i.DeliverymanID == 0).forEach(element => {
    //       element.SpentTime = 0
    //     });
    //     callback()
    //   }
      this._dispatchService.trips = this.DummyDataService.DummyTrips
      this._dispatchService.trips.filter(i => i.DeliverymanID == 0).forEach(element => {
        element.SpentTime = 0
      });
      callback()
      this._dispatchService.pageUtils.IsTripSearching = false
 
  }

  createSpecialTrip(model: SpecialTripViewModel) {
    model.OrdersID = this._dispatchService.tasks.filter(i => i.isSelected).map(i => i.ID)
    this._dispatchService.modalRef.hide()
      this._dispatchService.pageUtils.pageCreateTrip = false
      this._tripService.createSpecialTrip(model).subscribe(res => {
      this._sharedService.showToastr(res);
      if (res.Success) {
        var trip: DispatchTripViewModel = new DispatchTripViewModel()
        trip = res.Data
        trip.StatusName = this._sharedService.isLTR() ? "Sent" : "ارسال";
        trip.DeliverymanID = model.DeliverymanID
        let agent = this._dispatchService.agents.find(i => i.ID = model.DeliverymanID)
        trip.DeliverymanName = agent.Name
        trip.DeliverymanImage = agent.Image
        this._dispatchService.tasks.filter(i => i.isSelected).forEach(elemant => { this._taskUtils.addToTrip(elemant, trip.ID) });
        this._dispatchService.trips.unshift(trip)
      }
    })
  }
  addAgentToTrip(item: DispatchTripViewModel, agentID: number, agents, callback?) {
    this._dispatchService.page.isSaving = true;
    this._tripService.assignTripToDM(item.ID, agentID, item.Number).subscribe(res => {
      this._sharedService.showToastr(res)
      this._dispatchService.page.isSaving = false;
      if (res.Success) {
        this.afterAddAgentToTrip(item, agents.filter(i => i.ID == agentID))
      }
      if (callback) callback(res.Success)
    }, () => { this._dispatchService.page.isSaving = false; })
  }
  changeTripAgent(item: DispatchTripViewModel, agentID: number, agents: DispatchAgentViewModel[], callback?) {
    this._dispatchService.page.isSaving = true;
    this._tripService.assignTripToDM(item.ID, agentID, item.Number).subscribe(res => {
      this._sharedService.showToastr(res)
      this._dispatchService.page.isSaving = false;
      if (res.Success) {
        this._agentUtils.setAsAvailable(agents.find(i => i.ID == item.DeliverymanID))
        this.afterAddAgentToTrip(item, agents.filter(i => i.ID == agentID))
      }
      if (callback) callback(res.Success)
    }, () => { this._dispatchService.page.isSaving = false; })
  }

  closeTrip(item: DispatchTripViewModel, callback?) {
    this._dispatchService.page.isSaving = true;
    this._tripService.closeTrip(item.DeliverymanID).subscribe(res => {
      this._sharedService.showToastr(res)
      this._dispatchService.page.isSaving = false;
      if (res.Success) {
        this._dispatchService.trips.splice(this._dispatchService.trips.findIndex(i => i.ID == item.ID), 1);
      }
      if (callback) callback(res.Success)
    }, () => { this._dispatchService.page.isSaving = false; })
  }
  cancelTrip(item: DispatchTripViewModel, tasks, agents, callback?) {
    this._dispatchService.page.isSaving = true;
    this._tripService.cancelTrip(item).subscribe(res => {
      this._sharedService.showToastr(res)
      this._dispatchService.page.isSaving = false;
      if (res.Success) {
        this._taskUtils.removeAllFromTrip(tasks, item.ID)
        this._agentUtils.setAsAvailable(agents.find(i => i.ID == item.DeliverymanID))
        this._dispatchService.trips.splice(this._dispatchService.trips.findIndex(i => i.ID == item.ID), 1);
      }
      if (callback) callback(res.Success)
    }, () => { this._dispatchService.page.isSaving = false; })
  }

  getTripLog(item: DispatchTripViewModel, callback?) {
    this._tripService.getTripLog(item.Code).subscribe(res => {
      if (res.Success) {
        this._dispatchService.tripLog.Logs = res.Data
        this._dispatchService.tripLog.IsLoading = true
        callback()
        this._sharedService.sortBy(this._dispatchService.tripLog.Logs, { prop: "CreatedDate", desc: true })
      }
    })
  }
  getReasonList(callback?){
    this._tripService.getTripReasonList().subscribe(res => {
      if(res.Success)
      callback(res)
    })
  }



  private afterAddAgentToTrip(item: DispatchTripViewModel, agents: DispatchAgentViewModel[]) {
    this._tripUtils.sentToAgent(item, agents[0])
    this._agentUtils.setAsOnDuty(agents)
  }

}
