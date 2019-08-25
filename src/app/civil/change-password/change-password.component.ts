import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../classes/user';
import {MatDialog} from '@angular/material';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  collapsed = false;
  hide = true;
  loginForm: FormGroup;
  result: any;
  user = new User();
  private trans = {
    ChangePasswordMSG: null,
    ChangePasswordFailedMSG: null,

  };

  constructor( private fb: FormBuilder,
               public dialog: MatDialog,
               private toaster: ToastrService,
               private router: Router,
               private translate: TranslateService,
               private route: ActivatedRoute,
               public _appService: AppService) {

    this.loginForm = fb.group({


      'password': [null, [Validators.required]],

    });

    translate.get(['_ChangePasswordMSG', '_ChangePasswordFailedMSG']).subscribe(res => {

      this.trans.ChangePasswordMSG = res._ChangePasswordMSG;
      this.trans.ChangePasswordFailedMSG = res._ChangePasswordFailedMSG;

    });

    translate.onLangChange.subscribe(lang => {

      this.trans.ChangePasswordMSG = lang.translations._ChangePasswordMSG;
      this.trans.ChangePasswordFailedMSG = lang.translations._ChangePasswordFailedMSG;


    });
  }


  password = new FormControl('', [Validators.required]);



  savePassword(){
    this.user.password = this.loginForm.controls.password.value;
    this._appService.api.savePasswordService(this.user)
        .subscribe(response => {

          this.result = response;

          if (this.result.code === 1) {

            this.toaster.success(this.trans.ChangePasswordMSG, '');

            setTimeout(() => {
              this.router.navigate(['/home' ]);
            }, 2000);


          } else {
            this.toaster.error(this.trans.ChangePasswordFailedMSG, '');

          }

        });

  }



  ngOnInit() {
    window.scrollTo( 0, 0);

    this.route.params.subscribe(params => {
      this.user.activation_code = params['id'];

    });

  }

}
