import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timer'
})
export class TimerPipe implements PipeTransform {

  transform(value: number,format?:string): string {
    let time = Math.floor(value);
    var hours = format== "mm:ss"?0:Math.floor(time / 3600);
    var minutes = Math.floor((time / 60) - (hours*60));
    var seconds = time - (minutes * 60) - (hours*3600);
    if (format== "mm:ss") {
      return `${minutes>9?minutes:'0'+minutes}:${seconds>9?seconds:'0'+seconds}`;
    }
    else
    return `${hours>9?hours+':':hours==0?'':'0'+hours+':'}${minutes>9?minutes:'0'+minutes}:${seconds>9?seconds:'0'+seconds}`;
  }

}
