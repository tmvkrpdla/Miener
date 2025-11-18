package com.miener.dao.mariadb;

import com.miener.dto.Admin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper // ✅ Spring이 이 인터페이스의 구현체를 자동으로 생성하도록 지시
public interface AdminMapper {

    /**
     * 사용자 아이디(Id)로 관리자 정보를 조회합니다.
     * AdminMapper.xml의 <select id="findByUserId">와 연결됩니다.
     * * @param userId 조회할 관리자 아이디 (admin.Id)
     * @return 조회된 Admin 객체, 없으면 null
     */
    Admin findByUserId(@Param("Id") String userId);
    // XML에서 Id=#{Id}로 사용했기 때문에 @Param("Id")를 사용하여 파라미터 이름을 명시해 주는 것이 안전합니다.
}