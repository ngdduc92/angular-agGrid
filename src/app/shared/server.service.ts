import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ServerService {
  REST_API_SERVER = '';
  SERVER_CONTEXT_PATH = '/sco90-service/services';
  API_BASE_URL = this.REST_API_SERVER + this.SERVER_CONTEXT_PATH;

  getHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/x-www-form-urlencoded'
    })
  };

  constructor(private http: HttpClient) {}

  public httpCallApi(method: string, apiPath: string, formData: string, headers: any) {
    if (!headers) {
      headers = this.httpOptions;
    }

    if (method === 'POST') {
      return this.http.post(this.API_BASE_URL + apiPath, formData, headers);
    }

    return this.http.get(this.API_BASE_URL + apiPath, headers);
  }
}
