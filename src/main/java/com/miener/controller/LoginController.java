package com.miener.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;

@Controller
@RequiredArgsConstructor
public class LoginController {


//    private final LoginService loginService;
//
//    @PostMapping("/login")
//    public String login(LoginRequestDTO loginRequest, HttpSession session) {
//        boolean isValid = loginService.validateUser(loginRequest);
//
//        if (isValid) {
//            session.setAttribute("loginUser", loginRequest.getUsername());
//            return "redirect:/main"; // 로그인 성공 시 메인 페이지로 이동
//        } else {
//            return "redirect:/login?error"; // 실패 시 다시 로그인 페이지로
//        }
//    }

    @PostMapping("/login")
    public String login() {
//        boolean isValid = loginService.validateUser(loginRequest);
        boolean isValid = true;

        if (isValid) {
            return "redirect:/main"; // 로그인 성공 시 메인 페이지로 이동
        } else {
            return "redirect:/login?error"; // 실패 시 다시 로그인 페이지로
        }
    }

    @RequestMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }


    @GetMapping("/main")
    public String mainPage() {
        return "main"; // src/main/resources/templates/main.html 또는 WEB-INF/views/main.jsp 등 뷰 이름
    }


}
