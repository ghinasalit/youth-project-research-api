import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, DialogRole} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../../app.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';


@Component({
    selector: 'app-profile-info',
    templateUrl: './profile-info.component.html',
    styleUrls: ['./profile-info.component.css']
})


export class ProfileInfoComponent implements OnInit {
    public user: any;
    profileForm: FormGroup;
    result: any;
    university = new FormControl('', [Validators.required]);
    public animals = [
        {name: 'Dog', sound: 'Woof!'},
        {name: 'Cat', sound: 'Meow!'},
        {name: 'Cow', sound: 'Moo!'},
        {name: 'Fox', sound: 'Wa-pa-pa-pa-pa-pa-pow!'},
    ];

    constructor(private fb: FormBuilder,
                public _appService: AppService,
                private toaster: ToastrService,
                private router: Router ,
                public dialogRef: MatDialogRef<ProfileInfoComponent>) {
        this.profileForm = fb.group({

            'university': [null, Validators.required],
            'job': '',
            'location': '',
            'phone': '',
            'description': '',
            'Linkedin': '',

        });
    }


    register() {

        this.user.university = this.profileForm.controls.university.value;
        this.user.job = this.profileForm.controls.job.value;
        this.user.location = this.profileForm.controls.location.value;
        this.user.phone = this.profileForm.controls.phone.value;
        this.user.Linkedin = this.profileForm.controls.Linkedin.value;
        this.user.description = this.profileForm.controls.description.value;
        this._appService.api.registerService(this.user)
            .subscribe(response => {

                this.result = response;

                if (this.result.code === 1) {
                    this.dialogRef.close();
                    localStorage.setItem('logged', '1');
                    this.router.navigate(['/']);
                } else {

                    this.toaster.error(this.result.msg, 'Failed');

                }

            });

    }

    ngOnInit() {


    }

}
