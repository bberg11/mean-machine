import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  postsUpdated = new Subject<Post[]>();

  getPosts(): Post[] {
    return [...this.posts];
  }

  addPost(post: Post): void {
    this.posts.unshift(post);
    this.postsUpdated.next([...this.posts]);
  }
}
