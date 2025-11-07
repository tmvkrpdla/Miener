// installation-mobile.js


const workerSelect = new Choices('#workerFilter', {
    searchEnabled: true,
    itemSelectText: '',
    position: 'bottom', // 드롭다운을 아래로 표시
});


function changeTab(tabName) {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tabName);
    window.location.search = params.toString();
}

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


$(document).ready(function () {

    // 페이지 진입 시 데이터 로드
    loadInstallationList();

    function loadInstallationList() {
        // 샘플 JSON 데이터 (나중에 실제 API URL로 변경)
        // $.ajax({
        //     url: contextPath + '/api/installation/list',
        //     type: 'GET',
        //     dataType: 'json',
        //     success: function (data) { renderInstallationList(data); },
        //     error: function () { alert('데이터를 불러오지 못했습니다.'); }
        // });

        // === 샘플 데이터 ===
        const sampleData = [
            {
                id: 1,
                installDate: "2025-07-02 10:21",
                worker: "김화경",
                region: "경기 · 수원",
                type: "계량기",
                complexName: "수원금곡LG빌리지",
                serial: "90190258125",
                serialFull: "9019000001(직전)",
                detailAddress: "303동 1302호"
            },
            {
                id: 2,
                installDate: "2025-07-02 09:35",
                worker: "김화경",
                region: "경기 · 수원",
                type: "DCU",
                complexName: "수원금곡LG빌리지",
                serial: "A0007F0033",
                serialFull: "A0007F0001(직전)",
                detailAddress: "303동 지하주차장 1-2라인"
            },
            {
                id: 3,
                installDate: "2025-07-01 17:59",
                worker: "이호성",
                region: "경남 · 창원",
                type: "계량기",
                complexName: "한림푸르지오",
                serial: "90537072365",
                serialFull: "9019111201(직전)",
                detailAddress: "중앙 어린이놀이터"
            }
        ];

        renderInstallationList(sampleData);
    }

    function renderInstallationList(list) {
        const $listContainer = $("#installationList");
        $listContainer.empty(); // 기존 데이터 초기화

        $("#resultCount").text(list.length);

        list.forEach(item => {
            const badgeClass = item.type === "계량기" ? "badge-meter" : "badge-dcu";
            const cardHtml = `
                <div class="card-item" onclick="location.href='installation/detail/${item.id}'">
                    <div class="top-row">
                        <span>${item.installDate} · ${item.worker} · ${item.region}</span>
                        <span class="${badgeClass}">${item.type}</span>
                    </div>
                    <div class="main-row">
                        <span class="name">${item.complexName}</span>
                        <span class="serial">${item.serial}</span>
                    </div>
                    <div class="bottom-row">
                        <div>${item.detailAddress}</div>
                        <div><small>${item.serialFull}</small></div>
                    </div>
                </div>
            `;
            $listContainer.append(cardHtml);
        });
    }

    $('#historyBack').on('click', function () {
        window.location.href = '../profile/settings';
    })
});