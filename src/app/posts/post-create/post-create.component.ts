import { Component, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Post } from './../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  @Output() postAdded = new EventEmitter<Post>();

  onAddPost(form: NgForm): void {
    const post: Post = {
      title: form.value.title,
      content: form.value.content,
    };

    this.postAdded.emit(post);
    form.resetForm();
  }
}
