var zone = document.getElementById('select-zone');
var type = document.getElementById('select-type');
var complete = document.getElementById('select-complete');

var counter = document.getElementById('counter');
var showZone = document.getElementById('zone');

var detail = document.querySelector('.detail');  // tbody
var counterZone = document.getElementById('counter-zone');
var mainWrap = document.getElementById('mainWrap');

var pagination = document.getElementById('pagination');
var jsonData = {};
var jsonDataLen = new Number;

// 資料撈進來自動生成選單內的選項
var selectItem = [];
var selectItemLen = new Number;
var selectItemType = [];
var selectItemComplete = [];

// 存條件符合的資料
var data = [];

// 分頁元件
var prevBtn = `<li class="page-item">
                  <a class="page-link icon-prev" href="#" aria-label="Previous" data-num="-1"></a>
                </li>`;

var nextBtn = `<li class="page-item">
                  <a class="page-link icon-next" href="#" aria-label="Next" data-num="1"></a>
                </li>`;

// 向伺服器要資料、readyState=4後顯示在網頁上
var xhr = new XMLHttpRequest();
xhr.open('get', 'https://next.json-generator.com/api/json/get/Ek86hdRMr', true);
xhr.send(null);
//原資料來源：台北市消防局 https://tpeoc.blob.core.windows.net/blobfs/GetDisasterSummary.json


callAjax();

function callAjax(){
  xhr.onload = function () {
    jsonData = JSON.parse(xhr.responseText);
    data = jsonData;
    jsonDataLen = jsonData.length;
    counter.textContent = jsonDataLen +'件'; // 資料總筆數

    // 若載入的時候已經有產生選單之後就不再做
    if (selectItemLen < 1) {
      renderOption(jsonData);
    }
    // 渲染內容
    renderContent(1); // 參數 => 第1頁
    initMap();
  }
}



// 將撈到的資料，判斷有哪些地區，並建立成下拉選單的選項
// 渲染下拉選單
function renderOption(option) {
  for (let i = 0; i < option.length; i++) {
    if (selectItem.indexOf(option[i].CaseLocationDistrict) == -1 ) {
      selectItem.push(option[i].CaseLocationDistrict);
    }
    if (selectItemType.indexOf(option[i].PName) == -1) {
      selectItemType.push(option[i].PName);
    }
  }

  
  // 陣列內資料重新排序
  selectItem.sort();  
  var optionLen = selectItem.length;
  var optionTypeLen  = selectItemType.length;
  // var optionCompleteLen  = selectItemComplete.length;
  var zoneStr = '';
  var typeStr = '';

  // 把'其他'這個選項排序到最後
  for (let i = 0; i < optionLen; i++) {
    if (selectItem[i] === '其他') {
      var index = i;
      var option = selectItem[i];
    }
  }
  selectItem.splice(index, 1);
  selectItem.push(option);


  // 將selectItem內的資料渲染到option內
  for (let i = 0; i < optionLen; i++) {
    if (i == 0) {
      zoneStr = '<option selected disabled="disabled" >-請選擇行政區-</option>';
    }
    zoneStr += '<option value="' + selectItem[i] + '">' + selectItem[i] + '</option>';
  }
  zone.innerHTML = zoneStr;

  for (let i = 0; i < optionTypeLen; i++) {
    if (i == 0) {
      typeStr = '<option selected disabled="disabled">-尚未啟用-</option>';
    }
    typeStr += '<option value="' + selectItemType[i] + '">' + selectItemType[i] + '</option>';
  }
  type.innerHTML = typeStr;
  complete.innerHTML = `<option selected disabled="disabled">-尚未啟用-</option>
                        <option value="false">未處理</option >
                        <option value="true">已處理</option >`;
}



// 目前頁數、總頁數、總共幾筆、要前往的頁數
var currentPage, totalPage, totalItem;
// 一頁10筆資料
var perPage = 20;

function renderContent(goPage){

  totalItem = data.length;
  // 計算總共有幾頁(使用無條件進位)
  totalPage = Math.ceil(totalItem / perPage);

  // 起始資料index,結束資料index
  var startItem;
  var endItem;

  // 如果是最後一頁要判斷抓取幾筆資料，其餘都一定是perPage指定的筆數
  if (goPage == totalPage) {
    var minusItem = totalItem - (totalPage * perPage);

    if (minusItem == 0) { //判斷最後一頁是幾筆用 = 0 就是10筆
      startItem = ((totalPage - 1) * perPage);
      endItem = totalItem;
    } else { // 小於10筆
      startItem = ((totalPage - 1) * perPage);
      endItem = totalItem;
    }
  } else {
    startItem = perPage * (goPage - 1);
    endItem = (goPage * perPage);
  }

  // 資料渲染到畫面
  detail.innerHTML = ''; // 清除先前顯示的資料
  for(let i = startItem; i<endItem; i++){

    // 先處理抓到的資料
    if (data[i].CaseComplete) {
      var badge = `<span class="badge badge-pill badge-success">已處理</span>`;
    } else {
      var badge = `<span class="badge badge-pill badge-danger">待處理</span>`;
    }
    var timeData = (data[i].CaseTime).split('T');

    startItem++;
    detail.innerHTML += `<tr>
      <td>${startItem}</td>
      <td class="pill">${badge}</td>
      <td><div class="td-display">${timeData[0]}</div><div class="td-display">${timeData[1]}</div></td>
      <td>${data[i].PName}</td>
      <td>${data[i].CaseLocationDistrict}</td>
      <td>${data[i].CaseLocationDescription}</td>
      <td>${data[i].CaseDescription}</td>
    </tr>`;
  }


  // 紀錄目前頁數用來點選上下頁用
  currentPage = goPage;
  // 渲染頁碼
  renderPage(totalPage);
}


