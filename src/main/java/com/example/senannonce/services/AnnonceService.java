package com.example.senannonce.services;

import com.example.senannonce.entity.Annonce;
import com.example.senannonce.repository.AnnonceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnnonceService {
    @Autowired
    private AnnonceRepository annonceRepository;

// Creation d'une nouvelle annonce
    public Annonce createAnnonce(String titre, String description, double prix, String ville, String statut){
      Annonce annonce = new Annonce();
      annonce.setTitre(titre);
      annonce.setDescription(description);
      annonce.setPrix(prix);
      annonce.setVille(ville);
      annonce.setStatut(statut);
      return annonceRepository.save(annonce);

    }

    // Recuperation de la liste des annonces
    public List<Annonce> getAllAnnonce(){
       return annonceRepository.findAll();
    }

    // Récuperation d'un element de la liste des annonces
    public Annonce getAnnonceById(Long id){
        Optional<Annonce> annonce = annonceRepository.findById(id);
        return annonce.orElse(null);
    }
}
