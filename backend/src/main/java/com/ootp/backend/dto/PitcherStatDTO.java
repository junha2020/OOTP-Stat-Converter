package com.ootp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PitcherStatDTO {

    private String league;
    private String ip;
    private Integer h;
    private Integer hr;
    private Integer bb;
    private Integer hbp;
    private Integer so;
    private Integer er;

    // 백엔드 산출 원본 비율 지표
    private Double origEra;
    private Double origWhip;
    private Double origFip;

    // 백엔드 산출 MLB 환산 치표
    private Double mlbEra;
    private Double mlbWhip;
    private Double mlbFip;
}
