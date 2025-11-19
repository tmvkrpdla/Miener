// installation-mobile.js
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


/**
 * 모든 검색 필터를 초기 상태로 리셋하고 백엔드에 새로운 요청을 보냅니다.
 */
function resetFilters() {
    const $siteSelect = $('#siteSelect');

    // 1. ✅ Select2 중복 호출 방지를 위해 이벤트 리스너 잠시 해제
    // (이전에 $('#siteSelect').on('change', loadAndApplyFilters)로 연결했기 때문)
    $siteSelect.off('change');

    // 2. 필터 값 초기화 (이벤트 발생하지 않도록 .val()만 사용)

    // 날짜 필터 초기화: '오늘' (today)로 설정
    $('#dateFilter').val('today');

    // 작업자 필터 초기화: '전체' (all)로 설정
    $('#workerFilter').val('all');

    // 지역 필터 초기화: '전체' (all)로 설정
    $('#regionFilter').val('all');

    // ✅ Select2 초기화: .val(null) 후 trigger('change') 사용
    // (change 이벤트가 발생하지만, 위에서 off() 했기 때문에 안전함)
    $siteSelect.val(null).trigger('change');

    // 검색 키워드 입력 필드 초기화 (만약 있다면)
    $('#searchKeyword').val('');


    // 3. ✅ UI 상태 초기화: '기간설정' 입력 필드 숨기기
    $('#dateTargetInputs').hide();
    $('#startDate').val('');
    $('#endDate').val('');


    // 4. ✅ Select2 이벤트 리스너 다시 연결
    $siteSelect.on('change', loadAndApplyFilters);


    // 5. ✅ 필터가 초기화된 상태로 통합 로드 함수 호출
    loadAndApplyFilters();
}

// 작업자 목록 불러오기
function getWorkerList() {
    $.ajax({
        url: 'https://smartami.kr/api/v2/workers',
        method: 'GET',
        success: function (response) {
            renderingWorkerList(response)
        },
        error: function () {
            alert("작업자 정보를 불러오지 못했습니다.");
        }
    });
}

/**
 * API 응답 데이터를 사용하여 드롭다운 메뉴에 '전체' 옵션과 작업자 목록을 렌더링합니다.
 * @param {Array<Object>} data 작업자 목록 배열
 */
function renderingWorkerList(data) {
    const $workerFilter = $('#workerFilter');

    $workerFilter.empty();

    const $allOption = $('<option>', {
        value: 'all',
        text: '전체',
        selected: true // 기본 선택 상태로 지정
    });
    $workerFilter.append($allOption);

    if (data && Array.isArray(data)) {
        data.forEach(worker => {
            const $option = $('<option>', {
                value: worker.seq,
                text: worker.name
            });
            $workerFilter.append($option);
        });
    }
}

/**
 * 단지 리스트를 렌더링하고 Select2를 초기화합니다.
 * @param {Array<Object>} siteList - 단지 목록 데이터
 */
function renderSiteList(siteList) {
    const $siteSelect = $('#siteSelect').empty().append('<option value="" selected>단지 전체</option>');

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
                        <span class="serial serial-${item.hwType}">${serialValue}</span>
                    </div>
                    <div class="bottom-row">
                        <div class="bottom-value">${bottomRowValue}</div>
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
    // applySearchFiltersAndRender();
    loadAndApplyFilters();
}

// =========================================================================


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


/**
 * 현재 설정된 모든 필터 상태를 백엔드 API에 전달하여 데이터를 로드하고 렌더링합니다.
 */
function loadAndApplyFilters() {
    // 1. ✅ 로딩 모달 표시
    showLoading();

    // 2. 현재 필터 상태를 수집 (API 쿼리 파라미터로 사용)
    const dateValue = $('#dateFilter').val();
    const startDateValue = $('#startDate').val();
    const endDateValue = $('#endDate').val();
    const initialTab = new URLSearchParams(window.location.search).get('tab') || 'all';

    // 3. API 요청 파라미터 구성
    const searchParams = {
        seqWorker: $('#workerFilter').val() !== 'all' ? $('#workerFilter').val() : null,
        metroProv: $('#regionFilter').val() !== 'all' ? $('#regionFilter').val() : null,
        seqSite: $('#siteSelect').val() || null,

        // ✅ 날짜 필터 처리 로직: 백엔드가 이해할 수 있는 형식으로 날짜를 변환
        // 'today', 'yesterday', 'thisWeek', 'thisMonth', 'dateTarget' 처리
        ...getDateRangeParams(dateValue, startDateValue, endDateValue)
    };

    let apiEndpoint;
    if (initialTab === 'meter') {
        apiEndpoint = '../install/api/meter/installList';
    } else if (initialTab === 'dcu') {
        apiEndpoint = '../install/api/dcu/installList';
    } else {
        // 'all' 탭일 경우, Meter와 DCU 데이터를 병합해야 함 (다음 단계에서 처리)
        // 일단은 Meter와 DCU를 모두 호출하는 기존의 Promise.all 패턴을 사용합니다.
    }

    // 5. API 호출 및 처리 (탭이 'all'인 경우와 분리)
    if (initialTab === 'meter' || initialTab === 'dcu') {
        // 단일 API 호출 (Meter 또는 DCU 탭)
        fetchInstallationData(apiEndpoint, searchParams, initialTab)
            .then(resultList => {
                // 백엔드에서 정렬된 리스트를 받았다고 가정
                handleLoadSuccess([resultList]);
            })
            .catch(error => handleLoadError(error))
            .finally(() => hideLoading());

    } else {
        // 'all' 탭일 경우: 두 API를 동시에 호출하여 결과를 병합
        const meterPromise = fetchInstallationData('../install/api/meter/installList', searchParams, 'meter');
        const dcuPromise = fetchInstallationData('../install/api/dcu/installList', searchParams, 'dcu');

        Promise.all([meterPromise, dcuPromise])
            .then(results => handleLoadSuccess(results))
            .catch(error => handleLoadError(error))
            .finally(() => hideLoading());
    }
}


