package com.example.senannonce.controllers;


import com.example.senannonce.entity.Annonce;
import com.example.senannonce.services.AnnonceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/annonce")
public class AnnonceController {

    @Autowired
    private AnnonceService annonceService;

    @PostMapping("/create")
    public Annonce createAnnonce(
            @RequestParam String titre,
            @RequestParam String description,
            @RequestParam double prix,
            @RequestParam String ville,
            @RequestParam String statut
    ){
        return annonceService.createAnnonce(titre, description, prix, ville, statut);
    }

}
