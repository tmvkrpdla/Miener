package com.miener.service;

import com.miener.dao.mariadb.AdminMapper;
import com.miener.dto.Admin;
import com.miener.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// LoginServiceImpl.java 예시 (Spring Data JPA 또는 MyBatis 사용 가정)
@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private AdminMapper adminMapper; // MyBatis 사용 시

    @Override
    public Admin validateUser(LoginRequest loginRequest) {
        // 1. 아이디로 사용자 정보 조회 (DB: admin 테이블)
        // Admin 객체는 nSeqAdmin, Id, Password, Name 등을 포함해야 합니다.
        Admin admin = adminMapper.findByUserId(loginRequest.getUsername());

        if (admin == null) {
            // 사용자가 존재하지 않음
            return null;
        }

        // 2. 비밀번호 검증
        // 실제 비밀번호는 해시되어 저장되어야 합니다. 여기서는 단순 비교를 예시로 듭니다.
        // 실제 운영 환경에서는 BCryptPasswordEncoder 등을 사용해야 합니다.
        if (admin.getPassword().equals(loginRequest.getPassword())) {
            // 3. 인증 성공
            return admin;
        } else {
            // 4. 비밀번호 불일치
            return null;
        }
    }

    @Override
    public void updateLastLoginTime(Long nSeqAdmin) {
        adminMapper.updateLastLogin(nSeqAdmin);
    }
}
