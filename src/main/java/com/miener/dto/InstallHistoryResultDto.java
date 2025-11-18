package com.miener.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Data
@Getter
@Setter
public class InstallHistoryResultDto {

    // 공통 필드
    private String seqSite;
    private String siteName;
    private String metroProv;
    private String cityDist;
    private String workerName;
    private Date installDate; // SQL의 dtInstalled 결과
    private String hwType;     // 클라이언트에서 추가된 타입 (Meter 또는 DCU)

    // Meter 고유 필드
    private String dongName;
    private String hoName;
    private String mid;
    private String midPrev;
    private Integer seqHo;
    private Integer seqMeter;

    // DCU 고유 필드
    private String dcuId;
    private String location;
    private Integer seqDcu;
}
