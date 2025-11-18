// installation-mobile.js
let combinedInstallationList = [];

const $installationList = $('#installationList');

// function changeTab(tabName) {
//     const params = new URLSearchParams(window.location.search);
//     params.set('tab', tabName);
//     window.location.search = params.toString();
// }

function resetFilters() {
    document.getElementById('dateFilter').value = 'today';
    document.getElementById('workerFilter').value = 'all';
    document.getElementById('regionFilter').value = 'all';
    document.getElementById('searchKeyword').value = '';
}

let currentSelectType = '';

function openBottomSheet(type) {
    currentSelectType = type;
    document.getElementById('bottomSheet').classList.add('show');
}

function closeBottomSheet() {
    document.getElementById('bottomSheet').classList.remove('show');
}

document.querySelectorAll('.sheet-option').forEach(option => {
    option.addEventListener('click', function () {
        const value = this.getAttribute('data-value');
        const text = this.textContent;

        // 변경할 대상
        if (currentSelectType === 'worker') {
            document.getElementById('workerSelectedText').textContent = text;
            document.getElementById('workerFilter').value = value;
        }

        closeBottomSheet();
    });
});

function renderInstallationList(list) {
    // const $listContainer = $("#installationList");
    // $installationList.empty(); // 기존 데이터 초기화

    $("#resultCount").text(list.length);

    list.forEach(item => {

        const meterParams = new URLSearchParams({
            mid: item.mid,          // Meter ID (serial)
            seqMeter: item.seqMeter,
            siteName: item.siteName,
            seqHo: item.seqHo
        }).toString();

        const dcuParams = new URLSearchParams({
            dcuId: item.dcuId,      // DCU ID (serial)
            seqDcu: item.seqDcu,    // DCU 내부 시퀀스
            siteName: item.siteName,
            seqSite: item.seqSite
            // seqHo는 DCU 정보에서 필요 없을 수 있으나, 통합 페이지라면 유지 가능
        }).toString();


        // ===========================================
        // 2. 동적 변수 설정 (hwType에 따라 변경)
        // ===========================================

        // A. 클릭 시 이동할 URL 설정
        let locationHref;
        if (item.hwType === "meter") {
            locationHref = `../install/meterInstallList?${meterParams}`;
        } else if (item.hwType === "dcu") {
            locationHref = `../install/dcuInstallList?${dcuParams}`;
        } else {
            locationHref = "#"; // 정의되지 않은 타입의 경우 이동 없음
        }

        // B. 시리얼 번호로 표시할 데이터 필드 설정
        const serialValue = item.hwType === "meter" ? item.mid : item.dcuId;

        // C. 뱃지 클래스와 라벨
        const hwTypeLabels = {
            "meter": "계량기",
            "dcu": "DCU",
            // "lte": "LTE",
        };
        const badgeClass = `badge-${item.hwType}`;
        const hwLabel = hwTypeLabels[item.hwType] || "";

        // D. 바텀 로우 값 설정
        let bottomRowValue;
        if (item.hwType === "meter") {
            bottomRowValue = `${item.dongName}동 ${item.hoName}호`;
        } else if (item.hwType === "dcu") {
            bottomRowValue = item.location || '위치 정보 없음';
        } else {
            bottomRowValue = '';
        }

        // ===========================================
        // 3. cardHtml 템플릿 리터럴 적용
        // ===========================================

        const cardHtml = `
                <div class="card-item" onclick="location.href='${locationHref}'">
                    <div class="top-row">
                        <span>${formatTimestamp(item.installDate)} · ${item.workerName} · ${item.metroProv} · ${item.cityDist}</span>
                        <span class="${badgeClass}">${hwLabel}</span>
                    </div>
                    <div class="main-row">
                        <span class="name">${item.siteName}</span>
                        <span class="serial">${serialValue}</span>
                    </div>
                    <div class="bottom-row">
                        <div>${bottomRowValue}</div>
                    </div>
                </div>
            `;
        $installationList.append(cardHtml);
    });
}


/**
 * Meter 또는 DCU 설치 리스트를 비동기로 조회하는 함수
 * @param {string} url - API 엔드포인트 URL
 * @param {object} params - 검색 조건 객체
 * @returns {Promise<Array<Object>>} - 성공 시 리스트 데이터를 반환
 */
