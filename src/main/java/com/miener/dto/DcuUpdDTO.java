package com.miener.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Setter
@ToString
public class DcuUpdDTO {
    private Long seqDcu;
    private String dcuId;
    private String lteSn;
    private Integer sshPort;
    private Integer fepPort;
    private Integer snmpPort;
}
