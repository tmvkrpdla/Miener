<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8"/>
    <title>설치이력</title>

    <jsp:include page="../common/common.jsp"/>

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
    <link href="${pageContext.request.contextPath}/static/css/installation-mobile.css?${resourceVersion}"
          rel="stylesheet"/>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css">
    <script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>

</head>
<body>
<%@ include file="/WEB-INF/views/common/header.jsp" %>


<div class="page-header">
    <span class="back-btn" id="historyBack">←</span>
    <div class="page-title">설치이력</div>
</div>

<div class="tabs">
    <div class="tab-item ${param.tab == null || param.tab == 'all' ? 'active' : ''}" onclick="changeTab('all')">전체</div>
    <div class="tab-item ${param.tab == 'meter' ? 'active' : ''}" onclick="changeTab('meter')">계량기</div>
    <div class="tab-item ${param.tab == 'dcu' ? 'active' : ''}" onclick="changeTab('dcu')">DCU</div>
</div>

<div class="filter-box">
    <div class="filter-title-container"><span class="filter-title">검색 상세 필터</span>
        <span class="refresh-btn" title="초기화" onclick="resetFilters()">⟳</span>
    </div>
    <div class="filter-controls">

        <div class="filter-group">
            <label for="dateFilter" class="filter-label">날짜</label>
            <select id="dateFilter" name="dateFilter">
                <option value="today" selected>오늘</option>
                <option value="yesterday">어제</option>
                <option value="thisWeek">이번주</option>
                <option value="thisMonth">이번달</option>
<%--                <option value="dateTarget">기간설정</option>--%>
            </select>

            <div id="dateTargetInputs" style="display: none; margin-top: 8px;">
                <input type="date" id="startDate" class="date-input" placeholder="시작 날짜" required>
                <span class="date-separator">~</span>
                <input type="date" id="endDate" class="date-input" placeholder="종료 날짜" required>
            </div>

        </div>

        <div class="filter-group">
            <label for="workerFilter" class="filter-label">설치 작업자</label>
            <select id="workerFilter">
                <option value="all" selected>전체</option>
                <option value="김화경">김화경</option>
                <option value="이호성">이호성</option>
            </select>
        </div>

        <div class="filter-group">
            <label for="workerFilter" class="filter-label">광역시·도</label>
            <select id="regionFilter" name="regionFilter" class="filter-select">
                <option value="all" selected>전체</option>
                <option value="서울특별시">서울</option>
                <option value="인천광역시">인천</option>
                <option value="경기도">경기</option>
                <option value="경상남도">경남</option>
                <option value="부산광역시">부산</option>
                <option value="충청남도">충남</option>
                <option value="광주광역시">광주</option>
                <option value="전라북도">전북</option>
                <option value="대전광역시">대전</option>
                <option value="강원도">강원</option>
                <option value="울산광역시">울산</option>
                <option value="경상북도">경북</option>
                <option value="대구광역시">대구</option>
                <option value="충청북도">충북</option>
                <option value="전라남도">전남</option>
            </select>
        </div>

    </div>

    <div class="siteSelect-container" id="siteSelectContainer">
        <select id="siteSelect" class="select2" name="siteSelect" data-live-search="true"></select>
    </div>
    <%--    <input type="text" id="searchKeyword" name="searchKeyword" placeholder="단지 전체"/>--%>

</div>


<div id="loadingOverlay" style="display: none;">
    <div class="spinner-container">
        <div class="spinner"></div>
        <p>데이터 로드중입니다...</p>
    </div>
</div>

<div class="search-result-count">
    검색 결과 : <span id="resultCount"></span>
</div>

<div class="card-list" id="installationList">
    <!-- AJAX로 동적으로 데이터가 채워짐 -->
</div>

<script src="${pageContext.request.contextPath}/static/js/installation-mobile.js?${resourceVersion}"></script>

</body>
</html>
