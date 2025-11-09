package com.miener.service;

import com.miener.util.ManagerApi;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class InstallService {


    public Map<String, Object> getDcuDetails(String seqDcu) {
        Map<String, Object> response = new HashMap<>();

        HashMap<String, Object> detailInfoMap = fetchDcuInfo(seqDcu);

        HashMap<String, Object> dcuInfo = (HashMap<String, Object>) detailInfoMap.get("dcu_info");
        List<Object> listImageDcu = (List<Object>) detailInfoMap.get("list_image_dcu");

//        log.info("dcuInfo : {}", dcuInfo);
//        log.info("listImageDcu : {}", listImageDcu);

        response.put("dcu_info", dcuInfo);
        response.put("list_image", listImageDcu);

        return response;
    }


    // Method that calls ManagerApi to fetch DCU info
    private HashMap<String, Object> fetchDcuInfo(String seqDcu) {
        return ManagerApi.getDcuInfo(seqDcu);
    }
}


