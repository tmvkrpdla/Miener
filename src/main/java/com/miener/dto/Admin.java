package com.miener.dto;

import lombok.Data;

import java.util.Date;

@Data
public class Admin {

    private Long nSeqAdmin; // 기본 키
    private String Id;      // ✅ 추가: 로그인 아이디
    private String Password;
    private String Name;    // 사용자 이름
    private String Phone;   // ✅ 추가: 연락처
    private String entityType; // 관리자 유형 (apt, iener 등)
    private Long companyId; // ✅ 추가: 회사 ID (소속 회사명을 조회하기 위함)
    private String roleName; // ✅ 추가: 권한 레벨 (DB 조인을 통해 가져와야 함)
    private Date dtLastLogin; // ✅ 추가: 최종 로그인 날짜

}