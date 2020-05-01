import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  title = '';
  content = '';
  @Output() postAdded = new EventEmitter();

  onAddPost(): void {
    const post = {
      title: this.title,
      content: this.content,
    };

    this.postAdded.emit(post);
  }
}
