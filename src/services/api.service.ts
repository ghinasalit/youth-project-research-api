import {Injectable, isDevMode} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../classes/user';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public apiURL: string;
    public imgURL: string;

    constructor(private http: HttpClient) {
        this.getAbsoluteDomainUrl();
    }

    public getAbsoluteDomainUrl(): string {
        if (isDevMode()) {
            this.apiURL = '/src/app/api/user/';
            this.imgURL = 'src/app/api/uploaded/';
        } else {
            if (window
                && 'location' in window
                && 'protocol' in window.location
                && 'host' in window.location) {
                this.apiURL = window.location.protocol + '//' + window.location.host + '/api/user/';
                this.imgURL = 'api/uploaded/';
            }
        }
        return null;
    }

    submitPage(func, data): Observable<Object> {
        let headers = new HttpHeaders();
        const lang = localStorage.getItem('language') ;
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
            .set('Accept-Language', lang)
            .set('Authorization', '12345')
            .set('Platform', '1')
            .set('Os-Version', '1')
            .set('Mobile-Brand', '1')
            .set('App-Version', '1');
        return this.http.post(
            this.apiURL + func
            , JSON.stringify(data), {
                headers: headers
            }).pipe(map(res => res));
    }


    getDataPage(func): Observable<Object> {
        let headers = new HttpHeaders();
        const lang = localStorage.getItem('language') ;
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
            .set('Accept-Language', lang)
            .set('Authorization', '12345')
            .set('Platform', '1')
            .set('Os-Version', '1')
            .set('Mobile-Brand', '1')
            .set('App-Version', '1');
        return this.http.get(
            this.apiURL + func
            , {
                headers: headers
            }).pipe(map(res => res));
    }


        uploadImagePage(func, data: FormData): Observable<any> {

            let headers = new HttpHeaders();
        const lang = localStorage.getItem('language') ;
        headers = headers.set('Accept-Language', lang)
            .set('Accept', 'application/json')
            .set('Authorization', '12345')
            .set('Platform', '1')
            .set('Os-Version', '1')
            .set('Mobile-Brand', '1')
            .set('App-Version', '1');

        return this.http.post(
            this.apiURL + func
            , data, {
                headers: headers
            }).pipe(map(res => res));
    }

}
