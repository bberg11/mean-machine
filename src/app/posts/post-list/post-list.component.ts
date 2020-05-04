import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from './../../auth/auth.service';
import { PostsService } from './../posts.service';
import { Post } from './../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postsUpdated: Subscription;
  userId: string;
  userIsAuthenticated = false;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.postsService.getPosts();
    this.userId = this.authService.getId();

    this.postsUpdated = this.postsService.postsUpdated.subscribe((posts) => {
      this.posts = posts;
    });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userId = this.authService.getId();
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    this.postsUpdated.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(post: Post): void {
    this.postsService.deletePost(post);
  }
}
