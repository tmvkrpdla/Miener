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


// === 여러 장의 사진 업로드 (튜닝) ===
function uploadMultiplePhotos(files, seqWorker, seqDcu) {
    const totalFiles = files.length;
    let uploadCount = 0;

    // 1. 💥 업로드 시작 시 로딩 모달 표시
    showLoadingModal(totalFiles);

    files.forEach(file => {
        const formData = new FormData();
        formData.append("file", file);

        $.ajax({
            // 💥 주의: 템플릿 리터럴 내에서 URL을 사용할 때는 백틱(`)으로 감싸야 합니다.
            url: `https://egservice.co.kr:18613/api/InsertPhotoListDcu?SeqWorker=${seqWorker}&seqDcu=${seqDcu}`,
            method: "POST",
            processData: false,
            contentType: false,
            data: formData,
            success: function () {
                uploadCount++;

                // 2. 💥 성공 시 진행 상태 업데이트
                updateProgress(uploadCount, totalFiles);

                // 3. 모든 파일 업로드 완료 시
                if (uploadCount === totalFiles) {

                    // 성공 메시지 후 모달 숨김
                    alert("✅ 모든 사진 업로드 성공!");
                    hideLoadingModal();

                    // 파일 목록 초기화 (이전 단계에서 정의한 전역 변수나 함수 사용)
                    // 예: uploadedFiles 배열 초기화 및 input 값 클리어
                    // selectedFiles = []; // 이전 코드에 없으므로 주석 처리
                    // document.getElementById('fileInput').value = ''; // input ID가 'fileInputMultiple' 이므로 수정

                    // (이전 단계에서 정의한) 전역 파일 목록 초기화 필요
                }
            },
            error: function (xhr, status, error) {
                console.error("❌ 업로드 실패:", error);

                // 4. 💥 에러 발생 시 진행 중단 및 모달 숨김
                alert("❌ 사진 업로드 실패! 페이지를 새로고침합니다.");
                hideLoadingModal();

                window.location.reload();
            }
        });
    });
}