package com.ootp.backend.service;

import com.ootp.backend.dto.BatterStatDTO;
import com.ootp.backend.dto.PitcherStatDTO;
import org.springframework.stereotype.Service;

@Service
public class StatConversionService {

    public BatterStatDTO convertBatter(BatterStatDTO input) {
        if (input.getAb() == null || input.getAb() <= 0) {
            throw new IllegalArgumentException("AB(타수)는 0보다 커야 합니다.");
        }

        double origH = input.getH() != null ? input.getH() : 0;
        double origAb = input.getAb();
        double orig2b = input.getDoubleBase() != null ? input.getDoubleBase() : 0;
        double orig3b = input.getTripleBase() != null ? input.getTripleBase() : 0;
        double origHr = input.getHr() != null ? input.getHr() : 0;
        double origBb = input.getBb() != null ? input.getBb() : 0;
        double origHbp = input.getHbp() != null ? input.getHbp() : 0;
        double origSo = input.getSo() != null ? input.getSo() : 0;
        double origSb = input.getSb() != null ? input.getSb() : 0;

        double origBa = origH / origAb;
        double baPenalty = 0.040;
        double tripleMult = 0.5;
        double hrMult = 0.5;
        double bbMult = 0.85;
        double soMult = 1.25;
        double sbMult = 0.8;

        String league = input.getLeague() != null ? input.getLeague().toUpperCase() : "KBO";
        switch (league) {
            case "NPB":
                baPenalty = 0.050;
                tripleMult = 1.0;
                hrMult = 0.7;
                bbMult = 0.85;
                soMult = 1.20;
                sbMult = 0.85;
                break;
            case "AAA":
                baPenalty= 0.044;
                tripleMult = 0.6;
                hrMult = 0.65;
                bbMult = 0.85;
                soMult = 1.20;
                sbMult = 1.0;
                break;
            case "KBO":
            default:
                break;
        }

        double newBa = Math.max(0, origBa - baPenalty);
        double newH = origAb * newBa;
        double new2b = origH > 0 ? orig2b * (newH / origH) : 0;
        double new3b = orig3b * tripleMult;
        double newHr = origHr * hrMult;
        double newBb = origBb * bbMult;
        double newSo = origSo * soMult;
        double newSb = origSb * sbMult;

        return BatterStatDTO.builder()
                .league("MLB (Converted from " + league + ")")
                .ab((int) origAb)
                .h((int) Math.round(newH))
                .doubleBase((int) Math.round(new2b))
                .tripleBase((int) Math.round(new3b))
                .hr((int) Math.round(newHr))
                .bb((int) Math.round(newBb))
                .hbp((int) origHbp)
                .so((int) Math.round(newSo))
                .sb((int) Math.round(newSb))
                .avg(Math.round(newBa * 1000.0) / 1000.0)
                .build();
    }

    public PitcherStatDTO convertPitcher(PitcherStatDTO input) {
        double origHr = input.getHr() != null ? input.getHr() : 0;
        double origBb = input.getBb() != null ? input.getBb() : 0;
        double origSo = input.getSo() != null ? input.getSo() : 0;
        double origHbp = input.getHbp() != null ? input.getHbp() : 0;

        double hrMult = 1.5;
        double bbMult = 1.15;
        double soMult = 0.9;
        double hMult = 1.2;

        String league = input.getLeague() != null ? input.getLeague().toUpperCase() : "KBO";
        if ("NPB".equals(league)) {
            hrMult = 1.35;
            bbMult = 1.10;
            soMult = 0.9;
            hMult = 1.1;
        } else if ("AAA".equals(league)) {
            hrMult = 1.40;
            bbMult = 1.12;
            soMult = 0.92;
            hMult = 1.15;
        }

        double newHr = origHr * hrMult;
        double newBb = origBb * bbMult;
        double newSo = origSo * soMult;

        Integer newH = null;
        if (input.getH() != null) {
            newH = (int) Math.round(input.getH() * hMult);
        }

        return PitcherStatDTO.builder()
                .league("MLB (Converted from " + league + ")")
                .ip(input.getIp())
                .h(newH)
                .hr((int) Math.round(newHr))
                .bb((int) Math.round(newBb))
                .hbp((int) Math.round(origHbp))
                .so((int) Math.round(newSo))
                .build();
    }
}
