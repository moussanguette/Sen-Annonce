package com.example.senannonce.controllers;

import com.example.senannonce.entity.Annonce;
import com.example.senannonce.services.AnnonceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/annonce")
@CrossOrigin(origins = "http://localhost:4200")
public class AnnonceController {

    @Autowired
    private AnnonceService annonceService;

    @PostMapping
    public ResponseEntity<?> createAnnonce(@RequestBody Annonce annonce) {
        try {
            System.out.println("Reçu: " + annonce); // Pour déboguer
            annonce.setStatut("EN_ATTENTE");
            Annonce saved = annonceService.saveAnnonce(annonce);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Annonce> getAll() {
        return annonceService.findAll();
    }

    @GetMapping("/{id}")
    public Annonce getById(@PathVariable Long id) {
        return annonceService.findById(id);
    }

    @PostMapping("/{id}/soumettre")
    public ResponseEntity<?> soumettre(@PathVariable Long id) {
        annonceService.updateStatut(id, "EN_ATTENTE");
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/publier")
    public Annonce publier(@PathVariable Long id) {
        return annonceService.updateStatut(id, "PUBLIEE");
    }

    @PatchMapping("/{id}/rejeter")
    public Annonce rejeter(@PathVariable Long id) {
        return annonceService.updateStatut(id, "REJETEE");
    }
}