/* 지도 확대/축소 레벨 설정 */
const ZOOMIN = 4;
const ZOOMOUT = 9;

/* 날씨 정보 데이터 받아오는 부분 */
const API_KEY = "341611f95d76874b2e5d207c40a6b07f"

function onGeoSuccess(position) {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            // 날씨
            const weather = document.querySelector(".weather-now");
            // 날씨 아이콘
            const weatherIcon = document.querySelector(".weather-icon");
            // 온도
            const temp = document.querySelector(".temp-now");
            // 체감 온도
            const tempFeel = document.querySelector(".temp-feel");
            // 습도
            const humid = document.querySelector(".humid");
            // 풍속
            const wind = document.querySelector(".wind");
            // 위치(동 이름)
            const location = document.querySelector(".location-name");

            location.innerText = data.name;

            temp.innerText = `${parseInt(data.main.temp)}°`;
            tempFeel.innerText = `체감온도 ${parseInt(data.main.feels_like)}°`;

            const weatherIconCode = data.weather[0].icon;
            weatherIcon.src = `image/weather-icon/${weatherIconCode}.png`;
            weather.innerText = data.weather[0].main;

            humid.innerText = `습도 ${data.main.humidity}%`;
            wind.innerText = `풍속 ${data.wind.speed}m/s`;

        })
}

function onGeoError() {
    alert("Error: 위치 추적을 허용해 주세요.");
}


/*북마크 기능 */
// function toggleBookmark() { //북마크 버튼 클릭 시 아이콘 효과
//     const bottomBox = document.querySelector('.bottom');
//     const bookmarkIcon = document.querySelector('.fa-bookmark');
//     bottomBox.classList.toggle('active');
//     bottomBox.classList.remove('initial');
//     bookmarkIcon.classList.toggle('active');
// }
// 북마크 버튼 클릭 시 화면 하단 bottom 박스에 bookmark.html 내용 fetch
// document.querySelector('.bookmark-btn').addEventListener('click', function() {
//     fetch('bookmark.html')
//       .then(response => response.text())
//       .then(data => {
//         //초기화(이전에 추가된 요소 제거)
//         const elementToDelete = document.querySelector('.bookmark-screen');
//         if (elementToDelete) {
//         elementToDelete.remove();
//         }
//         // 가져온 HTML을 파싱하여 DOM으로 변환
//         const parser = new DOMParser();
//         const htmlDocument = parser.parseFromString(data, 'text/html');
//         // 원하는 요소를 가져오기 위해 해당 선택자로 요소 추출
//         const extractedElement = htmlDocument.querySelector('.bookmark-screen');
//         // 추출한 요소 삽입
//         document.querySelector('.bottom').appendChild(extractedElement);
//       })
//       .catch(error => {
//         console.error('Error.', error);
//       });
//   });

/* bottom-bar experimental */
function toggleBookmark() {
  // 아이콘 효과
  const bookmarkIcon = document.querySelector('.fa-bookmark');
  bookmarkIcon.classList.toggle('active');
}

function toggleWeather() {
  // 아이콘 효과
  const weatherIcon = document.querySelector('.fa-cloud');
  weatherIcon.classList.toggle('active');
}

// 날씨 버튼 클릭 시 날씨 show
document.querySelector('.weather-btn').addEventListener('click', function() {
  // 아이콘 효과
  toggleWeather();
  
  const bottomBar = document.querySelector('.bottom-bar');
  const content = document.querySelector('.content');
  const weatherIcon = document.querySelector('.fa-cloud');
  const bookmarkIcon = document.querySelector('.fa-bookmark');

  bottomBar.removeAttribute('hidden');

  if(weatherIcon.classList.contains('active')) {
    // 하단 창 보이게 하기(slide-up)
    bottomBar.classList.remove('hide-bottom-bar');
    // content에 날씨 정보 띄울 공간 생성
    content.innerHTML = `
      <div class="home-column home-weather">
      <div class="location">
          <i class="fa-solid fa-location-arrow"></i>
          <span class="location-name"></span>
      </div>

      <span class="temp-now"></span>
      <span class="temp-feel"></span>

      <img class="weather-icon" />
      <span class="weather-now"></span>

      <span class="humid"></span>
      <span class="wind"></span>
      </div>`;
    // content에 날씨 정보 넣기
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError); 
    
    // 북마크active된 상태에서 클릭되었을 때 -> 북마크 아이콘 active 해제
    if(bookmarkIcon.classList.contains('active')){ 
      bookmarkIcon.classList.remove('active');
    }
  }
  else { // 날씨버튼 클릭되었으나 active아닐때, 
    // 하단 창 내리기(slide-down)
    weatherIcon.classList.remove('active');
    bottomBar.classList.add("hide-bottom-bar");
  }
});

