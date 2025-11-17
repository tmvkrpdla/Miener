// 선택된 파일들을 저장할 전역 배열. (파일명과 File 객체를 매칭)
const uploadedFiles = [];
let fileCounter = 0; // 각 파일에 고유 ID를 부여하기 위한 카운터


/**
 * 💥 모든 사진을 순차적으로 업로드하는 함수
 * @param {Array<Object>} fileList - 업로드할 {id, file} 객체 배열
 * @param {string} seqWorker - 작업자 ID
 * @param {string} seqHo - DCU 시퀀스 ID
 */
function uploadAllPhotos(fileList, seqWorker, seqHo) {


    // 1. seqHo 유효성 검사
    if (!seqHo) {
        alert("호 정보가 유효하지 않아 업로드를 시작할 수 없습니다.");
        return Promise.reject(new Error("SeqHo is missing."));
    }
    // 순차적 업로드를 위한 Promise 체인 또는 async/await 사용
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
        return uploadSinglePhoto(item.file, seqWorker, seqHo)
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
    return Promise.allSettled(uploadPromises)
        .then(results => {


            const successfulUploads = results.filter(r => r.value === 'success').length;
            const failedUploads = results.filter(r => r.value === 'fail').length;

            // 4. 로딩 모달 숨김
            hideLoadingModal();

            // 최종 알림 (클릭 핸들러에서 이동 여부를 판단하므로 여기서 alert는 생략하는 것이 더 깔끔할 수 있음)
            if (failedUploads === 0) {
                alert(`✅ 모든 사진(${successfulUploads}건) 업로드를 완료했습니다.`);
            } else {
                alert(`⚠️ 업로드 완료! (성공: ${successfulUploads}건 / 실패: ${failedUploads}건)`);
            }

            return {total: totalFiles, success: successfulUploads, fail: failedUploads};

        })
        .catch(error => {
            // 이 catch 블록은 Promise.allSettled 자체의 에러(거의 발생 안 함)를 잡습니다.
            console.error("최종 처리 중 예상치 못한 오류 발생:", error);
            hideLoadingModal();
        });
}


