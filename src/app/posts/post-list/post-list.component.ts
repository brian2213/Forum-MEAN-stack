import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  constructor(public postService: PostsService) {}
  private postSub: Subscription;
  isLoading = false;

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }
  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postSub = this.postService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
