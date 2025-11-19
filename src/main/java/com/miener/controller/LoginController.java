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
            // 2. ✅ 로그인 성공: 세션에 사용자 정보 저장
            session.setAttribute("nSeqAdmin", admin.getNSeqAdmin());
            session.setAttribute("userName", admin.getName());
            session.setAttribute("userId", admin.getId());       // ✅ 아이디
            session.setAttribute("userPhone", admin.getPhone()); // ✅ 연락처
            session.setAttribute("userRole", admin.getRoleName()); // ✅ 권한 레벨 (예: "슈퍼 관리자")
            session.setAttribute("userCompanyId", admin.getCompanyId()); // ✅ 회사 ID
            session.setAttribute("lastLogin", admin.getDtLastLogin()); // ✅ 마지막 로그인 시간
            session.setAttribute("companyName", admin.getCompanyName()); //

            // 3. 메인 페이지로 이동
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
