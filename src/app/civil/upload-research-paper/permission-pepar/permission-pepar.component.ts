import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {AppService} from '../../../app.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {ConditionsComponent} from '../../../dialogs/conditions/conditions.component';

@Component({

    selector: 'app-permission-pepar',
    templateUrl: './permission-pepar.component.html',
    styleUrls: ['./permission-pepar.component.css']
})
export class PermissionPeparComponent implements OnInit {
    permissionForm: FormGroup;
    result: any;

    constructor(private fb: FormBuilder,
                private toaster: ToastrService,
                private  router: Router,
                public dialog: MatDialog,
                public  appService: AppService) {

        this.permissionForm = fb.group({

            'permission': [null, Validators.required],
            'conditions': [null, Validators.required]
        });
    }


    sendPaper() {
        this.appService.paper.append('permission', this.permissionForm.controls.permission.value);
        this.appService.paper.append('status', '0');
        this.appService.api.sendPaperService(this.appService.paper)
            .subscribe(response => {

                this.result = response;

                if (this.result.code === 1) {
                    this.toaster.success('The request have sent successfully ', 'success');

                    setTimeout(() => {
                        this.router.navigate(['/profile' , localStorage.getItem('username') ]);
                    }, 2000);


                } else {
                    this.toaster.error(this.result.msg, 'Failed');

                }

            });

    }

    openDialog() {
        const dialogRef = this.dialog.open(ConditionsComponent);

    }

    ngOnInit() {


        if(this.appService.fileName == ''){
            this.router.navigate(['/upload-paper']);

        }
    }

}
