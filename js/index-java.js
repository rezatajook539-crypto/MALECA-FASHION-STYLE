/* =========================================================
   MALECA | index-java.js
   مسیر فایل: ./js/index-java.js  (با defer لود می‌شود، پس DOM آماده است)
   ========================================================= */

'use strict';

/* ---------- انتخاب المان‌ها ---------- */
const header = document.querySelector('.header');
const menuToggle = document.getElementById('menu-toggle');
const nav = document.querySelector('.nav');

const searchOpen = document.getElementById('search-open');
const searchBar = document.getElementById('search-bar');
const searchInput = document.getElementById('search-input');
const searchClose = document.getElementById('search-close');

const bestGrid = document.querySelector('.best-grid');
const products = document.querySelectorAll('.product');
const noResults = document.getElementById('no-results');
const arrowButtons = document.querySelectorAll('.arrow');

const newsletterForm = document.querySelector('.newsletter-form');


/* =========================================================
   1) هدر: بعد از اسکرول کلاس scrolled اضافه شود
   ========================================================= */
function handleHeaderScroll() {
  header.classList.toggle('scrolled', window.scrollY > 50);
}
window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll(); // اگر صفحه وسط اسکرول رفرش شد، وضعیت درست باشد


/* =========================================================
   2) منوی موبایل (همبرگری)
   ========================================================= */
function closeMenu() {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.innerHTML = '&#9776;'; // ☰
}

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.innerHTML = isOpen ? '&times;' : '&#9776;';
});

// با کلیک روی هر لینک منو، منو بسته شود
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// اگر صفحه بزرگ شد (دسکتاپ)، منو بسته شود
window.addEventListener('resize', () => {
  if (window.innerWidth > 1000) closeMenu();
});


/* =========================================================
   3) نوار جستجو + فیلتر محصولات
   ========================================================= */
function openSearch() {
  searchBar.classList.add('open');
  searchInput.focus();
}

function closeSearch() {
  searchBar.classList.remove('open');
  searchInput.value = '';
  filterProducts(''); // همه‌ی محصولات دوباره نشان داده شوند
}

function filterProducts(query) {
  const q = query.trim().toLowerCase();
  let visibleCount = 0;

  products.forEach((product) => {
    const name = product.querySelector('h3').textContent.toLowerCase();
    const match = name.includes(q);
    product.classList.toggle('hidden', !match);
    if (match) visibleCount++;
  });

  noResults.classList.toggle('hidden', visibleCount > 0);
  bestGrid.scrollLeft = 0;
  updateArrows();
}

searchOpen.addEventListener('click', (e) => {
  e.preventDefault(); // href="#" صفحه را به بالا نپراند
  searchBar.classList.contains('open') ? closeSearch() : openSearch();
});

searchClose.addEventListener('click', closeSearch);

searchInput.addEventListener('input', () => {
  filterProducts(searchInput.value);

  // وقتی کاربر تایپ می‌کند، به بخش محصولات برویم
  if (searchInput.value.trim() !== '') {
    document.getElementById('best').scrollIntoView({ behavior: 'smooth' });
  }
});

// کلید Escape نوار جستجو را ببندد
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && searchBar.classList.contains('open')) {
    closeSearch();
  }
});


/* =========================================================
   4) اسلایدر Bestsellers (دکمه‌های قبلی / بعدی)
   ========================================================= */
function getStep() {
  // عرض یک کارت + فاصله‌ی 8 پیکسلی بین کارت‌ها
  const firstVisible = [...products].find((p) => !p.classList.contains('hidden'));
  return firstVisible ? firstVisible.offsetWidth + 8 : 0;
}

function updateArrows() {
  const [prevBtn, nextBtn] = arrowButtons;
  const maxScroll = bestGrid.scrollWidth - bestGrid.clientWidth;

  // در صفحه‌ی راست‌چین scrollLeft منفی است، پس قدر مطلق می‌گیریم
  const pos = Math.abs(bestGrid.scrollLeft);
  const canGoPrev = pos > 5;
  const canGoNext = pos < maxScroll - 5;

  // دکمه‌ای که می‌تواند حرکت کند پررنگ می‌شود (کلاس arrow-active در CSS)
  prevBtn.classList.toggle('arrow-active', canGoPrev);
  nextBtn.classList.toggle('arrow-active', canGoNext);
}

// در صفحه‌ی راست‌چین (فارسی) جهت اسکرول برعکس است
const dir = document.documentElement.dir === 'rtl' ? -1 : 1;

arrowButtons[0].addEventListener('click', () => {
  bestGrid.scrollBy({ left: -getStep() * dir, behavior: 'smooth' });
});

arrowButtons[1].addEventListener('click', () => {
  bestGrid.scrollBy({ left: getStep() * dir, behavior: 'smooth' });
});

bestGrid.addEventListener('scroll', updateArrows, { passive: true });
window.addEventListener('resize', updateArrows);
updateArrows();


/* =========================================================
   5) فرم خبرنامه (اعتبارسنجی ایمیل + پیام موفقیت/خطا)
   ========================================================= */
// پیام را با جاوا اسکریپت می‌سازیم تا نیازی به تغییر HTML نباشد
const message = document.createElement('p');
message.className = 'newsletter-message';
message.setAttribute('aria-live', 'polite');
newsletterForm.insertAdjacentElement('afterend', message);

function isValidEmail(value) {
  // الگوی ساده: متن@متن.متن
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault(); // صفحه رفرش نشود

  const emailInput = newsletterForm.querySelector('input[type="email"]');
  const email = emailInput.value.trim();

  if (!isValidEmail(email)) {
    message.textContent = 'Please enter a valid email address.';
    message.className = 'newsletter-message error';
    return;
  }

  message.textContent = 'Thank you! You are now subscribed.';
  message.className = 'newsletter-message success';
  newsletterForm.reset();
});


/* =========================================================
   6) انیمیشن ظاهر شدن بخش‌ها هنگام اسکرول (reveal)
   ========================================================= */
const revealTargets = document.querySelectorAll(
  '.edit, .best, .philosophy, .campaign, .newsletter, .footer'
);

revealTargets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // فقط یک‌بار اجرا شود
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((el) => observer.observe(el));
} else {
  // مرورگرهای قدیمی: همه چیز بدون انیمیشن نمایش داده شود
  revealTargets.forEach((el) => el.classList.add('visible'));
}