import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { isEmpty } from 'lodash';

import { PostsService } from './../posts.service';
import { Post } from './../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  form: FormGroup;
  editMode = false;
  post: Post;
  id: string;
  imagePreview;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      content: new FormControl(null, Validators.required),
      image: new FormControl(null),
    });

    this.postsService.postsUpdated.subscribe(() => {
      if (this.id) {
        this.setUpEditForm();
      }
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id');

      if (this.id) {
        this.setUpEditForm();
      }
    });
  }

  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();

    this.form.patchValue({
      image: file,
    });

    this.form.get('image').updateValueAndValidity();

    reader.onload = (): void => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    const post: Post = {
      title: this.form.value.title,
      content: this.form.value.content,
    };

    if (this.editMode) {
      this.postsService.updatePost(this.post._id, post);
    } else {
      this.postsService.addPost(post);
    }

    this.form.reset();
  }

  setUpEditForm(): void {
    this.editMode = true;
    this.post = this.postsService.getPost(this.id);

    if (isEmpty(this.post)) {
      return;
    }

    this.form.setValue({
      title: this.post.title,
      content: this.post.content,
      image: null,
    });
  }
}