function fetchInstallationData(url, params, type) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            data: params,
            success: function (res) {
                if (res.success) {
                    // 리스트의 각 레코드에 hwType 추가
                    const typedList = res.list.map(item => ({
                        ...item,
                        hwType: type
                    }));
                    resolve(typedList);// 성공 시 리스트만 반환
                } else {
                    // API 응답은 성공(200 OK)했으나 내부 로직 실패
                    console.error(`데이터 조회 실패 (${url}): ${res.message}`);
                    resolve([]); // 빈 배열로 resolve하여 전체 Promise.all을 멈추지 않음
                }
            },
            error: function (xhr, status, error) {
                console.error(`API 호출 중 오류 발생 (${url}): ${error}`);
                reject(new Error(`API Error: ${url}`)); // Promise.all을 catch로 이동시킴
            }
        });
    });
}

// =========================================================================

function loadInstallationList() {

    const searchParams = {
        // 예시: DOM에서 작업자 ID와 광역시를 가져옴
        // seqSite:
        // seqWorker: $('#workerSelect').val() || null,
        // metroProv: $('#metroSelect').val() || null,
        // installDateFrom: $('#startDate').val() || null,
        // installDateTo: $('#endDate').val() || null,
    };

    const meterApiUrl = '../install/api/meter/installList';
    const dcuApiUrl = '../install/api/dcu/installList';

    // 1. Meter 및 DCU API 호출 Promise 생성
    const meterPromise = fetchInstallationData(meterApiUrl, searchParams, 'meter');
    const dcuPromise = fetchInstallationData(dcuApiUrl, searchParams, 'dcu');

    // 2. Promise.all을 사용하여 두 호출의 완료를 기다림
    Promise.all([meterPromise, dcuPromise])
        .then(results => {
            const [meterList, dcuList] = results;

            // 3. 두 리스트를 하나의 배열로 병합
            const combinedList = [...meterList, ...dcuList];

            // 4. 설치 일시(installDate)를 기준으로 정렬
            combinedList.sort((a, b) => {
                const dateA = new Date(a.installDate).getTime();
                const dateB = new Date(b.installDate).getTime();
                return dateB - dateA; // 내림차순 정렬 (최신순)
            });

            combinedInstallationList = combinedList;

            const initialTab = new URLSearchParams(window.location.search).get('tab') || 'all';

            // 탭 UI 활성화 (선택적)
            $('.tab-item').removeClass('active');
            $(`.tab-item[onclick="changeTab('${initialTab}')"]`).addClass('active');

            renderFilteredList(initialTab);

            // 5. 통합 리스트 렌더링
            // renderInstallationList(combinedList);
        })
        .catch(error => {
            // Promise 중 하나라도 reject(API 호출 자체 실패)되면 이쪽으로 옴
            alert('설치 리스트 조회 중 오류가 발생했습니다. 자세한 내용은 콘솔을 확인하십시오.');
            console.error('Combined Load Error:', error);
        });
}


/**
 * 전역 리스트를 필터링하고 화면을 렌더링하는 핵심 함수
 * @param {string} tabType - 'all', 'meter', 또는 'dcu'
 */
function renderFilteredList(tabType) {
    let filteredList = [];

    if (tabType === 'all') {
        filteredList = combinedInstallationList;
    } else {
        // 'meter' 또는 'dcu' 타입으로 필터링
        filteredList = combinedInstallationList.filter(item => item.hwType === tabType);
    }

    // 4. 화면 초기화 (전역 변수 사용)
    $installationList.empty(); // ✅ $installationList 사용

    // 5. 필터링된 리스트 렌더링 실행
    if (filteredList.length > 0) {
        // 리스트가 있을 경우, HTML을 생성하여 $installationList에 추가
        renderInstallationList(filteredList);
    } else {
        // 결과가 없을 때 표시할 내용
        $installationList.append('<div class="no-data">조회된 설치 이력이 없습니다.</div>');
    }
}


/**
 * 탭 클릭 이벤트 핸들러
 * @param {string} tabType - 'all', 'meter', 또는 'dcu'
 */
function changeTab(tabType) {
    // 1. URL 파라미터를 업데이트하여 탭 상태 유지
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('tab', tabType);
    window.history.pushState({}, '', currentUrl);

    // 2. 탭 UI 활성화/비활성화
    $('.tab-item').removeClass('active');
    $(`.tab-item[onclick="changeTab('${tabType}')"]`).addClass('active');

    // 3. 필터링 및 렌더링 실행
    renderFilteredList(tabType);
}

// =========================================================================

$(document).ready(function () {

    // 페이지 진입 시 데이터 로드
    loadInstallationList();


    $('#historyBack').on('click', function () {
        window.location.href = '../profile/settings';
    })
});