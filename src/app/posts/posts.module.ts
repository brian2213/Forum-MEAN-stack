import { NgModule } from '../../../node_modules/@angular/core';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { ReactiveFormsModule } from '../../../node_modules/@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '../../../node_modules/@angular/common';
import { RouterModule } from '../../../node_modules/@angular/router';

@NgModule({
  declarations: [PostListComponent, PostCreateComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ]
})
export class PostsModule {}
