import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  transform(value: number): string {
    //// console.log(value.length);
    if(value == 0)
      return '0.00';
    return (Math.floor(value*100)/100).toString()
  }

}
