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
    for (const element of input.files) {
        const file = element;
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
 * 💥 모든 사진을 병렬로 업로드하는 함수
 * @param {Array<Object>} fileList - 업로드할 {id, file} 객체 배열
 * @param {string} seqWorker - 작업자 ID
 * @param {string} seqDcu - DCU 시퀀스 ID
 * @returns {Promise<Object>} 성공/실패 건수를 포함하는 결과를 resolve
 */
function uploadAllPhotos(fileList, seqWorker, seqDcu) {

    // DCU ID의 유효성 검증
    if (!seqDcu) {
        alert("DCU ID가 유효하지 않아 업로드를 시작할 수 없습니다.");
        // Promise를 반환하여 호출자에게 오류를 전달
        return Promise.reject(new Error("DCU ID가 유효하지 않습니다."));
    }

    const filesToUpload = [...fileList];
    const totalFiles = filesToUpload.length;

    // 1. 업로드 시작 시 로딩 모달 표시
    showLoadingModal(totalFiles);

    let uploadedCount = 0; // 진행률 카운터 (클로저 내부에서 관리)

    const uploadPromises = filesToUpload.map((item) => {
        return uploadSinglePhoto(item.file, seqWorker, seqDcu)
            .then(() => {
                // 성공한 항목은 미리보기에서 제거 (선택 사항)
                $(`#${item.id}`).remove();
                return {status: 'fulfilled', name: item.file.name};
            })
            .catch((error) => {
                console.error(`❌ 파일 업로드 실패 (${item.file.name}):`, error);
                return {status: 'rejected', name: item.file.name, reason: error};
            })
            .finally(() => {
                // 2. 성공/실패 여부와 관계없이 처리된 파일 수 증가 및 모달 업데이트
                uploadedCount++;
                updateProgress(uploadedCount, totalFiles);
            });
    });


    // Promise.allSettled를 사용하여 모든 요청이 완료될 때까지 기다림
    // map에서 .catch로 에러를 잡았기 때문에, 여기서 받는 results는 모두 status: 'fulfilled' 입니다.
    return Promise.allSettled(uploadPromises)
        .then(results => {
            // 모든 파일 처리가 끝난 후 실행
            const successfulUploads = results.filter(r => r.value && r.value.status === 'fulfilled').length;
            const failedUploads = results.filter(r => r.value && r.value.status === 'rejected').length;

            // 4. 로딩 모달 숨김
            hideLoadingModal();

            // 최종 알림
            if (failedUploads === 0) {
                alert(`✅ 모든 사진(${successfulUploads}건) 업로드를 완료했습니다.`);
            } else {
                alert(`⚠️ 업로드 완료! (성공: ${successfulUploads}건 / 실패: ${failedUploads}건)`);
            }

            // 호출자에게 결과 객체를 반환
            return {total: totalFiles, success: successfulUploads, fail: failedUploads};
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
function renderingDcuInfo(data) {
    console.log("data : ", data);

    let location = data.dcu_info.dcu_location
    let dcuId = data.dcu_info.dcu_id;
    let mdmsId = data.dcu_info.mdms_id;
    let seqDcu = data.dcu_info.seq_dcu;
    let lteSn = data.dcu_info.LteSn;
    let sshPort = data.dcu_info.nPortSsh2;
    let fepPort = data.dcu_info.port_fep;
    let snmpPort = data.dcu_info.port_snmp;

    // hidden input
    $('#ajaxSeqDcu').val(seqDcu);

    // input value 설정 + 기존값(data-old) 설정
    $('#location').val(location).data('old', location);
    $('#dcuId').val(dcuId).data('old', dcuId);
    $('#lteSn').val(lteSn).data('old', lteSn);
    $('#sshPort').val(sshPort).data('old', sshPort);
    $('#fepPort').val(fepPort).data('old', fepPort);
    $('#snmpPort').val(snmpPort).data('old', snmpPort);

    // 기타 static 정보
    $('#ajaxMdmsId').text(mdmsId);
    $('#ajaxDcuIp').text(data.dcu_info.ip_dcu);
    $('#workerName').text(`${data.dcu_info.worker_name} (${data.dcu_info.company_name})`);
    $('#firstLastInstalled').text(data.dcu_info.time_dcu_installed);

}

// ===========================================
// Promise 기반으로 DCU 정보 업데이트 함수 수정
// ===========================================
function updateDcuInfo() {
    // Promise를 반환하도록 수정
    return new Promise((resolve, reject) => {
        const dcuData = {
            seqDcu: $('#ajaxSeqDcu').val(),
            dcuId: $('#dcuId').val(),
            lteSn: $('#lteSn').val(),
            sshPort: $('#sshPort').val(),
            fepPort: $('#fepPort').val(),
            snmpPort: $('#snmpPort').val(),
            location: $('#location').val()
        };

        $.ajax({
            url: '../install/api/dcu/update',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(dcuData),
            success: function (res) {
                if (res.success) {
                    // alert('DCU 정보가 업데이트되었습니다.');
                    console.log("DCU 정보 업데이트 성공");
                    resolve(res); // 성공 시 Promise resolve
                } else {
                    alert('업데이트 실패: ' + res.message);
                    reject(new Error(res.message)); // 실패 시 Promise reject
                }
            },
            error: function (err) {
                console.error('서버 오류 발생:', err);
                alert('서버 오류 발생');
                reject(err); // 오류 발생 시 Promise reject
            }
        });
    });
}

function isDcuChanged() {
    // 현재 입력 값 (항상 문자열)
    const location = $('#location').val();
    const dcuId = $('#dcuId').val();
    const lteSn = $('#lteSn').val();
    const sshPort = $('#sshPort').val();
    const fepPort = $('#fepPort').val();
    const snmpPort = $('#snmpPort').val();

    // 초기값 (숫자일 수 있음)
    // .data()로 가져온 값에 .toString()을 적용하여 문자열로 강제 변환
    const oldDcuLocation = String($('#location').data('old') || '');
    const oldDcuId = String($('#dcuId').data('old') || '');
    const oldLteSn = String($('#lteSn').data('old') || '');
    const oldSshPort = String($('#sshPort').data('old') || '');
    const oldFepPort = String($('#fepPort').data('old') || '');
    const oldSnmpPort = String($('#snmpPort').data('old') || '');

    // 추가: 양쪽 모두 trim()을 적용하여 혹시 모를 앞뒤 공백을 제거
    const currentDcuLocation = location.trim();
    const currentDcuId = dcuId.trim();
    const currentLteSn = lteSn.trim();
    const currentSshPort = sshPort.trim();
    const currentFepPort = fepPort.trim();
    const currentSnmpPort = snmpPort.trim();

    return (
        currentDcuLocation !== oldDcuLocation ||
        currentDcuId !== oldDcuId ||
        currentLteSn !== oldLteSn ||
        currentSshPort !== oldSshPort ||
        currentFepPort !== oldFepPort ||
        currentSnmpPort !== oldSnmpPort
    );
}


/**
 * DCU 설치 이력을 서버에 추가합니다.
 * @param {string} workerId - 설치 작업자 ID
 * @param {string} seqDcu - 설치된 DCU ID (seqDcu)
 * @returns {Promise<void>} - 성공/실패와 관계없이 resolve되어 메인 로직이 계속 진행되도록 합니다.
 */
function addDcuInstallHistory(workerId, seqDcu, seqSite) {
    const historyData = {
        seqWorker: workerId,
        seqDcu: seqDcu,
        seqSite: seqSite
    };

    return new Promise((resolve) => {
        $.ajax({
            url: '../install/api/dcu/history/add',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(historyData),
            success: function (res) {
                if (res.success) {
                    console.log('DCU 설치 이력이 성공적으로 추가되었습니다.');
                } else {
                    console.error('DCU 설치 이력 추가 실패:', res.message);
                }
                resolve();
            },
            error: function (err) {
                console.error('DCU 설치 이력 추가 중 서버 오류 발생:', err);
                resolve();
            }
        });
    });
}

$(document).ready(function () {
    // URL 파라미터에서 dcuId 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const dcuId = urlParams.get("dcuId");

    console.log(`[DEBUG] 현재 페이지 dcuId: ${dcuId}`);

    $.ajax({
        url: '../install/getDcuInfo',
        type: 'GET',
        data: {seqDcu: seqDcu},
        success: function (response) {
            console.log("response : ", response);
            renderingDcuInfo(response);
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
        location.reload(); // 페이지 새로고침
    });

    // ===========================================
    // 클릭 이벤트 핸들러 수정 (async/await 적용)
    // ===========================================
    $('#saveDcuInfoBtn').on('click', async function () {
        const $this = $(this);
        const selectedWorker = '29'; // 실제로는 DOM에서 선택된 작업자 ID를 가져와야 함
        const seqDcu = $("#ajaxSeqDcu").val(); // DCU ID를 DOM에서 가져옴

        // ✅ 1-A. DCU 위치 값으로 최초 설치 여부 판단
        const oldLocation = $('#location').data('old') || '';

        const isFirstInstall = (oldLocation === ''); // location 값이 비어 있으면 최초 설치로 간주

        let shouldGoBack = true;

        // 1. 유효성 검사
        if (!selectedWorker) {
            alert("작업자를 선택해주세요.");
            return;
        }

        /*   // `uploadedFiles`가 전역 변수라고 가정
           if (typeof uploadedFiles === 'undefined' || uploadedFiles.length === 0) {
               console.log("등록할 사진 없음.");
               return;
           }*/

        // 2. 버튼 비활성화 (중복 클릭 방지)
        $this.prop('disabled', true);

        try {

            // 3. DCU 정보 업데이트 (변경 사항 체크)
            if (isDcuChanged()) {
                await updateDcuInfo();
            } else {
                console.log('DCU 정보에 변경 사항 없음, 업데이트 생략');
            }

            // 3-1. ✅ DCU 최초 설치 이력 추가
            if (isFirstInstall) {
                console.log("DCU 위치 값이 없어 최초 설치 이력을 추가합니다.");
                // seqDcu가 유효한 값이어야 이력을 남길 수 있음
                if (seqDcu) {
                    await addDcuInstallHistory(selectedWorker, seqDcu, seqSite);
                } else {
                    console.warn("seqDcu가 없어 DCU 설치 이력을 건너뜁니다.");
                    // 이력 추가 실패하더라도 메인 로직은 계속 진행
                }
            } else {
                console.log("DCU 위치 값이 존재하여 설치 이력을 추가하지 않습니다.");
            }

            // 4. 사진 업로드 유효성 검사
            const hasFiles = (typeof uploadedFiles !== 'undefined' && uploadedFiles.length > 0);

            if (hasFiles) {
                // 4-1. 모든 파일을 업로드 (완료될 때까지 await)
                const uploadResult = await uploadAllPhotos(uploadedFiles, selectedWorker, seqDcu);

                // 5. 업로드가 성공적으로 완료된 후, 전역 파일 목록 초기화 및 화면 업데이트
                if (uploadResult && uploadResult.success > 0) {
                    uploadedFiles.splice(0, uploadedFiles.length);
                    // ex: $('#previewContainer').empty();
                }

                // 업로드 실패 시
                if (uploadResult.fail > 0) {
                    shouldGoBack = false;
                }
            } else {
                console.log("등록할 사진 없음. DCU 정보 업데이트만 성공했으므로 이동합니다.");
                // 사진이 없더라도 업데이트가 성공했으므로 페이지 이동 (아래 finally에서 처리)
            }

        } catch (error) {
            // DCU 정보 업데이트 실패, uploadAllPhotos 내 seqDcu 오류 등
            console.error("최종 처리 실패:", error);
            shouldGoBack = false; // 오류 발생 시 페이지 이동 금지
        } finally {
            // 6. 버튼 재활성화
            $this.prop('disabled', false);

            // 7. 성공 여부에 따라 페이지 이동
            if (shouldGoBack) {
                // window.history.back();
            }
        }
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


