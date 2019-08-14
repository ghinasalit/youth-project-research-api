import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app.service';
import {Paper} from '../../../classes/paper';

@Component({
    selector: 'app-accept-request',
    templateUrl: './accept-request.component.html',
    styleUrls: ['./accept-request.component.css']
})
export class AcceptRequestComponent implements OnInit {
    paper = new Paper();
    counter = 5;

    constructor(private route: ActivatedRoute, private _appService: AppService, private router: Router) {
    }


    acceptRequest() {
        this._appService.api.acceptRequsetService(this.paper)
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    // this.toaster.success('Your request has been sent successfully', 'success');
                    // this.dialogRef.close();
                } else {
                    // this.toaster.error(result.msg, 'Failed');


                }
            });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.paper.activation_id = params['id'];
            this.acceptRequest();
        });

        setInterval(() => {
            this.counter = this.counter - 1;
            if (this.counter === 0) {
                this.router.navigate(['/home']);
            }
        }, 1000);
    }

}
