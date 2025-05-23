document.addEventListener("DOMContentLoaded", () => {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: false,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".custom-swiper-button-next",
      prevEl: ".custom-swiper-button-prev",
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      // 768: { slidesPerView: 2 },
      992: { slidesPerView: 3 },
    },
    on: {
      init: function () {
        updateNavButtons(this);
      },
      slideChange: function () {
        updateNavButtons(this);
      },
    },
  });
  function updateNavButtons(swiper) {
    const prev = document.querySelector(".custom-swiper-button-prev");
    const next = document.querySelector(".custom-swiper-button-next");
    const isBeginning = swiper.isBeginning;
    const isEnd = swiper.isEnd;
    if (isBeginning) {
      next.classList.add("swiper-btn-active");
      prev.classList.remove("swiper-btn-active");
    } else if (isEnd) {
      prev.classList.add("swiper-btn-active");
      next.classList.remove("swiper-btn-active");
    } else {
      prev.classList.add("swiper-btn-active");
      next.classList.remove("swiper-btn-active");
    }
  }
});
