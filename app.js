const startDate = Date.UTC(2026, 8, 3);
function updateDays() {
  const dateParts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const part = (type) => Number(dateParts.find((p) => p.type === type).value);
  const days = Math.max(0, Math.floor((Date.UTC(part('year'), part('month') - 1, part('day')) - startDate) / 86400000));
  document.getElementById('days').textContent = days;
  document.getElementById('day-label').textContent = days % 10 === 1 && days % 100 !== 11 ? 'день' : days % 10 >= 2 && days % 10 <= 4 && !(days % 100 >= 12 && days % 100 <= 14) ? 'дня' : 'дней';
}
updateDays();
setInterval(updateDays, 60000);
const letterDialog = document.getElementById('letter-dialog');
document.querySelectorAll('[data-open-letter]').forEach((button) => button.addEventListener('click', () => letterDialog.showModal()));
document.querySelector('.close-dialog').addEventListener('click', () => letterDialog.close());
letterDialog.addEventListener('click', (event) => {
  const rect = letterDialog.getBoundingClientRect();
  if (event.target === letterDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) letterDialog.close();
});
const wishButtons = [...document.querySelectorAll('[data-wish]')];
let savedWishes = [];
try { const saved = JSON.parse(localStorage.getItem('diana-wishes-v1') || '[]'); if (Array.isArray(saved)) savedWishes = saved; } catch {}
wishButtons.forEach((button) => {
  button.setAttribute('aria-pressed', String(savedWishes.includes(button.dataset.wish)));
  button.addEventListener('click', () => {
    button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
    const selected = wishButtons.filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.dataset.wish);
    try { localStorage.setItem('diana-wishes-v1', JSON.stringify(selected)); } catch {}
    updateWishMessage();
  });
});
function updateWishMessage() {
  const count = wishButtons.filter((b) => b.getAttribute('aria-pressed') === 'true').length;
  document.getElementById('wish-status').textContent = count === 4 ? 'Всё сразу? Мне нравится твой план ♡' : count ? 'Хороший план. Сохрани его для нашей встречи ♡' : 'Можно выбрать всё. Я только за.';
}
updateWishMessage();
document.getElementById('kiss-button').addEventListener('click', (event) => {
  document.getElementById('kiss-reply').textContent = 'Вот ради этой улыбки всё и было, Лямашка ♡';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = event.currentTarget.getBoundingClientRect();
  for (let i = 0; i < 9; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = i % 2 ? '♡' : '♥';
    heart.setAttribute('aria-hidden', 'true');
    heart.style.left = `${rect.left + rect.width / 2 + (Math.random() - .5) * 80}px`;
    heart.style.top = `${rect.top}px`;
    heart.style.setProperty('--drift', `${(Math.random() - .5) * 160}px`);
    heart.style.animationDelay = `${i * .04}s`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2200);
  }
});
