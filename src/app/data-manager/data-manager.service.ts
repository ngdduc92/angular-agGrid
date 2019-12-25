import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RailincUserService } from '@railinc/rl-common-ui-lib';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ServerService } from '../shared/server.service';

@Injectable({ providedIn: 'root' })
export class DataManagerService extends ServerService{

    constructor(private httpClient: HttpClient) {
        super(httpClient);
    }

    getAppConfigs() {
        //return this.httpClient.get('/assets/mock-data/tableConfig.json', {headers: this.getHeaders})
        return this.httpClient.get(this.API_BASE_URL +  '/view/appConfig/' + Date.now(), {headers: this.getHeaders})
        .pipe(
            map((data) => {
                return data['AppConfig'];
            }), catchError( error => {
                return throwError( 'tableConfig not found!' );
            })
        );
    }

    getTableData(tableConfig) {
        //return this.httpClient.get('/assets/mock-data/master.json', {headers: this.getHeaders}
        return this.httpClient.get(this.REST_API_SERVER + tableConfig.UrlView + '/includeHistory/N/' + Date.now(), {headers: this.getHeaders}
        ).pipe(
            map((data) => {
                return data;
            }), catchError( error => {
                return throwError( tableConfig.DisplayName + ' not found!' );
            })
        );
    }

    getMasterReasonCodes() {
        //return this.httpClient.get('/assets/mock-data/masterReasonCodes.json', {headers: this.getHeaders}
        return this.httpClient.get(this.API_BASE_URL + '/view/masterReasonCodes', {headers: this.getHeaders}
        ).pipe(
            map((data) => {
                return data;
            }), catchError( error => {
                return throwError( 'Master Reason Codes not found!' );
            })
        );
    }

    addTableData(tableConfig, data) {
        const postParams = Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
        return this.httpClient.post(this.REST_API_SERVER + tableConfig.UrlAdd , postParams, this.httpOptions)
        .pipe(
            map((res) => {
                return this.handlePostServiceDataRespond(res);
            }), catchError( error => {
                return throwError( 'Add Table ' + tableConfig.DisplayName + ' Data error!' );
            })
        );
    }
    
    expireTodayData(tableConfig, data) {
        const postParams = Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
        return this.httpClient.post(this.REST_API_SERVER + tableConfig.UrlExpire , postParams, this.httpOptions)
            .pipe(
                map((res) => {
                    return this.handlePostServiceDataRespond(res);
                }), catchError( error => {
                    return throwError( 'Expire Today Data error!' );
                })
            );
    }
    
    revertMasterDraftData(tableConfig, data) {
        const postParams = Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
        return this.httpClient.post(this.API_BASE_URL + '/manage/masterDrafts/revert' , postParams, this.httpOptions)
            .pipe(
                map((res) => {
                    return this.handlePostServiceDataRespond(res);
                }), catchError( error => {
                    return throwError( 'Revert Master Draft Data error!' );
                })
            );
    }
    
    updateTableData(tableConfig, data) {
        const postParams = Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
        return this.httpClient.post(this.REST_API_SERVER + tableConfig.UrlUpdate , postParams, this.httpOptions)
            .pipe(
                map((res) => {
                    return this.handlePostServiceDataRespond(res);
                }), catchError( error => {
                    return throwError( 'Update Table ' + tableConfig.DisplayName + ' Data error!' );
                })
            );
    }

    refreshAllData(tableConfig, data) {
        let sendOption = this.httpOptions;
        sendOption['responseType'] = 'text';
        const postParams = Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
        return this.httpClient.post(this.API_BASE_URL + '/manage/masterDrafts/refreshData' , JSON.parse(JSON.stringify(postParams)), sendOption);
    }

    massUpdate(tableConfig, data) {
        const postParams = Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
        return this.httpClient.post(this.API_BASE_URL + '/manage/masterDrafts/massUpdate/' , postParams, this.httpOptions);
    }
    
    massValidate(tableConfig, data) {
        const postParams = Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
        return this.httpClient.post(this.API_BASE_URL + '/manage/masterDrafts/massValidate' ,  JSON.parse(JSON.stringify(postParams)), this.httpOptions);
    }

    commitChanges(tableConfig, data) {
        const postParams = Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
        return this.httpClient.post(this.API_BASE_URL + '/manage/masterDrafts/commitChanges' ,  JSON.parse(JSON.stringify(postParams)), this.httpOptions);
    }

    handlePostServiceDataRespond(res) {
        const resJson = JSON.parse(JSON.stringify(res));
        if ('Errors' in resJson.RecordContainer[0] && resJson.RecordContainer[0].Errors != null) {
            return resJson.RecordContainer[0].Errors;
        } else {
            return resJson.RecordContainer[0].Record;
        }
    }
}
