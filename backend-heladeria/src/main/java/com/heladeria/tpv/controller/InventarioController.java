package com.heladeria.tpv.controller;

import com.heladeria.tpv.domain.entity.Inventario;
import com.heladeria.tpv.service.InventarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventario")
@CrossOrigin("*")
public class InventarioController {

    private final InventarioService service;

    public InventarioController(InventarioService service) {
        this.service = service;
    }

    @GetMapping("/sede/{id}")
    public List<Inventario> porSede(@PathVariable Long id) {
        return service.inventarioPorSede(id);
    }
}
