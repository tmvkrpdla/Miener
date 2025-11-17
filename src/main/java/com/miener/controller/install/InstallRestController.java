package com.miener.controller.install;

import com.miener.dto.*;
import com.miener.service.InstallService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
            if (!success) {
                result.put("message", "업데이트 대상이 없습니다.");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PutMapping("/api/ho/update")
    public ResponseEntity<Map<String, Object>> updateHoHardwareInfo(@RequestBody HoUpdateDto hoUpdateDto) {
        Map<String, Object> response = new HashMap<>();

        try {
            installService.updateHoHardware(hoUpdateDto);
            response.put("success", true);
            response.put("message", "하드웨어 정보가 성공적으로 업데이트되었습니다.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "업데이트 중 서버 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @RequestMapping("/getAptMeter")
    public Map<String, Object> getAptMeter(@RequestParam HashMap<String, Object> paramMap) {
        log.info("getAptMeter paramMap : {}", paramMap);

        Map<String, Object> response = new HashMap<>();

        // 인자로 받은 paramMap에서 필요한 값 추출
        String seqSite = (String) paramMap.get("seqSite");
        String seqCode = String.valueOf(paramMap.get("seqCode") == null ? "12" : paramMap.get("seqCode"));
        String dongName = String.valueOf(paramMap.get("dongName") == null ? "" : paramMap.get("dongName"));
        String hoName = String.valueOf(paramMap.get("hoName") == null ? "" : paramMap.get("hoName"));
        String mid = String.valueOf(paramMap.get("mid") == null ? "" : paramMap.get("mid"));

        int modemCnt = 0;


        // 서비스 호출에 필요한 핵심 파라미터 추가/재설정
        paramMap.put("seqSite", seqSite);
        paramMap.put("IndexFrom", "1"); // 하드코딩된 값 (모든 페이지를 가져오기 위함)
        paramMap.put("IndexTo", "999999"); // 하드코딩된 값
        paramMap.put("seqCode", seqCode); // 위에서 기본값("12")이 적용된 값 사용


        // 3. 생성된 Map(재사용된 paramMap)을 서비스 메서드에 전달
        List<Map> list = installService.WkGetHoListBySiteForPaging(paramMap);
        // ... (후략)

        // ... 필터링 로직은 그대로 유지 ...
        if ("12".equals(seqCode)) {
            if (!"".equals(dongName))
                list = list.stream()
                        .filter(map -> map.get("seq_dong") != null && map.get("seq_dong").toString().contains(dongName)
                        ).collect(Collectors.toList());
            if (!"".equals(hoName))
                list = list.stream()
                        .filter(map -> map.get("seq_ho") != null && map.get("seq_ho").toString().contains(hoName)
                        ).collect(Collectors.toList());
        } else if ("21".equals(seqCode)) {
            if (!"".equals(hoName))
                list = list.stream()
                        .filter(map -> map.get("ho_name") != null && map.get("ho_name").toString().contains(hoName)
                        ).collect(Collectors.toList());
        }

        if (!"".equals(mid))
            list = list.stream()
                    .filter(map -> map.get("mid_new") != null && map.get("mid_new").toString().contains(mid)
                    ).collect(Collectors.toList());

        response.put("list_ho", list);

        for (Object o : list) {

            Map list_ho_map = (HashMap) o;

            if ((boolean) list_ho_map.get("bound_to_modem")) {
                modemCnt++;
            }
        }

        response.put("modemCnt", modemCnt);
        response.put("meterCnt", list.size());

        return response;
    }


    /**
     * API: POST /install/api/history/add
     * 설치 이력을 추가합니다.
     *
     * @param historyDto 클라이언트에서 전송된 {nSeqWorker, nSeqHo} 정보
     * @return 처리 결과 JSON
     */
    @PostMapping("/api/history/add/meter")
    public ResponseEntity<Map<String, Object>> addInstallHistory(@RequestBody MeterInstallHistoryDto historyDto) {
        Map<String, Object> response = new HashMap<>();

        try {
            boolean success = installService.addHistory(historyDto);

            if (success) {
                response.put("success", true);
                response.put("message", "설치 이력이 성공적으로 추가되었습니다.");
            } else {
                response.put("success", false);
                response.put("message", "설치 이력 추가에 실패했습니다.");
            }
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            // 유효성 검사 실패 (작업자 ID, 호 ID 누락 등)
            response.put("success", false);
            response.put("message", "입력 값 오류: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            // 기타 DB 오류 또는 서비스 오류
            response.put("success", false);
            response.put("message", "서버 처리 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * API: GET /api/installation/meter/list
     * 계량기 설치 이력을 조회하고 페이징 정보를 포함하여 반환합니다.
     */
    @GetMapping("/api/meter/installList")
    public ResponseEntity<Map<String, Object>> getMeterInstallationList(@ModelAttribute MeterInstallHistorySearchDto searchDto) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 1. 전체 카운트 조회
            int totalCount = installService.getMeterHistoryCount(searchDto);

            // 2. 이력 목록 조회
            List<Map<String, Object>> list = installService.getMeterHistoryList(searchDto);

            response.put("success", true);
            response.put("list", list);
            response.put("totalCount", totalCount);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "계량기 설치 이력 조회 중 서버 오류 발생: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }


    @PostMapping("/api/dcu/history/add")
    public ResponseEntity<Map<String, Object>> addDcuInstallHistory(@RequestBody DcuInstallHistoryDto historyDto) {
        Map<String, Object> response = new HashMap<>();

        try {
            boolean success = installService.addDcuHistory(historyDto);

            if (success) {
                response.put("success", true);
                response.put("message", "설치 이력이 성공적으로 추가되었습니다.");
            } else {
                response.put("success", false);
                response.put("message", "설치 이력 추가에 실패했습니다.");
            }
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            // 유효성 검사 실패 (작업자 ID, dcu ID 누락 등)
            response.put("success", false);
            response.put("message", "입력 값 오류: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            // 기타 DB 오류 또는 서비스 오류
            response.put("success", false);
            response.put("message", "서버 처리 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }


}
