package com.miener.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.Date;

@Controller
public class MainController {


    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("menu", "dashboard");
        return "dashboard"; // => /WEB-INF/views/dashboard.jsp
    }

    @GetMapping("/complex/status")
    public String complexStatus(Model model) {
        model.addAttribute("menu", "complexStatus");
        return "complex/status"; // => /WEB-INF/views/complex/status.jsp
    }

    @GetMapping("/metering/unavailable")
    public String meteringUnavailable(Model model) {
        model.addAttribute("menu", "unavailable");
        return "metering/unavailable"; // => /WEB-INF/views/metering/unavailable.jsp
    }

    @GetMapping("/hardware/info")
    public String hardwareInfo(Model model) {
        model.addAttribute("menu", "hardware");
        return "hardware/info"; // => /WEB-INF/views/hardware/info.jsp
    }

    @GetMapping("/statistics")
    public String statistics(Model model) {
        model.addAttribute("menu", "stats");
        return "statistics"; // => /WEB-INF/views/statistics.jsp
    }


//    @GetMapping("/profile/settings")
//    public String profileSettings(Model model) {
//        model.addAttribute("menu", "profile");
//        return "profile/settings"; // => /WEB-INF/views/profile/settings.jsp
//    }


    @GetMapping("/profile/settings")
    public String profileSettings(Model model, HttpSession session) {
        model.addAttribute("menu", "profile");

        // ✅ 세션에서 필요한 사용자 정보 읽기
        String userName = (String) session.getAttribute("userName");
        String userId = (String) session.getAttribute("userId");
        String userPhone = (String) session.getAttribute("userPhone");
        String userRole = (String) session.getAttribute("userRole");
        Date lastLogin = (Date) session.getAttribute("lastLogin");

        // TODO: company_id를 이용하여 회사 이름 조회 로직 추가 필요 (예시에서는 하드코딩)
        String companyName = "더글로리";

        // ✅ Model에 데이터 추가
        model.addAttribute("displayName", userName + " (" + userId + ")"); // "박연진 (pyj)"
        model.addAttribute("roleAndCompany", userRole + " · " + companyName); // "슈퍼 관리자 · 더글로리"
        model.addAttribute("companyName", companyName);
        model.addAttribute("roleLevel", userRole);
        model.addAttribute("contactPhone", userPhone);

        // 날짜 포맷팅 (뷰에서 처리하는 것이 일반적이나, 컨트롤러에서 미리 문자열로 포맷팅 가능)
        if (lastLogin != null) {
            model.addAttribute("formattedLastLogin", new SimpleDateFormat("yyyy-MM-dd HH:mm").format(lastLogin));
        } else {
            model.addAttribute("formattedLastLogin", "N/A");
        }


        return "profile/settings"; // => /WEB-INF/views/profile/settings.jsp
    }


/*    @GetMapping("/install/history")
    public String installHistory(Model model) {
        return "install/installHistory";
    }

    @GetMapping("/install/regImage")
    public String regInstallImage(Model model) {
        return "install/regImage";
    }*/

}
