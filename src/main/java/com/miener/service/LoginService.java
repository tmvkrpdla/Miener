package com.miener.service;

import com.miener.dao.mariadb.AdminMapper;
import com.miener.dto.Admin;
import com.miener.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

public interface LoginService {
    /**
     * 사용자 아이디와 비밀번호를 검증하고, 유효한 경우 Admin 객체를 반환합니다.
     * @param loginRequest 로그인 요청 정보 (아이디, 비밀번호)
     * @return 인증에 성공하면 Admin 객체, 실패하면 null
     */
    Admin validateUser(LoginRequest loginRequest);
}

