package com.miener.dto;

import lombok.Data;

@Data
public class HoUpdateDto {
    // 필수 조건: 어떤 호/미터를 수정할지 식별자
    private Long seqHo;      // aptho.nSeqAptHo
    private Long seqMeter;   // meter.nSeqMeter

    // 수정 가능한 필드
    private String mid;            // meter.Mid (미터 ID)
    private Integer meterValueStart; // aptho.nValueStart (시작 검침값)
    private String meterMacAddress;  // meter.MacAddr (MAC 주소)
    private Boolean boundToModem;    // aptho.bBoundToModem (모뎀 연결 여부)

    // 추가: 작업자 변경 시
    // private Long seqWorker;
}