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

    const maNVList = document.getElementById('maNhanVien').value.trim().split('\n').map(s => s.trim());
    const hoTenList = document.getElementById('hoTen').value.trim().split('\n').map(s => s.trim());
    const idHisList = document.getElementById('idHis').value.trim().split('\n').map(s => s.trim());
    const cccdList = document.getElementById('cccd').value.trim().split('\n').map(s => s.trim());

    const fileNames = Array.from(files).map(f => f.name.toLowerCase());

    let resultHTML = `
        <table class="table table-bordered table-sm">
            <thead class="table-light">
                <tr>
                    <th>Mã NV</th>
                    <th>Họ tên</th>
                    <th>ID HIS</th>
                    <th>CCCD</th>
                    <th>Ảnh</th>
                </tr>
            </thead>
            <tbody>
    `;

    const maxLen = Math.max(maNVList.length, hoTenList.length, idHisList.length, cccdList.length);

    for (let i = 0; i < maxLen; i++) {
        const maNV = maNVList[i] || '';
        const hoTen = hoTenList[i] || '';
        const idHis = idHisList[i] || '';
        const cccd = cccdList[i] || '';

        let imgCell = `<span class="text-danger">Không tìm thấy</span>`;
        if (cccd) {
            const match = fileNames.find(name =>
                name === `${cccd}.png`.toLowerCase() || name === `${cccd}.jpg`.toLowerCase()
            );
            if (match) {
                const fileObj = Array.from(files).find(f => f.name.toLowerCase() === match);
                const imgURL = URL.createObjectURL(fileObj);
                imgCell = `<a href="${imgURL}" target="_blank">${match}</a> <img src="${imgURL}" alt="${cccd}" style="height:40px;">`;
            }
        }

        resultHTML += `
            <tr>
                <td>${maNV}</td>
                <td>${hoTen}</td>
                <td>${idHis}</td>
                <td>${cccd}</td>
                <td>${imgCell}</td>
            </tr>
        `;
    }

    resultHTML += `</tbody></table>`;
    document.getElementById('result-text').innerHTML = resultHTML;
});

function printResult() {
    // Lưu lại nội dung gốc của trang
    let originalContent = document.body.innerHTML;

    // Lấy nội dung cần in
    let printContent = document.getElementById('result-text').innerHTML;

    // Thay nội dung body bằng nội dung cần in
    document.body.innerHTML = `
        <html>
        <head>
            <title>In toàn bộ kết quả</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                pre { white-space: pre-wrap; word-wrap: break-word; }
            </style>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
    `;

    // Gọi lệnh in
    window.print();

    // Khôi phục lại nội dung gốc
    document.body.innerHTML = originalContent;
}


document.getElementById('folderInput').addEventListener('change', function () {
    let count = this.files.length;
    document.getElementById('folderCount').textContent = count ? `${count} file ảnh ký được chọn` : '';
});

// document.getElementById('exInput').addEventListener('change', function() {
//     let name = this.files.length ? this.files[0].name : '';
//     document.getElementById('fileName').textContent = name;
// });

function exportData() {
    const data = {
        maNhanVien: document.getElementById('maNhanVien').value.trim(),
        cccd: document.getElementById('cccd').value.trim(),
        idHis: document.getElementById('idHis').value.trim(),
        hoTen: document.getElementById('hoTen').value.trim()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "du_lieu_nhap.json";
    a.click();
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            document.getElementById('maNhanVien').value = data.maNhanVien || "";
            document.getElementById('cccd').value = data.cccd || "";
            document.getElementById('idHis').value = data.idHis || "";
            document.getElementById('hoTen').value = data.hoTen || "";
            updateReview();
        } catch (err) {
            alert("File không hợp lệ!");
        }
    };
    reader.readAsText(file);
}


[maNVInput, cccdInput, idHisInput, hoTenInput].forEach(input => {
    input.addEventListener('input', updateReview);
});
