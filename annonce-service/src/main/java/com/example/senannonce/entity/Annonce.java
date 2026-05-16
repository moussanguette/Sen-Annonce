package com.example.senannonce.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Annonce {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 3, message = "Le titre doit faire au moins 3 caractères")
    private String titre;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    @Min(value = 0, message = "Le prix doit être positif")
    private double prix;

    @NotBlank(message = "La ville est obligatoire")
    private String ville;

    private String statut;
}
