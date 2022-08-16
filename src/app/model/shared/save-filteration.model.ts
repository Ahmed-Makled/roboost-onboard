import { FormGroup } from "@angular/forms";

export class SaveFilterationViewModel {
    pageRoute: string;
    searchForm: FormGroup;
    orderBy?: string = "ID";
    isAscending?: boolean = false;
    pageSize?: number = 50
    currentPage?: number = 1
}