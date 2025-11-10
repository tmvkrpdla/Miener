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
    <link href="${pageContext.request.contextPath}/static/css/modal.css?${resourceVersion}" rel="stylesheet"/>

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
            <span class="value static" id="targetName"></span>
        </li>

        <li class="detail-item editable" data-editable="true">
            <span class="label">계량기 ID</span>
            <input type="text" class="value-input" id="mid" value="">
            <span class="arrow">&gt;</span>
        </li>

        <li class="detail-item editable" data-editable="true">
            <span class="label">MAC Address</span>
            <input type="text" class="value-input" id="macAddress" value="">
            <span class="arrow">&gt;</span>
        </li>

        <li class="detail-item editable" data-editable="true">
            <span class="label">모뎀 여부</span>
            <select id="bModem" class="value-input">
                <option value="모뎀">모뎀</option>
                <option value="모뎀아님">모뎀 아님</option>
            </select>
            <span class="arrow">&gt;</span>
        </li>

        <li class="detail-item editable" data-editable="true">
            <span class="label">시작 지침</span>
            <input type="text" class="value-input" id="startValue" value="">
            <span class="arrow">&gt;</span>
        </li>

        <li class="detail-item">
            <span class="label">연결된 DCU</span>
            <span id="linkedDcuId" class="value static"></span>
        </li>

        <li class="detail-item">
            <span class="label">설치 작업자</span>
            <span id="workerName" class="value static"></span>
        </li>

        <li class="detail-item">
            <span class="label">설치 작업일시</span>
            <span id="firstLastInstalled" class="value static"></span>
        </li>
    </ul>

    <button class="save-button">저장하기</button>

    <div class="reg-image-container">
        <h3>사진 등록</h3>

        <div class="reg-grid-container">
            <div id="previewContainer" class="photo-preview-list">

                <div class="reg-item add-button" onclick="document.getElementById('fileInputMultiple').click();">
                    <div class="camera-icon">
                        <span class="icon">📸</span>
                        <span class="plus">+</span>
                    </div>
                </div>

            </div>

            <input type="file" id="fileInputMultiple" style="display: none;"
                   accept="image/*" multiple
                   onchange="handleMultipleFiles(this);">
        </div>

        <button id="uploadAllBtn" class="save-button image-save-button">저장하기</button>
    </div>


    <div id="loadingModal" class="loading-modal-overlay">
        <div class="loading-modal-content">
            <div class="loading-spinner"></div>
            <p class="loading-text">사진을 업로드 중입니다...</p>
            <p class="loading-progress">0 / 0</p>
        </div>
    </div>


    <div class="image-list-container">
        <h3>하드웨어 설치 사진</h3>

        <div class="photo-grid">
        </div>
    </div>


</div>


<script src="${pageContext.request.contextPath}/static/js/meterInstallList.js?${resourceVersion}"></script>

</body>
</html>
