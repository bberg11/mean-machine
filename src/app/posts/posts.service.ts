import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { Post } from './post.model';
import { PageEvent } from '@angular/material/paginator';

const endpoint = `${environment.api}/posts`;

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  totalPosts = 0;
  perPage = 5;
  paginationOptions = [5, 10, 25, 100];
  currentPage = 1;
  postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(): void {
    const queryParams = `?perPage=${this.perPage}&currentPage=${this.currentPage}`;
    this.http
      .get<{ posts: Post[]; totalPosts: number }>(endpoint + queryParams)
      .subscribe((response) => {
        console.log(response);

        this.posts = response.posts;
        this.totalPosts = response.totalPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id: string): Observable<{ post: Post }> {
    return this.http.get<{ post: Post }>(`${endpoint}/${id}`);
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
      .patch<{ message: string; post: Post }>(`${endpoint}/${id}`, formData)
      .subscribe((response) => {
        console.log(response);

        this.posts[postIndex] = response.post;
        this.postsUpdated.next([...this.posts]);

        this.router.navigate(['/']);
      });
  }

  addPost(post: Post, image: File): void {
    const postData = new FormData();

    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image);

    this.http
      .post<{ message: string; post: Post }>(endpoint, postData)
      .subscribe((response) => {
        console.log(response);

        this.posts.push(response.post);
        this.postsUpdated.next([...this.posts]);
        this.totalPosts = this.posts.length;

        this.router.navigate(['/']);
      });
  }

  deletePost(postToDelete: Post): void {
    this.http
      .delete<{ message: string }>(`${endpoint}/${postToDelete._id}`)
      .subscribe((response) => {
        console.log(response);

        this.posts = this.posts.filter((post) => {
          return post._id !== postToDelete._id;
        });
        this.postsUpdated.next([...this.posts]);
        this.totalPosts = this.posts.length;
      });
  }

  onPaginationChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.perPage = event.pageSize;

    this.getPosts();
  }
}
