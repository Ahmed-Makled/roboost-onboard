import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NotificationCreateModel } from './view-models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private apiService: ApiService) { }
  getAgentListWithStatus() {
    return this.apiService.get(`/Deliveryman/GetAgentListWithStatus`);
  }
  pushNotification(notification: NotificationCreateModel) {
    return this.apiService.post(`/Broadcast/Send`, notification);
  }
  
}

