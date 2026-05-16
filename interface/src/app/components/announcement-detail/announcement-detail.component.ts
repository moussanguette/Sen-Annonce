import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Announcement } from '../../models/announcement.model';
import { AnnonceService } from '../../services/annonce.service';

@Component({
  selector: 'app-announcement-detail',
  templateUrl: './announcement-detail.component.html',
  standalone: false 
})
export class AnnouncementDetailComponent implements OnInit {
  annonce?: Announcement;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annonceService: AnnonceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.annonceService.getById(id).subscribe({
        next: (data) => {
          this.annonce = data;
          console.log('Annonce assignée:', this.annonce);
          this.cdr.detectChanges(); // Force le rafraîchissement
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.router.navigate(['/annonces']);
        }
      });
    }
  }

  soumettre(id: number) {
    if (confirm('Soumettre cette annonce à la modération ?')) {
      this.annonceService.soumettre(id).subscribe({
        next: () => {
          alert('Annonce soumise');
          this.router.navigate(['/annonces']);
        }
      });
    }
  }
}