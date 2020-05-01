import { Component } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.styles.css'],
})
export class PostCreateComponent {
  enteredContent = '';
  postValue = '';

  onAddPost() {
    this.postValue = this.enteredContent;
  }
}
