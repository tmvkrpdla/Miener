<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>지구방</title>

    <jsp:include page="../common/common.jsp"/>

    <script src="${pageContext.request.contextPath}/static/js/setting.js?${resourceVersion}"></script>
    <link href="${pageContext.request.contextPath}/static/css/setting.css?${resourceVersion}" rel="stylesheet"/>

</head>
<body>

<!-- 🔹 상단 고정 헤더 -->
<%@ include file="/WEB-INF/views/common/header.jsp" %>


<!-- 🔹 콘텐츠 -->
<main class="app-content">
    <!-- 프로필 -->
    <div class="profile-card">

        <div class="menu-title-container" style="text-align: left;"><span class="menu-title">내 프로필</span></div>

        <div class="profile-pic">
            <%-- <img src="${pageContext.request.contextPath}/static/images/character01.png" class="logo" alt="프로필 사진"/>
             <img src="${pageContext.request.contextPath}/static/images/character02.png" class="logo" alt="프로필 사진"/>
             <img src="${pageContext.request.contextPath}/static/images/character03.png" class="logo" alt="프로필 사진"/>--%>
            <img src="${pageContext.request.contextPath}${sessionScope.profileImagePath}" class="logo"
                 alt="사용자 프로필 이미지"/>
        </div>
        <p class="profile-name">${displayName}</p>
        <%--        <p class="profile-sub">${roleAndCompany}</p>--%>

        <div class="profile-details">
            <div class="detail-item">
                <p>${companyName}</p>
                <small>소속 회사</small>
            </div>
            <div class="detail-item">
                <p>${roleLevel}</p>
                <small>권한 레벨</small>
            </div>
            <div class="detail-item">
                <p>${contactPhone}</p>
                <small>연락처</small>
            </div>
        </div>
        <span class="last-login">마지막 로그인: ${formattedLastLogin}</span>
    </div>

    <!-- 관리자 기능 -->
    <div class="features-card">
        <div class="menu-title-container"><span class="menu-title">관리자 부가 기능</span></div>
        <div class="features-grid">
            <div class="feature-item feature-link feature-disabled"><i class="fa-solid fa-bullhorn"></i>
                <p>공지사항</p>
            </div>
            <a href="${pageContext.request.contextPath}/install/regImage" class="feature-item feature-link">
                <i class="fa-solid fa-camera"></i>
                <p>설치사진</p>
            </a>
            <a href="${pageContext.request.contextPath}/install/history" class="feature-item feature-link">
                <i class="fa-solid fa-clock-rotate-left"></i>
                <p>설치이력</p>
            </a>
            <div class="feature-item feature-link feature-disabled"><i class="fa-solid fa-headset"></i>
                <p>문의관리</p>
            </div>
            <div class="feature-item feature-link feature-disabled"><i class="fa-solid fa-home"></i>
                <p>지구방</p>
            </div>
            <div class="feature-item feature-link feature-disabled"><i class="fa-solid fa-chart-line"></i>
                <p>DR 통계</p>
            </div>
            <div class="feature-item feature-link feature-disabled"><i class="fa-solid fa-gear"></i>
                <p>DR 관리</p>
            </div>
            <div class="feature-item feature-link feature-disabled"><i class="fa-solid fa-shield-alt"></i>
                <p>거주인증</p>
            </div>
        </div>
    </div>
</main>

<%--<!-- 🔹 하단 고정 네비게이션 -->--%>
<%--<nav class="bottom-nav">--%>
<%--    <button class="active">🏠</button>--%>
<%--    <button>📊</button>--%>
<%--    <button>💬</button>--%>
<%--    <button>👤</button>--%>
<%--</nav>--%>

</body>


</html>
