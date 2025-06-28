import './bootstrap';

import Alpine from 'alpinejs';
// Import Swiper JS
import Swiper from 'swiper/bundle';
// Import Swiper styles
import 'swiper/css/bundle';

const swiper = new Swiper('.category-swiper', {
    // Konfigurasi
    loop: true, // Agar bisa scroll terus menerus
    autoplay: {
        delay: 3000, // Ganti slide setiap 3 detik
        disableOnInteraction: false,
    },

    // Menampilkan 3 slide di layar besar, sesuai permintaanmu
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
        640: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
    },

    // Tombol Navigasi (panah kiri-kanan)
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // Paginasi (titik-titik di bawah)
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

window.Alpine = Alpine;

//Alpine.start();
