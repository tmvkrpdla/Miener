
// === 설치 사진 렌더링 함수 ===
// === 설치 사진 렌더링 함수 (JQuery 통일) ===
function drawImg(list_image) {
    const photoGrid = $('.photo-grid'); // JQuery 셀렉터 사용
    photoGrid.empty(); // JQuery empty() 사용

    if (!list_image || list_image.length === 0) {
        ``
        photoGrid.append('<p>등록된 설치 사진이 없습니다.</p>');
        return;
    }

    list_image.forEach((img) => {
        const item = $('<div>').addClass('photo-item'); // JQuery로 요소 생성

        const htmlContent = `
            <img src="${img.url_thumbnail}" alt="설치사진">
            <div class="photo-overlay">
                <span class="date">${img.time_image_added.substring(0, 16)}</span>
                <span class="worker-name">${img.worker_name}</span>
            </div>
        `;

        item.html(htmlContent);

        // 썸네일 클릭 시 원본 이미지 새 창 열기 (JQuery 이벤트 바인딩)
        item.find('img').on('click', () => {
            window.open(img.url_image, '_blank');
        });

        photoGrid.append(item);
    });
}


$(document).ready(function () {
    // URL 파라미터에서 meterId 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const meterId = urlParams.get("meterId");

    console.log(`[DEBUG] 현재 페이지 meterId: ${meterId}`);


    $.ajax({
        url: '../install/getMeterDetail',
        type: 'GET',
        data: {seqHo: "516782"},
        success: function (response) {

            console.log("response : ", response);

             // updateDcuInfo(response);
             // 설치 사진 그리기
             drawImg(response.LIST_IMAGE);


        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            alert("DCU 정보를 불러오는데 실패했습니다.");
        }

    });


    $('#historyBack').on('click', function () {
        history.back();
    })

    $('#refreshBtn').on('click', function () {
        console.log('[DEBUG] 새로고침 버튼 클릭됨');
        location.reload(); // 페이지 새로고침
    });
});