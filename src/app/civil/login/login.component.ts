import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../classes/user';
import {MatDialog} from '@angular/material';
import {AppService} from '../../app.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    collapsed = false;
    hide = true;
    loginForm: FormGroup;
    result: any;
    user = new User();
    private trans = {
        AccountNotActive: null,

    };

    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private toaster: ToastrService,
                private router: Router,
                private translate: TranslateService,
                private route: ActivatedRoute,
                public _appService: AppService) {

        this.loginForm = fb.group({


            'email': [null, [Validators.required, Validators.pattern(this._appService.isEmail)]],
            'password': [null, Validators.required,],

        });

        translate.get(['_AccountNotActive']).subscribe(res => {

            this.trans.AccountNotActive = res._AccountNotActive;
        });

        translate.onLangChange.subscribe(lang => {

            this.trans.AccountNotActive = lang.translations._AccountNotActive;

        });
    }


    email = new FormControl('', [Validators.required, Validators.email]);
    password = new FormControl('', [Validators.required]);


    getErrorMessage() {
        return this.email.hasError('required') ? 'You must enter a value' :
            this.email.hasError('email') ? 'Not a valid email' :
                '';
    }


    login() {
        this.user.email = this.loginForm.controls.email.value;
        this.user.password = this.loginForm.controls.password.value;
        this._appService.api.loginService(this.user)
            .subscribe(response => {

                this.result = response;

                if (this.result.code === 1) {
                    this._appService.getRoll();
                    localStorage.setItem('username', this.result.data.username);
                    localStorage.setItem('id', this.result.data.member_id);
                    if (this._appService.goPapers === true) {
                        this.router.navigate(['/papers']);
                        this._appService.goPapers = false;

                    } else {
                        this.router.navigate(['/home']);

                    }

                } else if (this.result.code === -99) {
                    this.toaster.error('Your account not active', '');

                } else {
                    this.toaster.error(this.result.msg, '');

                }

            });

    }

    activeMember() {
        this._appService.api.activeMemberService(this.user)
            .subscribe(response => {
                this.result = response;
                if (this.result.code === 1) {

                } else {

                }

            });

    }


    ngOnInit() {
        window.scrollTo(0, 0);
        this.route.params.subscribe(params => {
            this.user.activation_code = params['id'];
            if (this.user.activation_code) {
                this.activeMember();
            }

        });

    }

}
