// installation-mobile.js
let combinedInstallationList = [];
let currentSelectType = '';
const API_URL = 'https://smartami.kr/api/v2';


const $installationList = $('#installationList');


/**
 * 로딩 오버레이를 표시합니다.
 */
function showLoading() {
    $('#loadingOverlay').show();
}

/**
 * 로딩 오버레이를 숨깁니다.
 */
function hideLoading() {
    $('#loadingOverlay').hide();
}


function resetFilters() {
    // 날짜 필터 초기화: '오늘' (today)로 설정
    $('#dateFilter').val('today');

    // 작업자 필터 초기화: '전체' (all)로 설정
    $('#workerFilter').val('all');

    // 지역 필터 초기화: '전체' (all)로 설정
    $('#regionFilter').val('all');

    $('#siteSelect').val(null).trigger('change');

    // 3. 탭 상태 초기화 (선택 사항: '전체' 탭으로 이동)
    // 현재 활성화된 탭이 아닌 '전체'로 탭 UI를 강제로 변경하고 싶다면:
    // changeTab('all');

    // 하지만, 현재 탭은 유지하고 필터만 초기화하는 경우가 많으므로,
    // 현재 UI 상태를 유지한 채 통합 필터링 함수만 호출합니다.

    // 4. ✅ 필터가 초기화된 상태로 리스트를 다시 필터링 및 렌더링
    // (applySearchFiltersAndRender 함수 내부에서 현재 탭 상태와 초기화된 필터 값을 읽어 필터링을 수행합니다.)
    applySearchFiltersAndRender();
}


/**
 * 단지 리스트를 렌더링하고 Select2를 초기화합니다.
 * @param {Array<Object>} siteList - 단지 목록 데이터
 */
function renderSiteList(siteList) {
    const $siteSelect = $('#siteSelect').empty().append('<option value="" disabled selected>선택하세요</option>');

    // 1. 단지 옵션 렌더링
    siteList.forEach(site => {
        $siteSelect.append(`<option value="${site.seqSite}" data-siteCode="${site.siteCode}">${site.name} (${site.siteCode})</option>`);
    });

    // 2. Select2 초기화
    $siteSelect.select2({
        // 한국어 설정 적용
        language: "ko",
        // 검색 결과를 드롭다운 안에 렌더링 (모바일 화면 전체를 덮지 않도록)
        dropdownAutoWidth: true,
        // 선택하지 않은 상태에서 보일 텍스트
        placeholder: "단지 검색",
        // 검색창에 커서 자동 포커스
        minimumResultsForSearch: 1, // 항상 검색창 표시
        width: '100%' // 부모 요소 너비에 맞춤
    });

}

