const offices = [
    {
      name: "위워크 삼성점",
      location: "서울 강남구 삼성로 512",
      rating: 4.5,
      price: "월 ₩350,000~",
      image: "images/wework.jpeg",
    },
    {
      name: "패스트파이브 역삼 2호점",
      location: "서울 강남구 테헤란로 201",
      rating: 4.3,
      price: "월 ₩300,000~",
      image: "images/fast.jpeg",
    },
    {
      name: "로컬스페이스 홍대",
      location: "서울 마포구 양화로 135",
      rating: 4.7,
      price: "월 ₩250,000~",
      image: "images/local.jpeg",
    },
  ];
  
  function renderOffices(filtered) {
    const container = document.getElementById("officeList");
    container.innerHTML = "";
  
    filtered.forEach((office) => {
      const card = document.createElement("div");
      card.className = "office-card";
      card.innerHTML = `
        <img src="${office.image}" alt="office image" />
        <div class="office-content">
          <div class="office-title">${office.name}</div>
          <div class="office-location">📍 ${office.location}</div>
          <div class="office-price">${office.price}</div>
          <div class="office-rating">⭐ ${office.rating}</div>
        </div>
      `;
      container.appendChild(card);
    });
  }
  
  function filterOffices() {
    const searchValue = document.getElementById("searchInput").value.trim();
    const filtered = offices.filter(
      (o) =>
        o.name.includes(searchValue) || o.location.includes(searchValue)
    );
    renderOffices(filtered);
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    renderOffices(offices); // 초기 전체 리스트
  });
  