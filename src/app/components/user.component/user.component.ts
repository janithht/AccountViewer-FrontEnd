import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

interface BalanceItem {
  accountName: string;
  balance: number;
}

interface LatestBalancesDto {
  year: number;
  month: number;
  items: BalanceItem[];
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  balances: LatestBalancesDto | null = null;
  loading = true;
  error = '';
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<LatestBalancesDto>(`${this.baseUrl}/balance/latest`).subscribe({
      next: data => {
        this.balances = data;
        this.loading = false;
      },
      error: err => {
        this.error = err.error?.message || 'Failed to load balances.';
        this.loading = false;
      }
    });
  }
}
