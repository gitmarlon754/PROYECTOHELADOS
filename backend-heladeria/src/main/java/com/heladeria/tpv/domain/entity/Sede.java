package com.heladeria.tpv.domain.entity;

import jakarta.persistence.*;
@Entity
@Table(name = "SEDE")
public class Sede {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String direccion;

    public Sede() {}

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getDireccion() { return direccion; }

    public void setId(Long id) { this.id = id; }   // ← AGREGAR ESTO
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
}

