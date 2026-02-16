package com.heladeria.tpv.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "CATEGORIA")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    public Categoria() {}

    public Long getId() { return id; }
    public String getNombre() { return nombre; }

    public void setId(Long id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}
