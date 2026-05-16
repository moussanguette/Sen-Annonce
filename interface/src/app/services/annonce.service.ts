import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Announcement } from '../models/announcement.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnnonceService {
  private apiUrl = environment.annonceApiUrl;

  constructor(private http: HttpClient) {}

  create(annonce: Announcement): Observable<Announcement> {
    return this.http.post<Announcement>(`${this.apiUrl}/annonces`, annonce);
  }

  getAll(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.apiUrl}/annonces`);
  }

  getById(id: number): Observable<Announcement> {
    return this.http.get<Announcement>(`${this.apiUrl}/annonces/${id}`);
  }

  soumettre(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/annonces/${id}/soumettre`, {});
  }

  publier(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/annonces/${id}/publier`, {});
  }
}