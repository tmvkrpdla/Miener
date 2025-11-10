// 선택된 파일들을 저장할 전역 배열. (파일명과 File 객체를 매칭)
const uploadedFiles = [];
let fileCounter = 0; // 각 파일에 고유 ID를 부여하기 위한 카운터


/**
 * 💥 튜닝된 파일 선택 처리 함수 (다중 선택 지원)
 * fileInputMultiple의 onchange 이벤트에서 호출됩니다.
 */
function handleMultipleFiles(input) {
    if (!input.files || input.files.length === 0) {
        return;
    }

    // 선택된 모든 파일을 순회하며 처리
    for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const fileId = 'file_' + fileCounter++; // 고유 ID 생성

        // 1. 전역 배열에 파일 저장
        uploadedFiles.push({
            id: fileId,
            file: file
        });

        // 2. 미리보기 생성
        createPreview(file, fileId);
    }

    // input 값 초기화 (같은 파일을 다시 선택해도 change 이벤트가 발생하도록)
    input.value = '';
}


/**
 * 파일 하나에 대한 미리보기 HTML을 동적으로 생성합니다.
 */
function createPreview(file, fileId) {
    const reader = new FileReader();
    const previewContainer = $('#previewContainer');

    reader.onload = function (e) {

        // 1. 미리보기 썸네일 HTML 생성
        const previewHtml = `
            <div class="photo-preview-item" id="${fileId}">
                <img src="${e.target.result}" alt="미리보기">
                <span class="delete-btn" data-file-id="${fileId}">&times;</span>
            </div>
        `;

        // 2. 생성된 HTML을 '추가 버튼' 앞에 삽입
        // (미리보기는 추가 버튼 왼쪽에 나열)
        previewContainer.find('.add-button').before(previewHtml);
    };

    reader.readAsDataURL(file);
}


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
            <img src="${img.url_dcu_thumb}" alt="설치사진">
            <div class="photo-overlay">
                <span class="date">${img.time_image_added.substring(0, 16)}</span>
                <span class="worker-name">${img.worker_name}</span>
            </div>
        `;

        item.html(htmlContent);

        // 썸네일 클릭 시 원본 이미지 새 창 열기 (JQuery 이벤트 바인딩)
        item.find('img').on('click', () => {
            window.open(img.url_dcu_image, '_blank');
        });

        photoGrid.append(item);
    });
}


/**
 * 💥 모든 사진을 순차적으로 업로드하는 함수
 * @param {Array<Object>} fileList - 업로드할 {id, file} 객체 배열
 * @param {string} seqWorker - 작업자 ID
 * @param {string} seqDcu - DCU 시퀀스 ID
 */
function uploadAllPhotos(fileList, seqWorker, seqDcu) {


    // 이전에 정의된 전역 변수와 함수를 사용합니다:
    // const uploadedFiles; // 전역 파일 배열
    // function showLoadingModal(total) { ... }
    // function hideLoadingModal() { ... }
    // function updateProgress(current, total) { ... }
    // function uploadSinglePhoto(file, seqWorker) { ... } // Promise 반환


    // 💥 추가: DCU ID의 유효성을 함수 시작 단계에서 검증 (안정성 강화)
    if (!seqDcu) {
        alert("DCU ID가 유효하지 않아 업로드를 시작할 수 없습니다.");
        return;
    }


    // 순차적 업로드를 위한 Promise 체인 또는 async/await 사용 (가독성을 위해 간단한 for문 사용)
    let successfulUploads = 0;
    const totalFiles = fileList.length;
    let uploadedCount = 0; // 성공/실패와 관계없이 처리된 파일 수


    // files 배열을 복사하여 사용 (업로드 중 배열이 변경되는 것을 방지)
    const filesToUpload = [...fileList];

    // 1. 💥 업로드 시작 시 로딩 모달 표시
    showLoadingModal(totalFiles);

    // 모든 파일에 대한 Promise 배열 생성
    const uploadPromises = filesToUpload.map((item) => {

        // uploadSinglePhoto가 Promise를 반환하므로 .then, .catch 사용 가능
        return uploadSinglePhoto(item.file, seqWorker, seqDcu)
            .then(() => {
                // 개별 업로드 성공 시
                successfulUploads++;
                // 성공한 항목은 미리보기에서 제거 (선택 사항)
                $(`#${item.id}`).remove();
                return 'success';
            })
            .catch((error) => {
                // 개별 업로드 실패 시
                console.error(`❌ 파일 업로드 실패 (${item.file.name}):`, error);
                return 'fail';
            })
            .finally(() => {
                // 2. 💥 성공/실패 여부와 관계없이 처리된 파일 수 증가 및 모달 업데이트
                uploadedCount++;
                updateProgress(uploadedCount, totalFiles);
            });
    });

    // 3. 💥 Promise.allSettled를 사용하여 모든 요청이 완료될 때까지 기다림
    // Promise.allSettled는 요청 중 하나가 실패해도 나머지 결과를 기다립니다.
    Promise.allSettled(uploadPromises)
        .then(results => {
            // 모든 파일 처리가 끝난 후 실행

            // 최종 알림
            // alert(`📸 업로드 완료! (성공: ${successfulUploads}건 / 전체: ${totalFiles}건)`);

            // 4. 💥 로딩 모달 숨김
            hideLoadingModal();

            // 전역 파일 배열 초기화 및 화면 업데이트 (이전 단계에서 정의한 전역 배열)
            uploadedFiles.splice(0, uploadedFiles.length);
        })
        .catch(error => {
            // 이 catch 블록은 Promise.allSettled 자체의 에러(거의 발생 안 함)를 잡습니다.
            console.error("최종 처리 중 예상치 못한 오류 발생:", error);
            hideLoadingModal();
        });
}


