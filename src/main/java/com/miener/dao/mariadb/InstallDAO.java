package com.miener.dao.mariadb;

import com.miener.dto.*;
import org.apache.ibatis.annotations.Mapper;
import org.json.simple.JSONArray;

import java.util.List;
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

    /**
     * 설치 이력을 테이블에 추가합니다.
     *
     * @param historyDto nSeqWorker와 nSeqHo 정보를 포함
     * @return 삽입된 레코드 수 (성공 시 1)
     */
    int insertInstallHistory(MeterInstallHistoryDto historyDto);

    int insertDcuInstallHistory(DcuInstallHistoryDto historyDto);

    List<Map> WkGetHoListBySiteForPaging(Map param);


    /**
     * MID(계량기 ID)를 사용하여 해당하는 nSeqMeter 값을 조회합니다.
     *
     * @param mid 조회할 계량기 ID
     * @return nSeqMeter 값 (조회 실패 시 null)
     */
    Long getSeqMeterByMid(String mid);


    /**
     * 계량기 설치 이력을 검색 조건에 따라 조회합니다.
     *
     * @param searchDto 검색 조건 및 페이징 정보
     * @return 설치 이력 목록
     */
    List<Map<String, Object>> getMeterInstallationHistory(MeterInstallHistorySearchDto searchDto);

    /**
     * 계량기 설치 이력의 전체 개수를 조회합니다.
     *
     * @param searchDto 검색 조건
     * @return 전체 개수
     */
    int countMeterInstallationHistory(MeterInstallHistorySearchDto searchDto);

}
