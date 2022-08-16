import { DatePipe } from "@angular/common";
import { Inject, LOCALE_ID, Pipe, PipeTransform } from "@angular/core";
import { SharedService } from "../service/shared.service";

@Pipe({
    name: 'date'
  })
  export class ExtendDatePipe extends DatePipe implements PipeTransform {
    readonly customFormats = {
      medium: 'mediumDate',
      short: 'short',
      longDate: 'dd-MM-yyyy hh:mm a'
    };
    private local:string='';

    constructor(@Inject(LOCALE_ID) locale: string ,
    private _sharedService:SharedService
    ) {
        super(locale);
        this.local= _sharedService.isLTR()? locale : 'ar_EG'              
    }
  
    transform(value: string | number | Date, format?: string, timezone?: string, locale?: string): string;
    transform(value: null, format?: string, timezone?: string, locale?: string): null;
    transform(value: string | number | Date, format?: string, timezone?: string, locale?: string): string;
    transform(value: any, format = 'mediumDate', timezone?: string, locale?: string): string {
          format = this.customFormats[format] || format;
          return super.transform(value, format, timezone, this.local);
   }
  }