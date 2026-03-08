package com.heladeria.tpv.domain.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "JORNADA")
public class Jornada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;
    private LocalDateTime inicio;
    private LocalDateTime cierre;
    private String estado;
    private Integer usarSobrantes;

    public Jornada() {
        this.fecha = LocalDate.now();
        this.inicio = LocalDateTime.now();
        this.estado = "ABIERTA";
        this.usarSobrantes = 1;
    }

    public Long getId() { return id; }
    public LocalDate getFecha() { return fecha; }
    public LocalDateTime getInicio() { return inicio; }
    public LocalDateTime getCierre() { return cierre; }
    public String getEstado() { return estado; }
    public Integer getUsarSobrantes() { return usarSobrantes; }

    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public void setInicio(LocalDateTime inicio) { this.inicio = inicio; }
    public void setCierre(LocalDateTime cierre) { this.cierre = cierre; }
    public void setEstado(String estado) { this.estado = estado; }
    public void setUsarSobrantes(Integer usarSobrantes) { this.usarSobrantes = usarSobrantes; }
}
