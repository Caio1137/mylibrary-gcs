package br.senai.mylibrary.controller;

import br.senai.mylibrary.dto.DashboardResponse;
import br.senai.mylibrary.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardResponse obterResumo() {
        return dashboardService.obterResumo();
    }
}
