import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostsService } from './../posts.service';
import { Post } from './../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  constructor(private postsService: PostsService) {}

  onAddPost(form: NgForm): void {
    const post: Post = {
      title: form.value.title,
      content: form.value.content,
    };

    this.postsService.addPost(post);

    form.resetForm();
  }
}
