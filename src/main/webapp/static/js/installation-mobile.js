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
