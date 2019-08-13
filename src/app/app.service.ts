import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import * as AOS from 'aos';
import {DataService} from '../services/data.service';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public fileName = '';
    public roll: any;
    public username = '';
    public registerPageTitle = 0; // 0 for default ; 1 for save bookmark ; 2 for submit paper ; 3 for view paper
    public paper = new FormData();
    public language = new BehaviorSubject<string>(null);
    public roleNotifier = new BehaviorSubject<any>(null);
    currentLanguage: string;
    public isEmail: any = /^[\w\-\.]{2,}\@[a-zA-Z-0-9]{2,}\.[\w\-]{2,4}$/;


    constructor(private translate: TranslateService, public api: DataService, private router: Router) {
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
}
