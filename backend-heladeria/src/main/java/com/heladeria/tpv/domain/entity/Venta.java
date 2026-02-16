package com.heladeria.tpv.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "VENTA")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "SEDE_ID")
    private Sede sede;

    private LocalDateTime fecha;
    private double total;

    public Venta() {
        this.fecha = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Sede getSede() { return sede; }
    public LocalDateTime getFecha() { return fecha; }
    public double getTotal() { return total; }

    public void setSede(Sede sede) { this.sede = sede; }
    public void setTotal(double total) { this.total = total; }
}
