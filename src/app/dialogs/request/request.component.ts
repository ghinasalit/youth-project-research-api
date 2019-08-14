import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {AppService} from '../../app.service';
import {Paper} from '../../../classes/paper';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-request',
    templateUrl: './request.component.html',
    styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
    public paper_id: number;
    paper = new Paper();
    requestForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<RequestComponent>,
                private _appService: AppService,
                private fb: FormBuilder,
                private toaster: ToastrService) {

        this.requestForm = fb.group({


            'description': [null, Validators.required],

        });
    }

    sendRequest() {
        this.paper.message = this.requestForm.controls.description.value;
        this.paper.paper_id = this.paper_id;



        this._appService.api.sedRequsetService(this.paper)
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    this.toaster.success('Your request has been sent successfully', 'success');
                    this.dialogRef.close();
                } else {
                    this.toaster.error(result.msg, 'Failed');


                }
            });
    }


    ngOnInit() {
    }

}
