const API_URL = 'https://smartami.kr/api/v2';


// Bootstrap Offcanvas 인스턴스
// const hoBottomSheet = new bootstrap.Offcanvas('#hoBottomSheet');

let cachedHwData = {
    dcu: [],
    meter: []
};

let swiper; // 전역 스코프

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

function getMeterListBySite(seqSite) {

    const apiUrl = "../install/getAptMeter"

    const formData = {
        seqSite: seqSite,
        seqCode: 12,
        type: 'APT'
        // seqDong: $("#dongSelect").val(),
        // seqHo: $("#hoSelect").val()
    };

    console.log("formData : ", formData);

    return $.ajax({
        url: apiUrl,
        method: 'GET',
        data: formData
    })
        .then(response => response)
        .catch(() => {
            alert('데이터를 불러오지 못했습니다.');
            return null;
        });

}

// === 장비 데이터 호출 ===
function getHwListBySite({
                             seqSite,
                             hwType,
                             dongName = '',
                             hoName = '',
                             manufacturer = '',
                             mid = '',
                             dcuId = '',
                             lteSn = '',
                             installLocation = '',
                             seqCode = ''
                         }) {
    const bldType = 'APT';
    let apiUrl = `${API_URL}/infra/hardware/${hwType}?seqSite=${seqSite}&type=${bldType}&seqCode=${seqCode}`;

    if (dongName) apiUrl += `&dongName=${dongName}`;
    if (hoName) apiUrl += `&hoName=${hoName}`;
    if (manufacturer) apiUrl += `&manufacturer=${manufacturer}`;
    if (mid) apiUrl += `&mid=${mid}`;
    if (dcuId) apiUrl += `&dcuId=${dcuId}`;
    if (lteSn) apiUrl += `&lteSn=${lteSn}`;
    if (installLocation) apiUrl += `&installLocation=${installLocation}`;

    console.log(`API >>> ${apiUrl}`);

    return $.ajax({url: apiUrl, method: 'GET'})
        .then(response => response)
        .catch(() => {
            alert('데이터를 불러오지 못했습니다.');
            return null;
        });
}

// === 테이블 렌더링 ===
function renderInstallationList(type, data) {
    const thead = document.querySelector('#installTable thead');
    const tbody = document.querySelector('#installTable tbody');
    const resultCount = document.getElementById('resultCount');
    const $dcuCnt = $('#dcuCnt');
    const $meterCnt = $('#meterCnt');
    const $modemCnt = $('#modemCnt');

    thead.innerHTML = '';
    tbody.innerHTML = '';

    // 1. mid_new 값이 ""가 아닌(즉, 계량기가 설정된) 요소만 필터링
    const installedMeterCount = cachedHwData.meter.filter(item => {
        // mid_new가 null이 아니면서, 빈 문자열 ""도 아닌 경우를 카운트
        return item.mid_new && item.mid_new !== "";
    }).length;

    // 전체 카운트 반영
    $dcuCnt.text(cachedHwData.dcu.length);
    $meterCnt.text(installedMeterCount);

    // (boundToModem === true인 경우)
    const modemBoundMeters = cachedHwData.meter.filter(meter => meter.bound_to_modem === 'true').length;
    $modemCnt.text(modemBoundMeters);

    // 헤더
    if (type === "dcu") {
        thead.innerHTML = `<tr><th>설치 위치</th><th>DCU ID</th></tr>`;
    } else if (type === "meter") {
        thead.innerHTML = `<tr><th>동</th><th>호</th><th>계량기 ID</th></tr>`;
    }

    // 타겟 페이지 경로는 반복문 밖에서 미리 정의
    const targetPage = type === "dcu" ? "../install/dcuInstallList" : "../install/meterInstallList";
    const isDcu = type === "dcu";

    data.forEach(item => {
        const tr = document.createElement('tr');

        if (isDcu) {
            const {
                location,
                dcuId,
                seqDcu,
                siteName,
                seqSite
            } = item;

            // ✅ URLSearchParams 사용으로 안전하게 파라미터 구성
            const params = new URLSearchParams({
                dcuId,
                seqDcu,
                siteName,
                seqSite
            }).toString();

            tr.innerHTML = `
                <td>${location || '-'}</td>
                <td>
                    <a href="${targetPage}?${params}" class="dcu-link" data-id="${dcuId}">
                        ${dcuId}
                    </a>
                </td>
            `;
        } else {

            const {
                dong_name,
                ho_name,
                mid_new,
                siteName,
                seq_ho,
                seqMeter,
                seqHo
            } = item;

            // 변수 보정 로직은 유지
            const finalSeqMeter = seqMeter || item.seq_meter;
            const finalSeqHo = seqHo || seq_ho;
            const finalMidNew = mid_new || item.midNew;

            // ✅ URL 파라미터를 언더바('_') 없이 CamelCase로 구성
            const params = new URLSearchParams({
                mid: finalMidNew,
                seqMeter: finalSeqMeter,
                siteName: siteName,
                seqHo: finalSeqHo
            }).toString();

            tr.innerHTML = `
                <td>${dong_name || '-'}</td>
                <td>${ho_name || '-'}</td>
                <td>
                    <a href="${targetPage}?${params}" class="meter-link" data-id="${mid_new}">
                        ${mid_new || '-'}
                    </a>
                </td>
            `;
        }

        tbody.appendChild(tr);
    });
}

