import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  form: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  onSignIn() {
    const { username, password } = this.form.value;
    this.auth.login(username, password).subscribe({
      next: res => {
        this.auth.setToken(res.token);
        this.error = '';
        const role = this.auth.getRole();
        setTimeout(() => {
          this.router.navigate([role === 'Admin' ? '/admin' : '/user']);
        }, 0);
      },
      error: () => this.error = 'Invalid credentials'
    });
  }

  onSignOut() {
    this.auth.logout();
    this.form.reset();
    this.error = '';
  }
}
