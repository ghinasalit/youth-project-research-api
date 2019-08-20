import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../classes/user';
import {MatDialog} from '@angular/material';
import {AppService} from '../../app.service';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';


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
  constructor( private fb: FormBuilder,
               public dialog: MatDialog,
               private toaster: ToastrService,
               private router: Router,
               public _appService: AppService) {

    this.loginForm = fb.group({


      'email': [null, [Validators.required, Validators.pattern(this._appService.isEmail)]],
      'password': [null, Validators.required , ],

    });
  }


  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);


  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }


  login(){
    this.user.email = this.loginForm.controls.email.value;
    this.user.password = this.loginForm.controls.password.value;
    this._appService.api.loginService(this.user)
        .subscribe(response => {

          this.result = response;

          if (this.result.code === 1) {
            this._appService.getRoll();
            localStorage.setItem('username', this.result.data.username);
            this.router.navigate(['/home']);

          } else {
            this.toaster.error(this.result.msg, 'Failed');

          }

        });

  }



  ngOnInit() {
    window.scrollTo( 0, 0);

  }

}
