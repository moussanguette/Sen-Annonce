export interface Announcement {
  id?: number;
  titre: string;
  description: string;
  prix: number;
  ville: string;
  statut: 'EN_ATTENTE' | 'APPROUVEE' | 'REJETEE' | 'PUBLIEE';
}