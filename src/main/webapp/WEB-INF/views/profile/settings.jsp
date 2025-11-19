<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>지구방</title>

    <jsp:include page="../common/common.jsp"/>

    <script src="${pageContext.request.contextPath}/static/js/setting.js?${resourceVersion}"></script>

    <style>
        :root {
            --primary: #007bff;
            --bg: #f4f6f8;
            --card-bg: #fff;
            --text-dark: #222;
            --text-light: #666;
            --border-color: #e0e0e0;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--bg);
            color: var(--text-dark);
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        /* 🔹 상단 고정 헤더 */
        .app-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background-color: var(--primary);
            color: white;
            padding: 14px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: bold;
            z-index: 100;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .app-header span {
            font-size: 1.1rem;
        }

        .app-header button {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
        }

        /* 🔹 메인 컨테이너 */
        .app-content {
            margin-top: 20px;
            padding: 20px;
            max-width: 480px;
            margin-left: auto;
            margin-right: auto;
        }

        /* 🔹 프로필 카드 */
        .profile-card {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 25px 20px;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
            text-align: center;
        }

        .profile-pic {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            overflow: hidden;
            border: 3px solid #e0e0e0;
            margin: 0 auto;
        }

        .profile-pic img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .profile-name {
            color: #474747;
            font-size: 12.0pt;
            font-weight: 400;
        }

        .profile-sub {
            font-size: 0.85rem;
            color: var(--text-light);
        }

        .profile-details {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
            gap: 5px;
        }

        .detail-item {
            flex: 1;
        }

        .detail-item small {
            color: #929292;
            font-size: 8.25pt;
            font-weight: 400;
        }

        .detail-item p {
            margin: 3px 0 0;
            color: #474747;
            font-size: 9.75pt;
            font-weight: 400;
            background: #F0F0F0;
        }

        .last-login {
            font-size: 0.75rem;
            color: var(--text-light);
            margin-top: 15px;
        }

        /* 🔹 관리자 기능 카드 */
        .features-card {
            background: var(--card-bg);
            border-radius: 20px;
            margin-top: 20px;
            padding: 20px;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
        }

        .features-card h3 {
            font-size: 1rem;
            margin-bottom: 15px;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            gap: 12px;
        }

        .feature-item {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 15px 5px;
            text-align: center;
            transition: 0.2s ease;
            cursor: pointer;
            color: inherit;
            text-decoration: none;
        }

        .feature-item:hover {
            background-color: #eaf3ff;
            transform: translateY(-2px);
        }

        .feature-item span {
            font-size: 1.5rem;
        }

        .feature-item p {
            margin-top: 6px;
            font-size: 0.8rem;
        }

        /* 🔹 하단 탭 (앱 스타일) */
        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: var(--card-bg);
            display: flex;
            justify-content: space-around;
            border-top: 1px solid var(--border-color);
            padding: 8px 0;
            z-index: 100;
        }

        .bottom-nav button {
            background: none;
            border: none;
            font-size: 1.4rem;
            color: var(--text-light);
            cursor: pointer;
            transition: 0.2s;
        }

        .bottom-nav button.active {
            color: var(--primary);
        }

        /* 🔹 반응형 조정 */
        @media (max-width: 480px) {
            .profile-pic {
                width: 80px;
                height: 80px;
            }

            .features-grid {
                grid-template-columns: repeat(3, 1fr);
            }

            .app-header {
                padding: 12px 15px;
            }

            .app-content {
                padding: 15px;
            }
        }
    </style>
</head>
<body>

<!-- 🔹 상단 고정 헤더 -->
<%@ include file="/WEB-INF/views/common/header.jsp" %>


<!-- 🔹 콘텐츠 -->
<main class="app-content">
    <!-- 프로필 -->
    <div class="profile-card">
        <div class="profile-pic">
<%--            <img src="https://via.placeholder.com/150" alt="프로필 사진">--%>
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
        <p class="last-login">마지막 로그인: ${formattedLastLogin}</p>
    </div>

    <!-- 관리자 기능 -->
    <div class="features-card">
        <h3>관리자 부가 기능</h3>
        <div class="features-grid">
            <div class="feature-item"><span>📢</span>
                <p>공지사항</p></div>
            <a href="${pageContext.request.contextPath}/install/regImage" class="feature-item"><span>📸</span>
                <p>설치사진</p></a>
            <a href="${pageContext.request.contextPath}/install/history" class="feature-item"><span>📜</span>
                <p>설치이력</p></a>
            <div class="feature-item"><span>📞</span>
                <p>문의관리</p></div>
            <div class="feature-item"><span>🏠</span>
                <p>지구방</p></div>
            <div class="feature-item"><span>📊</span>
                <p>DR 통계</p></div>
            <div class="feature-item"><span>⚙️</span>
                <p>DR 관리</p></div>
            <div class="feature-item"><span>🛡️</span>
                <p>거주인증</p></div>
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
\

</html>
