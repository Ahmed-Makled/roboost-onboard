import { SelectItem } from "src/app/model/shared/select-view-model";

export class FilterViewModel {
  SearchByList: SelectItem[] = [
    { ID: FilterByEnum.Order_Number, Name: "order.order-number", Selected: false },
    { ID: FilterByEnum.Agent_Name, Name: "system.deliveryman-name", Selected: false },
    { ID: FilterByEnum.Customer_Name, Name: "system.customer-name", Selected: false },
    { ID: FilterByEnum.Customer_Mobile, Name: "system.customer-mobile", Selected: false },
    { ID: FilterByEnum.District, Name: "dispatch.district", Selected: false },
  ];
  SearchValue:FilterByEnum = FilterByEnum.Order_Number;
  FiltterValue:string = "";
  FiltterType:GroupingTypeEnum = GroupingTypeEnum.STORE;
  GroupByValue:GroupingTypeEnum = GroupingTypeEnum.NONE;
  SortingValue:SortingTypeEnum = SortingTypeEnum.AZ;
  RecentValue:RecentOldestEnum = RecentOldestEnum.RECENT;
  FiltterByList: SelectItem[] = [
    { ID: GroupingTypeEnum.AREA, Name: "system.area", Selected: true },
    { ID: GroupingTypeEnum.STORE, Name: "system.store", Selected: false }
  ];
  GroupingBy: SelectItem[] = [
    { ID: GroupingTypeEnum.AREA, Name: "system.area", Selected: false },
    { ID: GroupingTypeEnum.STORE, Name: "system.store", Selected: false },
    { ID: GroupingTypeEnum.NONE, Name: "shared.none", Selected: true }
  ];
  SortingGroupsBy: SelectItem[] = [
    { ID: SortingTypeEnum.AZ, Name: "filter.sortingGroupsBy.alphabetic-A-Z", Selected: true },
    { ID: SortingTypeEnum.ZA, Name: "filter.sortingGroupsBy.alphabetic-Z-A", Selected: false },
    { ID: SortingTypeEnum.HIGHEST_ORDERS, Name: "filter.sortingGroupsBy.high-order", Selected: false },
    { ID: SortingTypeEnum.LOWEST_ORDERS, Name: "filter.sortingGroupsBy.low-order", Selected: false }
  ];
  RecentOrOldest: SelectItem[] = [
    { ID: RecentOldestEnum.RECENT, Name: "filter.recent-or-oldest.recent", Selected: true },
    { ID: RecentOldestEnum.OLDEST, Name: "filter.recent-or-oldest.oldest", Selected: false },
  ];
}
export enum FilterByEnum {
  Order_Number = 1,
  Agent_Name = 2,
  Customer_Name = 3,
  Customer_Mobile = 4,
  District = 5
}
export enum GroupingTypeEnum{
  AREA=1,
  STORE=2,
  NONE=3,
}
export enum SortingTypeEnum{
  AZ=1,
  ZA=2,
  HIGHEST_ORDERS=3,
  LOWEST_ORDERS=4,
}
export enum RecentOldestEnum{
  RECENT=1,
  OLDEST=2,
}