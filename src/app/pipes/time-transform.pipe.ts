import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'TimerTransform'
})
export class TimerTransformPipe implements PipeTransform {
  constructor() {}

  transform(value: number): string {
      let minutes: number = Math.trunc(value/60);
      let hours: number = 0;
      // let seconds: number = value - (minutes*60);

      if (minutes >= 60) {
        hours = Math.trunc(minutes/60);
        minutes = minutes - (hours*60);
      }

      let response: string = "";

      if (hours > 0) {
        response = response + hours + "h "+" · ";
      } 

      if (minutes > 0) {
        response = response + minutes + "min ";
      }

      // if (seconds > 0) {
      //   response = response + seconds + " seconds";
      // }

      return response;
  }
}