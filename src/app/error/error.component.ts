import { Component, Inject } from '../../../node_modules/@angular/core';
import { MAT_DIALOG_DATA } from '../../../node_modules/@angular/material';

@Component({
  templateUrl: './error.component.html'
})
export class ErrorComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
