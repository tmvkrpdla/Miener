<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8"/>
    <title>계량기 설치 사진</title>

    <jsp:include page="../common/common.jsp"/>

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
    <link href="${pageContext.request.contextPath}/static/css/meterInstallList.css?${resourceVersion}"
          rel="stylesheet"/>
</head>
<body>
<%@ include file="/WEB-INF/views/common/header.jsp" %>

<div class="page-header">
    <span class="back-btn" id="historyBack">←</span>
    <div class="page-title" id="siteName">신길경남</div>
</div>

<div class="install-container">

    <div class="info-header">
        <span class="title">하드웨어 설치 정보</span>
        <span class="badge dcu">계량기</span>
        <button class="refresh-btn" id="refreshBtn" title="새로고침">
            <i class="fas fa-sync-alt"></i>
        </button>
    </div>

    <ul class="detail-list">

        <li class="detail-item">
            <span class="label">설치 위치</span>
            <span class="value static">101동 101호</span>
        </li>

        <li class="detail-item editable" data-editable="true">
            <span class="label">계량기 ID</span>
            <input type="text" class="value-input" value="90190000419">
            <span class="arrow">&gt;</span>
        </li>

        <li class="detail-item editable" data-editable="true">
            <span class="label">MAC Adress</span>
            <input type="text" class="value-input" value="123456789">
            <span class="arrow">&gt;</span>
        </li>

        <li class="detail-item editable" data-editable="true">
            <span class="label">모뎀 여부</span>
            <select class="value-input">
                <option value="모뎀">모뎀</option>
                <option value="모뎀아님">모뎀 아님</option>
            </select>
            <span class="arrow">&gt;</span>
        </li>

        <li class="detail-item">
            <span class="label">연결된 DCU</span>
            <span class="value static">A0007AF0001</span>
        </li>

        <li class="detail-item">
            <span class="label">설치 작업자</span>
            <span class="value static">김화경 (에너넷)</span>
        </li>

        <li class="detail-item">
            <span class="label">설치 작업일시</span>
            <span class="value static">2025-11-07 14:00</span>
        </li>
    </ul>

    <button class="save-button">저장하기</button>

    <div class="reg-image-container">
        <h3>사진 등록</h3>

        <div class="reg-grid">

            <div class="reg-item" onclick="document.getElementById('fileInput1').click();">
                <div class="camera-icon">
                    <span class="icon">📸</span>
                    <span class="plus">+</span>
                </div>
                <input type="file" id="fileInput1" style="display: none;" accept="image/*"
                       onchange="previewImage(this, 'regItem1');">
            </div>

            <div class="reg-item" onclick="document.getElementById('fileInput2').click();">
                <div class="camera-icon">
                    <span class="icon">📸</span>
                    <span class="plus">+</span>
                </div>
                <input type="file" id="fileInput2" style="display: none;" accept="image/*"
                       onchange="previewImage(this, 'regItem2');">
            </div>
        </div>

        <button class="save-button image-save-button">저장하기</button>
    </div>


    <div class="image-list-container">
        <h3>하드웨어 설치 사진</h3>

        <div class="photo-grid">
            <div class="photo-item">
                <img src="https://via.placeholder.com/180x180/007bff/ffffff?text=Image+1" alt="설치사진 1">
                <div class="photo-overlay">
                    <span class="date">2025-06-17 16:30</span>
                    <span class="worker-name">김화경</span>
                </div>
            </div>
            <div class="photo-item">
                <img src="https://via.placeholder.com/180x180/28a745/ffffff?text=Image+2" alt="설치사진 2">
                <div class="photo-overlay">
                    <span class="date">2024-08-15 09:59</span>
                    <span class="worker-name">고명우</span>
                </div>
            </div>
            <div class="photo-item">
                <img src="https://via.placeholder.com/180x180/ffc107/333333?text=Image+3" alt="설치사진 3">
                <div class="photo-overlay">
                    <span class="date">2023-02-09 15:22</span>
                    <span class="worker-name">이호성</span>
                </div>
            </div>
            <div class="photo-item">
                <img src="https://via.placeholder.com/180x180/dc3545/ffffff?text=Image+4" alt="설치사진 4">
                <div class="photo-overlay">
                    <span class="date">2023-02-09 15:22</span>
                    <span class="worker-name">이호성</span>
                </div>
            </div>
        </div>
    </div>

</div>


<script src="${pageContext.request.contextPath}/static/js/meterInstallList.js?${resourceVersion}"></script>

</body>
</html>
