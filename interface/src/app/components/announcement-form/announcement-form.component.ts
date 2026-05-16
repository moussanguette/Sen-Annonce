import { Component } from '@angular/core';
import { Announcement } from '../../models/announcement.model';
import { AnnonceService } from '../../services/annonce.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-announcement-form',
  standalone: false,  // ← Garde false
  // SUPPRIME cette ligne → imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './announcement-form.component.html'
})
export class AnnouncementFormComponent {
  annonce: Announcement = {
    titre: '',
    description: '',
    prix: 0,
    ville: '',
    statut: 'EN_ATTENTE'
  };

  constructor(private annonceService: AnnonceService, private router: Router) {}

  onSubmit() {
    this.annonceService.create(this.annonce).subscribe({
      next: () => {
        alert('Annonce créée, en attente de modération');
        this.router.navigate(['/annonces']);
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur lors de la création');
      }
    });
  }
}