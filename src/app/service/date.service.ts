import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }
  getTomorrowDate():Date
  {
    let currentDate=new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate;
  }
  getFirstDayCurrentMonth():Date
  {
    let currentDate=new Date();
    
    let startDate=new Date();
    startDate.setFullYear(currentDate.getFullYear());
    startDate.setMonth(currentDate.getMonth());
    startDate.setDate(1);
    // console.log("startDate : "+JSON.stringify(startDate));
    // console.log(startDate.getMonth());
    return startDate;
  }
  getYearStartDay():Date
  {
    let currentDate=new Date();
    //alert(currentDate.getMonth());
    let startDate=new Date();
    startDate.setFullYear(currentDate.getFullYear());
    startDate.setMonth(0);
    startDate.setDate(1);
    //// console.log("startDate : "+JSON.stringify(startDate));
    //// console.log(startDate.getMonth());
    return startDate;
  }
  getYearEndDay():Date
  {
    let currentDate=new Date();
    //alert(currentDate.getMonth());
    let startDate=new Date();
    startDate.setFullYear(currentDate.getFullYear());
    startDate.setMonth(11);
    startDate.setDate(31);
    //// console.log("startDate : "+JSON.stringify(startDate));
    //// console.log(startDate.getMonth());
    return startDate;
  }

  getSpecificDayOfCurrentMonth(day:number):Date{
    let currentDate=new Date();
    let startDate=new Date();
    if(currentDate.getDate()<=day){
      startDate.setMonth(currentDate.getMonth()-1);
    }
    else{
      startDate.setMonth(currentDate.getMonth());
    }
    startDate.setDate(day);
    return startDate;
  }

  getCurrentDateMinusNumberOfDays(numberOfDays:number):Date{
    let currDate=new Date();
    let date=new Date()
    date.setDate(currDate.getDate() -1);
    return date;
  }
  setDateTimeToDate(date:Date,dateTime:string){
    date.setHours(this.getHoursFromDateTime(dateTime));
    date.setMinutes(this.getMinutesFromDateTime(dateTime));
  }
  getHoursFromDateTime(value:string):number{
    return +value.split(":")[0];
  }
  getMinutesFromDateTime(value:string):number{
    return +value.split(":")[1].split(" ")[0];
  }

}