// === 필터/동/호 설정 ===
function getDongListBySite(seqSite) {
    const $dongSelect = $("#selectDongForMeter").empty().append('<option selected value="">선택</option>');
    const $hoSelect = $("#selectHoForMeter").empty().append('<option selected value="">선택</option>');

    if (!seqSite) return;

    const res = enernet.modules.api.getDongListBySite(seqSite);
    const dongList = res.list_dong || [];
    dongList.forEach(dong => $dongSelect.append(`<option value="${dong.seq_dong}">${dong.dong_name}동</option>`));

    $dongSelect.select2({
        // 한국어 설정 적용
        language: "ko",
        // 검색 결과를 드롭다운 안에 렌더링 (모바일 화면 전체를 덮지 않도록)
        dropdownAutoWidth: true,
        // 선택하지 않은 상태에서 보일 텍스트
        // placeholder: "동 선택",
        // 검색창에 커서 자동 포커스
        minimumResultsForSearch: 1, // 항상 검색창 표시
        width: '100%' // 부모 요소 너비에 맞춤
    });
}

function getCategoryListBySite(seqSite) {
    // TODO: API 호출
}

// === 공통 콜백 ===
function callBackForTypeSelectEvent(seqSite, type) {
    getDongListBySite(seqSite);
    getCategoryListBySite(seqSite);
}

function toggleFilter(type) {
    if (type === 'meter') $('.filter-container').show();
    else $('.filter-container').hide();
}

function getCardDtype() {
    const activeSlide = swiper.slides[swiper.activeIndex];
    return activeSlide.dataset.type;
}


// 호 리스트 렌더링 함수 (바텀시트용)
function renderHoList(hoList) {
    const $list = $("#hoListContainer");
    $list.empty();

    if (!hoList || hoList.length === 0) {
        $list.append(`<li class="list-group-item text-center text-muted">호 정보 없음</li>`);
        return;
    }

    for (const ho of hoList) {
        $list.append(`
            <li class="list-group-item" data-value="${ho.seq_ho}">
                ${ho.ho_name}호
            </li>
        `);
    }
}

