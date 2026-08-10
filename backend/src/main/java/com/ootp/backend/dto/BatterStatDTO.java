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

    private Double avg; // 계산된 타율
}
