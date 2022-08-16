import { FeatureEnum } from "src/app/enum/feature.enum"
import { OrderStatus } from "src/app/enum/order-status.enum"
import { SelectItem } from "src/app/model/shared/select-view-model"

export class DispatchUtilsViewModel {
  IsTripSearching: boolean = true
  IsOrderSearching: boolean = true
  IsAgentSearching: boolean = true
  IsKpisSearching: boolean = true
  WithUrgentTripsTasks: boolean = false
  WithUrgentTasks: boolean = false
  WithUrgentPreparedTasks: boolean = false
  WithUrgentNewTasks: boolean = false
  WithUrgentTransfferedTasks: boolean = false
  WithUrgentScheduledTasks: boolean = false
  SecondInterval:any
  dragDelayTime:number = 120
  filterSearchInput:string
  TasksTabList:SelectItem[]=[];
  CurrentTasksTab:OrderStatus=OrderStatus.CREATED;
  TasksFilterList:SelectItem[]=[
    {ID:OrderStatus.READY,Name:"dispatch.ready",Selected:false},
    {ID:OrderStatus.CREATED,Name:"dispatch.in-progress",Selected:false},
  ];
  defaultGroupList: SelectItem[] = [{ Name: "", Selected: false, Code: "" }]
  pageCreateTrip: boolean = false
  oldTripID: number
  tripActionSearchValue: string;
  showSingleSearch: boolean = false;
  withShowTaskSection: boolean = false
  currentDropConrainerID:string
}



