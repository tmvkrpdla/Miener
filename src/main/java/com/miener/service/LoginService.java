package com.miener.service;

import com.miener.dto.Admin;
import com.miener.dto.LoginRequest;

public interface LoginService {
    /**
     * 사용자 아이디와 비밀번호를 검증하고, 유효한 경우 Admin 객체를 반환합니다.
     * @param loginRequest 로그인 요청 정보 (아이디, 비밀번호)
     * @return 인증에 성공하면 Admin 객체, 실패하면 null
     */
    Admin validateUser(LoginRequest loginRequest);

    /**
     * 최종 로그인 시간을 업데이트하는 메서드 추가
     * @param nSeqAdmin 관리자 고유 ID
     */
    void updateLastLoginTime(Long nSeqAdmin);
}

