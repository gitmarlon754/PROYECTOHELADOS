package com.heladeria.tpv.service.impl;

import com.heladeria.tpv.domain.entity.Venta;
import com.heladeria.tpv.repository.VentaRepository;
import com.heladeria.tpv.service.VentaService;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VentaServiceImpl implements VentaService {

    private final VentaRepository ventaRepository;

    public VentaServiceImpl(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    @Override
    public List<Venta> listar() {
        return ventaRepository.findAll();
    }
}
