package com.example.senannonce;

import com.example.senannonce.entity.Annonce;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import jakarta.validation.ConstraintViolation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class AnnonceValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void whenFieldsAreValid_thenNoViolations() {
        Annonce annonce = new Annonce(null, "iPhone 15", "Vente superbe iPhone", 500000, "Dakar", "EN_ATTENTE", null, null, null);
        Set<ConstraintViolation<Annonce>> violations = validator.validate(annonce);
        assertTrue(violations.isEmpty(), "Il ne devrait y avoir aucune violation");
    }

    @Test
    void whenTitreIsBlank_thenViolation() {
        Annonce annonce = new Annonce(null, "", "Description", 100, "Dakar", "EN_ATTENTE", null, null, null);
        Set<ConstraintViolation<Annonce>> violations = validator.validate(annonce);
        assertFalse(violations.isEmpty(), "Le titre vide devrait causer une violation");
    }

    @Test
    void whenPrixIsNegative_thenViolation() {
        Annonce annonce = new Annonce(null, "Titre", "Description", -10, "Dakar", "EN_ATTENTE", null, null, null);
        Set<ConstraintViolation<Annonce>> violations = validator.validate(annonce);
        assertFalse(violations.isEmpty(), "Un prix négatif devrait causer une violation");
    }
}
