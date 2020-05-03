import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

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

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.posts = this.postsService.updatePosts();

    this.postsUpdated = this.postsService.postsUpdated.subscribe((posts) => {
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {
    this.postsUpdated.unsubscribe();
  }

  onDelete(post: Post): void {
    this.postsService.deletePost(post);
  }
}
