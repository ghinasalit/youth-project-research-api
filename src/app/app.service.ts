import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import * as AOS from 'aos';
import {DataService} from '../services/data.service';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public fileName: string;
    public session: string;
    public language = new BehaviorSubject<string>(null);
    currentLanguage: string;
    public isEmail: any = /^[\w\-\.]{2,}\@[a-zA-Z-0-9]{2,}\.[\w\-]{2,4}$/;


    constructor(private translate: TranslateService , public api: DataService) {
        /** Language Configurations **/
        if (!localStorage.getItem('language')) {
            localStorage.setItem('language', 'en');
        }

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
}
