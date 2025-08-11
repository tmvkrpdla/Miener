package com.miener.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

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

    @GetMapping("/profile/settings")
    public String profileSettings(Model model) {
        model.addAttribute("menu", "profile");
        return "profile/settings"; // => /WEB-INF/views/profile/settings.jsp
    }

    @GetMapping("/install/history")
    public String installHistory(Model model) {
        return "install/installHistory";
    }

    @GetMapping("/install/regImage")
    public String regInstallImage(Model model) {
        return "install/regInstallImage";
    }

}
