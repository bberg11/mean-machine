import { Component, Output, EventEmitter } from '@angular/core';

import { Post } from './../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  title = '';
  content = '';
  @Output() postAdded = new EventEmitter<Post>();

  onAddPost(): void {
    const post: Post = {
      title: this.title,
      content: this.content,
    };

    this.postAdded.emit(post);
  }
}
