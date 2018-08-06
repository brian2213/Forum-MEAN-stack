import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authSubs: Subscription;
  constructor(private authService: AuthService) {}

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

  onSignUP(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }
}
