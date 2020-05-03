import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from './../posts.service';
import { Post } from './../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  editMode = false;
  post: Post;
  id: string;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.postsService.postsUpdated.subscribe(() => {
      if (this.id) {
        this.post = this.postsService.getPost(this.id);
      }
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id');

      if (this.id) {
        this.editMode = true;
        this.post = this.postsService.getPost(this.id);
      }
    });
  }

  onSubmit(form: NgForm): void {
    const post: Post = {
      title: form.value.title,
      content: form.value.content,
    };

    if (this.editMode) {
      this.postsService.updatePost(this.post._id, post);
    } else {
      this.postsService.addPost(post);
    }

    form.resetForm();
  }
}
