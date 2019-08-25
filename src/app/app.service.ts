import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import * as AOS from 'aos';
import {DataService} from '../services/data.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {User} from '../classes/user';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public fileName = '';
    public active = 0;
    public goPapers = false;
    public section: any;
    public roll: any;
    public username = '';
    public user = new User();
    public registerPageTitle = 0; // 0 for default ; 1 for save bookmark ; 2 for submit paper ; 3 for view paper
    public paper = new FormData();
    public language = new BehaviorSubject<string>(null);
    public roleNotifier = new BehaviorSubject<any>(null);
    public countiesNotifier = new BehaviorSubject<any>(null);
    public disciplinesNotifier = new BehaviorSubject<any>(null);
    public yearsNotifier = new BehaviorSubject<any>(null);
    currentLanguage: string;
    public isEmail: any = /^[\w\-\.]{2,}\@[a-zA-Z-0-9]{2,}\.[\w\-]{2,4}$/;


    constructor(private translate: TranslateService,
                public api: DataService, private router: Router ,
                private toaster: ToastrService) {
        /** Language Configurations **/
        if (!localStorage.getItem('language')) {
            localStorage.setItem('language', 'en');
        }

        // if (localStorage.getItem('username')) {
        //     this.username = localStorage.getItem('username');
        // }


        const browserLang = localStorage.getItem('language');
        translate.setDefaultLang(browserLang.match(/en|ar/) ? browserLang : 'en');
        this.language.next(browserLang);

        /** Animations Trigger **/
        AOS.init({
            disable: window.outerWidth < 376,
            useClassNames: window.outerWidth > 375
        });
    }

    /* Switch Language */
    switchLanguage(language: string) {
        localStorage.setItem('language', language);
        this.translate.use(language);
        this.language.next(language);
    }


    clearLocalStorage() {
        this.roll = 0;
        localStorage.setItem('username', '');

    }


    getCounties() {

        this.user.language = localStorage.getItem('language') === 'en' ? 1 : 2
        this.api.getCountriesService(this.user)
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    this.countiesNotifier.next(result.data);
                } else {

                }

            });

    }

    getDisciplines() {
        this.api.getDisciplinesService()
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    this.disciplinesNotifier.next(result.data);
                } else {

                }

            });

    }

    get_years() {
        this.api.getYearsService()
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    this.yearsNotifier.next(result.data);
                } else {

                }

            });

    }

    getRoll() {
        this.api.getRollService()
            .subscribe(response => {
                this.roll = response;
                if(this.roll === 0){
                    localStorage.setItem('username', '');

                }
                this.roleNotifier.next(response);
            });

    }

    authenticatedUser() {
        if (this.roll === 0) {
            return false;
        }
        return true;
    }

    authenticatedLoginUser() {
        if (this.roll === 1) {
            return false;
        }
        return true;
    }

    submitPaper() {
        if (this.roll === 1) {
            this.router.navigate(['/upload-paper']);

        } else {
            this.registerPageTitle = 2;
            this.router.navigate(['/register']);

        }
    }

    logout() {
        this.api.logoutService()
            .subscribe(response => {
                let result
                result = response;

                if (result === '1') {

                    this.clearLocalStorage();
                    this.router.navigate(['/home']);

                } else {
                    this.toaster.error(result.msg, 'Failed');

                }

            });
    }
}
