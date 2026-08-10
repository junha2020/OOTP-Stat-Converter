package com.ootp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatterStatDTO {

    private String league; // KBO, NPB, AAA
    private Integer ab;
    private Integer h;
    private Integer doubleBase;
    private Integer tripleBase;
    private Integer hr;
    private Integer bb;
    private Integer hbp;
    private Integer so;
    private Integer sb;

    // 백엔드 산출 원본 비율 지표
    private Double origAvg;
    private Double origObp;
    private Double origSlg;
    private Double origOps;
    private Double origBabip;

    // 백엔드 산출 MLB 비율 지표
    private Double mlbAvg;
    private Double mlbObp;
    private Double mlbSlg;
    private Double mlbOps;
    private Double mlbBabip;
}
