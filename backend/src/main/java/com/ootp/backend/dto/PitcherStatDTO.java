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
}
