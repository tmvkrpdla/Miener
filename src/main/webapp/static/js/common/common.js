// === 로딩 모달 제어 함수 ===
function showLoadingModal(total) {
    $('#loadingModal').css('display', 'flex'); // Flex로 변경하여 중앙 정렬 활성화
    updateProgress(0, total);
}

function hideLoadingModal() {
    $('#loadingModal').css('display', 'none');
}

function updateProgress(current, total) {
    $('.loading-progress').text(`${current} / ${total}`);
}

function formatTimestamp(timestamp) {
    if (!timestamp) return '';

    // Date 객체 생성 (KST 기준으로 처리됨)
    const date = new Date(timestamp);

    // 각 구성 요소 가져오기 (getMonth()는 0부터 시작)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}


/**
 * Date 객체를 YYYY-MM-DD 형식의 문자열로 반환합니다.
 */
function getDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}