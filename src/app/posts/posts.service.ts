import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts(): void {
    this.http
      .get<{ posts: Post[] }>('http://localhost:3000/api/posts')
      .subscribe((response) => {
        this.posts = response.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  addPost(post: Post): void {
    this.http.post('http://localhost:3000/api/posts', post).subscribe(() => {
      this.posts.unshift(post);
      this.postsUpdated.next([...this.posts]);
    });
  }
}
