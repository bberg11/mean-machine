import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private endpoint = 'http://localhost:3000/api/posts';
  private posts: Post[] = [];
  postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(): void {
    this.http.get<{ posts: Post[] }>(this.endpoint).subscribe((response) => {
      this.posts = response.posts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPost(id: string): Post {
    return { ...this.posts.find((post) => id === post._id) };
  }

  updatePosts(): Post[] {
    return [...this.posts];
  }

  updatePost(id: string, updatedPost: Post, image: string | File): void {
    const postIndex = this.posts.findIndex((post) => post._id === id);
    let formData;

    if (typeof image === 'string') {
      formData = {
        ...updatedPost,
        imagePath: image,
      };
    } else {
      formData = new FormData();
      formData.append('title', updatedPost.title);
      formData.append('content', updatedPost.content);
      formData.append('image', image);
    }

    this.http
      .patch<{ message: string; post: Post }>(
        `${this.endpoint}/${id}`,
        formData
      )
      .subscribe((response) => {
        this.posts[postIndex] = response.post;
        this.postsUpdated.next([...this.posts]);

        console.log(response.message);

        this.router.navigate(['/']);
      });
  }

  addPost(post: Post, image: File): void {
    const postData = new FormData();

    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image);

    this.http
      .post<{ message: string; post: Post }>(this.endpoint, postData)
      .subscribe((response) => {
        this.posts.push(response.post);
        this.postsUpdated.next([...this.posts]);

        console.log(response.message);

        this.router.navigate(['/']);
      });
  }

  deletePost(postToDelete: Post): void {
    this.http
      .delete<{ message: string }>(`${this.endpoint}/${postToDelete._id}`)
      .subscribe((response) => {
        this.posts = this.posts.filter((post) => {
          return post._id !== postToDelete._id;
        });
        this.postsUpdated.next([...this.posts]);

        console.log(response.message);
      });
  }
}
