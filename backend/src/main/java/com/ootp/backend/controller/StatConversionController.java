package com.ootp.backend.controller;

import com.ootp.backend.dto.BatterStatDTO;
import com.ootp.backend.dto.PitcherStatDTO;
import com.ootp.backend.service.StatConversionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/convert")
@RequiredArgsConstructor
public class StatConversionController {

    private final StatConversionService conversionService;

    @PostMapping("/batter")
    public ResponseEntity<BatterStatDTO> convertBatter(@RequestBody BatterStatDTO input) {
        return ResponseEntity.ok(conversionService.convertBatter(input));
    }

    @PostMapping("/pitcher")
    public ResponseEntity<PitcherStatDTO> convertPitcher(@RequestBody PitcherStatDTO input) {
        return ResponseEntity.ok(conversionService.convertPitcher(input));
    }
}
