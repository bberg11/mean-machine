import { Component, OnInit } from '@angular/core';

import { PostsService } from './posts/posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.getPosts();
  }
}
