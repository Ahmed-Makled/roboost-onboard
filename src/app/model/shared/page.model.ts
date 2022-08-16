import { environment } from './../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { ColumnViewModel } from './column-view-model';
import { ResponseViewModel } from './response.model';

export class Page{
    searchForm:FormGroup;
    form: FormGroup;
    isLoading: boolean = false;
    isUploading: boolean = false;
    isEdit: boolean = false;
    isSaving: boolean = false;
    resultViewModel: ResponseViewModel;
    isPageLoaded: boolean = false;
    term: string = "";
    orderBy: string = "ID";
    isAscending: boolean = false;
    pageIndex: number = 1;
    pageSize: number = 10;
    selectedAll: boolean = false;
    columns: ColumnViewModel[];
    options = { itemsPerPage: environment.pageSize, currentPage: 1, id: 'Pagination', totalItems: 0, totalPages: 0 }
  
}