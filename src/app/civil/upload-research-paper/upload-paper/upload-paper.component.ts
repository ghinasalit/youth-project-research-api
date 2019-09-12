import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../../../app.service';
import {Route, Router} from '@angular/router';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
    selector: 'app-upload-paper',
    templateUrl: './upload-paper.component.html',
    styleUrls: ['./upload-paper.component.css']
})
export class UploadPaperComponent implements OnInit {
    collapsed = false;
    uploadPaper: FormGroup;
    @ViewChild('File') InputFile;
    UploadFiles: File;
    fileName: string;
    public files: NgxFileDropEntry[] = [];
    constructor(private fb: FormBuilder ,
                private router: Router,
                public appService: AppService) {

        this.uploadPaper = fb.group({
            'File': [''],
        });
    }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          // console.log(file);
          if (file) {
            this.UploadFiles = file;
            if (this.UploadFiles['type'] === 'application/pdf') { // console.log(file.name);
              this.appService.fileName = this.UploadFiles['name'];
              this.appService.paper.append('file' , this.UploadFiles );

            } else {
              this.clearFile();

            }
          }
          /**
           // You could upload it like this:
           const formData = new FormData()
           formData.append('logo', file, relativePath)

           // Headers
           const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

           this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
           .subscribe(data => {
            // Sanitized logo returned from backend
          })
           **/

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  /*public fileOver(event){
    console.log(event);
  }

  public fileLeave(event){
    console.log(event);
  }*/

    getFile() {
        const file = this.InputFile.nativeElement;
        if (file.files && file.files[0]) {
            this.UploadFiles = file.files[0];
            if (this.UploadFiles['type'] === 'application/pdf') {
                this.appService.fileName = this.UploadFiles['name'];
                this.appService.paper.append('file' , this.UploadFiles );

            } else {
                this.clearFile();

            }
        }
    }


    clearFile() {
        this.uploadPaper.reset();
        const file = this.InputFile.nativeElement;
        this.UploadFiles = file.files[0];

    }

    ngOnInit() {
    }

}
