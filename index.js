const maNVInput = document.getElementById('maNhanVien');
const cccdInput = document.getElementById('cccd');
const idHisInput = document.getElementById('idHis');
const hoTenInput = document.getElementById('hoTen');
const reviewTableBody = document.querySelector('#reviewTable tbody');

function updateReview() {
    const maNVList = maNVInput.value.split('\n').map(s => s.trim()).filter(s => s);
    const cccdList = cccdInput.value.split('\n').map(s => s.trim()).filter(s => s);
    const idHisList = idHisInput.value.split('\n').map(s => s.trim()).filter(s => s);
    const hoTenList = hoTenInput.value.split('\n').map(s => s.trim()).filter(s => s);

    // Cập nhật badge
    document.getElementById('countMaNV').textContent = `Mã NV: ${maNVList.length}`;
    document.getElementById('countCCCD').textContent = `CCCD: ${cccdList.length}`;
    document.getElementById('countIDHIS').textContent = `ID HIS: ${idHisList.length}`;
    document.getElementById('countHoTen').textContent = `Họ tên: ${hoTenList.length}`;

    let formatErrorCount = 0;
    let invalidCCCDCount = 0;

    const maxLen = Math.max(maNVList.length, cccdList.length, idHisList.length, hoTenList.length);

    reviewTableBody.innerHTML = '';

    for (let i = 0; i < maxLen; i++) {
        const row = document.createElement('tr');

        const maNV = maNVList[i] || '';
        const cccd = cccdList[i] || '';
        const idHis = idHisList[i] || '';
        const hoTen = hoTenList[i] || '';

        let rowError = false;

        // Mã NV
        const cellMaNV = document.createElement('td');
        cellMaNV.textContent = maNV;
        if (!maNV) {
            cellMaNV.classList.add('table-danger');
            rowError = true;
        }
        row.appendChild(cellMaNV);

        // CCCD
        const cellCCCD = document.createElement('td');
        cellCCCD.textContent = cccd;
        if (!cccd) {
            cellCCCD.classList.add('table-danger');
            rowError = true;
        } else if (cccd.length !== 12) {
            cellCCCD.classList.add('table-warning');
            invalidCCCDCount++;
            rowError = true;
        }
        row.appendChild(cellCCCD);

        // ID HIS
        const cellIDHIS = document.createElement('td');
        cellIDHIS.textContent = idHis;
        if (!idHis) {
            cellIDHIS.classList.add('table-danger');
            rowError = true;
        }
        row.appendChild(cellIDHIS);

        // Họ tên
        const cellHoTen = document.createElement('td');
        cellHoTen.textContent = hoTen;
        if (!hoTen) {
            cellHoTen.classList.add('table-danger');
            rowError = true;
        }
        row.appendChild(cellHoTen);

        if (rowError) {
            formatErrorCount++;
            row.classList.add('table-danger');
        }

        reviewTableBody.appendChild(row);
    }

    document.getElementById('countMismatch').textContent = `Lỗi Mapping: ${formatErrorCount}`;
    document.getElementById('countCCCDInvalid').textContent = `CCCD sai định dạng: ${invalidCCCDCount}`;
}

document.getElementById('btnCheck').addEventListener('click', () => {
    const files = document.getElementById('folderInput').files;
    const cccdList = document.getElementById('cccd').value.trim().split('\n').map(s => s.trim());
    const fileNames = Array.from(files).map(f => f.name.toLowerCase());

    let resultHTML = '<ul>';
    cccdList.forEach(cccd => {
        const match = fileNames.find(name => name === `${cccd}.png`.toLowerCase() || name === `${cccd}.jpg`.toLowerCase());
        if (match) {
            const fileObj = Array.from(files).find(f => f.name.toLowerCase() === match);
            const imgURL = URL.createObjectURL(fileObj);
            resultHTML += `<li>${cccd}: <a href="${imgURL}" target="_blank">${match}</a> <img src="${imgURL}" alt="${cccd}" style="height:40px;"></li>`;
        } else {
            resultHTML += `<li>${cccd}: <span class="text-danger">Không tìm thấy</span></li>`;
        }
    });
    resultHTML += '</ul>';
    document.getElementById('result-text').innerHTML = resultHTML;
});

document.getElementById('folderInput').addEventListener('change', function () {
    let count = this.files.length;
    document.getElementById('folderCount').textContent = count ? `${count} file ảnh ký được chọn` : '';
});

// document.getElementById('exInput').addEventListener('change', function() {
//     let name = this.files.length ? this.files[0].name : '';
//     document.getElementById('fileName').textContent = name;
// });


[maNVInput, cccdInput, idHisInput, hoTenInput].forEach(input => {
    input.addEventListener('input', updateReview);
});
