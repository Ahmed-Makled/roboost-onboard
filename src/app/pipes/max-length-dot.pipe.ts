import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxLengthDot'
})
export class MaxLengthDotPipe implements PipeTransform {

  transform(value: string, maxLength:number): string {
    //// console.log(value.length);
    if(value==null || value.length<=maxLength)
      return value;
    return (value.substr(0,(maxLength - 3)) + "...");
  }

}