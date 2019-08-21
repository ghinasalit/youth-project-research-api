import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../classes/user';
import {MatDialog} from '@angular/material';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {AppService} from '../../app.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  collapsed = false;
  hide = true;
  loginForm: FormGroup;
  result: any;
  user = new User();
  private trans = {
    CheckYourEmail: null,
  };
  constructor( private fb: FormBuilder,
               private toaster: ToastrService,
               private translate: TranslateService,
               public dialog: MatDialog,
               public _appService: AppService) {

    this.loginForm = fb.group({

      'email': [null, [Validators.required, Validators.pattern(this._appService.isEmail)]],
    });

    translate.get(['_CheckYourEmail']).subscribe(res => {

      this.trans.CheckYourEmail = res._CheckYourEmail;

    });

    translate.onLangChange.subscribe(lang => {

      this.trans.CheckYourEmail = lang.translate._CheckYourEmail;


    });
  }

  email = new FormControl('', [Validators.required, Validators.email]);


  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }


  sendConfirmEmail(){
    this.user.email = this.loginForm.controls.email.value;
    this._appService.api.sendConfirmEmailService(this.user)
        .subscribe(response => {

          this.result = response;

          if (this.result.code === 1) {
            this.toaster.error(this.trans.CheckYourEmail , '');


          } else {
            this.toaster.error(this.result.msg, '');

          }

        });

  }


  ngOnInit() {

    window.scrollTo( 0, 0);
  }

}
