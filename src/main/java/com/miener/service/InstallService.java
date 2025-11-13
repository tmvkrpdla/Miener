package com.miener.service;

import com.miener.dao.mariadb.InstallDAO;
import com.miener.dto.DcuUpdDTO;
import com.miener.dto.HoUpdateDto;
import com.miener.util.ManagerApi;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        try{
            return installDAO.WkGetHoInfo(param);
        }catch (Exception e){
            return new JSONArray();
        }
    }

    public JSONArray WkGetImageMeterListByHo(Map param) {
        try{
            return installDAO.WkGetImageMeterListByHo(param);
        }catch (Exception e){
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
     * 트랜잭션을 사용하여 두 업데이트가 모두 성공하거나 모두 실패하도록 보장합니다.
     */
    @Transactional
    public void updateHoHardware(HoUpdateDto dto) {
        if (dto.getSeqMeter() != null) {
            installDAO.updateMeterInfo(dto);
        } else {
            throw new IllegalArgumentException("계량기 ID가 필요합니다.");
        }
        // AptHo 정보는 seqHo를 통해 업데이트
        installDAO.updateAptHoInfo(dto);

    }
}


