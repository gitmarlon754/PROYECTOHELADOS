package com.heladeria.tpv.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    private String metodoPago;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleVenta> detalles = new ArrayList<>();

    public Venta() {
        this.fecha = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Sede getSede() { return sede; }
    public LocalDateTime getFecha() { return fecha; }
    public double getTotal() { return total; }
    public String getMetodoPago() { return metodoPago; }
    public List<DetalleVenta> getDetalles() { return detalles; }

    public void setSede(Sede sede) { this.sede = sede; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public void setTotal(double total) { this.total = total; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    public void setDetalles(List<DetalleVenta> detalles) { this.detalles = detalles; }

    public void addDetalle(DetalleVenta detalle) {
        detalle.setVenta(this);
        this.detalles.add(detalle);
    }
}
