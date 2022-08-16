import { Injectable } from '@angular/core';
import { UserPagesViewModel } from '../components/logged-user/view-model/logged-user.model';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  userPagesStorageName: string = "userPages"
  isSingleStore: string = "isSingleStore"
  api: string = "api"

  constructor() { }

  setUserPages(value: string) {
    localStorage.setItem(this.userPagesStorageName, value);
  }
  getUserPages() {
    let value: string = localStorage.getItem(this.userPagesStorageName);
    if (value == null || value == 'undefined')
      return [];
    return JSON.parse(value) as number[];
  }
  removeUserPages() {
    localStorage.setItem(this.userPagesStorageName, "");
    localStorage.removeItem(this.userPagesStorageName);
  }

  setISSingleStore(value) {
    localStorage.setItem(this.isSingleStore, value);
  }

  getISSingleStore() {
    let value: string = localStorage.getItem(this.isSingleStore);
    if (value == null || value == 'undefined')
      return false;
    return JSON.parse(value) as boolean;
  }

  removeISSingleStore() {
    localStorage.setItem(this.isSingleStore, "");
    localStorage.removeItem(this.isSingleStore);
  }


  setApi(value) {
    localStorage.setItem(this.api, value);
  }
  getApi() {
    let value: string = localStorage.getItem(this.api);
    if (value == null || value == 'undefined')
      return false;
    return value;
  }
  hasApi(): boolean {
    let value: string = localStorage.getItem(this.api);
    return value != null && value != 'undefined';
  }
  removeApi() {
    localStorage.setItem(this.api, "");
    localStorage.removeItem(this.api);
  }
}
