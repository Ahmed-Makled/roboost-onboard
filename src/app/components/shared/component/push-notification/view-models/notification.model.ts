import { SelectItem } from "src/app/model/shared/select-view-model";

export class NotificationCreateModel {
  DelivermanIDs: number[] = [];
  Title: string;
  Body: string;
}

export class FilterViewModel {
  SearchByList: SelectItem[] = [
    { ID: FilterAgentStatusEnum.Agents_All, Name: "broadcast.push.all", Selected: false },
    { ID: FilterAgentStatusEnum.Agents_Availability, Name: "system.available", Selected: false },
    { ID: FilterAgentStatusEnum.Agents_OnDuty, Name: "system.on-duty", Selected: false },
    { ID: FilterAgentStatusEnum.Agents_Offline, Name: "dispatch.offline", Selected: false },
  ];
  SearchValue: FilterAgentStatusEnum = FilterAgentStatusEnum.Agents_All;

}
export enum FilterAgentStatusEnum {
  Agents_All = 0,
  Agents_Availability = 1,
  Agents_OnDuty = 2,
  Agents_Offline = 3,
}