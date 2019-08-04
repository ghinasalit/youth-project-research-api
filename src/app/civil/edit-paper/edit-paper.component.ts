import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-edit-paper',
  templateUrl: './edit-paper.component.html',
  styleUrls: ['./edit-paper.component.css']
})
export class EditPaperComponent implements OnInit {
  paperForm: FormGroup;
  collapsed = false;
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  toppings = new FormControl();

  constructor(private fb: FormBuilder,
              public _appService: AppService) {

    this.paperForm = fb.group({
      'title': [null, Validators.required],
      'discipline': [null, Validators.required],
      'description': [null, Validators.required],
      'tags': [null, Validators.required],
      'lang': [null, Validators.required],

    });
  }

  title = new FormControl('', [Validators.required]);
  discipline = new FormControl('', [Validators.required]);
  description = new FormControl('', [Validators.required]);
  tags = new FormControl('', [Validators.required]);
  lang = new FormControl('', [Validators.required]);

  savePaper(){
    console.log('test');
  }

  ngOnInit() {
  }

}
