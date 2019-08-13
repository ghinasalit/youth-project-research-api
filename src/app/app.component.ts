import {Component, OnInit} from '@angular/core';
import {AppService} from './app.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    styles = {
        bootstrap: '',
        style: '',
        responsive: '',
        components: '',
    };

    constructor(public _appService: AppService) {

    }





    ngOnInit() {
        this._appService.getRoll();
        this._appService.language.subscribe(language => {
            this._appService.currentLanguage = language === 'en' ? 'en' : 'ar';
            switch (language) {
                case 'en':
                    this.styles.bootstrap = 'assets/css/ltr/bootstrap.min.css';
                    this.styles.style = 'assets/css/ltr/style.css';
                    this.styles.components = 'assets/css/ltr/components.css';
                    this.styles.responsive = 'assets/css/ltr/responsive.css';
                    break;
                case 'ar':
                    this.styles.bootstrap = 'assets/css/rtl/bootstrap-ar.css';
                    this.styles.style = 'assets/css/rtl/style.css';
                    this.styles.components = 'assets/css/rtl/components.css';
                    this.styles.responsive = 'assets/css/rtl/responsive.css';
                    break;
            }
        });
    }
}


