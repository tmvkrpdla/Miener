package com.miener.controller.install;

import com.miener.service.InstallService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/install")
public class InstallRestController {

    private final InstallService installService;



    @RequestMapping("/getDcuInfo")
    public Map<String, Object> getDcuInfo(@RequestParam HashMap<String, Object> paramMap) {

        // 요청 파라미터에서 `seqDcu` 추출
        String seqDcu = (String) paramMap.get("seqDcu");

        // 서비스 메서드를 호출하여 DCU 정보를 가져옴
        return installService.getDcuDetails(seqDcu);
    }
}
