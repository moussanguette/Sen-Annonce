package com.example.senannonce.services;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.example.senannonce.entity.Annonce;
import com.example.senannonce.repository.AnnonceRepository;
import jakarta.persistence.criteria.Predicate;

@Service
public class AnnonceService {
    
    @Autowired
    private AnnonceRepository annonceRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${service.moderation.url}")
    private String moderationServiceUrl;

    public Annonce saveAnnonce(Annonce annonce) {
        return annonceRepository.save(annonce);
    }

    public List<Annonce> findAll() {
        return annonceRepository.findAll();
    }

    public List<Annonce> findAllAdvanced(String q, Pageable pageable) {
        Specification<Annonce> spec = (root, query, cb) -> {
            if (q == null || q.isEmpty()) {
                return cb.conjunction();
            }
            String pattern = "%" + q.toLowerCase() + "%";
            Predicate titleMatch = cb.like(cb.lower(root.get("titre")), pattern);
            Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
            return cb.or(titleMatch, descMatch);
        };
        return annonceRepository.findAll(spec, pageable).getContent();
    }

    public List<Annonce> findByVille(String ville) {
        return annonceRepository.findByVilleIgnoreCase(ville);
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

    public void soumettrePourModeration(Long id) {
        Annonce annonce = findById(id);
        annonce.setStatut("EN_ATTENTE");
        annonceRepository.save(annonce);

        try {
            String url = moderationServiceUrl + "/moderations/submit";
            Map<String, Object> request = Map.of("annonceId", id);
            restTemplate.postForObject(url, request, String.class);
        } catch (Exception e) {
            System.err.println("Erreur modération: " + e.getMessage());
        }
    }
}
