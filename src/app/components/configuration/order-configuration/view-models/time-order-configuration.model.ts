export class TimeOrderConfigurationViewModel {
     ID :number
     BranchID :number
     OrderReadyTime :number = 1;
     OrderNormalTime :number = 4;
     OrderUrgentTime :number = 8;
     OrderTopUrgentTime :number = 12;
     BranchName :string
  IsSelected: boolean;
}