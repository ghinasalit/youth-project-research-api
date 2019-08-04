import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-details-paper',
  templateUrl: './details-paper.component.html',
  styleUrls: ['./details-paper.component.css']
})
export class DetailsPaperComponent implements OnInit {
  paperForm: FormGroup;
  collapsed = false;
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  toppings = new FormControl();

  constructor(private fb: FormBuilder) {

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
