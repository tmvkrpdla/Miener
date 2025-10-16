<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>지구방</title>

    <jsp:include page="../common/common.jsp"/>

    <link href="${pageContext.request.contextPath}/static/css/setting.css" rel="stylesheet"/>
    <script src="${pageContext.request.contextPath}/static/js/setting.js"></script>

</head>
<body>
<%@ include file="/WEB-INF/views/common/header.jsp" %>

<div class="mobile-frame">

    <div class="profile-section">
        <h3>내 프로필</h3>
        <div class="profile-header">
            <div class="profile-pic">
                <img src="https://via.placeholder.com/150" alt="프로필 사진">
            </div>
        </div>
        <p class="profile-name">박연진 (pyj)</p>
        <div class="profile-details">
            <div class="detail-item">
                <small>소속 회사</small>
                <p>더글로리</p>
            </div>
            <div class="detail-item">
                <small>권한 레벨</small>
                <p>슈퍼 관리자</p>
            </div>
            <div class="detail-item">
                <small>연락처</small>
                <p>010-1234-5678</p>
            </div>
        </div>
        <p class="last-login">마지막 로그인: 2025-06-20 09:38</p>
    </div>

    <div class="admin-features">
        <h3>관리자 부가 기능</h3>
        <div class="features-grid">
            <div class="feature-item">
                <span>📢</span>
                <p>공지사항</p>
            </div>
            <div class="feature-item">
                <%--                <a href="${pageContext.request.contextPath}/install/regImage" class="feature-item">--%>
                <span>📸</span>
                <p>설치사진</p>
                <%--                </a>--%>
            </div>
            <div class="feature-item">
                <%--                <a href="${pageContext.request.contextPath}/install/history" class="feature-item">--%>
                <span>📜</span>
                <p>설치이력</p>
                <%--                </a>--%>
            </div>
            <div class="feature-item">
                <span>📞</span>
                <p>문의관리</p>
            </div>
            <div class="feature-item">
                <span>🏠</span>
                <p>지구방</p>
            </div>
            <div class="feature-item">
                <span>📊</span>
                <p>DR 통계</p>
            </div>
            <div class="feature-item">
                <span>⚙️</span>
                <p>DR 관리</p>
            </div>
            <div class="feature-item">
                <span>🛡️</span>
                <p>거주인증</p>
            </div>
        </div>
    </div>
</div>

</body>
</html>
