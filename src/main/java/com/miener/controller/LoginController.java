package com.miener.controller;

import com.miener.dto.Admin;
import com.miener.dto.LoginRequest;
import com.miener.service.LoginService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.Random;

@Controller
@RequiredArgsConstructor
public class LoginController {

    @Autowired
    private LoginService loginService;


    @PostMapping("/login")
    public String login(@ModelAttribute LoginRequest loginRequest, HttpSession session) {

        // 1. 서비스 호출하여 사용자 검증
        Admin admin = loginService.validateUser(loginRequest);

        if (admin != null) {

            // 2. ✅ 로그인 성공 후 DB 업데이트
            loginService.updateLastLoginTime(admin.getNSeqAdmin()); // ✅ 현재 시간으로 업데이트

            // 3. ✅ 로그인 성공: 세션에 사용자 정보 저장
            // 🚨 세션 유지 기간을 9시간 (32,400초)로 설정 🚨 session.setMaxInactiveInterval(9 * 60 * 60); // 시 분 초
            session.setMaxInactiveInterval(32400);


            // =======================================================
            // ✅ 캐릭터 이미지 랜덤 할당 로직 추가
            // 1부터 3까지의 정수(1, 2, 3) 중 하나를 랜덤으로 선택
            Random random = new Random();
            int charNumber = random.nextInt(3) + 1; // 0, 1, 2 -> 1, 2, 3

            // 이미지 경로를 완성하여 세션에 저장
            // 예: "/static/images/character02.png"
            String profileImagePath = "/static/images/character0" + charNumber + ".png";
            session.setAttribute("profileImagePath", profileImagePath);
            // =======================================================

            session.setAttribute("nSeqAdmin", admin.getNSeqAdmin());
            session.setAttribute("userName", admin.getName());
            session.setAttribute("userId", admin.getId());       // ✅ 아이디
            session.setAttribute("userPhone", admin.getPhone()); // ✅ 연락처
            session.setAttribute("userRole", admin.getRoleName()); // ✅ 권한 레벨 (예: "슈퍼 관리자")
            session.setAttribute("userCompanyId", admin.getCompanyId()); // ✅ 회사 ID
            /*AS-IS*/
//            session.setAttribute("lastLogin", admin.getDtLastLogin()); // ✅ 마지막 로그인 시간
            /*TO-BE*/
            session.setAttribute("lastLogin", new Date()); // 현재 시각으로 세션값 강제 업데이트 (DB에 업데이트된 시각과 동일하게)
            session.setAttribute("companyName", admin.getCompanyName()); //

            // 4. 메인 페이지로 이동
            return "redirect:/profile/settings";
        } else {
            // 4. 로그인 실패
            // 오류 메시지를 포함하여 로그인 페이지로 리다이렉트
            return "redirect:/";
        }
    }


    @RequestMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
//        return "redirect:/login";
        return "redirect:/";

    }


}
