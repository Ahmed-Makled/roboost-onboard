import { FormGroup } from '@angular/forms';
import { ControlType } from 'src/app/enum/control-type.enum';
import { ResponseViewModel } from './response.model';

export class CRUDCreatePage{
    form: FormGroup;
    isSerching: boolean = false;
    isUploading: boolean = false;
    isEdit: boolean = false;
    isSaving: boolean = false;
    isDeleting: boolean = false;
    responseViewModel: ResponseViewModel;
    isPageLoaded: boolean = false;
    ControlType=ControlType

    
}