// === 설치 dcu 사진 등록 함수 (Promise 반환하도록 튜닝) ===
function uploadSinglePhoto(file, seqWorker, seqHo) {
    return new Promise((resolve, reject) => {

        if (!seqWorker || !seqHo) {
            return reject("작업자 또는 호 정보 누락");
        }

        const formData = new FormData();
        formData.append("file", file); // 파일 하나만 append

        $.ajax({
            url: `https://egservice.co.kr:18613/api/InsertPhotoListMeter?SeqWorker=${seqWorker}&SeqHo=${seqHo}`,
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


// === 하드웨어 설치 정보 렌더링 ===
function renderingHoInfo(data) {

    // 초단위 자름 (사용자 표시용)
    const formattedTime = data.time_meter_installed ? data.time_meter_installed.substring(0, 16) : '';

    // 1. 단순 표시 정보 (old 값 저장 불필요)
    $('#targetName').text(`${data.dong_name}동 ${data.ho_name}호`);
    $('#linkedDcuId').text(data.linkedDcuId);
    $('#workerName').text(`${data.worker_name} (${data.worker_id})`);
    $('#firstLastInstalled').text(data.time_meter_installed);

    // 기타 단순 표시 정보 (중복되는 항목은 제거하거나 하나만 남겨야 합니다.)
    // 일반적으로 아래 항목들은 입력 필드가 아닌 텍스트로 표시될 가능성이 높습니다.
    $('#meter_value_start').text(data.meter_value_start);
    $('#time_meter_installed').text(formattedTime);
    $('#worker_name').text(data.worker_name);
    $('#mid_old').text(data.mid_old);
    $('#meter_value_last').text(data.meter_value_last);


    // mid (미터 ID)
    $('#mid').val(data.mid).data('old', data.mid);

    // startValue (시작 검침값)
    $('#startValue').val(data.meter_value_start).data('old', data.meter_value_start);

    // macAddress (MAC 주소)
    $('#macAddress').val(data.meterMacAdderess).data('old', data.meterMacAdderess);

    // bound_to_modem (모뎀 연결 여부)
    const bModemText = data.bound_to_modem ? '모뎀' : '모뎀아님';
    $('#bModem').val(bModemText).data('old', bModemText);
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


/**
 * 현재 UI의 하드웨어 정보가 초기값(data-old)과 변경되었는지 확인합니다.
 * @returns {boolean} 변경되었으면 true, 아니면 false
 */
function isHoChanged() {
    // 1. 현재 값 가져오기
    const currentMid = $('#mid').val();
    const currentStartValue = $('#startValue').val(); // 문자열로 가져와서 비교
    const currentMacAddress = $('#macAddress').val();
    const currentBoundToModemText = $('#bModem').val();

    // 2. 초기값 가져오기 (renderingHoInfo에서 설정된 값)
    const oldMid = $('#mid').data('old') || '';
    const oldStartValue = $('#startValue').data('old') || '';
    const oldMacAddress = $('#macAddress').data('old') || '';
    const oldBoundToModemText = $('#bModem').data('old') || '';


    /**
     * 값을 문자열로 변환하고 트림하며, 특히 '0'과 빈 값을 동일하게 처리합니다.
     * @param {*} val - 비교할 값 (현재 값 또는 old 값)
     * @returns {string} 비교를 위한 표준화된 문자열
     */
    const formatValue = (val) => {
        // null, undefined를 빈 문자열로 처리
        let strVal = String(val ?? '').trim();

        // 🚨 핵심 수정: 만약 값이 '0'이거나 비어있다면, 둘 다 'EMPTY_OR_ZERO'로 통일하여 비교합니다.
        // 이는 시작 검침값이 0이거나 미입력 상태일 때를 동일하게 보기 위함입니다.
        if (strVal === '0' || strVal === '') {
            return 'EMPTY_OR_ZERO';
        }
        return strVal;
    };

    const startValueChanged = formatValue(currentStartValue) !== formatValue(oldStartValue);

    // 3. 비교를 위해 문자열로 변환 및 트림 (공백/타입 불일치 방지)
    const midChanged = String(currentMid).trim() !== String(oldMid).trim();
    const macAddressChanged = String(currentMacAddress).trim() !== String(oldMacAddress).trim();
    const bModemChanged = String(currentBoundToModemText).trim() !== String(oldBoundToModemText).trim();

    // 변경된 항목이 하나라도 있으면 true 반환
    const changed = midChanged || startValueChanged || macAddressChanged || bModemChanged;


    console.table({
        currentMid, oldMid,
        currentStartValue, oldStartValue,
        currentMacAddress, oldMacAddress,
        currentBoundToModemText, oldBoundToModemText
    });

    if (changed) {
        console.log('✅ 하드웨어 정보 변경됨, 업데이트 필요');
    } else {
        console.log('❌ 하드웨어 정보 변경 없음, 업데이트 생략 가능');
    }

    return changed;
}


/**
 * 하드웨어 설치 정보를 서버에 PUT 요청으로 업데이트하는 함수
 * @returns {Promise<void>} 비동기 처리를 위한 Promise 반환 (변경 없으면 즉시 resolve)
 */
function updHoInfo() {
    // 변경 사항이 없으면 바로 종료
    if (!isHoChanged()) {
        return Promise.resolve(); // Promise를 반환하여 호출 체인을 유지
    }

    // UI에서 변경된 현재 값을 가져옴
    const currentMid = $('#mid').val();
    const currentStartValue = parseInt($('#startValue').val(), 10);
    const currentMacAddress = $('#macAddress').val();

    // '모뎀'이면 true, '모뎀아님'이면 false로 변환
    const boundToModemText = $('#bModem').val();
    const currentBoundToModem = (boundToModemText === '모뎀');

    const hoData = {
        seqHo: seqHo, // 전역/상위 스코프에서 가져옴
        seqMeter: seqMeter, // 전역/상위 스코프에서 가져옴
        mid: currentMid,
        meterValueStart: currentStartValue,
        meterMacAddress: currentMacAddress,
        boundToModem: currentBoundToModem
    };

    // 비동기 처리를 위해 Promise로 감싸서 반환합니다. (async/await 체이닝을 위해 필수)
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '../install/api/ho/update',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(hoData),
            success: function (res) {
                if (res.success) {
                    alert('하드웨어 정보가 업데이트되었습니다.');
                    resolve(res);
                } else {
                    alert('업데이트 실패: ' + res.message);
                    reject(new Error(res.message));
                }
            },
            error: function (err) {
                console.error(err);
                alert('서버 오류 발생');
                reject(err);
            }
        });
    });
}


/**
 * 기존 MID가 비어있었을 때 (최초 설치 시) 설치 이력을 추가하는 함수
 * 이력 추가 실패 시에도 메인 작업 흐름을 막지 않기 위해 resolve 처리합니다.
 * @param {string} workerId - 작업을 수행한 작업자 ID (nSeqWorker)
 * @returns {Promise<void>} 비동기 처리를 위한 Promise 반환
 */
function addInstallHistory(workerId) {
    const historyData = {
        seqWorker: workerId,
        seqHo: seqHo // 전역/상위 스코프에서 가져옴 (updHoInfo와 동일)
        // dtInstalled는 서버에서 자동 생성될 것으로 가정합니다.
    };

    return new Promise((resolve) => { // reject 대신 resolve를 사용하여 메인 흐름을 이어갑니다.
        $.ajax({
            url: '../install/api/history/add/meter', // 설치 이력 추가를 위한 API 엔드포인트
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(historyData),
            success: function (res) {
                if (res.success) {
                    console.log('설치 이력이 성공적으로 추가되었습니다.');
                } else {
                    console.error('설치 이력 추가 실패:', res.message);
                }
                resolve(); // 성공 또는 실패와 관계없이 다음 단계로 이동
            },
            error: function (err) {
                console.error('설치 이력 추가 중 서버 오류 발생:', err);
                resolve(); // 서버 오류 시에도 다음 단계로 이동
            }
        });
    });
}

$(document).ready(function () {

    console.log(`[DEBUG] 현재 페이지 meterId: ${mid}`);
    console.log(`[DEBUG] 현재 페이지 seqHo: ${seqHo}`);

    $('#siteName').text(siteName)

    $.ajax({
        url: '../install/getMeterDetail',
        type: 'GET',
        data: {seqHo},
        success: function (response) {
            console.log("response : ", response);
            renderingHoInfo(response.HO_INFO);
            drawImg(response.LIST_IMAGE);
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            alert("DCU 정보를 불러오는데 실패했습니다.");
        }
    });

    $('#historyBack').on('click', function () {
        history.back();
        // window.location.href = '../install/regImage';
    })

    $('#refreshBtn').on('click', function () {
        console.log('[DEBUG] 새로고침 버튼 클릭됨');
        location.reload(); // 페이지 새로고침
    });


    // ===========================================
    // 저장 버튼 클릭 이벤트 핸들러
    // ===========================================
    $('#saveMeterInfoBtn').on('click', async function () {
        const $this = $(this);
        const selectedWorker = '29'; // 실제로는 DOM에서 선택된 작업자 ID를 가져와야 함

        const oldMid = $('#mid').data('old') || '';
        let shouldGoBack = false; // 최종적으로 페이지를 이동할지 결정하는 플래그

        // 1. 버튼 비활성화 (중복 클릭 방지)
        $this.prop('disabled', true);

        try {
            // 2. 호(Ho) 정보 업데이트
            await updHoInfo();

            // updHoInfo가 오류 없이 완료되면 기본적으로 페이지 이동 가능 (shouldGoBack = true)
            shouldGoBack = true;

            // 2-1. 기존 MID가 Falsy 값일 경우에만 설치 이력 추가
            if (!oldMid) {
                console.log("기존 MID가 없어 설치 이력을 추가합니다.");
                await addInstallHistory(selectedWorker);
            } else {
                console.log("기존 MID가 존재하여 설치 이력을 추가하지 않습니다.");
            }

            // 3. 작업자 유효성 검사
            if (!selectedWorker) {
                alert("작업자를 선택해주세요.");
                return; // finally로 이동하여 버튼 재활성화
            }

            if (typeof uploadedFiles === 'undefined' || uploadedFiles.length === 0) {
                console.log("등록할 사진 없음");
                return; // finally로 이동하여 버튼 재활성화
            }

            // 4. 사진 업로드 처리
            if (typeof uploadedFiles !== 'undefined' && uploadedFiles.length > 0) {
                // 4-1. 파일이 있으면 업로드 실행 및 완료 대기
                const uploadResult = await uploadAllPhotos(uploadedFiles, selectedWorker, seqHo);

                // 5. 성공 시 파일 목록 초기화
                if (uploadResult && uploadResult.success > 0) {
                    uploadedFiles.splice(0, uploadedFiles.length);
                }

                // 6. 업로드 실패 항목이 하나라도 있다면 페이지 이동 금지
                if (uploadResult.fail > 0) {
                    shouldGoBack = false;
                    // 업로드 실패 항목 알림은 uploadAllPhotos 내에서 처리되었다고 가정
                }

            } else {
                // 파일이 없음: 업로드 로직 전체를 건너뛰고, shouldGoBack은 2단계 성공 상태(true) 유지
                console.log("등록할 사진 없음. 업데이트만 성공하면 페이지 이동합니다.");
            }

        } catch (error) {
            // updHoInfo 실패 시
            console.error("최종 처리 실패:", error);
            shouldGoBack = false; // 오류 발생 시 페이지 이동 금지

        } finally {
            // 7. 성공/실패와 관계없이 버튼 재활성화
            $this.prop('disabled', false);

            // 8. 모든 필수 작업이 성공하고, 파일 업로드에 실패가 없었을 경우 페이지 이동
            if (shouldGoBack) {
                window.history.back();
            }
        }
    });


});

