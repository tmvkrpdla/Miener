<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8" />
    <title>설치이력</title>

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

    <link href="${pageContext.request.contextPath}/static/css/bootstrap.min.css" rel="stylesheet" />
    <link href="${pageContext.request.contextPath}/static/css/installation-mobile.css" rel="stylesheet" />

</head>
<body>

<header class="header">
    <div class="logo">
        <img src="${pageContext.request.contextPath}/static/img/logo-white.png" alt="지구방 로고" />
        <span>지구방</span>
        <span class="subtitle">지구를 구하는 방법</span>
        <span class="role-badge">관리자</span>
    </div>
    <div class="icons">
        <span title="로그아웃" onclick="location.href='${pageContext.request.contextPath}/logout'">&#x1F511;</span>
        <span title="알림">&#128276;</span>
    </div>
</header>

<div class="page-header">
    <span class="back-btn" onclick="history.back()">←</span>
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
        <select id="workerFilter" name="workerFilter">
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
    <input type="text" id="searchKeyword" name="searchKeyword" placeholder="단지 전체" />
</div>

<div class="search-result-count">
    검색 결과 : <c:out value="${fn:length(installationList)}" />
</div>

<div class="card-list">
    <c:forEach var="item" items="${installationList}">
        <div class="card-item" onclick="location.href='${pageContext.request.contextPath}/installation/detail/${item.id}'">
            <div class="top-row">
                <span>${item.installDate} · ${item.worker} · ${item.region}</span>
                <c:choose>
                    <c:when test="${item.type == '계량기'}">
                        <span class="badge-meter">계량기</span>
                    </c:when>
                    <c:when test="${item.type == 'DCU'}">
                        <span class="badge-dcu">DCU</span>
                    </c:when>
                </c:choose>
            </div>
            <div class="main-row">
                <span class="name">${item.complexName}</span>
                <span class="serial">
                    <c:out value="${item.serial}" />
                </span>
            </div>
            <div class="bottom-row">
                <div>${item.detailAddress}</div>
                <div><small>${item.serialFull}</small></div>
            </div>
        </div>
    </c:forEach>
</div>

<script src="${pageContext.request.contextPath}/static/js/installation-mobile.js"></script>

</body>
</html>
