package com.heladeria.tpv.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class VentaRealtimeDTO {

    private Long ventaId;
    private Long sedeId;
    private BigDecimal total;
    private LocalDateTime fecha;

    public VentaRealtimeDTO(Long ventaId, Long sedeId, BigDecimal total, LocalDateTime fecha) {
        this.ventaId = ventaId;
        this.sedeId = sedeId;
        this.total = total;
        this.fecha = fecha;
    }

    public Long getVentaId() { return ventaId; }
    public Long getSedeId() { return sedeId; }
    public BigDecimal getTotal() { return total; }
    public LocalDateTime getFecha() { return fecha; }
}

