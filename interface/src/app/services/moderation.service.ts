import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ModerationService {
  private apiUrl = environment.moderationApiUrl;

  constructor(private http: HttpClient) {}

  approve(annonceId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/moderations/${annonceId}/approve`, {});
  }

  reject(annonceId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/moderations/${annonceId}/reject`, {});
  }
}