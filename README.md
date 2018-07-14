# Typhoon API 颱風防災資訊平台

### Demo：
https://hsinny.github.io/06_2-Typhoon_API/

### 使用者故事：
為即時獲得颱風資訊，一個方便台灣市民得知目前災情資訊的平台


### 基本功能：
1. 下拉式選單切換市區，顯示各區災情明細
1. 介接 Google Map API，顯示全部災情位置


### 介接API：
[臺北市政府消防局](https://taipeicity.github.io/eoc_119/)


### 前端介面：
![](https://i.imgur.com/uTMlVnF.jpg)

* 地圖的標記顯示為主要重點，讓使用者知道目前哪區的災情較嚴重，未來加上 Hover 地圖標記可以顯示該點災情的描述。

* 次要重點為災情處理狀態，透過顏色標籤，在瀏覽上可快速注意到未處理的災情還有哪些，對應到地圖標記上做出區分。

* 災情回報和諮詢電話讓有需要的人可以很快找到並撥打，所以設計讓它一直顯示在視窗底部。

### 優化項目：
#### Table Responsive 
表格為這網站重要的瀏覽資訊，考量要在手機上也能讓使用者友善瀏覽，在 RWD 加上讓表格不顯示 X 軸，能垂直上下瀏覽的作法；改善一般網站表格在手機上，使用者需左右滑動才能瀏覽整個表格內容的不便。

![](https://i.imgur.com/ZNUEGUh.jpg)


### 使用技術：
###### `JavaScript` `Ajax` `Google Map API` `BootStrap4` `Sass` `HTML5` `RWD` `GA`
