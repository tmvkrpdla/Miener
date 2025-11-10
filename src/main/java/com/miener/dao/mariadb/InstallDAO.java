package com.miener.dao.mariadb;

import org.apache.ibatis.annotations.Mapper;
import org.json.simple.JSONArray;

import java.util.Map;

@Mapper
public interface InstallDAO {

    JSONArray WkGetHoInfo(Map param);

    JSONArray WkGetImageMeterListByHo(Map param);


}
