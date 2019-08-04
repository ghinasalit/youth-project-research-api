import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';
import {User} from '../classes/user';
import {Feedback} from '../classes/feedback';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private api: ApiService) {
    }

    registerService(data: User): Observable<Object> {
        return this.api.submitPage('register', data);
    }


    loginService(data: User): Observable<Object> {
        return this.api.submitPage('login', data);
    }

    logoutService(data: User): Observable<Object> {
        return this.api.submitPage('logout', data);
    }

    getMemberService(data: User): Observable<Object> {
        return this.api.submitPage('get_member', data);
    }

    feedbackService(data: Feedback): Observable<Object> {
        return this.api.submitPage('add_feedback', data);
    }

    uploadImageService(data: FormData): Observable<Object> {
        return this.api.uploadImagePage('add_paper', data);
    }

}

