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

        // 원본 비율 지표 연산
        double orig1b = Math.max(0, origH - (orig2b + orig3b + origHr));
        double origTb = orig1b + (orig2b * 2) + (orig3b * 3) + (origHr * 4);
        Double origAvg = Math.round((origH / origAb) * 1000.0) / 1000.0;
        Double origObp = (origAb + origBb + origHbp) > 0 ? Math.round(((origH + origBb + origHbp) / (origAb + origBb + origHbp)) * 1000.0) / 1000.0 : null;
        Double origSlg = origAb > 0 ? Math.round((origTb / origAb) * 1000.0) / 1000.0 : null;
        Double origOps = (origObp != null && origSlg != null) ? Math.round((origObp + origSlg) * 1000.0) / 1000.0 : null;
        double origBabipDenom = origAb - origSo - origHr;
        Double origBabip = origBabipDenom > 0 ? Math.round(((origH - origHr) / origBabipDenom) * 1000.0) / 1000.0 : null;

        // MLE 리그 보정 계수 적용
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

        // Converted MLB 비율 지표 연산
        double new1b = Math.max(0, newH - (new2b + new3b + newHr));
        double newTb = new1b + (new2b * 2) + (new3b * 3) + (newHr * 4);
        Double mlbAvg = Math.round(newBa * 1000.0) / 1000.0;
        Double mlbObp = (origAb + newBb + origHbp) > 0 ? Math.round(((newH + newBb + origHbp) / (origAb + newBb + origHbp)) * 1000.0) / 1000.0 : null;
        Double mlbSlg = origAb > 0 ? Math.round((newTb / origAb) * 1000.0) / 1000.0 : null;
        Double mlbOps = (mlbObp != null && mlbSlg != null) ? Math.round((mlbObp + mlbSlg) * 1000.0) / 1000.0 : null;
        double mlbBabipDenom = origAb - newSo - newHr;
        Double mlbBabip = mlbBabipDenom > 0 ? Math.round(((newH - newHr) / mlbBabipDenom) * 1000.0) / 1000.0 : null;

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
                .origAvg(origAvg)
                .origObp(origObp)
                .origSlg(origSlg)
                .origOps(origOps)
                .origBabip(origBabip)
                .mlbAvg(mlbAvg)
                .mlbObp(mlbObp)
                .mlbSlg(mlbSlg)
                .mlbOps(mlbOps)
                .mlbBabip(mlbBabip)
                .build();
    }

    public PitcherStatDTO convertPitcher(PitcherStatDTO input) {
        double parsedIp = parseIpToOuts(input.getIp());
        double origH = input.getH() != null ? input.getH() : 0;
        double origHr = input.getHr() != null ? input.getHr() : 0;
        double origBb = input.getBb() != null ? input.getBb() : 0;
        double origSo = input.getSo() != null ? input.getSo() : 0;
        double origHbp = input.getHbp() != null ? input.getHbp() : 0;
        double origEr = input.getEr() != null ? input.getEr() : 0;

        // 원본 비율 지표 연산
        Double origEra = parsedIp > 0 ? Math.round(((origEr * 9.0) / parsedIp) * 100.0) / 100.0 : null;
        Double origWhip = parsedIp > 0 ? Math.round(((origH + origBb) / parsedIp) * 100.0) / 100.0 : null;
        Double origFip = parsedIp > 0 ? Math.round((((13 * origHr) + (3 * (origBb + origHbp)) - (2 * origSo)) / parsedIp + 3.20) * 100.0) / 100.0 : null;

        // MLE 리그 보정 계수 적용
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
        double newH = origH * hMult;
        double erFactor = ((newHr / Math.max(1, origHr)) + (newH / Math.max(1, origH)) + (newBb / Math.max(1, origBb))) / 3.0;
        double newEr = origEr * erFactor;

        // Converted MLB 비율 지표 연산
        Double mlbEra = parsedIp > 0 ? Math.round(((newEr * 9.0) / parsedIp) * 100.0) / 100.0 : null;
        Double mlbWhip = parsedIp > 0 ? Math.round(((newH + newBb) / parsedIp) * 100.0) / 100.0 : null;
        Double mlbFip = parsedIp > 0 ? Math.round((((13 * newHr) + (3 * (newBb + origHbp)) - (2 * newSo)) / parsedIp + 3.20) * 100.0) / 100.0 : null;

        return PitcherStatDTO.builder()
                .league("MLB (Converted from " + league + ")")
                .ip(input.getIp())
                .h((int) Math.round(newH))
                .hr((int) Math.round(newHr))
                .bb((int) Math.round(newBb))
                .hbp((int) Math.round(origHbp))
                .so((int) Math.round(newSo))
                .er((int) Math.round(newEr))
                .origEra(origEra)
                .origWhip(origWhip)
                .origFip(origFip)
                .mlbEra(mlbEra)
                .mlbWhip(mlbWhip)
                .mlbFip(mlbFip)
                .build();
    }

    private double parseIpToOuts(String ipStr) {
        if (ipStr == null || ipStr.trim().isEmpty()) return 0.0;
        try {
            double ip = Double.parseDouble(ipStr);
            int fullInnings = (int) ip;
            double decimal = Math.round((ip - fullInnings) * 10.0) / 10.0;
            if (decimal == 0.1) return fullInnings + (1.0 / 3.0);
            if (decimal == 0.2) return fullInnings + (2.0 / 3.0);
            return fullInnings;
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }
}
