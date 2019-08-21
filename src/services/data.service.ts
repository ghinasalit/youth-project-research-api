import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';
import {User} from '../classes/user';
import {Feedback} from '../classes/feedback';
import {Paper} from '../classes/paper';
import {HttpClient} from '@angular/common/http';
import {Shared} from '../classes/shared';
import {AppService} from '../app/app.service';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(public api: ApiService, private _http: HttpClient) {
    }

    registerService(data: Object): Observable<Object> {
        return this.api.submitPage('register', data);
    }

    updateProfileService(data: User): Observable<Object> {
        return this.api.submitPage('update_profile', data);
    }

    loginService(data: User): Observable<Object> {
        return this.api.submitPage('login', data);
    }

    logoutService(): Observable<Object> {
        return this.api.getDataPage('logout');
    }

    getMemberService(data: Shared): Observable<Object> {
        return this.api.submitPage('get_member', data);
    }

    getMemberLoggedinService(): Observable<Object> {
        return this.api.getDataPage('get_member_logged_in');
    }

    feedbackService(data: Feedback): Observable<Object> {
        return this.api.submitPage('add_feedback', data);
    }


    getMembersService(data: any): Observable<Object> {
        return this.api.submitPage('get_members', data);
    }

    searchMemeberService(data: any): Observable<Object> {
        return this.api.submitPage('search_member', data);
    }

    getPapersService(data: any): Observable<Object> {
        return this.api.submitPage('get_published_papers', data);
    }

    isHaveAccessService(data: any): Observable<Object> {
        return this.api.submitPage('is_have_access', data);
    }

    savePaperService(data: any): Observable<Object> {
        return this.api.submitPage('save_paper', data);
    }

    sedRequsetService(data: any): Observable<Object> {
        return this.api.submitPage('send_request_paper', data);
    }

    acceptRequsetService(data: any): Observable<Object> {
        return this.api.submitPage('accept_request_paper', data);
    }

    addViewService(data: any): Observable<Object> {
        return this.api.submitPage('add_view', data);
    }

    addDownloadService(data: any): Observable<Object> {
        return this.api.submitPage('add_download', data);
    }

    unsavePaperService(data: any): Observable<Object> {
        return this.api.submitPage('unsave_paper', data);
    }

    searchPaperByMemberService(data: any): Observable<Object> {
        return this.api.submitPage('search_paper_by_member', data);
    }

    searchPapersService(data: any): Observable<Object> {
        return this.api.submitPage('search_paper', data);
    }

    getStatisticsService(): Observable<Object> {
        return this.api.getDataPage('statistics');
    }


    editPaperService(data: Paper): Observable<Object> {
        return this.api.submitPage('edit_paper', data);
    }

    savePasswordService(data: User): Observable<Object> {
        return this.api.submitPage('reset_password', data);
    }

    getPaperService(data: Paper): Observable<Object> {
        return this.api.submitPage('get_paper', data);
    }

    sendConfirmEmailService(data: User): Observable<Object> {
        return this.api.submitPage('send_email_reset_password', data);
    }

    getOneRecognizedService(data: object): Observable<Object> {
        return this.api.submitPage('get_one_recognizes_researched', data);
    }

    getBbookmarksService(data: object): Observable<Object> {
        return this.api.submitPage('get_bookmarks', data);
    }

    getCountriesService(): Observable<Object> {
        return this.api.getDataPage('get_countries');
    }

    getYearsService(): Observable<Object> {
        return this.api.getDataPage('get_years');
    }


    getDisciplinesService(): Observable<Object> {
        return this.api.getDataPage('get_disciplines');
    }

    isUserExistService(data): Observable<Object> {
        return this.api.submitPage('is_user_exist', data);
    }

    sendPaperService(data: FormData): Observable<Object> {
        return this.api.uploadImagePage('add_paper', data);
    }

    getUniversitiesService(): Observable<Object> {
        return this.api.getDataPage('get_universities');
    }


    getTagsService(): Observable<Object> {
        return this.api.getDataPage('get_tags');
    }

    getRollService(): Observable<Object> {
        return this.api.getDataPage('get_roll');
    }

    getPapersByMemberService(data): Observable<Object> {
        return this.api.submitPage('get_papers_by_member', data);
    }


    downloadNoteReceipt(filename: string): Observable<Blob> {
        return this._http.get(this.api.imgURL + filename, {responseType: 'blob'});
    }


}

