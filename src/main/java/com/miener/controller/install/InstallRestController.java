package com.miener.controller.install;

import com.miener.dto.DcuUpdDTO;
import com.miener.service.InstallService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
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


    @RequestMapping("/getMeterDetail")
    public Map<String, Object> getMeterDetail(@RequestParam HashMap<String, Object> paramMap) throws Exception {

        Map<String, Object> response = new HashMap<>();

        int seqHo = Integer.parseInt(String.valueOf(paramMap.get("seqHo")));

        response.put("HO_INFO",
                installService.WkGetHoInfo(Collections.singletonMap("seqHo", seqHo)).get(0)
        );
        response.put("LIST_IMAGE",
                installService.WkGetImageMeterListByHo(Collections.singletonMap("seqHo", seqHo))
        );
        response.put("SEQ_HO", seqHo);

        return response;
    }

    @PutMapping("/api/dcu/update")
    public Map<String, Object> updateDcuInfo(@RequestBody DcuUpdDTO dto) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = installService.updateDcuInfo(dto);
            result.put("success", success);
            if(!success) {
                result.put("message", "업데이트 대상이 없습니다.");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }
}
