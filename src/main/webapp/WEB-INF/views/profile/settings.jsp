<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>지구방</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f2f5;
        }

        .mobile-frame {
            width: 375px;
            margin: 20px auto;
            border: 1px solid #ddd;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #007bff;
            color: white;
            padding: 10px;
        }

        .header-nav {
            display: flex;
            gap: 10px;
        }

        .header-logo {
            font-size: 20px;
            font-weight: bold;
        }

        .profile-section {
            padding: 20px;
            background-color: white;
            border-bottom: 1px solid #eee;
        }

        .profile-header {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .profile-pic {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid #ccc;
        }

        .profile-pic img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .profile-name {
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
            text-align: center;
        }

        .profile-id {
            font-size: 14px;
            color: #666;
            text-align: center;
        }

        .profile-details {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
        }

        .detail-item {
            text-align: center;
        }

        .detail-item p {
            margin: 0;
            font-size: 14px;
        }

        .detail-item small {
            color: #999;
        }

        .last-login {
            font-size: 12px;
            color: #999;
            text-align: center;
            margin-top: 10px;
        }

        .admin-features {
            padding: 20px;
            background-color: white;
            margin-top: 10px;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            text-align: center;
        }

        .feature-item {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 15px 5px;
            border: 1px solid #ddd;
        }

        .feature-item img {
            width: 40px;
            height: 40px;
        }

        .feature-item p {
            margin-top: 5px;
            font-size: 12px;
        }


    </style>
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
                <small>클릭 가능</small>
            </div>
            <div class="feature-item">
                <a href="${pageContext.request.contextPath}/install/regImage" class="feature-item">
                    <span>📸</span>
                    <p>설치사진</p>
                    <small>클릭 가능</small>
                </a>
            </div>
            <div class="feature-item">
                <a href="${pageContext.request.contextPath}/install/history" class="feature-item">
                    <span>📜</span>
                    <p>설치이력</p>
                    <small>클릭 가능</small>
                </a>
            </div>
            <div class="feature-item">
                <span>📞</span>
                <p>문의관리</p>
                <small>클릭 가능</small>
            </div>
            <div class="feature-item">
                <span>🏠</span>
                <p>지구방</p>
                <small>클릭 가능</small>
            </div>
            <div class="feature-item">
                <span>📊</span>
                <p>DR 통계</p>
                <small>클릭 가능</small>
            </div>
            <div class="feature-item">
                <span>⚙️</span>
                <p>DR 관리</p>
                <small>클릭 가능</small>
            </div>
            <div class="feature-item">
                <span>🛡️</span>
                <p>거주인증</p>
                <small>클릭 가능</small>
            </div>
        </div>
    </div>
</div>

</body>
</html>
