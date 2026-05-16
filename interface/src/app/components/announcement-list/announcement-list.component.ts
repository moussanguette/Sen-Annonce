import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Announcement } from '../../models/announcement.model';
import { AnnonceService } from '../../services/annonce.service';

@Component({
  selector: 'app-announcement-list',
  templateUrl: './announcement-list.component.html',
  standalone: false 
})
export class AnnouncementListComponent implements OnInit {
  annonces: Announcement[] = [];
  loading = true;

  constructor(
    private annonceService: AnnonceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAnnonces();
  }

  loadAnnonces() {
    this.loading = true;
    console.log('Chargement de toutes les annonces...');
    this.annonceService.getAll().subscribe({
      next: (data) => {
        console.log('Annonces reçues pour la liste:', data);
        this.annonces = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des annonces:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  soumettre(id: number) {
    if (confirm('Soumettre cette annonce ?')) {
      this.annonceService.soumettre(id).subscribe({
        next: () => {
          alert('Annonce soumise à la modération');
          this.loadAnnonces();
        },
        error: (err) => {
          console.error('Erreur soumission:', err);
          alert('Erreur lors de la soumission');
        }
      });
    }
  }
}