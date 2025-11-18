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
    <div class="filter-title">검색 상세 필터</div>
    <div class="filter-controls">
        <select id="dateFilter" name="dateFilter">
            <option value="today" selected>오늘</option>
            <option value="yesterday">어제</option>
            <option value="thisWeek">이번주</option>
            <option value="thisMonth">이번달</option>
        </select>

        <select id="workerFilter">
            <option value="all" selected>전체</option>
            <option value="kim">김화경</option>
            <option value="lee">이호성</option>
        </select>

        <select id="regionFilter" name="regionFilter">
            <option value="all" selected>전체</option>
            <option value="seoul">서울</option>
            <option value="gyeonggi">경기</option>
        </select>

        <span class="refresh-btn" title="초기화" onclick="resetFilters()">⟳</span>
    </div>
    <input type="text" id="searchKeyword" name="searchKeyword" placeholder="단지 전체"/>

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
