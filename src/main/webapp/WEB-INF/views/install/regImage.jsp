<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8"/>
    <title>설치사진 등록</title>

    <jsp:include page="../common/common.jsp"/>

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
    <link href="${pageContext.request.contextPath}/static/css/regImage.css?${resourceVersion}" rel="stylesheet"/>

</head>
<body>
<%@ include file="/WEB-INF/views/common/header.jsp" %>

<div class="page-header">
    <span class="back-btn" id="historyBack">
       <i class="fa-solid fa-arrow-left"></i>
    </span>
    <div class="page-title">설치사진</div>
</div>


<div class="filter-box">
    <div class="filter-title">단지 검색</div>

    <div class="siteSelect-container" id="siteSelectContainer">
        <select id="siteSelect" class="select2" name="siteSelect" data-live-search="true"></select>
    </div>

</div>

<div class="hardware-box">
    <div class="filter-title">하드웨어 설치 현황</div>

    <div class="hardware-meter swiper">
        <div class="swiper-wrapper">

            <div class="swiper-slide hardware-card dcu" data-type="dcu">
                <div class="card-title dcu">DCU</div>
                <div class="card-body dcu">
                    <div><span class="card-main" id="dcuCnt"></span> <span class="card-ea"></span></div>
                </div>
            </div>

            <div class="swiper-slide hardware-card meter" data-type="meter">
                <div class="card-title meter">계량기 / 계측기</div>
                <div class="card-body meter">
                    <div><span id="meterCnt" class="card-main"></span><span class="card-ea">(<span
                            id="modemCnt"></span>)</span>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>

<!-- 하단 개별 설치 정보 -->
<div class="hardware-list" id="installationList">
    <div class="filter-title">개별 설치 정보</div>

    <div class="filter-container">
        <select id="selectDongForMeter"></select>
        <select id="selectHoForMeter"></select>
    </div>

    <div class="search-result-count">
        <%--        검색 결과 : <span id="resultCount">0</span>--%>
    </div>

    <div id="installTable-container">
        <table class="installation-table" id="installTable">
            <thead>
            <tr>
                <th>설치 위치</th>
                <th style="font-weight: 700;">DCU ID</th>
            </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</div>

<script src="${pageContext.request.contextPath}/static/js/regImage.js?${resourceVersion}"></script>
</body>
</html>
