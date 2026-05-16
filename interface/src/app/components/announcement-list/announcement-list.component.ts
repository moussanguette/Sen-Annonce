import { Component, OnInit } from '@angular/core';
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

  constructor(private annonceService: AnnonceService) {}

  ngOnInit() {
    this.loadAnnonces();
  }

  loadAnnonces() {
    this.annonceService.getAll().subscribe(data => this.annonces = data);
  }

  soumettre(id: number) {
    this.annonceService.soumettre(id).subscribe(() => {
      alert('Annonce soumise à la modération');
      this.loadAnnonces();
    });
  }
}