import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AppService} from '../../app.service';
import {Paper} from '../../../classes/paper';
@Component({
  selector: 'app-university-verification',
  templateUrl: './university-verification.component.html',
  styleUrls: ['./university-verification.component.css']
})
export class UniversityVerificationComponent implements OnInit {

  paper = new Paper();
  counter = 5;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              public _appService: AppService) {


  }

  universityVerification() {

    this.paper.v_status = this.activatedRoute.snapshot.url[1].path;
    // tslint:disable-next-line:radix
    this.paper.paper_id = parseInt(this.activatedRoute.snapshot.url[2].path);
    this.paper.v_code = this.activatedRoute.snapshot.url[3].path;

    this._appService.api.universityVerificationService(this.paper)
      .subscribe(response => {
        let result;
        result = response; //console.log(result);
        if (result.code === 1) {
          this.router.navigate(['/home']);
        } else {
          //this.router.navigate(['/home']);
        }
      });
  }

  ngOnInit() {
    this.universityVerification();
  }

}
