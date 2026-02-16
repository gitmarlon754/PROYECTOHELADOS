package com.heladeria.tpv.service.impl;

import com.heladeria.tpv.domain.entity.Producto;
import com.heladeria.tpv.repository.ProductoRepository;
import com.heladeria.tpv.service.ProductoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoServiceImpl(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Override
    public List<Producto> listar() {
        return productoRepository.findAll();
    }
}