// === 문서 준비 후 ===
$(document).ready(async function () {

    // Swiper 초기화
    swiper = new Swiper('.hardware-meter', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        freeMode: true,
        on: {
            init() {
                console.log("✅ Swiper 초기화 완료");
                const type = this.slides[this.activeIndex].dataset.type;
                toggleFilter(type);
                if (cachedHwData[type]?.length > 0) renderInstallationList(type, cachedHwData[type]);
            },
            slideChange() {
                const type = this.slides[this.activeIndex].dataset.type;
                toggleFilter(type);

                const seqSite = $('#siteSelect').val();
                if (!seqSite || seqSite === '') {
                    alert("단지를 선택하세요");
                    return;
                }

                // === 동/호 필터 초기화 ===
                $("#selectDongForMeter").val('');
                $("#selectHoForMeter").val('')
                $('#commonAreaNameSearch').val('');

                if (cachedHwData[type]?.length > 0) renderInstallationList(type, cachedHwData[type]);
            }
        }
    });

    // 단지 선택
    $("#siteSelect").on('change', async function () {
        const seqSite = $(this).val();
        if (!seqSite) {
            alert("단지를 선택하세요.");
            return;
        }

        const type = getCardDtype();

        try {
            const [dcuData, meterData] = await Promise.all([
                getHwListBySite({seqSite, hwType: "dcu"}),
                // getHwListBySite({seqSite, hwType: "meter"})
                getMeterListBySite(seqSite)
            ]);

            console.log("dcuData : ", dcuData);
            console.log("meterData : ", meterData);

            cachedHwData = {dcu: dcuData || [], meter: meterData.list_ho || []};
            renderInstallationList(type, cachedHwData[type]);
            callBackForTypeSelectEvent(seqSite, type);

            console.log("cachedHwData : ", cachedHwData);

        } catch (err) {
            console.error(err);
            alert("데이터를 불러오지 못했습니다.");
        }
    });

    // 동/호 필터
    $("#selectDongForMeter").on('change', function () {
        const hwType = getCardDtype();
        const _seqDong = $(this).val();

        const $hoSelect = $("#selectHoForMeter").empty().append(`<option selected value="">선택</option>`);
        $('#commonAreaNameSearch').val('');

        const dongName = $(this).find('option:selected').text().replace('동', '').trim();
        // const seqCode = 12;

        const data = _seqDong && _seqDong !== '선택'
            ? cachedHwData[hwType].filter(item => item.dong_name === dongName)
            : cachedHwData[hwType];

        renderInstallationList(hwType, data);


        // === 기존 enernet 모듈로 호 리스트 업데이트 ===
        const _res = enernet.modules.api.getHoListByDong(_seqDong);
        const _hoList = _res?.list_ho || [];


        if (!_hoList || _hoList.length === 0) {
            return;
        }

        for (const ho of _hoList) {
            $hoSelect.append(`<option value="${ho.seq_ho}">${ho.ho_name}호</option>`);
        }
    });

    $("#selectHoForMeter").on('change', function () {
        const hwType = getCardDtype();
        const dongName = $('#selectDongForMeter').find('option:selected').text().replace('동', '').trim();
        const hoName = $(this).find('option:selected').text().replace('호', '').trim();
        const finalHoName = $(this).val() && $(this).val() !== '선택' ? hoName : '';

        const data = cachedHwData[hwType].filter(item =>
            item.dong_name === dongName && (!finalHoName || item.ho_name === finalHoName)
        );

        renderInstallationList(hwType, data);
    });

    $('#historyBack').on('click', function () {
        window.location.href = '../profile/settings';
    })


    $('#selectHoForMeter').select2({
        language: "ko",
        // 검색 결과를 드롭다운 안에 렌더링 (모바일 화면 전체를 덮지 않도록)
        dropdownAutoWidth: true,
        // 검색창에 커서 자동 포커스
        minimumResultsForSearch: 1, // 항상 검색창 표시
        width: '100%' // 부모 요소 너비에 맞춤
    });


    /* // 바텀시트 열기 (input 클릭 시)
     $("#selectHoForMeterInput").on("click", function () {
         hoBottomSheet.show();
     });


 // 리스트에서 클릭하여 선택
     $("#hoListContainer").on("click", "li", function () {
         const seqHo = $(this).data("value");
         const hoName = $(this).text();

         // input에 값 반영
         $("#selectHoForMeterInput").val(hoName);
         $("#selectHoForMeterInput").data("value", seqHo); // seq_ho 값 저장

         // 바텀시트 닫기
         hoBottomSheet.hide();
     });
 */

// 검색 기능
    $("#searchHoInput").on("input", function () {
        const keyword = $(this).val().toLowerCase();

        $("#hoListContainer li").each(function () {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(keyword));
        });
    });


    // 초기 단지 리스트
    getSiteList('apt');
});
