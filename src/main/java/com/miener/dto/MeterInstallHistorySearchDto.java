package com.miener.dto;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class MeterInstallHistorySearchDto {

    // 검색 조건
    private String seqSite;
    private String seqWorker;      // 설치 작업자 ID
    private String metroProv;     // 광역시/도 (site.MetroProv)
   /* private String installDateFrom; // 설치 시작 날짜 (YYYY-MM-DD)
    private String installDateTo;   // 설치 종료 날짜 (YYYY-MM-DD)*/

    // ✅ 타입 수정: String -> Date
    // ✅ @DateTimeFormat 추가: ISO 8601 형식으로 바인딩 지정
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime installDateFrom;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime installDateTo;

    // 페이징 (선택적)
    private Integer limit;
    private Integer offset;
}