// 渲染有幾頁用
function renderPage(totalPage){
  // 若資料不到第2頁，清除頁碼DOM
  if (totalPage <= 1) { 
    pagination.innerHTML = '';
  } else if (totalPage > 1) {
    pagination.innerHTML = '';
    var pageBtn = '';
    for (let i = 0; i < totalPage; i++) {
      pageBtn += `<li class="page-item"><a class="page-link" href="#" data-page="${(i + 1)}">${(i + 1)}</a></li>`;
    }
    pagination.innerHTML = prevBtn + pageBtn + nextBtn;
  }
}



// 畫面滾至第一筆資料的位置
function scrollUp(){
  mainWrap.scrollTo(0, window.scrollY + 200);  // scrollTo(x,y)
}



// 重新將查詢的資料放入到新的 array
function queryArea(zoneName) {
   // 清空 
  data = [];
  for (let i = 0; i < jsonDataLen; i++){
    if (jsonData[i].CaseLocationDistrict == zoneName) {
      data.push(jsonData[i]);
    }
  }
  showZone.textContent = zoneName;
  counterZone.textContent = data.length + '件';
}


// 監聽 select 變動
zone.addEventListener('change', function(e){
  e.preventDefault();
  queryArea(e.target.value);
  renderContent(1);
  initMap();
}, false);


// 頁次偵聽
pagination.addEventListener('click', function(e){
  e.preventDefault();
  var goPage;
  var prevNext = Number(e.target.dataset.num);
  
  // 當有按下下一頁或上頁
  if (prevNext == -1 || prevNext == 1) {
    if (prevNext == -1) {
      if (currentPage + prevNext < 1) {
        return false;
      }
      goPage = currentPage - 1;
    } else if (prevNext == 1) {
      if (currentPage + prevNext > totalPage) {
        return false;
      }
      goPage = currentPage + 1;
    }
  } else if (e.target.dataset.page > 0) {
    goPage = Number(e.target.dataset.page); //Number() 把對象的值轉換為數字
    if (currentPage == goPage){
      return;
    }
  } else {
    return;
  }
  renderContent(goPage);
  scrollUp();
},false);



/*===================================================================*/
/* Google Map
/*===================================================================*/
var map;

function initMap() {
  // 選取地圖DOM & center 中心點 & zoom 縮放層級 & styles 地圖樣式
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 25.0479, lng: 121.555 },
    zoom: 13,
    styles: [
      {
        "featureType": "landscape.natural",
        "stylers": [
          {
            "color": "#bcddff"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#5fb3ff"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "stylers": [
          {
            "color": "#ebf4ff"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ebf4ff"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#93c8ff"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#c7e2ff"
          }
        ]
      },
      {
        "featureType": "transit.station.airport",
        "elementType": "geometry",
        "stylers": [
          {
            "saturation": 100
          },
          {
            "gamma": 0.82
          },
          {
            "hue": "#0088ff"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#1673cb"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.icon",
        "stylers": [
          {
            "saturation": 58
          },
          {
            "hue": "#006eff"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#4797e0"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#209ee1"
          },
          {
            "lightness": 49
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#83befc"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#3ea3ff"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "saturation": 86
          },
          {
            "hue": "#0077ff"
          },
          {
            "weight": 0.8
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "hue": "#0066ff"
          },
          {
            "weight": 1.9
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "hue": "#0077ff"
          },
          {
            "saturation": -7
          },
          {
            "lightness": 24
          }
        ]
      }
    ]
  });

  
  // 標記顯示
  var markerIcon;
  for (let i = 0; i < totalItem; i++){
    if (data[i].CaseComplete) {
      markerIcon = 'https://hsinny.github.io/06_2-Typhoon_API/images/icon-complete.svg';
    } else {
      markerIcon = 'https://hsinny.github.io/06_2-Typhoon_API/images/icon-warning.svg';
    }

    var markerObj = { 
      position: { lat: data[i].Wgs84Y, lng: data[i].Wgs84X},
      map: map, // 要執行在哪張地圖上
      // label: data[i].CaseDescription,
      icon: markerIcon
      // title: data[i].CaseDescription
    };
    new google.maps.Marker(markerObj);
  }
}



/*===================================================================*/
/* jQuery
/*===================================================================*/

$(document).ready(function () {

  /*========================================================*/
  /* GA Event Tracking
  /*========================================================*/

  $('#map').click(function () {
    gtag('event', 'map', {
      'event_category': 'click',
      'event_label': 'map'
    });
  });

  $('#select-zone').click(function () {
    gtag('event', 'select', {
      'event_category': 'click',
      'event_label': 'select'
    });
  });

  $('#select-zone').change(function () {
    gtag('event', 'dropdownMenu', {
      'event_category': 'click',
      'event_label': 'dropdownMenu'
    });
  });
 
  $('#pagination').click(function () {
    gtag('event', 'page', {
      'event_category': 'click',
      'event_label': 'page'
    });
  });

  $('.footer-info-phone').click(function () {
    gtag('event', 'phone', {
      'event_category': 'click',
      'event_label': 'phone'
    });
  });

});