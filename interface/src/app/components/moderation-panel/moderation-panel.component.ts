import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Announcement } from '../../models/announcement.model';
import { AnnonceService } from '../../services/annonce.service';
import { ModerationService } from '../../services/moderation.service';

@Component({
  selector: 'app-moderation-panel',
  templateUrl: './moderation-panel.component.html',
  standalone: false 
})
export class ModerationPanelComponent implements OnInit {
  annonces: Announcement[] = [];
  loading = true;

  constructor(
    private annonceService: AnnonceService,
    private moderationService: ModerationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPending();
  }

  loadPending() {
    this.loading = true;
    this.annonceService.getAll().subscribe({
      next: (data) => {
        console.log('Données brutes reçues:', data);
        // On filtre de manière plus robuste (trim et uppercase)
        this.annonces = data.filter(a => a.statut?.trim().toUpperCase() === 'EN_ATTENTE');
        console.log('Annonces filtrées pour affichage:', this.annonces);
        this.loading = false;
        this.cdr.detectChanges(); // Force le rafraîchissement de l'interface
      },
      error: (err) => {
        console.error('Erreur lors du chargement:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  approve(id: number) {
    this.moderationService.approve(id).subscribe({
      next: () => {
        alert('Annonce approuvée');
        this.loadPending();
      },
      error: (err) => {
        alert('Erreur: ' + err.message);
      }
    });
  }

  reject(id: number) {
    this.moderationService.reject(id).subscribe({
      next: () => {
        alert('Annonce rejetée');
        this.loadPending();
      },
      error: (err) => {
        alert('Erreur: ' + err.message);
      }
    });
  }
}