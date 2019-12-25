import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerService} from 'src/app/shared/server.service';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
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
   * Method: POST
   * URL: /reports/admin/releaseReports/
   * Return: Boolean
   */
  public releaseReports(formData: string) {
    let apiPath = '/reports/admin/releaseReports/';   
    return this.serverService.httpCallApi('POST',apiPath,formData,'');     
  }

  /*
   * Method: POST
   * URL: /reports/admin/releaseReports/
   * Return: Boolean
   */
  public generateReports() {
    let apiPath = '/reports/admin/createReports/';    
    let headers = this.serverService.httpOptions.headers;
    return this.serverService.httpCallApi('POST',apiPath,'Data: [object Object]',{headers, responseType: 'text'});  
  }
}
