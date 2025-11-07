$(document).ready(function () {

    // === 샘플 데이터 ===
    const sampleData = {
        "DCU": [
            {location: "1동 주차장", id: "A0007F0001"},
            {location: "2동 지하주차장", id: "A0007F0002"},
            {location: "3동 옥상", id: "A0007F0003"},
        ],
        "Meter": [
            {dong: "101동", ho: "101호", id: "901900011112"},
            {dong: "101동", ho: "102호", id: "901900011113"},
            {dong: "102동", ho: "103호", id: "901900011114"},
            {dong: "102동", ho: "102호", id: "901900011111"},
        ]
    };

    // === 테이블 렌더링 함수 ===
    function renderInstallationList(type) {


        const thead = document.querySelector('#installTable thead');
        const tbody = document.querySelector('#installTable tbody');
        const resultCount = document.getElementById('resultCount');

        thead.innerHTML = '';
        tbody.innerHTML = '';


        // === 1헤더 변경 ===
        if (type === "DCU") {
            thead.innerHTML = `
            <tr>
                <th>설치 위치</th>
                <th>DCU ID</th>
            </tr>
        `;
        } else if (type === "Meter") {
            thead.innerHTML = `
            <tr>
                <th>동</th>
                <th>호</th>
                <th>계량기 ID</th>
            </tr>
        `;
        }

        // === 데이터 로드 ===
        const data = sampleData[type] || [];
        resultCount.textContent = data.length;

        data.forEach(item => {
            const targetPage = type === "DCU" ? "../install/dcuInstallList" : "../install/meterInstallList";
            const tr = document.createElement('tr');

            if (type === "DCU") {
                // DCU용
                tr.innerHTML = `
                <td>${item.location}</td>
                <td>
                    <a href="${targetPage}?dcuId=${item.id}" class="dcu-link" data-id="${item.id}">
                        ${item.id}
                    </a>
                </td>
            `;
            } else if (type === "Meter") {
                // METER용
                tr.innerHTML = `
                <td>${item.dong}</td>
                <td>${item.ho}</td>
                <td>
                    <a href="${targetPage}?meterId=${item.id}" class="meter-link" data-id="${item.id}">
                        ${item.id}
                    </a>
                </td>
            `;
            }

            tbody.appendChild(tr);
        });
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
                renderInstallationList('DCU');
                console.log("✅ Swiper 초기화 완료");

            },
            slideChange: function () {
                const activeSlide = this.slides[this.activeIndex];
                const type = activeSlide.dataset.type;
                console.log(`➡️ 슬라이드 변경됨: ${type}`);
                renderInstallationList(type);
                /* const activeIndex = this.activeIndex;
                 console.log("현재 인덱스:", activeIndex);
                 // ✅ 스와이프 시 AJAX로 데이터 호출
                 fetch(`/api/hardware/status?index=${activeIndex}`)
                     .then(res => res.json())
                     .then(data => {
                         console.log('새 데이터:', data);
                         // 여기에 DOM 업데이트 로직 추가
                     });*/
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

});