<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>

<link href="${pageContext.request.contextPath}/static/css/header.css?${resourceVersion}" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
<!-- 헤더 영역 -->
<header class="header mobile-tuned-header">
    <div class="logo-area">
        <img src="${pageContext.request.contextPath}/static/images/jgbLogoWhiteBack.png" alt="지구방 로고"/>
        <div class="logo-text-group">
            <span class="main-title">지구방</span>
            <span class="subtitle">지구를 구하는 방법</span>
        </div>
        <span class="role-badge">관리자</span>
    </div>

    <div class="icons">
        <i class="fa-solid fa-right-from-bracket"
           title="로그아웃"
           onclick="location.href='${pageContext.request.contextPath}/logout'"></i>
        <i class="fa-solid fa-bell" title="알림"></i>
    </div>
</header>