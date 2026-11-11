/* =========================================================
   MALECA | index-fa-java.js  (مخصوص نسخه‌ی فارسی)
   ---------------------------------------------------------
   مهم: این فایل باید «قبل» از index-java.js لود شود.
   چون HTML فارسی بعضی المان‌ها را ندارد (دکمه‌ی منو، نوار جستجو،
   پیام «نتیجه‌ای پیدا نشد») و index-java.js بدون آن‌ها خطا می‌دهد.
   اینجا آن المان‌ها را می‌سازیم تا کدهای مشترک بدون تغییر کار کنند.

   <script src="./js/index-fa-java.js"></script>
   <script src="./js/index-java.js"></script>
   ========================================================= */

(function () {
  'use strict';

  // اگر این فایل در صفحه‌ی انگلیسی لود شد، هیچ کاری نکند
  if (document.documentElement.lang !== 'fa') return;

  const header = document.querySelector('.header');
  const best = document.getElementById('best');


  /* =======================================================
     1) ساختن المان‌هایی که در HTML فارسی نیستند
     ======================================================= */

  // دکمه‌ی همبرگری (id همان است که index-java.js دنبالش می‌گردد)
  const menuToggle = document.createElement('button');
  menuToggle.className = 'menu-toggle';
  menuToggle.id = 'menu-toggle';
  menuToggle.setAttribute('aria-label', 'باز کردن منو');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.innerHTML = '&#9776;';
  header.querySelector('.logo').insertAdjacentElement('afterend', menuToggle);

  // به لینک «جستجو» (اولین لینک header-actions) id می‌دهیم
  header.querySelector('.header-actions a').id = 'search-open';

  // نوار جستجو (درست بعد از هدر، چون CSS از انتخابگر ".header.scrolled + .search-bar" استفاده می‌کند)
  const searchBar = document.createElement('div');
  searchBar.className = 'search-bar';
  searchBar.id = 'search-bar';
  searchBar.innerHTML = `
    <input type="search" id="search-input" placeholder="جستجوی محصولات..." aria-label="جستجوی محصولات">
    <button id="search-close" aria-label="بستن جستجو">&times;</button>
  `;
  header.insertAdjacentElement('afterend', searchBar);

  // پیام «نتیجه‌ای پیدا نشد»
  const noResults = document.createElement('p');
  noResults.className = 'no-results hidden';
  noResults.id = 'no-results';
  noResults.textContent = 'نتیجه‌ای پیدا نشد';
  best.appendChild(noResults);


  /* =======================================================
     2) جستجوی فارسی: یکسان‌سازی حروف عربی و فارسی
     کیبوردهای مختلف «ي» و «ك» عربی تایپ می‌کنند، ولی متن سایت «ی» و «ک» فارسی است.
     این شنونده قبل از شنونده‌ی index-java.js اجرا می‌شود (چون فایل اول لود شده).
     ======================================================= */
  const searchInput = document.getElementById('search-input');

  function normalizePersian(text) {
    return text
      .replace(/ي/g, 'ی')
      .replace(/ك/g, 'ک')
      .replace(/ۀ/g, 'ه');
  }

  searchInput.addEventListener('input', () => {
    const fixed = normalizePersian(searchInput.value);
    if (fixed !== searchInput.value) searchInput.value = fixed;
  });


  /* =======================================================
     3) خبرنامه: متن فارسی + جهت چپ‌به‌راست برای ایمیل
     ======================================================= */
  const newsletterForm = document.querySelector('.newsletter-form');
  const emailInput = newsletterForm.querySelector('input[type="email"]');

  // ایمیل انگلیسی است و باید چپ‌به‌راست تایپ شود؛ placeholder فارسی راست‌چین می‌ماند
  emailInput.addEventListener('input', () => {
    emailInput.dir = emailInput.value ? 'ltr' : 'rtl';
  });

  // index-java.js پیام انگلیسی را می‌نویسد؛ ما بعد از آن، متن را فارسی می‌کنیم
  newsletterForm.addEventListener('submit', () => {
    setTimeout(() => {
      const msg = document.querySelector('.newsletter-message');
      if (!msg) return;

      if (msg.classList.contains('error')) {
        msg.textContent = 'لطفاً یک ایمیل معتبر وارد کنید.';
      } else if (msg.classList.contains('success')) {
        msg.textContent = 'ممنون! عضویت شما با موفقیت انجام شد.';
        emailInput.dir = 'rtl'; // بعد از ریست فرم، دوباره راست‌چین
      }
    }, 0);
  });
})();