/**
 * API 호출 성공 시 데이터 병합 및 렌더링을 처리하는 헬퍼 함수
 */
function handleLoadSuccess(results) {
    // 1. 두 리스트를 하나의 배열로 병합 (results는 [meterList, dcuList] 형태)
    const combinedList = [].concat(...results);

    // 2. ✅ (선택 사항) 클라이언트에서 최종 정렬 (백엔드에서 정렬하는 것을 권장)
    combinedList.sort((a, b) => {
        const dateA = new Date(a.installDate).getTime();
        const dateB = new Date(b.installDate).getTime();
        return dateB - dateA; // 내림차순 정렬 (최신순)
    });

    // 3. 렌더링 실행
    const $listContainer = $('#installationList');
    $listContainer.empty();

    if (combinedList.length > 0) {
        renderInstallationList(combinedList);
    } else {
        $listContainer.append('<div class="no-data">조회된 설치 이력이 없습니다.</div>');

        $("#resultCount").text('0');

    }
}

/**
 * API 호출 실패 시 에러를 처리하는 헬퍼 함수
 */
function handleLoadError(error) {
    alert('설치 리스트 조회 중 오류가 발생했습니다. 자세한 내용은 콘솔을 확인하십시오.');
    console.error('Combined Load Error:', error);
}


/**
 * 날짜 필터 값에 따라 백엔드 API에 전달할 시작일/종료일 파라미터를 생성합니다.
 * @param {string} dateValue - 'today', 'thisWeek', 'dateTarget' 등
 * @param {string} startDateValue - 기간설정 시 시작 날짜 ('YYYY-MM-DD')
 * @param {string} endDateValue - 기간설정 시 종료 날짜 ('YYYY-MM-DD')
 * @returns {Object} { installDateFrom: string, installDateTo: string }
 */
function getDateRangeParams(dateValue, startDateValue, endDateValue) {
    let range = null;

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
        case 'dateTarget':
            if (startDateValue && endDateValue) {
                const start = DateUtil.getStartOfDay(new Date(startDateValue));
                // 종료 날짜는 해당 날짜의 자정(다음 날 00:00:00) 직전까지 포함
                const end = DateUtil.getStartOfDay(new Date(endDateValue)) + 86400000 - 1;
                range = {start: start, end: end};
            }
            break;
    }

    if (range) {
        // UTC 변환 없이 KST 기준 로컬 포맷으로 변환
        const formatLocalDateTime = (ts) => {
            const d = new Date(ts);
            return [
                    d.getFullYear(),
                    String(d.getMonth() + 1).padStart(2, '0'),
                    String(d.getDate()).padStart(2, '0')
                ].join('-')
                + 'T' +
                [
                    String(d.getHours()).padStart(2, '0'),
                    String(d.getMinutes()).padStart(2, '0'),
                    String(d.getSeconds()).padStart(2, '0')
                ].join(':');
        };

        return {
            installDateFrom: formatLocalDateTime(range.start),
            installDateTo: formatLocalDateTime(range.end)
        };
    }

    return {}; // 날짜 필터가 없거나 유효하지 않은 경우 빈 객체 반환
}


$(document).ready(function () {

    // 페이지 진입 시 데이터 로드
    // loadInstallationList();
    loadAndApplyFilters();


    // ✅ 모든 필터 <select>에 change 이벤트 리스너 연결
    $('#workerFilter, #regionFilter, #siteSelect').on('change', function () {
        loadAndApplyFilters();
    });


    $('#dateFilter').on('change', function () {
        const selectedValue = $(this).val();

        if (selectedValue === 'dateTarget') {
            $('#dateTargetInputs').show();

            // ✅ 기본값 설정 로직 추가
            const today = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(today.getMonth() - 1); // 오늘 날짜로부터 한 달 전

            // 입력 필드에 기본값 설정
            $('#startDate').val(getDateString(oneMonthAgo));
            $('#endDate').val(getDateString(today));

        } else {
            $('#dateTargetInputs').hide();
            $('#startDate').val('');
            $('#endDate').val('');
        }

        // UI 변경 및 기본값 설정 후, 데이터를 다시 로드
        loadAndApplyFilters();
    });

    // // 3. ✅ 시작/종료 날짜 입력 필드 리스너 추가
    // $('#startDate, #endDate').on('change', applySearchFiltersAndRender);
    $('#startDate, #endDate').on('change', loadAndApplyFilters);


    $('#historyBack').on('click', function () {
        window.location.href = '../profile/settings';
    })

    // 초기 단지 리스트
    getSiteList('apt');
    getWorkerList();
});