package com.miener.service;

import com.miener.dao.mariadb.InstallDAO;
import com.miener.dto.DcuUpdDTO;
import com.miener.dto.HoUpdateDto;
import com.miener.dto.MeterInstallHistoryDto;
import com.miener.dto.MeterInstallHistorySearchDto;
import com.miener.util.ManagerApi;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class InstallService {


    private final InstallDAO installDAO;


    public Map<String, Object> getDcuDetails(String seqDcu) {
        Map<String, Object> response = new HashMap<>();

        HashMap<String, Object> detailInfoMap = fetchDcuInfo(seqDcu);

        HashMap<String, Object> dcuInfo = (HashMap<String, Object>) detailInfoMap.get("dcu_info");
        List<Object> listImageDcu = (List<Object>) detailInfoMap.get("list_image_dcu");

        response.put("dcu_info", dcuInfo);
        response.put("list_image", listImageDcu);

        return response;
    }


    public JSONArray WkGetHoInfo(Map param) {
        try {
            return installDAO.WkGetHoInfo(param);
        } catch (Exception e) {
            return new JSONArray();
        }
    }

    public JSONArray WkGetImageMeterListByHo(Map param) {
        try {
            return installDAO.WkGetImageMeterListByHo(param);
        } catch (Exception e) {
            return new JSONArray();
        }
    }


    // Method that calls ManagerApi to fetch DCU info
    private HashMap<String, Object> fetchDcuInfo(String seqDcu) {
        return ManagerApi.getDcuInfo(seqDcu);
    }

    @Transactional
    public boolean updateDcuInfo(DcuUpdDTO dto) {
        int updated = installDAO.updateDcuInfo(dto);
        return updated > 0;
    }


    /**
     * 하드웨어 설치 정보를 업데이트합니다. (Meter 및 AptHo 테이블)
     * 1. DTO의 mid를 사용하여 meter 테이블에서 nSeqMeter를 조회합니다.
     * 2. 조회된 nSeqMeter를 AptHo 테이블에 연결합니다.
     *
     * @param dto mid, meterValueStart, meterMacAddress, boundToModem, seqHo를 포함
     */
    @Transactional
    public void updateHoHardware(HoUpdateDto dto) {
        // 1. 필수 값 유효성 검사 (mid와 seqHo 모두 필요)
        if (dto.getMid() == null || dto.getMid().isEmpty()) {
            throw new IllegalArgumentException("새로운 계량기 ID (mid)가 필요합니다.");
        }
        if (dto.getSeqHo() == null) {
            throw new IllegalArgumentException("호 ID (seqHo)가 필요합니다.");
        }

        // 2. MID를 사용하여 nSeqMeter를 조회
        Long newSeqMeter = installDAO.getSeqMeterByMid(dto.getMid());

        if (newSeqMeter == null) {
            throw new IllegalArgumentException("해당 MID(" + dto.getMid() + ")에 해당하는 계량기 정보가 DB에 존재하지 않습니다.");
        }

        // 3. DTO에 조회된 nSeqMeter 설정
        // 이 nSeqMeter 값은 meter 업데이트의 WHERE 조건으로, aptho 업데이트의 SET 값으로 사용됩니다.
        dto.setSeqMeter(newSeqMeter);

        // 4. Meter 정보 업데이트 (Mid, MacAddr)
        // WHERE nSeqMeter = newSeqMeter
        installDAO.updateMeterInfo(dto);

        // 5. AptHo 정보 업데이트 (nValueStart, bBoundToModem, nSeqMeter)
        // SET nSeqMeter = newSeqMeter
        // WHERE nSeqAptHo = seqHo
        installDAO.updateAptHoInfo(dto);
    }

    /**
     * 설치 이력을 등록합니다.
     *
     * @param historyDto 설치 이력 정보 (작업자 ID, 호 ID)
     * @return 등록 성공 여부 (true/false)
     */
    @Transactional
    public boolean addHistory(MeterInstallHistoryDto historyDto) {
        // 필수 값 유효성 검사 (Controller에서 처리할 수도 있지만, Service에서도 한 번 더 확인)
        if (historyDto.getSeqWorker() == null || historyDto.getSeqHo() == null) {
            throw new IllegalArgumentException("작업자 ID 또는 호 ID가 누락되었습니다.");
        }

        int result = installDAO.insertInstallHistory(historyDto);
        return result == 1;
    }


    public List<Map> WkGetHoListBySiteForPaging(Map param) {
        try {
            return installDAO.WkGetHoListBySiteForPaging(param);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public List<Map<String, Object>> getMeterHistoryList(MeterInstallHistorySearchDto searchDto) {
        return installDAO.getMeterInstallationHistory(searchDto);
    }

    public int getMeterHistoryCount(MeterInstallHistorySearchDto searchDto) {
        return installDAO.countMeterInstallationHistory(searchDto);
    }
}


