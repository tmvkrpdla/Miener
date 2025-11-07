package com.miener.controller.install;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Slf4j
@RequiredArgsConstructor
@Controller
@RequestMapping("/install")
public class InstallController {


    @GetMapping("/history")
    public String installHistory(Model model) {
        return "install/installHistory";
    }

    @GetMapping("/regImage")
    public String regInstallImage(Model model) {
        return "install/regImage";
    }


    @RequestMapping("/dcuInstallList")
    public ModelAndView dcuInstallList(ModelAndView mav) {
        mav.setViewName("install/dcuInstallList");
        return mav;
    }

    @RequestMapping("/meterInstallList")
    public ModelAndView meterInstallList(ModelAndView mav) {
        mav.setViewName("install/meterInstallList");
        return mav;
    }


}
