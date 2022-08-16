import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AgentFilterViewModel, DeliverymanViewModel, TaskFilterViewModel } from '../view-models/deliveryman-model';
import { TrackLocationService } from '../track-location.service';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { ListService } from 'src/app/service/list.service';
import { SignalRService } from 'src/app/service/signlr.service';
import { OrderStatus } from 'src/app/enum/order-status.enum';
import { ClusterStyle } from '@agm/js-marker-clusterer/services/google-clusterer-types';
import { DeliveryStatus } from 'src/app/enum/delivery-status';
import { BranchTrackingViewModel } from '../view-models/tracking.model';
import { SharedService } from 'src/app/service/shared.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DispatchAgentViewModel, DispatchOrderViewModel, DispatchTripViewModel } from 'src/app/components/dispatch/page/view-models/dispatch.model';
import { DispatchSearchViewModel } from 'src/app/components/dispatch/page/view-models/dispatch-search.model';
import { DispatchService } from 'src/app/components/dispatch/page/dispatch.service';
import { SpecialTripViewModel } from 'src/app/components/dispatch/page/view-models/dispatch-create.model';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { TripActionService } from 'src/app/components/dispatch/page/service/trip/trip.action';
import { TaskActionService } from 'src/app/components/dispatch/page/service/task/task.action';
import { DispatchUtilsViewModel } from '../../dispatch/page/view-models/dispatch.utils';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit, OnDestroy {
  storeList: BranchTrackingViewModel[] = [];
  delivermenForMap: DeliverymanViewModel[] = [];
  agentList: DeliverymanViewModel[] = []
  zoom = 8;
  previous;
  pageUtils: DispatchUtilsViewModel = new DispatchUtilsViewModel();
  trips: DispatchTripViewModel[] = []
  orders: DispatchOrderViewModel[] = []
  page: CRUDIndexPage = new CRUDIndexPage();
  searchViewModel: DispatchSearchViewModel = new DispatchSearchViewModel();
  secondInterval: any
  agentStoreSearch
  agentSearchValue: string = ""
  selectedAgentId: number
  selectagent: DeliverymanViewModel = new DeliverymanViewModel()
  showOrderList: boolean = false
  showUnassignTask: boolean = false
  isKpisSearching: boolean = false
  showMap: boolean = true;
  agentCreateTrip: number
  modalRef: BsModalRef;
  agentFilter: AgentFilterViewModel = new AgentFilterViewModel()
  agentStatusfilter
  taskFilter: TaskFilterViewModel = new TaskFilterViewModel()
  constructor(
    private _listService: ListService,
    private _trackLocationService: TrackLocationService,
    public signalRService: SignalRService,
    private _dispatchService: DispatchService,
    private _tripAction: TripActionService,
    private _taskAction: TaskActionService,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this._dispatchService.page = this.page
    this._dispatchService.pageUtils = this.pageUtils
    // if (!environment.production) {
    //   this.showMap = false
    // }
    this.setTaskTabs()
    this.setClusterInfo()
    this.initializePage()
  }

  ngOnDestroy(): void {
    clearInterval(this.pageUtils.SecondInterval)
  }

  isMobileView(): boolean {
    return this._sharedService.isMobileView()
  }
  initializePage() {
    this.page.isPageLoaded = false;
    this.getStoreList()
    this.getRunningAgent()
    this.getRunningTrips()
    this.getRunningTasks()
    this._dispatchService.startInterval()
  }
  getStoreList() {
    this._listService.getBranchListWithLocation().subscribe((res) => {
      this.storeList = res.Data
      this.storeList.forEach(i => i.Selected = true)
      this.page.isPageLoaded = true;
    })
  }
  getSelectedStroreList() {
    return this.storeList.filter(i => this.agentStoreSearch ? i.ID == this.agentStoreSearch : true)
  }
  getRunningAgent() {
    this._trackLocationService.getDeliverymen().subscribe((res) => {
      this.agentList = res.Data
      this.agentList.forEach(i => i.Selected = true)
    })
  }

  getRunningTrips() {
    this._tripAction._tripService.getRunningTrips(this.searchViewModel).subscribe((res) => {
      this._dispatchService.trips = res.Data
    })
  }

  getRunningTasks() {
    this._taskAction._taskService.getRunningOrders(this.searchViewModel).subscribe((res) => {
      this._dispatchService.tasks = res.Data
    })
  }
  getStoreById(id) {
    return this.storeList.find(i => i.ID == id)
  }
  getOrderByStoreCount(id) {
    return this._dispatchService.tasks.filter(i => i.BranchID == id).length
  }
  isOrderhasTrip(order: DispatchOrderViewModel): boolean {
    return order.TripID != 0
  }
  getStatusById() {
    return this.agentFilter.FiltterByList.find(i => i.ID == this.agentStatusfilter)
  }
  getOrderTrip(item: DispatchOrderViewModel) {
    if (this.isOrderhasTrip(item))
      return this._dispatchService.trips.find((i) => i.ID == item.TripID)
  }
  getAgentsByStore(id: number): DeliverymanViewModel[] {
    if (this.agentStatusfilter)
      return this.agentList.filter(i => id ? i.BranchID == id && i.StatusID == this.agentStatusfilter : true)
    else
      return this.agentList.filter(i => id ? i.BranchID == id : true)
  }
  getAgentById(id) {
    return this.agentList.find(i => i.ID == id)
  }
  getAgentList(id?) {
    if (this.agentSearchValue)
      return this.getAgentsByStore(id ?? 0).filter(i => i.Name.toLowerCase().includes(this.agentSearchValue.toLowerCase()))
    else return this.getAgentsByStore(id ?? 0)
  }
  agentsForMap(): DeliverymanViewModel[] {
    let agentsForMap = this.getAgentList().filter(i => this.agentStoreSearch ? i.Selected == true && i.BranchID == this.agentStoreSearch : i.Selected == true)
    return agentsForMap.filter(i => this.selectedAgentId ? i.ID == this.selectedAgentId : true)
  }
  getAgentsbyStatusForMap() {
    return this.agentsForMap().filter(i => this.agentStatusfilter ? i.StatusID == this.agentStatusfilter : true)
  }

  isAgentHasTrip(id): boolean {
    return this._dispatchService.trips.filter(i => i.DeliverymanID == id).length > 0
  }

  agentTrip(id): DispatchTripViewModel {
    if (this.isAgentHasTrip(id))
      return this._dispatchService.trips.find(i => i.DeliverymanID == id)
  }

  get currentAgentTrip(): DispatchTripViewModel {
    return this.agentTrip(this.selectedAgentId)
  }

  getTripOrderList(id: number): DispatchOrderViewModel[] {
    return this._dispatchService.tasks.filter(i => i.TripID == id)
  }

  getTripDeliveredOrderList(id: number) {
    return this._dispatchService.tasks.filter(i => i.TripID == id && i.Status == OrderStatus.DELIVERED)
  }

  getTaskAgent(id) {
    return this._dispatchService.tasks.filter(i => i.TripID == this.agentTrip(id).ID)
  }
  getAgentStatusCount(id) {
    return this.agentList.filter(i => i.StatusID == id).length
  }

  isShowAgentTrip(): boolean {
    return this.selectedAgentId != null && this.isAgentHasTrip(this.selectedAgentId)
  }

  getOrderWithLoction() {
    let orders = this.agentStoreSearch ? this._dispatchService.tasks.filter(i => i.BranchID == this.agentStoreSearch) : this._dispatchService.tasks
    return orders.filter(i => (this.selectedAgentId ? i.TripID == this.agentTrip(this.selectedAgentId).ID : true))
  }

  getOrderList() {
    if (this.showUnassignTask)
      return this._dispatchService.tasks.filter(i => i.TripID == 0 && (i.Status == OrderStatus.READY || i.Status == OrderStatus.CREATED) && i.BranchID == this.getAgentById(this.agentCreateTrip).BranchID)
    else
      return this._dispatchService.tasks.filter(i => i.HasGoogleLocation == false)
  }
  getFilterOrderListOnMap() {
    if (this.taskFilter.AssignTask && this.taskFilter.UnAssignTasks)
      return this.getOrderWithLoction()
    if (this.taskFilter.AssignTask)
      return this.getOrderWithLoction().filter(i => i.TripID != 0)
    else if (this.taskFilter.UnAssignTasks)
      return this.getOrderWithLoction().filter(i => i.TripID == 0)
    else return null
  }

  getOrderSelected() {
    return this._dispatchService.tasks.filter(i => i.isSelected == true)
  }

  showTaskWithoutLocation() {
    this.showOrderList = true;
    this.currentTasksTab = 1
    this.selectedAgentId = null
  }

  mapInterval: any
  showTaskUnassign(id) {
    this.previous?.close();
    this._dispatchService.tasks.forEach(x => { x.IsStoreSelect = false, x.IsAgentSelect = false })
    if (this.isAgentHasTrip(id)) {
      this.selectedAgentId = id
      if (this.zoom > 14)
        this.zoom = 14
      // this.mapInterval = setInterval(() => {
      //   if (this.zoom > 14)
      //     this.zoom--
      // }, 250);
    }
    else {
      this.agentCreateTrip = id
      this.currentTasksTab = 3
      this.selectedAgentId = null
      this.showOrderList = true
      this.showUnassignTask = true
    }
  }

  agentSelect(item: DeliverymanViewModel,event, isCheck: boolean = true) { 
    if (item.Selected && isCheck) {
      this.selectagent = item;
      this.showOrderList = false;
      this.selectedAgentId = null;
      this.zoom = 22
    }
    else event.stopPropagation()
  }

  isAgentAvailable(agent: DeliverymanViewModel): boolean {
    return agent.StatusID == DeliveryStatus.AVAILABLE
  }
  isAgentOnDuty(agent: DeliverymanViewModel): boolean {
    return agent.StatusID == DeliveryStatus.ON_DUTY
  }

  isOrderDelivered(order: DispatchOrderViewModel) {
    return order.Status == OrderStatus.DELIVERED || order.Status == OrderStatus.DELIVERED_MANUALLY
  }

  isOrderCantDelivered(order: DispatchOrderViewModel) {
    return order.Status == OrderStatus.CAN_NOT_DELIVER
  }


  getOrderMarker(order: DispatchOrderViewModel) {
    if (order.IsStoreSelect || order.IsAgentSelect)
      return '/assets/rb-icon/dropoff_map_marker_purple.png'
    // if (order.IsPaused)
    //   return '/assets/rb-icon/dropoff_map_marker_yellow.png'
    if (this.isOrderDelivered(order))
      return '/assets/rb-icon/dropoff_map_marker_green.png'
    if (this.isOrderCantDelivered(order))
      return '/assets/rb-icon/dropoff_map_marker_red.png'
    if (!this.isOrderhasTrip(order))
      return '/assets/rb-icon/dropoff_map_marker_grey.png'
    if (this.isOrderhasTrip(order))
      return '/assets/rb-icon/dropoff_map_marker_blue.png'
  }

  getOrderLatitude(order: DispatchOrderViewModel): number {
    return order.PlannedLatitude > 0 ? order.PlannedLatitude :
      order.Latitude == 0 ? 0 : order.Latitude
  }

  getOrderLongtude(order: DispatchOrderViewModel): number {
    return order.PlannedLongitude > 0 ? order.PlannedLongitude :
      order.Longitude == 0 ? 0 : order.Longitude
  }

  showOrderMarker(order): boolean {
    return this.getOrderLatitude(order) > 0 && this.getOrderLongtude(order) > 0
  }

  onStoreAgentClick(item: BranchTrackingViewModel) {
    this.getAgentList(item.ID).forEach(element => {
      element.Selected = item.Selected
    });
  }
  onAgentChange(item: BranchTrackingViewModel) {
    item.Selected = this.getAgentList(item.ID).every(i => i.Selected)
  }

  TasksTabList: SelectItem[] = [];
  currentTasksTab: number = 1
  setTaskTabs() {
    this.TasksTabList.push({ ID: 1, Name: "All Tasks", Selected: true })
    this.TasksTabList.push({ ID: 2, Name: "Assigned", Selected: false })
    this.TasksTabList.push({ ID: 3, Name: "Unassigned", Selected: false })
    this.TasksTabList.push({ ID: 4, Name: "Without Location", Selected: false })
  }
  getOrder(currentTasksTab) {
    switch (currentTasksTab) {
      case 1: return this._dispatchService.tasks
      case 2: return this._dispatchService.tasks.filter(i => i.TripID > 0)
      case 3: return this._dispatchService.tasks.filter(i => this.showUnassignTask ? this.getAgentById(this.agentCreateTrip).BranchID == i.BranchID && i.TripID == 0 : i.TripID == 0)
      case 4: return this._dispatchService.tasks.filter(i => i.HasGoogleLocation == false)
      default: return this._dispatchService.tasks
    }
  }
  /////////////// add task ///////////
  @ViewChild('addTaskToTripTemplate', { static: false }) addTaskToTripTemplate: any;

  showAddTaskTamplet() {
    this._dispatchService.tasks.forEach(i => i.isSelected = false)
    this.modalRef = this._sharedService.modalService.show(this.addTaskToTripTemplate, { class: 'modal-640' });
  }
  getOrderListToAddTrip(withSelected: boolean = false) {
    let agent = this.agentList.find(i => i.ID == this.selectedAgentId)
    return this._dispatchService.tasks.filter(x => x.BranchID == agent.BranchID && (x.Status == OrderStatus.READY || x.Status == OrderStatus.CREATED) && (withSelected ? x.isSelected : true))
  }

  addToTrip() {
    let order = this._dispatchService.tasks.filter(order => order.isSelected == true)[0]
    this._taskAction.addToTrip(order, this.agentTrip(this.selectedAgentId).ID, false)
  }
  ///////////// Create spcial trip ////////////
  tripModel: SpecialTripViewModel = new SpecialTripViewModel()
  createSpecialTrip() {
    this.tripModel.OrdersID = this._dispatchService.tasks.filter(i => i.isSelected).map(i => i.ID)
    this.tripModel.DeliverymanID = this.getAgentById(this.agentCreateTrip).ID
    this.tripModel.BranchID = this.getAgentById(this.agentCreateTrip).BranchID
    this._tripAction._tripService.createSpecialTrip(this.tripModel).subscribe(res => {
      this._sharedService.showToastr(res);
      if (res.Success) {
        this.showOrderList = false
        this.showUnassignTask = false
        var trip: DispatchTripViewModel = new DispatchTripViewModel()
        trip = res.Data
        trip.StatusName = this._sharedService.isLTR() ? "READY" : "جاهزة";
        trip.DeliverymanID = this.tripModel.DeliverymanID
        let agent = this.agentList.find(i => i.ID = this.tripModel.DeliverymanID)
        trip.DeliverymanName = agent.Name
        trip.DeliverymanImage = agent.Image
        this._dispatchService.tasks.filter(i => i.isSelected).forEach(elemant => {
          elemant.TripID = trip.ID
          elemant.Status = OrderStatus.ADDED_TO_TRIP
        });
      }
    })
  }

  onStoreClick(item: BranchTrackingViewModel, infowindow) {
    this.clickedMarker(infowindow)
    this._dispatchService.tasks.filter(i => i.BranchID == item.ID).forEach(x => { x.IsStoreSelect = true })
    this.agentList.filter(i => i.BranchID == item.ID).forEach(x => { x.IsStoreSelect = true })
  }
  onAgentClick(item: DispatchAgentViewModel, infowindow) {
    this.clickedMarker(infowindow)
    this.getTaskAgent(item.ID).forEach(task => task.IsAgentSelect = true)
  }

  getFirstLetterOfAgentName(fullName) {
    const allNames = fullName.trim().split(' ');
    const initials = allNames.reduce((acc, curr, index) => {
      if (index === 0 || index === allNames.length - 1) {
        acc = `${acc}${curr.charAt(0).toUpperCase()}`;
      }
      return acc;
    }, '');
    return initials;
  }
  ///////////////////////////// Map
  onZoomChange(event) {
    this.zoom = event
  }
  public customSMaptyle = [
    {
      "featureType": "poi",
      "elementType": "labels",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "landscape",
      "stylers": [
        { "color": "#f2f2f2" }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "on",
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels",
      "stylers": [
        { "visibility": "off" }
      ]
    }
  ];

  clusterAgentStyles: ClusterStyle[] = [
    {
      textColor: "#FFFFFF",
      url: "/assets/rb-icon/cluster-orders.svg",
      backgroundPosition: "0 0",
      height: 36,
      width: 36,
      textSize: 14
    }
  ];

  clusterOrderStyles: ClusterStyle[] = [
    {
      textColor: "#FFFFFF",
      url: "/assets/rb-icon/cluster-agent.svg",
      backgroundPosition: "0 0",
      height: 36,
      width: 36,
      textSize: 14
    }
  ];

  clickedMarker(infowindow) {
    this.previous?.close();
    this.previous = infowindow;
  }
  onMapClick($event: MouseEvent) {
    this.previous?.close();
    this.showUnassignTask = false;
    this.showOrderList = false
    this._dispatchService.tasks.forEach(x => { x.IsStoreSelect = false, x.IsAgentSelect = false })
    this.agentList.forEach(x => x.IsStoreSelect = false)
  }
  clusterInfos: any
  setClusterInfo() {
    this.clusterInfos = [
      { code: "#FF6D00", title: "deliveryman.live-tracking.group-tasks" },
      { code: "#6200FF", title: "deliveryman.live-tracking.group-agents" },
      { code: "#6B7480", title: "deliveryman.live-tracking.unassigned-tasks" },
      { code: "#009DFF", title: "deliveryman.live-tracking.assigned-tasks" },
      // { code: "#FFE000", title: "Paused Task" },
      { code: "#009F42", title: "dispatch.delivered-tasks" },
      { code: "#D50000", title: "deliveryman.live-tracking.task-with-issue" },
    ]
  }

  closeInfoWindow(isStore: boolean = false) {
    this.previous?.close();
    if (isStore) {
      this._dispatchService.tasks.forEach(x => { x.IsStoreSelect = false, x.IsAgentSelect = false })
      this.agentList.forEach(x => x.IsStoreSelect = false)
    }
  }

  isSingleStore() {
    return this._sharedService._storageService.getISSingleStore()
  }
  featureEnum = FeatureEnum
  hasFeature(value: FeatureEnum) {
    return SharedService.featureList.some(i => i == value)
  }
}
