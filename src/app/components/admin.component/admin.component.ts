import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  selectedFile: File | null = null;
  uploadProgress: number | null = null;
  uploadMessage: string = '';
  uploading = false;
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadMessage = '';
    }
  }

  onUpload() {
    if (!this.selectedFile) {
      this.uploadMessage = 'Please select a file first.';
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.uploading = true;
    this.uploadProgress = 0;
    this.uploadMessage = '';

    this.http.post<any>(`${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        } else if (event.type === HttpEventType.Response) {
          this.uploadMessage = event.body?.message || 'Upload successful!';
          this.uploading = false;
          this.uploadProgress = null;
        }
      },
      error: err => {
        this.uploadMessage = err.error?.message || 'Upload failed.';
        this.uploading = false;
        this.uploadProgress = null;
      }
    });
  }
}
