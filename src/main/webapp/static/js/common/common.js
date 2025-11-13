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

