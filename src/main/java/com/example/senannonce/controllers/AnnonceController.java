package com.example.senannonce.controllers;


import com.example.senannonce.entity.Annonce;
import com.example.senannonce.services.AnnonceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/annonces")
public class AnnonceController {

    @Autowired
    private AnnonceService annonceService;

    @PostMapping
    public Annonce createAnnonce(
            @RequestParam String titre,
            @RequestParam String description,
            @RequestParam double prix,
            @RequestParam String ville,
            @RequestParam String statut
    ){
        return annonceService.createAnnonce(titre, description, prix, ville, statut);
    }

    // Lister les annonces
    @GetMapping
    public List<Annonce> getAnnonces(){
        return annonceService.getAllAnnonce();
    }

    // Detail annonce
    @GetMapping("/{id}")
    public Annonce getAnnonceById(@PathVariable Long id){
        return annonceService.getAnnonceById(id);
    }

    @PutMapping("/{id}")
    public Annonce updateAnnonce(
            @RequestParam Long id,
            @RequestParam String statut
    ){
        return annonceService.changeStatut(id, statut);
    }

}
