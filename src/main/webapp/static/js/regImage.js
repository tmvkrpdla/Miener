const API_URL = 'https://smartami.kr/api/v2';

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

function renderSiteList(siteList) {
    const $siteSelect = $('#siteSelect').empty().append('<option value="" disabled selected>선택하세요</option>');
    siteList.forEach(site => {
        $siteSelect.append(`<option value="${site.seqSite}" data-siteCode="${site.siteCode}">${site.name} (${site.siteCode})</option>`);
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

    thead.innerHTML = '';
    tbody.innerHTML = '';

    // 전체 카운트 반영
    $dcuCnt.text(cachedHwData.dcu.length);
    $meterCnt.text(cachedHwData.meter.length);

    // 헤더
    if (type === "dcu") {
        thead.innerHTML = `<tr><th>설치 위치</th><th>DCU ID</th></tr>`;
    } else if (type === "meter") {
        thead.innerHTML = `<tr><th>동</th><th>호</th><th>계량기 ID</th></tr>`;
    }

    // 데이터
    resultCount.textContent = data.length;
    data.forEach(item => {
        const targetPage = type === "dcu" ? "../install/dcuInstallList" : "../install/meterInstallList";
        const tr = document.createElement('tr');
        if (type === "dcu") {
            tr.innerHTML = `<td>${item.location}</td>
                            <td><a href="${targetPage}?dcuId=${item.id}" class="dcu-link" data-id="${item.id}">${item.dcuId}</a></td>`;
        } else if (type === "meter") {
            tr.innerHTML = `<td>${item.dongName}</td>
                            <td>${item.hoName}</td>
                            <td><a href="${targetPage}?meterId=${item.mid}" class="meter-link" data-id="${item.mid}">${item.mid}</a></td>`;
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
                getHwListBySite({seqSite, hwType: "meter"})
            ]);

            cachedHwData = {dcu: dcuData || [], meter: meterData || []};
            renderInstallationList(type, cachedHwData[type]);
            callBackForTypeSelectEvent(seqSite, type);

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
            ? cachedHwData[hwType].filter(item => item.dongName === dongName)
            : cachedHwData[hwType];

        renderInstallationList(hwType, data);


        // === 기존 enernet 모듈로 호 리스트 업데이트 ===
        const _res = enernet.modules.api.getHoListByDong(_seqDong);
        const _hoList = _res.list_ho || [];

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
            item.dongName === dongName && (!finalHoName || item.hoName === finalHoName)
        );

        renderInstallationList(hwType, data);
    });

    // 초기 단지 리스트
    getSiteList('apt');
});
