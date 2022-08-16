import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private _apiService: ApiService
  ) { }

  post(path: string, body: Object) {
    return this._apiService.post(path, body, true);
  }

  isImage(file: File) {
    let extensions: string[] = [".jpg", ".png", ".gif", ".jpeg"];
    return extensions.some(item => file.name.toLowerCase().endsWith(item));
  }

  isPDF(file: File) {
    let extinsions: string[] = [".pdf"];
    return extinsions.some(item => file.name.toLowerCase().endsWith(item));
  }
  isAllowedExtinsion(file: File, extinsions: string[]) {
    return extinsions.some(item => file.name.toLowerCase().endsWith(item));
  }

}
