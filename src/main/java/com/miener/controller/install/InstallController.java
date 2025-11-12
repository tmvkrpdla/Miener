package com.miener.controller.install;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;

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
    public ModelAndView dcuInstallList(
            @RequestParam(required = false) Map<String, String> params,
            ModelAndView mav) {

        // siteName, dcuId, seqDcu 등 모든 파라미터를 한 번에 넣기
        params.forEach(mav::addObject);
        mav.setViewName("install/dcuInstallList");
        return mav;
    }

    @RequestMapping("/meterInstallList")
    public ModelAndView meterInstallList(@RequestParam(required = false) Map<String, String> params,
                                         ModelAndView mav) {
        params.forEach(mav::addObject);
        mav.setViewName("install/meterInstallList");
        return mav;
    }


}
