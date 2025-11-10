const API_URL = 'https://smartami.kr/api/v2';


let cachedHwData = {
    dcu: [],
    meter: []
};


/**
 * 단지정보 불러오기
 * @param type
 */
function getSiteList(type) {
    let apiUrl = "";

    if (type === 'apt') {
        apiUrl = API_URL + '/infra/all-site';
    } else if (type === 'bld') {
        apiUrl = API_URL + '/infra/all-building';
    }

    $.ajax({
        url: apiUrl,
        method: 'GET',
        data: {},
        success: function (response) {
            renderSiteList(response);
        },
        error: function () {
            alert('데이터를 불러오지 못했습니다.');
        }
    });
}


/**
 * @function renderSiteList
 * @param {string} seqSite - 건물 seq
 * @param {string} hwType - 장비 종류 (meter, dcu, lte)
 * @param dongName
 * @param hoName
 * @param manufacturer
 * @param mid
 * @param dcuId
 * @param lteSn
 * @param installLocation
 * @param seqCode - default : 12(세대부) else - 21(공용부)
 * @return {void}
 * */
function getHwListBySite(
    {
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
    }
) {

    console.log("seqSite : ", seqSite);

    // const bldType = getSelectedBldType();
    const bldType = 'APT';
    let apiUrl = `${API_URL}/infra/hardware/${hwType}?seqSite=${seqSite}&type=${bldType}&seqCode=${seqCode}`;

    if (dongName) apiUrl += `&dongName=${dongName}`;
    if (hoName) apiUrl += `&hoName=${hoName}`;
    if (manufacturer) apiUrl += `&manufacturer=${manufacturer}`;
    if (mid) apiUrl += `&mid=${mid}`;
    if (dcuId) apiUrl += `&dcuId=${dcuId}`;
    if (lteSn) apiUrl += `&lteSn=${lteSn}`;
    if (installLocation) apiUrl += `&installLocation=${installLocation}`;

    console.log(`get${hwType}List >>> `, apiUrl);


    // Promise로 감싸서 반환
    return $.ajax({
        url: apiUrl,
        method: 'GET'
    }).then((response) => {
        console.log(`get${hwType}List <<< `, response);

        return response; // 호출한 쪽에서 받을 수 있음
    }).catch(() => {
        alert('데이터를 불러오지 못했습니다.');
        return null;
    }).always(() => {
        // hideLhsModalElements();
    });


}


/**
 * 단지 셀렉트 박스 채우기
 * @param siteList
 */
function renderSiteList(siteList) {
    const $siteSelect = $('#siteSelect');
    $siteSelect.empty();

    $siteSelect.append('<option value="" disabled selected>선택하세요</option>');

    siteList.forEach(site => {
        $siteSelect.append('<option value="' + site.seqSite + '" data-siteCode="' + site.siteCode + '">' + site.name + ' (' + site.siteCode + ') ' + '</option>');
    })
}


// === 테이블 렌더링 함수 ===
function renderInstallationList(type, data) {


    const thead = document.querySelector('#installTable thead');
    const tbody = document.querySelector('#installTable tbody');
    const resultCount = document.getElementById('resultCount');
    const $dcuCnt = $('#dcuCnt')
    const $meterCnt = $('#meterCnt')

    thead.innerHTML = '';
    tbody.innerHTML = '';


    // === 전체 카운트 반영 ===
    $dcuCnt.text(cachedHwData.dcu.length);
    $meterCnt.text(cachedHwData.meter.length);


    // === 1헤더 변경 ===
    if (type === "dcu") {
        thead.innerHTML = `
            <tr>
                <th>설치 위치</th>
                <th>DCU ID</th>
            </tr>
        `;
    } else if (type === "meter") {
        thead.innerHTML = `
            <tr>
                <th>동</th>
                <th>호</th>
                <th>계량기 ID</th>
            </tr>
        `;
    }

    // === 데이터 로드 ===
    resultCount.textContent = data.length;

    data.forEach(item => {
        const targetPage = type === "dcu" ? "../install/dcuInstallList" : "../install/meterInstallList";
        const tr = document.createElement('tr');

        if (type === "dcu") {
            // DCU용

            // $dcuCnt.text(data.length);


            tr.innerHTML = `
                <td>${item.location}</td>
                <td>
                    <a href="${targetPage}?dcuId=${item.id}" class="dcu-link" data-id="${item.id}">
                        ${item.dcuId}
                    </a>
                </td>
            `;
        } else if (type === "meter") {
            // METER용
            // $meterCnt.text(data.length);

            tr.innerHTML = `
                <td>${item.dongName}</td>
                <td>${item.hoName}</td>
                <td>
                    <a href="${targetPage}?meterId=${item.mid}" class="meter-link" data-id="${item.mid}">
                        ${item.mid}
                    </a>
                </td>
            `;
        }

        tbody.appendChild(tr);
    });
}