// === 단지 리스트 불러오기 ===
function getSiteList(type) {
    const apiUrl = type === 'apt' ? `${API_URL}/infra/all-site` :
        type === 'bld' ? `${API_URL}/infra/all-building` : '';
    if (!apiUrl) return;

    $.ajax({
        url: apiUrl,
        method: 'GET',
        success: response => renderSiteList(response),
        error: () => alert('데이터를 불러오지 못했습니다.')
    });
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


    // 1. ✅ 로딩 모달 표시
    showLoading();

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

            // renderFilteredList(initialTab);

            // 5. ✅ 통합 필터링 함수 호출 (디폴트 필터 상태 적용)
            // applySearchFiltersAndRender()가 DOM에서 'today', 'all', 'all'을 읽어 필터링합니다.
            applySearchFiltersAndRender();
        })
        .catch(error => {
            // Promise 중 하나라도 reject(API 호출 자체 실패)되면 이쪽으로 옴
            alert('설치 리스트 조회 중 오류가 발생했습니다. 자세한 내용은 콘솔을 확인하십시오.');
            console.error('Combined Load Error:', error);
        })
        .finally(() => {
            // 4. ✅ 로딩 모달 숨기기 (성공/실패 여부에 관계없이 항상 실행)
            hideLoading();
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
    // renderFilteredList(tabType);
    applySearchFiltersAndRender();
}

// =========================================================================


/**
 * 모든 검색 필터 (날짜, 작업자, 지역)를 적용하여 리스트를 필터링하고 렌더링합니다.
 */
function applySearchFiltersAndRender() {
    const dateValue = $('#dateFilter').val();
    const workerValue = $('#workerFilter').val();
    const regionValue = $('#regionFilter').val();
    const siteValue = $('#siteSelect').val();


    const startDateValue = $('#startDate').val();
    const endDateValue = $('#endDate').val();

    // 1. 현재 활성화된 HW 탭 타입 (dcu, meter, all)을 가져옵니다.
    // changeTab 함수에서 URL 파라미터나 탭 클래스를 통해 현재 탭을 가져온다고 가정
    const currentTab = new URLSearchParams(window.location.search).get('tab') || 'all';

    // 2. HW 타입 필터링 (탭 클릭 결과)
    let tempFilteredList = combinedInstallationList;
    if (currentTab !== 'all') {
        tempFilteredList = combinedInstallationList.filter(item => item.hwType === currentTab);
    }

    // 3. 검색 필터 (날짜, 작업자, 지역) 적용
    const finalFilteredList = tempFilteredList.filter(item => {
        let isMatch = true;

        // **A. 작업자 필터 (workerFilter)**
        // <option value="all">이 아닐 경우, workerName과 일치하는지 확인
        if (workerValue !== 'all' && item.workerName !== workerValue) {
            isMatch = false;
        }

        // **B. 지역 필터 (regionFilter)**
        // <option value="all">이 아닐 경우, MetroProv와 일치하는지 확인
        if (isMatch && regionValue !== 'all' && item.metroProv !== regionValue) {
            isMatch = false;
        }

        // **C. 날짜 필터 (dateFilter)**
        if (isMatch) {
            const installTime = item.installDate;
            let range;

            if (dateValue === 'dateTarget') {
                // 1. '기간설정' 선택 시: 입력된 시작/종료 날짜를 사용
                if (startDateValue && endDateValue) {
                    // 입력된 날짜 문자열을 타임스탬프로 변환
                    const start = DateUtil.getStartOfDay(new Date(startDateValue));
                    // 종료 날짜는 해당 날짜의 자정(다음 날 00:00:00) 직전까지 포함
                    const end = DateUtil.getStartOfDay(new Date(endDateValue)) + 86400000 - 1;
                    range = {start: start, end: end};
                } else {
                    // '기간설정'이 선택되었으나 날짜 입력이 완료되지 않은 경우
                    // 일단 필터링을 건너뛰거나, 기간이 유효하지 않으면 false 반환 가능
                    // 여기서는 유효하지 않은 기간은 필터링하지 않음 (isMatch = true 유지)
                }
            } else {
                switch (dateValue) {
                    case 'today':
                        range = DateUtil.getTodayRange();
                        break;
                    case 'yesterday':
                        range = DateUtil.getYesterdayRange();
                        break;
                    case 'thisWeek':
                        range = DateUtil.getThisWeekRange();
                        break;
                    case 'thisMonth':
                        range = DateUtil.getThisMonthRange();
                        break;
                    default:
                        // 'today' 외의 다른 날짜 옵션이 추가될 경우 대비
                        range = null;
                }
            }
            // installDate (타임스탬프)가 계산된 범위 내에 있는지 확인
            if (range) {
                if (installTime < range.start || installTime > range.end) {
                    isMatch = false;
                }
            }
        }

        // D. ✅ 단지 필터 (siteSelect)
        // Select2는 기본적으로 값(value)을 반환하며, 이는 DB의 site ID/seqSite라고 가정합니다.
        // item 객체에 해당 site ID/seqSite 값이 있다고 가정하고 필터링합니다.
        if (isMatch && siteValue && siteValue !== item.seqSite) { // nSeqSite는 item 객체의 단지 ID 필드명이라고 가정
            isMatch = false;
        }

        return isMatch;
    });

    // ===================================================
// ✅ 4. DOM 초기화 (이전 데이터를 제거)
// ===================================================
    const $listContainer = $('#installationList');
    $listContainer.empty();

    console.log("finalFilteredList : ", finalFilteredList);

// 5. 리스트 렌더링 실행
    if (finalFilteredList.length > 0) {
        // 리스트가 있을 경우, HTML을 생성하여 $listContainer에 추가
        renderInstallationList(finalFilteredList);
    } else {
        // 리스트가 없을 경우, "데이터 없음" 메시지를 빈 컨테이너에 추가
        $listContainer.append('<div class="no-data">조회된 설치 이력이 없습니다.</div>');
    }
}


/**
 * 오늘, 어제, 이번 주, 이번 달의 시작/종료 타임스탬프를 계산하는 유틸리티
 */
const DateUtil = {
    // 날짜의 자정(00:00:00.000) 타임스탬프를 반환
    getStartOfDay: (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    },

    // 오늘 날짜 범위 (시작 타임스탬프)
    getTodayRange: () => {
        const todayStart = DateUtil.getStartOfDay(new Date());
        return {start: todayStart, end: DateUtil.getStartOfDay(todayStart + 86400000) - 1};
    },

    // 어제 날짜 범위 (시작 타임스탬프)
    getYesterdayRange: () => {
        const yesterdayStart = DateUtil.getStartOfDay(new Date()) - 86400000;
        return {start: yesterdayStart, end: DateUtil.getStartOfDay(yesterdayStart + 86400000) - 1};
    },

    // 이번 주 날짜 범위 (일요일 시작 기준)
    getThisWeekRange: () => {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0: 일요일, 6: 토요일

        // 이번 주 일요일 자정 (주의 시작일)
        const startOfWeek = DateUtil.getStartOfDay(now) - dayOfWeek * 86400000;

        // 다음 주 일요일 자정 - 1ms (주의 종료일)
        const endOfWeek = startOfWeek + (7 * 86400000) - 1;

        return {start: startOfWeek, end: endOfWeek};
    },

    // 이번 달 날짜 범위
    getThisMonthRange: () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        // 이번 달 1일 자정 (달의 시작일)
        const startOfMonth = DateUtil.getStartOfDay(new Date(year, month, 1));

        // 다음 달 1일 자정 - 1ms (달의 종료일)
        const endOfMonth = DateUtil.getStartOfDay(new Date(year, month + 1, 1)) - 1;

        return {start: startOfMonth, end: endOfMonth};
    }
};

$(document).ready(function () {

    // 페이지 진입 시 데이터 로드
    loadInstallationList();


    $('#historyBack').on('click', function () {
        window.location.href = '../profile/settings';
    })

    // ✅ 모든 필터 <select>에 change 이벤트 리스너 연결
    $('#workerFilter, #regionFilter, #siteSelect').on('change', function () {
        applySearchFiltersAndRender();
    });


    $('#dateFilter').on('change', function() {
        const selectedValue = $(this).val();

        if (selectedValue === 'dateTarget') {
            $('#dateTargetInputs').show();
        } else {
            $('#dateTargetInputs').hide();
            // 기간 설정 외의 옵션을 선택하면 날짜 입력 값 초기화
            $('#startDate').val('');
            $('#endDate').val('');
        }

        // UI 변경 후, 필터링을 여기서 단독으로 실행
        // applySearchFiltersAndRender();
    });

    // 3. ✅ 시작/종료 날짜 입력 필드 리스너 추가
    $('#startDate, #endDate').on('change', applySearchFiltersAndRender);


    // 초기 단지 리스트
    getSiteList('apt');
});