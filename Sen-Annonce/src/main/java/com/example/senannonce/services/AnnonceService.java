package com.example.senannonce.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.senannonce.entity.Annonce;
import com.example.senannonce.repository.AnnonceRepository;

@Service
public class AnnonceService {
    
    @Autowired
    private AnnonceRepository annonceRepository;

    public Annonce saveAnnonce(Annonce annonce) {
        return annonceRepository.save(annonce);
    }

    public List<Annonce> findAll() {
        return annonceRepository.findAll();
    }

    public Annonce findById(Long id) {
        return annonceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée avec l'id: " + id));
    }

    public Annonce updateStatut(Long id, String statut) {
        Annonce annonce = findById(id);
        annonce.setStatut(statut);
        return annonceRepository.save(annonce);
    }
}