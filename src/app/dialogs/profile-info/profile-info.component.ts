import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../../app.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {User} from '../../../classes/user';
import {variable} from '@angular/compiler/src/output/output_ast';


@Component({
    selector: 'app-profile-info',
    templateUrl: './profile-info.component.html',
    styleUrls: ['./profile-info.component.css']
})


export class ProfileInfoComponent implements OnInit {
    public user = new User();
    profileForm: FormGroup;
    result: any;
    universities: any;
    fileName: string;
    university = new FormControl('', [Validators.required]);
    imageChangedEvent: any = '';
    croppedImage: any = 'assets/img/avatar_default.PNG';



    constructor(private fb: FormBuilder,
                public _appService: AppService,
                private toaster: ToastrService,
                private router: Router,
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

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;

    }

    imageCropped(image: string) {
        this.croppedImage = image;
    }

    imageLoaded() {
        // console.log('loaded');
    }

    loadImageFailed() {
        // console.log('failed');
    }

    register() {
        this.user.university = this.profileForm.controls.university.value;
        this.user.job = this.profileForm.controls.job.value;
        this.user.location = this.profileForm.controls.location.value;
        this.user.phone = this.profileForm.controls.phone.value;
        this.user.Linkedin = this.profileForm.controls.Linkedin.value;
        this.user.description = this.profileForm.controls.description.value;
        this.user.avatar = this.croppedImage.base64 ? this.croppedImage.base64 : '';
        console.log(this.user);
        this._appService.api.registerService(this.user)
            .subscribe(response => {

                this.result = response;

                if (this.result.code === 1) {
                    this._appService.getRoll();
                    localStorage.setItem('username', this.result.data.username);

                    this.dialogRef.close();
                    this.router.navigate(['/']);
                } else {

                    this.toaster.error(this.result.msg, 'Failed');

                }

            });

    }


    getUniversities() {
        this._appService.api.getUniversitiesService()
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    this.universities = result.data;
                } else {

                }

            });

    }

    ngOnInit() {

        this.getUniversities();



    }

}