/*동 Select*/
function getDongListBySite(seqSite) {
    const $dongSelect = $("#selectDongForMeter");
    const $hoSelect = $("#selectHoForMeter");

    const defaultOption = `<option selected value="">선택</option>`;
    $dongSelect.empty().append(defaultOption);
    $hoSelect.empty().append(defaultOption);

    if (!seqSite || seqSite === "null") {
        return;
    }

    const res = enernet.modules.api.getDongListBySite(seqSite);
    const dongList = res.list_dong || [];

    dongList.forEach(dong => {
        const option = `<option value="${dong.seq_dong}">${dong.dong_name}동</option>`;
        $dongSelect.append(option);
    });
}


function setCateGoryList(data) {

    const $select = $('#selectCommonAreaForMeter');
    $select.empty(); // 기존 옵션 제거

    // 기본 옵션 추가
    $select.append('<option value="">전체</option>');

    // 응답 데이터로 옵션 추가
    data.forEach(item => {
        const option = $('<option></option>')
            .val(item.seq_dong)
            .text(item.dong_name);
        $select.append(option);
    });

}

/**
 * 공용필터
 * */
function getCategoryListBySite(seqSite) {

    let dataToSend = {
        seqSite: seqSite,
        seqCode: 21
    };

    /*  $.ajax({
          type: "GET",
          url: "../smartAmi/api/getCommonAreaZoneListBySeqSite",
          data: dataToSend,
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          success: function (response) {
              setCateGoryList(response.data)
          },
          error: function (error) {
              console.error("Error updating :", error);
              alert("통신 오류")
          }
      });*/

}




/**
 * @function callBackForTypeSelectEvent
 * @return {void}
 * */
function callBackForTypeSelectEvent(seqSite, type) {

    getDongListBySite(seqSite);
    getCategoryListBySite(seqSite);


   /* switch (type) {
        case  "meter" :
            getDongListBySite(seqSite);
            getCategoryListBySite(seqSite);
            break;
        case "dcu" :
            getHwListBySite({seqSite, hwType: 'meter', subContent: true}).then(data => {
                console.log("받은 데이터:", data);
                setConnectedMeterForDcu(data);
            });
            break;

        default :
            break;
    }*/

}

function toggleFilter(type) {
    if (type === 'meter') {
        $('.filter-container').show();
    } else {
        $('.filter-container').hide();
    }
}

