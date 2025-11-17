package com.miener.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MeterInstallHistoryDto {

    // DB에서 자동 생성되므로 입력 시에는 필요 없음
    private String seq;
    private String seqWorker;
    private String seqHo;

}
