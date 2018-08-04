import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
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
  totalPosts = 10;
  postsPerPage = 1;
  curPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  onDelete(postId: string) {
    if (this.posts.length === 1) {
      this.curPage -= 1;
    }
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.curPage);
    });
  }
  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.curPage);
    this.postSub = this.postService
      .getPostUpdateListener()
      .subscribe((fetchedData: { posts: Post[]; count: number }) => {
        this.isLoading = false;
        this.posts = fetchedData.posts;
        this.totalPosts = fetchedData.count;
      });
  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.curPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.curPage);
  }
}