$(document).ready(function () {


    // === 액티브한 카드 타입 가져오기 ===
    function getCardDtype() {

        const activeSlide = swiper.slides[swiper.activeIndex];
        // dcu, meter 등
        return activeSlide.dataset.type;
    }


    $('#historyBack').on('click', function () {
        window.location.href = '../profile/settings';
    })


    const swiper = new Swiper('.hardware-meter', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        freeMode: true,
        on: {
            init() {
                // 기본은 첫 번째 카드 데이터 로드
                // renderInstallationList('DCU');
                console.log("✅ Swiper 초기화 완료");

                const activeSlide = this.slides[this.activeIndex];
                const type = activeSlide.dataset.type;
                console.log("초기 활성 카드 타입:", type);

                // ✅ 초기 상태에서도 필터 토글 적용
                toggleFilter(type);

                // 초기 렌더링 (데이터 있으면 바로 표시)
                if (cachedHwData[type]?.length > 0) {
                    renderInstallationList(type, cachedHwData[type]);
                }

            },
            slideChange: function () {
                const activeSlide = this.slides[this.activeIndex];
                const type = activeSlide.dataset.type;
                console.log(`➡️ 슬라이드 변경됨: ${type}`);

                toggleFilter(type);

                const seqSite = $('#siteSelect').val();
                console.log("seqSite : ", seqSite);
                console.log("활성 카드 타입:", type);

                if (!seqSite || seqSite === '') {
                    alert("단지를 선택하세요");
                    return;
                }

                // 이미 캐시된 데이터로 렌더링
                if (cachedHwData[type]?.length > 0) {
                    renderInstallationList(type, cachedHwData[type]);
                } else {
                    console.warn(`⚠️ ${type} 데이터가 아직 로드되지 않음`);
                }


            },
            touchStart() {
                console.log("👆 터치 시작");
            },
            touchEnd() {
                console.log("👉 터치 종료");
            }
        }
    });


    // === 클릭 시 상세 페이지로 이동 ===
    $(document).on('click', '.dcu-link', function (e) {
        e.preventDefault();

        const dcuId = $(this).data('id');
        const href = $(this).attr('href');

        console.log(`[DEBUG] 클릭한 ID: ${dcuId}`);

        // 실제 AJAX 호출은 상세 페이지에서 처리함
        window.location.href = href;
    });


   /* $("#siteSelect").on('change', function () {

        const seqSite = $(this).val();
        console.log("seqSite : ", seqSite);

        const activeSlide = swiper.slides[swiper.activeIndex];
        const type = activeSlide.dataset.type; // dcu, meter 등
        console.log("활성 카드 타입:", type);


        getHwListBySite({seqSite, hwType: type}).then(data => {
            console.log("받은 데이터:", data);

            // 현재 활성 슬라이드 가져오기
            callBackForTypeSelectEvent(seqSite, type);
            renderInstallationList(type, data)
        });


    });*/


    $("#siteSelect").on('change', async function () {
        const seqSite = $(this).val();
        console.log("✅ 단지 선택됨:", seqSite);

        if (!seqSite) {
            alert("단지를 선택하세요.");
            return;
        }

        const activeSlide = swiper.slides[swiper.activeIndex];
        const type = activeSlide.dataset.type; // 현재 활성 카드 (dcu/meter)
        console.log("활성 카드 타입:", type);

        // ✅ 두 가지 데이터를 병렬로 가져오기
        try {
            const [dcuData, meterData] = await Promise.all([
                getHwListBySite({ seqSite, hwType: "dcu" }),
                getHwListBySite({ seqSite, hwType: "meter" }),
            ]);

            cachedHwData = { dcu: dcuData || [], meter: meterData || [] };
            console.log("📦 DCU & Meter 데이터 캐싱 완료:", cachedHwData);

            // ✅ 현재 활성 카드에 맞게 렌더링
            renderInstallationList(type, cachedHwData[type]);
            callBackForTypeSelectEvent(seqSite, type);

        } catch (err) {
            console.error("데이터 로드 실패:", err);
            alert("데이터를 불러오지 못했습니다.");
        }
    });



    /*세대 필터 트리거*/
    $("#selectDongForMeter").on('change', function () {
        const $dongSelect = $(this);
        const $hoSelect = $("#selectHoForMeter");
        const $commonSearch = $('#commonAreaNameSearch');

        const seqSite = $('#siteSelect').val();
        const hwType = getCardDtype();

        const _seqDong = $dongSelect.val();

        const seqCode = 12 // 세대부 : 12

        $commonSearch.val(''); // 공용부 검색 초기화
        $hoSelect.empty(); // 호 셀렉트 초기화

        const appendDefaultOption = () => {
            $hoSelect.append(`<option selected value="">선택</option>`);
        };

        if (_seqDong && _seqDong !== '선택') {
            const dongName = $dongSelect.find('option:selected').text().replace('동', '').trim();
            getHwListBySite({seqSite, hwType, dongName, seqCode}).then(data => {
                console.log("받은 데이터:", data);
                renderInstallationList(hwType, data)
            });


            const _res = enernet.modules.api.getHoListByDong(_seqDong);
            const _hoList = _res.list_ho || [];

            appendDefaultOption();

            for (const ho of _hoList) {
                $hoSelect.append(`<option value="${ho.seq_ho}">${ho.ho_name}호</option>`);
            }
        } else {
            getHwListBySite({seqSite, hwType, dongName: '', seqCode}).then(data => {
                console.log("받은 데이터:", data);
                renderInstallationList(hwType, data)
            });
            appendDefaultOption();
        }
    });


    $("#selectHoForMeter").on('change', function () {
        const $hoSelect = $(this);
        const $commonSearch = $('#commonAreaNameSearch');

        const seqSite = $('#siteSelect').val();
        const hwType = getCardDtype();
        const _seqHo = $hoSelect.val();

        $commonSearch.val(''); // 공용부 검색 초기화

        const dongName = $('#selectDongForMeter').find('option:selected').text().replace('동', '').trim();
        const hoName = $hoSelect.find('option:selected').text().replace('호', '').trim();

        const finalHoName = (_seqHo && _seqHo !== '선택') ? hoName : '';

        getHwListBySite({seqSite, hwType, dongName, hoName: finalHoName}).then(data => {
            console.log("받은 데이터:", data);
            renderInstallationList(hwType, data)
        });

        if (!finalHoName) {
            const $hoSelect = $("#selectHoForMeter");
            $hoSelect.empty().append(`<option selected value="">선택</option>`);
        }
    });


    getSiteList('apt')


});