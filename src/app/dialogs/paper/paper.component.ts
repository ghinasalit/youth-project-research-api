import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.css']
})
export class PaperComponent implements OnInit {
public paper: any;
  constructor( public dialogRef: MatDialogRef<PaperComponent> ,
               private _appService: AppService) { }


  download(filename: string , title: string ) {

      this._appService.api.downloadNoteReceipt(filename).subscribe(res => {
        console.log(res);
        var newBlob = new Blob([res], {type: "application/pdf"});

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }
        // For other browsers:
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        link.download = title + ".pdf";
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

        setTimeout(function () {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(data);
        }, 100);

      }, error => {
        console.log(error);
      });
    }



    viewPaper(filename: string){

      window.open('src/app/api/uploaded/' + filename, "_blank");
  }



  ngOnInit() {
  }

}
