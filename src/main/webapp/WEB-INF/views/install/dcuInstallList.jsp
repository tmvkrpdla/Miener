<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8"/>
    <title>DCU 설치 사진</title>

    <jsp:include page="../common/common.jsp"/>

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
    <link href="${pageContext.request.contextPath}/static/css/dcuInstallList.css?${resourceVersion}" rel="stylesheet"/>
    <link href="${pageContext.request.contextPath}/static/css/modal.css?${resourceVersion}" rel="stylesheet"/>

    <script>
        const dcuId = "${empty dcuId ? '' : dcuId}";
        const seqDcu = "${empty seqDcu ? '' : seqDcu}";
        const siteName = "${empty siteName ? '' : siteName}";
        const seqSite = "${empty seqSite ? '' : seqSite}";
    </script>

</head>
<body>
<%@ include file="/WEB-INF/views/common/header.jsp" %>

<div class="page-header">
    <span class="back-btn" id="historyBack">
       <i class="fa-solid fa-arrow-left"></i>
    </span>
    <div class="page-title" id="siteName">${siteName}</div>
</div>

<div class="install-container">


    <div class="info-header">
        <span class="title">하드웨어 설치 정보</span>
        <span class="badge dcu">DCU</span>
        <button class="refresh-btn" id="refreshBtn" title="새로고침">
            <i class="fas fa-sync-alt"></i>
        </button>
    </div>

    <ul class="detail-list">

        <li class="detail-item editable" data-editable="true">
            <span class="label">설치 위치</span>
            <input type="text" class="value-input" id="location" value="">
            <span class="arrow">&gt;</span>
        </li>

        <li class="detail-item editable" data-editable="true">
            <span class="label">DCU ID</span>
            <input type="text" class="value-input" id="dcuId" value="">
            <span class="arrow">&gt;</span>
            <input type="hidden" id="ajaxSeqDcu" style="display: none;">
        </li>

        <li class="detail-item editable" data-editable="true">
            <span class="label">연결된 LTE</span>
            <input type="text" class="value-input" id="lteSn" value="">
            <span class="arrow">&gt;</span>
        </li>

        <li class="detail-item editable" data-editable="true">
            <span class="label">SSH2 Port</span>
            <input type="text" id="sshPort" class="value-input" value="">
            <span class="arrow">&gt;</span>
        </li>

        <li class="detail-item editable" data-editable="true">
            <span class="label">FEP Port</span>
            <input type="text" id="fepPort" class="value-input" value="">
            <span class="arrow">&gt;</span>
        </li>

        <li class="detail-item editable" data-editable="true">
            <span class="label">SNMP Port</span>
            <input type="text" id="snmpPort" class="value-input" value="">
            <span class="arrow">&gt;</span>
        </li>

        <li class="detail-item">
            <span class="label">설치 작업자</span>
            <span id="workerName" class="value static worker"></span>
        </li>

        <li class="detail-item">
            <span class="label">설치 작업일시</span>
            <span id="firstLastInstalled" class="value static"></span>
        </li>
    </ul>

    <button id="saveDcuInfoBtn" class="save-button">저장하기</button>


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

        <%--        <button id="uploadAllBtn" class="save-button image-save-button">저장하기</button>--%>
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

        <div class="photo-grid"></div>
    </div>

</div>

<script src="${pageContext.request.contextPath}/static/js/dcuInstallList.js?${resourceVersion}"></script>

</body>
</html>
