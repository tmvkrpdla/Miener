<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>

<link href="${pageContext.request.contextPath}/static/css/header.css" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
<!-- 헤더 영역 -->
<header class="header">
    <div class="logo">
        <img src="${pageContext.request.contextPath}/static/img/logo-white.png" alt="지구방 로고"/>
        <span>지구방</span>
        <span class="subtitle">지구를 구하는 방법</span>
        <span class="role-badge">관리자</span>
    </div>
    <div class="icons">
        <span title="로그아웃" onclick="location.href='${pageContext.request.contextPath}/logout'">&#x1F511;</span>
        <span title="알림">&#128276;</span>
    </div>
</header>

<nav class="top-nav">
    <ul>
        <li class="nav-item <c:if test='${menu eq "dashboard"}'>active</c:if>'">
            <a href="${pageContext.request.contextPath}/dashboard">
                <i class="fas fa-chart-line"></i>
            </a>
        </li>
        <%-- 홈 (대시보드) --%>

        <li class="nav-item <c:if test='${menu eq "complexStatus"}'>active</c:if>'">
            <a href="${pageContext.request.contextPath}/complex/status">
                <i class="fas fa-building"></i>
            </a>
        </li>
        <%-- 단지별 검침 현황 --%>

        <li class="nav-item <c:if test='${menu eq "unavailable"}'>active</c:if>'">
            <a href="${pageContext.request.contextPath}/metering/unavailable">
                <i class="fas fa-xmark"></i>
            </a>
        </li>
        <%-- 검침불가 대시보드 --%>

        <li class="nav-item <c:if test='${menu eq "hardware"}'>active</c:if>'">
            <a href="${pageContext.request.contextPath}/hardware/info">
                <i class="fas fa-robot"></i>
            </a>
        </li>
        <%-- 하드웨어 정보 --%>

        <li class="nav-item <c:if test='${menu eq "stats"}'>active</c:if>'">
            <a href="${pageContext.request.contextPath}/statistics">
                <i class="fas fa-tachometer-alt"></i>
            </a>
        </li>
        <%-- 통계 --%>

        <li class="nav-item <c:if test='${menu eq "profile"}'>active</c:if>'">
            <a href="${pageContext.request.contextPath}/profile/settings">
                <i class="fas fa-sliders-h"></i>
            </a>
        </li>
        <%-- 프로필 설정 --%>
    </ul>
</nav>