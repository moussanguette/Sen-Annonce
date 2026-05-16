import { Component, OnInit } from '@angular/core';
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

  constructor(
    private annonceService: AnnonceService,
    private moderationService: ModerationService
  ) {}

  ngOnInit() {
    this.loadPending();
  }

  loadPending() {
    this.annonceService.getAll().subscribe({
      next: (data) => {
        console.log('Toutes les annonces reçues:', data); // DEBUG
        this.annonces = data.filter(a => a.statut === 'EN_ATTENTE');
        console.log('Annonces en attente:', this.annonces); // DEBUG
      },
      error: (err) => {
        console.error('Erreur lors du chargement:', err);
      }
    });
  }

  approve(id: number) {
    this.moderationService.approve(id).subscribe({
      next: () => {
        alert('Annonce approuvée → publiée');
        this.loadPending();
      },
      error: (err) => {
        console.error('Erreur lors de l\'approbation:', err);
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
        console.error('Erreur lors du rejet:', err);
        alert('Erreur: ' + err.message);
      }
    });
  }
}