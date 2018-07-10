var zone = document.getElementById('select-zone');
var detail = document.querySelector('.detail');
var counter = document.getElementById('counter');

var zoneData = ["全區", "中正區", "大同區", "中山區", "松山區", "大安區", "萬華區", "信義區", "士林區", "北投區", "內湖區", "南港區", "文山區"];
var zoneLen = zoneData.length;
var zoneStr = '';
    zoneData.sort();
    for(let i=0; i<zoneLen; i++){
      if(i==0){
        zoneStr = '<option value="' + zoneData[i] + '">-請選擇行政區-</option>';
      }
      zoneStr += '<option value="' + zoneData[i] + '">' + zoneData[i] + '</option>';
    }
    zone.innerHTML = zoneStr;


// 向伺服器要資料、readyState=4後顯示在網頁上
function getData(selectZone) {
  var xhr = new XMLHttpRequest();
  xhr.open('get', 'https://tpeoc.blob.core.windows.net/blobfs/GetDisasterSummary.json', true);
  xhr.send(null);
  

  xhr.onload = function () {
    var jsonData = JSON.parse(xhr.responseText);
    var jsonDataLen = jsonData.length;
    var number = 0;
    counter.textContent = jsonDataLen;
    for (let i = 0; i < jsonDataLen; i++){
      if (jsonData[i].CaseLocationDistrict == selectZone){
        number++;
        detail.innerHTML +=`
        <tr>
          <th>${number}</th>
          <th>${jsonData[i].CaseTime}</th>
          <th>${jsonData[i].CaseLocationDistrict}</th>
          <th>${jsonData[i].CaseLocationDescription}</th>
          <th>${jsonData[i].CaseDescription}</th>
        </tr>`;
      } else {
        number++;
        detail.innerHTML += `
        <tr>
          <th>${number}</th>
          <th>${jsonData[i].CaseTime}</th>
          <th>${jsonData[i].CaseLocationDistrict}</th>
          <th>${jsonData[i].CaseLocationDescription}</th>
          <th>${jsonData[i].CaseDescription}</th>
        </tr>`;
      }
    }
  }
}


// selector 事件
function filterData(){
  var selectZone = zone.value;
  detail.innerHTML = ''; // 清除先前顯示的資料
  getData(selectZone);
}

zone.addEventListener('change', filterData,false);