package com.miener.dao.mariadb;

import com.miener.dto.DcuUpdDTO;
import com.miener.dto.HoUpdateDto;
import org.apache.ibatis.annotations.Mapper;
import org.json.simple.JSONArray;

import java.util.Map;

@Mapper
public interface InstallDAO {

    JSONArray WkGetHoInfo(Map param);

    JSONArray WkGetImageMeterListByHo(Map param);

    int updateDcuInfo(DcuUpdDTO dto);

    /**
     * meter 테이블의 Mid, MacAddr 정보를 업데이트합니다.
     */
    int updateMeterInfo(HoUpdateDto dto);

    /**
     * aptho 테이블의 시작 검침값(nValueStart), 모뎀 연결 여부(bBoundToModem)를 업데이트합니다.
     */
    int updateAptHoInfo(HoUpdateDto dto);

}
