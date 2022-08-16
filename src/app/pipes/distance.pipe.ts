import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {

  transform(value: number): string {
    //// console.log(value.length);
    return (Math.floor(value*100)/100).toString()
  }

}
