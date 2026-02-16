package com.heladeria.tpv.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "TIPO_HELADO")
public class TipoHelado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    public TipoHelado() {}

    public Long getId() { return id; }
    public String getNombre() { return nombre; }

    public void setId(Long id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}
