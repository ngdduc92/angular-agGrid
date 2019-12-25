import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerService} from 'src/app/shared/server.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(private http: HttpClient, private serverService: ServerService) {}
  /*
   * Method: GET
   * URL: /reports/reportPeriods
   * Return: Array
   */
  public listReportPeriods() {
    let now = Date.now();
    let apiPath = '/reports/reportPeriods/' + now;
    return this.serverService.httpCallApi('GET',apiPath,'','');
  }

  /*
  * Method: GET
  * URL: /reports/roadmarks
  * Return: Array
  */
  public listRoadMarks() {
    let now = Date.now();
    let apiPath = '/reports/roadmarks/' + now;
    return this.serverService.httpCallApi('GET',apiPath,'','');
  }

  /*
  * Method: POST
  * URL: /reports/getReportInfo/
  * Return: Boolean
  */
  public reportInfo(formData: string) {
    let apiPath = '/reports/getReportInfo/';     
    return this.serverService.httpCallApi('POST',apiPath,formData,'');  
  }
}
