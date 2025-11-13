// 공유오피스 데이터
const offices = [
  {
    id: 1,
    name: "위워크 삼성점",
    location: "서울 강남구 삼성로 512",
    lat: 37.510374,
    lng: 127.058817,
    rating: 4.5,
    price: 350000,
    priceLabel: "월 ₩350,000~",
    image: "images/wework.jpeg",
    areaTag: "강남"
  },
  {
    id: 2,
    name: "패스트파이브 역삼 2호점",
    location: "서울 강남구 테헤란로 201",
    lat: 37.500328,
    lng: 127.035701,
    rating: 4.3,
    price: 300000,
    priceLabel: "월 ₩300,000~",
    image: "images/fast.jpeg",
    areaTag: "강남"
  },
  {
    id: 3,
    name: "로컬스페이스 홍대",
    location: "서울 마포구 양화로 135",
    lat: 37.556019,
    lng: 126.922134,
    rating: 4.7,
    price: 250000,
    priceLabel: "월 ₩250,000~",
    image: "images/local.jpeg",
    areaTag: "홍대"
  }
];

let map;
let markers = [];
let activeOffices = [...offices];
let currentModalOffice = null;
let currentRating = 0;

function initMap() {
  const container = document.getElementById("map");
  if (!container || !window.kakao) return;

  const options = {
    center: new kakao.maps.LatLng(37.55, 126.98),
    level: 6
  };

  map = new kakao.maps.Map(container, options);

  // 현재 위치로 센터 이동
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const locPosition = new kakao.maps.LatLng(lat, lng);

        map.setCenter(locPosition);

        const marker = new kakao.maps.Marker({
          map,
          position: locPosition
        });

        const infowindow = new kakao.maps.InfoWindow({
          content: `<div style="padding:5px;">📍 현재 위치</div>`
        });

        infowindow.open(map, marker);
      },
      () => {
        // 거부/에러 시 기본값 유지
      }
    );
  }

  renderMarkers(activeOffices);
}

function clearMarkers() {
  markers.forEach((m) => m.setMap(null));
  markers = [];
}

function renderMarkers(list) {
  if (!map || !window.kakao) return;
  clearMarkers();

  const bounds = new kakao.maps.LatLngBounds();

  list.forEach((office) => {
    const position = new kakao.maps.LatLng(office.lat, office.lng);
    const marker = new kakao.maps.Marker({
      map,
      position
    });

    const infowindow = new kakao.maps.InfoWindow({
      content: `
        <div style="padding:10px;font-size:13px;">
          <strong>${office.name}</strong><br/>
          ${office.priceLabel}<br/>
          ${office.location}
        </div>
      `
    });

    kakao.maps.event.addListener(marker, "click", () => {
      infowindow.open(map, marker);
    });

    markers.push(marker);
    bounds.extend(position);
  });

  if (list.length > 0) {
    map.setBounds(bounds);
  }
}

function renderOffices(list) {
  const container = document.getElementById("officeList");
  const countSpan = document.getElementById("officeCount");
  if (!container) return;

  container.innerHTML = "";

  if (countSpan) {
    countSpan.textContent = `총 ${list.length}개`;
  }

  if (list.length === 0) {
    container.innerHTML = `<p style="font-size:14px;color:#777;">검색 결과가 없습니다. 다른 키워드로 검색해 보세요.</p>`;
    return;
  }

  list.forEach((office) => {
    const card = document.createElement("article");
    card.className = "office-card";
    card.innerHTML = `
      <img src="${office.image}" alt="${office.name}" />
      <div class="office-info">
        <h3>${office.name}</h3>
        <div class="office-meta">
          <span>📍 ${office.location}</span>
          <span>💸 ${office.priceLabel}</span>
          <span>⭐ ${office.rating.toFixed(1)} / 5.0</span>
        </div>
        <div class="office-footer">
          <span class="tag-pill">#${office.areaTag}</span>
          <button class="btn-sm" data-id="${office.id}">상세 보기</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // 상세보기 버튼 클릭
  container.querySelectorAll(".btn-sm").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      const office = offices.find((o) => o.id === id);
      if (office) openModal(office);
    });
  });
}

function openModal(office) {
  currentModalOffice = office;
  const modal = document.getElementById("detailModal");
  const nameEl = document.getElementById("modalOfficeName");
  const locEl = document.getElementById("modalLocation");
  const priceEl = document.getElementById("modalPrice");
  const ratingEl = document.getElementById("modalRating");

  nameEl.textContent = office.name;
  locEl.textContent = `📍 ${office.location}`;
  priceEl.textContent = `💸 ${office.priceLabel}`;
  ratingEl.textContent = `⭐ ${office.rating.toFixed(1)} / 5.0`;

  // 별점 초기화
  currentRating = 0;
  updateStarUI();

  const reviewText = document.getElementById("reviewText");
  if (reviewText) reviewText.value = "";

  modal.classList.add("show");
}

function closeModal() {
  const modal = document.getElementById("detailModal");
  modal.classList.remove("show");
}

function updateStarUI() {
  const stars = document.querySelectorAll("#ratingStars span");
  stars.forEach((star) => {
    const value = Number(star.dataset.value);
    star.classList.toggle("active", value <= currentRating);
  });
}

function submitReservation() {
  if (!currentModalOffice) return;

  const dateInput = document.getElementById("reserveDate");
  const timeSelect = document.getElementById("reserveTime");
  const reviewText = document.getElementById("reviewText");

  const date = dateInput.value;
  const time = timeSelect.value;
  const review = reviewText.value.trim();

  if (!date) {
    alert("예약 날짜를 선택해 주세요.");
    return;
  }

  alert(
    `예약이 완료되었습니다! 🎉\n\n오피스: ${currentModalOffice.name}\n일시: ${date} ${time}\n별점: ${
      currentRating || "선택 안함"
    }\n리뷰: ${review || "작성 안함"}`
  );

  closeModal();
}

function applySearchAndSort() {
  const keyword = document.getElementById("searchInput").value.trim();
  const sortValue = document.getElementById("sortSelect").value;

  let filtered = offices.filter(
    (o) => o.name.includes(keyword) || o.location.includes(keyword) || o.areaTag.includes(keyword)
  );

  if (sortValue === "rating") {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  } else if (sortValue === "priceLow") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  }

  activeOffices = filtered;
  renderOffices(activeOffices);
  renderMarkers(activeOffices);
}

/* ===== 이벤트 연결 ===== */
document.addEventListener("DOMContentLoaded", () => {
  // 초기 렌더
  activeOffices = [...offices];
  renderOffices(activeOffices);
  initMap();

  // 검색 버튼
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");

  searchBtn?.addEventListener("click", applySearchAndSort);
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applySearchAndSort();
  });
  sortSelect?.addEventListener("change", applySearchAndSort);

  // 빠른 필터 chip
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const keyword = chip.dataset.keyword;
      if (searchInput) searchInput.value = keyword;
      applySearchAndSort();
    });
  });

  // 모달 닫기
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  modalBackdrop?.addEventListener("click", closeModal);
  modalCloseBtn?.addEventListener("click", closeModal);

  // 예약 완료 버튼
  const reserveBtn = document.getElementById("reserveSubmitBtn");
  reserveBtn?.addEventListener("click", submitReservation);

  // 별점 클릭
  document.querySelectorAll("#ratingStars span").forEach((star) => {
    star.addEventListener("click", () => {
      currentRating = Number(star.dataset.value);
      updateStarUI();
    });
  });
});
