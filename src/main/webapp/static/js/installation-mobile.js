// installation-mobile.js

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