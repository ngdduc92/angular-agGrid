import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerService} from 'src/app/shared/server.service';

@Injectable({
  providedIn: 'root'
})
export class SubcriptionsService {
  constructor(private http: HttpClient, private serverService: ServerService) {}
  /*
   * Method: GET
   * URL: /compadmin/subscriptions
   * Return: Array
   */
  public getSubscriptions() {
    let now = Date.now();
    let apiPath = '/compadmin/subscriptions/' + now;
    return this.serverService.httpCallApi('GET',apiPath,'','');
  }

  /*
  * Method: POST
  * URL: /compadmin/subscriptions/
  * Return: Array
  */
  public updateSubscriptions(formData: string) {
    let apiPath = '/compadmin/subscriptions/';     
    return this.serverService.httpCallApi('POST',apiPath,formData,'');  
  }
}
