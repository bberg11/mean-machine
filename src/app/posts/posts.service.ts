import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private endpoint = 'http://localhost:3000/api/posts';
  private posts: Post[] = [];
  postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

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

  updatePost(id: string, updatedPost: Post): void {
    const postIndex = this.posts.findIndex((post) => post._id === id);

    this.http
      .patch<{ message: string; post: Post }>(
        `${this.endpoint}/${id}`,
        updatedPost
      )
      .subscribe((response) => {
        this.posts[postIndex] = response.post;
        this.postsUpdated.next([...this.posts]);

        console.log(response.message);
      });
  }

  addPost(post: Post): void {
    this.http
      .post<{ message: string; post: Post }>(this.endpoint, post)
      .subscribe((response) => {
        this.posts.push(response.post);
        this.postsUpdated.next([...this.posts]);

        console.log(response.message);
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
