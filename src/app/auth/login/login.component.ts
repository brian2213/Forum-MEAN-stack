import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(public authService: AuthService) {}
  private authSubs: Subscription;
  isLoading = false;

  ngOnInit() {
    this.authSubs = this.authService
      .getAuthStatusListener()
      .subscribe(authstatus => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.authSubs.unsubscribe();
  }

  onLogIn(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }
}
