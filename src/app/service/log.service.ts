import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() { }
  addToConsole(text: string) {
    // if (!environment.production)
    //   console.log(text);
  }
  addToConsoleAsString(body: any) {
    // if (!environment.production)
    //   console.log(JSON.stringify(body));
  }
  showAlert(text: string) {
    // if (!environment.production)
    //   alert(text);
  }

}
