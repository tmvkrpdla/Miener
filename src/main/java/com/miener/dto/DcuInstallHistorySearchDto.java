package com.miener.dto;

import lombok.Data;

@Data
public class DcuInstallHistorySearchDto {

    // 검색 조건
    private String seqSite;
    private String seqWorker;      // 설치 작업자 ID
    private String metroProv;     // 광역시/도 (site.MetroProv)
    private String installDateFrom; // 설치 시작 날짜 (YYYY-MM-DD)
    private String installDateTo;   // 설치 종료 날짜 (YYYY-MM-DD)

    // 페이징 (선택적)
//    private Integer limit;
//    private Integer offset;
}