// 북마크 버튼 클릭 시 북마크 show
document.querySelector('.bookmark-btn').addEventListener('click', function() {
  // 아이콘 효과
  toggleBookmark();
  
  const bottomBar = document.querySelector('.bottom-bar');
  const content = document.querySelector('.content');
  const weatherIcon = document.querySelector('.fa-cloud');
  const bookmarkIcon = document.querySelector('.fa-bookmark')

  bottomBar.removeAttribute('hidden');

  if(bookmarkIcon.classList.contains('active')) {
    // 하단 창 보이게 하기(slide-up)
    bottomBar.classList.remove('hide-bottom-bar');
    // 기존 content 내용 삭제
    content.innerHTML=`HELLO`;
    // 하단 창에 북마크 show
    // 북마크 버튼 클릭 시 화면 하단 bottom 박스에 bookmark.html 내용 fetch
    fetch('bookmark.html')
      .then(response => response.text())
      .then(data => {
        // 가져온 HTML을 파싱하여 DOM으로 변환
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(data, 'text/html');
        // 원하는 요소를 가져오기 위해 해당 선택자로 요소 추출
        const extractedElement = htmlDocument.querySelector('.bookmark-screen');
        // 추출한 요소 삽입
        content.innerHTML= `extractedElement`;
        console.log(extractedElement);
      })
      .catch(error => {
        console.error('Error.', error);
      });
      
    if(weatherIcon.classList.contains('active')){ // 날씨active된 상태에서 클릭되었을 때 -> 날씨 아이콘 active 해제
      weatherIcon.classList.remove('active');
    }
  }
  else { // 북마크버튼 클릭되었으나 active아닐때, 
    // 하단 창 내리기(slide-down)
    bookmarkIcon.classList.remove('active');
    bottomBar.classList.add("hide-bottom-bar");
  }
});

////////////////////////////////////////////////////////////////////


/* 현재 위치에 마크업 및 포커스 기능*/
let marker = null;
function showLocation() {
  // 위치 버튼 클릭 시 아이콘 효과
  const locationIcon = document.querySelector('.fa-location-crosshairs');
  locationIcon.classList.toggle('active');
  const locationIconClicked = locationIcon.classList.contains('active');

  // HTML5의 geolocation으로 사용할 수 있는지 확인합니다
  if (navigator.geolocation) {
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {
        
        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도
        
        var locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다       
        // 마커를 표시합니다
        displayMarker(locPosition);
      });
    
  } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치를 설정합니다
    var locPosition = new kakao.maps.LatLng(37.566826, 126.9786567)
    displayMarker(locPosition);
  }
  //지도 위 마커 표시 함수
  function displayMarker(locPosition) { 
    // 재클릭시 마크업 제거 및 지도 중심 좌표 서울 중심좌표로 변경
    if(marker) { 
      var seoulCenter = new kakao.maps.LatLng(37.566826, 126.9786567);
      map.setCenter(seoulCenter);
      map.setLevel(ZOOMOUT);
      marker.setMap(null);
      marker = null;
      return;
    }
    // 현위치에 마커 생성
    marker = new kakao.maps.Marker({  
      map: map, 
      position: locPosition
    });
    // 지도 중심좌표를 현위치로 변경
    map.setCenter(locPosition);
    map.setLevel(ZOOMIN);
  }
}

/* 1시간 간격의 시간 값 세팅 함수*/
function calculateTime() {
  let currentTime = new Date();
  let hour = currentTime.getHours();
  let minute = currentTime.getMinutes();
  let formattedTime;
  const timeNavBtns = document.querySelectorAll('.time-nav__btn');
  
  // 24시간 표시법 적용
  for (let i = 0; i < timeNavBtns.length; i++) {
    let calculateHour = hour+i;
    if(calculateHour>=24) {
      calculateHour-=24;
    }
    // 시간값 00:00 형식으로 변환
    calculateHour = calculateHour.toString().padStart(2, '0');
    minute = minute.toString().padStart(2, '0');
    formattedTime=  calculateHour + ':' + minute;
    // 버튼의 시간 값 변경
    timeNavBtns[i].innerText = formattedTime;
  }
}
calculateTime();