// === 설치 dcu 사진 등록 함수 (Promise 반환하도록 튜닝) ===
function uploadSinglePhoto(file, seqWorker, seqDcu) {
    return new Promise((resolve, reject) => {

        if (!seqWorker || !seqDcu) {
            return reject("작업자 또는 DCU 정보 누락");
        }

        const formData = new FormData();
        formData.append("file", file); // 파일 하나만 append

        $.ajax({
            url: `https://egservice.co.kr:18613/api/InsertPhotoListDcu?SeqWorker=${seqWorker}&seqDcu=${seqDcu}`,
            method: "POST",
            processData: false,
            contentType: false,
            data: formData,
            success: function (response) {
                // API 응답이 성공(200 OK)이더라도 내부 로직 실패 가능성 확인 (선택 사항)
                // if (response.result_code !== 'SUCCESS') {
                //     return reject(response.message || "API 내부 처리 오류");
                // }
                resolve(response);
            },
            error: function (xhr, status, error) {
                // 💥 수정: 에러 객체 대신 명확한 에러 메시지를 Reject 인자로 전달합니다.
                reject(`AJAX 실패: ${status} (${error})`);
            }
        });
    });
}

// === 설치 dcu 정보 렌더링 함수 ===
function updateDcuInfo(data) {
    console.log("data : ", data);

    let dcuId = data.dcu_info.dcu_id;
    let mdmsId = data.dcu_info.mdms_id;
    let seqDcu = data.dcu_info.seq_dcu;

    $('#ajaxSeqDcu').val(seqDcu);
    $('#dcuId').val(dcuId);
    $('#lteSn').text(data.dcu_info.LteSn);
    $('#sshPort').val(data.dcu_info.nPortSsh2);

    $('#ajaxMdmsId').text(mdmsId);
    $('#ajaxDcuIp').text(data.dcu_info.ip_dcu);
    $('#fepPort').val(data.dcu_info.port_fep);
    $('#snmpPort').val(data.dcu_info.port_snmp);
    $('#workerName').text(`${data.dcu_info.worker_name} (${data.dcu_info.company_name})`);
    $('#firstLastInstalled').text(data.dcu_info.time_dcu_installed);

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

    $.ajax({
        url: '../install/getDcuInfo',
        type: 'GET',
        data: {seqDcu: "10264"},
        success: function (response) {

            console.log("response : ", response);

            updateDcuInfo(response);
            // 설치 사진 그리기
            drawImg(response.list_image);


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

// 동적으로 생성된 삭제 버튼 클릭 이벤트
$(document).on('click', '.delete-btn', function () {
    const fileIdToDelete = $(this).data('file-id');

    // 1. 전역 배열에서 해당 파일 제거
    const initialLength = uploadedFiles.length;
    for (let i = 0; i < uploadedFiles.length; i++) {
        if (uploadedFiles[i].id === fileIdToDelete) {
            uploadedFiles.splice(i, 1);
            break;
        }
    }

    // 2. 화면에서 미리보기 요소 제거
    $(`#${fileIdToDelete}`).remove();

    console.log(`파일 ${fileIdToDelete} 제거됨. 남은 파일 수: ${uploadedFiles.length}`);
});


// 💥 튜닝된 저장 버튼 클릭 이벤트
$('#uploadAllBtn').on('click', function () {
    const selectedWorker = '29'; // 실제로는 DOM에서 선택된 작업자 ID를 가져와야 함
    const seqDcu = $("#ajaxSeqDcu").val(); // DCU ID를 DOM에서 가져옴

    if (!selectedWorker) {
        alert("작업자를 선택해주세요.");
        return;
    }

    if (uploadedFiles.length === 0) {
        alert("등록할 사진을 선택해주세요.");
        return;
    }

    // 모든 파일을 순차적으로 업로드하는 함수 호출
    uploadAllPhotos(uploadedFiles, selectedWorker, seqDcu);
});