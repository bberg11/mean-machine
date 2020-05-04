import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from './../posts.service';
import { Post } from './../post.model';
import { mimeType } from './mime-type.validator';

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
  imagePreview: string | ArrayBuffer;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { asyncValidators: [mimeType] }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id');

      if (this.id) {
        this.postsService.getPost(this.id).subscribe((response) => {
          this.post = response.post;
          this.setUpEditForm();
        });
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
      this.postsService.updatePost(this.post._id, post, this.form.value.image);
    } else {
      this.postsService.addPost(post, this.form.value.image);
    }

    this.form.reset();
  }

  setUpEditForm(): void {
    this.editMode = true;
    this.imagePreview = this.post.imagePath;

    this.form.setValue({
      title: this.post.title,
      content: this.post.content,
      image: this.post.imagePath || null,
    });
  }
}
