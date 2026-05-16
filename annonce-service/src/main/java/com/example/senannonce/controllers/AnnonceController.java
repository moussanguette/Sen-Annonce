package com.example.senannonce.controllers;

import com.example.senannonce.entity.Annonce;
import com.example.senannonce.services.AnnonceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/annonces")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Annonce API", description = "Gestion des annonces")
public class AnnonceController {

    @Autowired
    private AnnonceService annonceService;

    @PostMapping
    @Operation(summary = "Créer une nouvelle annonce")
    public ResponseEntity<?> createAnnonce(@Valid @RequestBody Annonce annonce) {
        try {
            annonce.setStatut("EN_ATTENTE");
            Annonce saved = annonceService.saveAnnonce(annonce);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    @GetMapping
    @Operation(summary = "Lister toutes les annonces avec recherche, tri et pagination")
    public List<Annonce> getAll(
            @Parameter(description = "Recherche par nom/texte") @RequestParam(required = false) String q,
            @Parameter(description = "Champ par lequel trier") @RequestParam(defaultValue = "createdAt") String order_by,
            @Parameter(description = "Direction du tri") @RequestParam(defaultValue = "desc") String order_dir,
            @Parameter(description = "Nombre limite") @RequestParam(defaultValue = "20") int limit,
            @Parameter(description = "Décalage pour la pagination") @RequestParam(defaultValue = "0") int offset
    ) {
        Sort sort = order_dir.equalsIgnoreCase("asc") ? Sort.by(order_by).ascending() : Sort.by(order_by).descending();
        Pageable pageable = PageRequest.of(offset / limit, limit, sort);
        return annonceService.findAllAdvanced(q, pageable);
    }

    @GetMapping("/ville/{ville}")
    @Operation(summary = "Lister les annonces par ville")
    public List<Annonce> getByVille(@PathVariable String ville) {
        return annonceService.findByVille(ville);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer une annonce par son ID")
    public Annonce getById(@PathVariable Long id) {
        return annonceService.findById(id);
    }

    @PostMapping("/{id}/soumettre")
    @Operation(summary = "Soumettre une annonce pour modération")
    public ResponseEntity<?> soumettre(@PathVariable Long id) {
        annonceService.soumettrePourModeration(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/approuver")
    @Operation(summary = "Approuver une annonce (passe au statut APPROUVEE)")
    public Annonce approuver(@PathVariable Long id) {
        return annonceService.updateStatut(id, "APPROUVEE");
    }

    @PatchMapping("/{id}/publier")
    @Operation(summary = "Publier une annonce (passe au statut PUBLIEE)")
    public Annonce publier(@PathVariable Long id) {
        return annonceService.updateStatut(id, "PUBLIEE");
    }

    @PatchMapping("/{id}/rejeter")
    @Operation(summary = "Rejeter une annonce (passe au statut REJETEE)")
    public Annonce rejeter(@PathVariable Long id) {
        return annonceService.updateStatut(id, "REJETEE");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer logiquement une annonce (soft delete)")
    public ResponseEntity<Void> deleteAnnonce(@PathVariable Long id) {
        annonceService.deleteAnnonce(id);
        return ResponseEntity.noContent().build();
    }
}
