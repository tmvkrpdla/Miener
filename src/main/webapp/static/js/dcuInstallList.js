function previewImage(input, regItemId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        const regItem = input.closest('.reg-item'); // 가장 가까운 .reg-item 부모 찾기

        reader.onload = function (e) {
            // 1. 기존 카메라 아이콘 제거
            const cameraIcon = regItem.querySelector('.camera-icon');
            if (cameraIcon) {
                cameraIcon.style.display = 'none';
            }

            // 2. 새로운 이미지 요소 생성 또는 업데이트
            let imgPreview = regItem.querySelector('.image-preview');
            if (!imgPreview) {
                imgPreview = document.createElement('img');
                imgPreview.className = 'image-preview';
                // 이미지 크기 조정을 위해 CSS 클래스 추가
                regItem.appendChild(imgPreview);
            }
            imgPreview.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
}


$(document).ready(function () {
    // URL 파라미터에서 dcuId 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const dcuId = urlParams.get("dcuId");

    console.log(`[DEBUG] 현재 페이지 dcuId: ${dcuId}`);

    // ⚡ 샘플 데이터 (나중에 실제 API로 대체)
    const sampleDetailData = {
        "A0007F0001": {name: "1동 주차장 DCU", status: "정상", lastCheck: "2025-11-06 10:00"},
        "A0007F0002": {name: "2동 지하주차장 DCU", status: "통신 불량", lastCheck: "2025-11-06 09:50"},
        "A0007F0003": {name: "3동 옥상 DCU", status: "정상", lastCheck: "2025-11-06 09:45"}
    };

    // AJAX 대신 샘플 데이터로 표시
    const detail = sampleDetailData[dcuId];
    if (detail) {
        $('#dcuName').text(detail.name);
        $('#dcuStatus').text(detail.status);
        $('#lastCheck').text(detail.lastCheck);
    } else {
        alert("해당 DCU 정보를 찾을 수 없습니다.");
    }

    // ✅ 실제 API 사용 시
    /*
    $.ajax({
        url: contextPath + '/install/api/getDcuDetail',
        type: 'GET',
        data: { dcuId },
        success: function(data) {
            $('#dcuName').text(data.name);
            $('#dcuStatus').text(data.status);
            $('#lastCheck').text(data.lastCheck);
        },
        error: function() {
            alert("DCU 정보를 불러오는 중 오류가 발생했습니다.");
        }
    });
    */


    $('#historyBack').on('click', function () {
        history.back();
    })

    $('#refreshBtn').on('click', function () {
        console.log('[DEBUG] 새로고침 버튼 클릭됨');
        location.reload(); // 페이지 새로고침
    });
});