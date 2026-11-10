// MUSLIMTECH — interaksi frontend tanpa backend.
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('muslimtech-theme');
const applyTheme = theme => {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === 'dark';
  themeToggle.textContent = isDark ? '☀' : '☾';
  themeToggle.setAttribute('aria-label', isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
  themeToggle.title = isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap';
  document.querySelector('meta[name="theme-color"]').content = isDark ? '#10231f' : '#f2f2e8';
};
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('muslimtech-theme', nextTheme);
  applyTheme(nextTheme);
});

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
document.querySelectorAll('.back-to-top').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}));

// Menandai menu sesuai bagian yang sedang dibaca.
const navLinks = [...document.querySelectorAll('.nav-link')];
const observedSections = ['home','landasan','pilar','digital','belajar','referensi']
  .map(id => document.getElementById(id)).filter(Boolean);
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
observedSections.forEach(section => sectionObserver.observe(section));

// Kuis pengetahuan dasar.
const questions = [
  { q: "Apa pesan utama QS. Al-'Alaq ayat 1–5 yang relevan dengan perkembangan IPTEK?", options: ['Manusia tidak perlu belajar hal baru.','Pentingnya membaca dan memperoleh ilmu.','Teknologi dapat menggantikan seluruh ibadah.','Semua informasi internet pasti benar.'], answer: 1, explain: "QS. Al-'Alaq ayat 1–5 menekankan membaca dan proses manusia memperoleh pengetahuan." },
  { q: 'Teknologi apa yang dapat membantu memperkirakan waktu shalat?', options: ['Perhitungan astronomi dan aplikasi jadwal shalat.','Aplikasi penyunting foto.','Permainan daring.','Aplikasi belanja.'], answer: 0, explain: 'Perhitungan posisi Matahari dan metode hisab dapat digunakan untuk menyusun jadwal waktu shalat.' },
  { q: 'Apa sikap yang tepat ketika menerima berita agama yang belum jelas sumbernya?', options: ['Langsung menyebarkannya.','Mengubah judul agar menarik.','Melakukan tabayyun dan memeriksa sumbernya.','Mempercayainya karena ramai dibicarakan.'], answer: 2, explain: 'Prinsip tabayyun mengajarkan pemeriksaan informasi sebelum mengambil tindakan atau menyebarkannya.' },
  { q: 'Apa peran kalkulator zakat digital?', options: ['Menggantikan seluruh ketentuan zakat.','Membantu membuat estimasi perhitungan.','Menentukan penerima zakat secara otomatis tanpa verifikasi.','Menjamin semua harta wajib dizakati dengan nilai yang sama.'], answer: 1, explain: 'Kalkulator membantu estimasi. Jenis harta, nisab, haul, dan ketentuan lain tetap perlu diperhatikan.' },
  { q: 'Manakah contoh penggunaan teknologi yang bertanggung jawab?', options: ['Menyalin jawaban AI lalu mengaku sebagai karya sendiri.','Menyebarkan foto orang tanpa izin.','Memakai AI untuk memahami materi lalu memeriksa jawabannya.','Membagikan kata sandi kepada teman.'], answer: 2, explain: 'AI dapat menjadi alat bantu belajar, tetapi pengguna tetap perlu memeriksa hasil dan menjaga kejujuran.' }
];
let currentQuestion = 0;
let selectedAnswers = Array(questions.length).fill(null);
const questionText = document.getElementById('questionText');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('quizFeedback');
const nextBtn = document.getElementById('nextQuestion');
const countEl = document.getElementById('questionCount');
const progressFill = document.getElementById('progressFill');
const quizContent = document.getElementById('quizContent');
const resultEl = document.getElementById('quizResult');
function renderQuestion() {
  const item = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  countEl.textContent = `PERTANYAAN ${currentQuestion + 1} / ${questions.length}`;
  progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  questionText.textContent = item.q;
  feedbackEl.textContent = '';
  nextBtn.disabled = selectedAnswer === null;
  nextBtn.textContent = currentQuestion === questions.length - 1 ? 'Lihat hasil →' : 'Lanjut →';
  optionsEl.innerHTML = '';
  item.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option';
    if (selectedAnswer === index) button.classList.add('selected');
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    button.addEventListener('click', () => {
      selectedAnswers[currentQuestion] = index;
      optionsEl.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
      button.classList.add('selected');
      nextBtn.disabled = false;
    });
    optionsEl.appendChild(button);
  });
}
nextBtn.addEventListener('click', () => {
  if (selectedAnswers[currentQuestion] === null) return;
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    return renderQuestion();
  }

  const score = questions.reduce((total, item, index) => total + (selectedAnswers[index] === item.answer ? 1 : 0), 0);
  quizContent.hidden = true;
  resultEl.hidden = false;
  const message = score === questions.length ? 'Luar biasa! Kamu menjawab semua soal dengan benar.' : score >= Math.ceil(questions.length / 2) ? 'Bagus! Kamu sudah memahami materi dengan cukup baik.' : 'Tetap semangat. Pelajari kembali materi dan coba lagi.';
  resultEl.innerHTML = `<strong>${score} / ${questions.length}</strong><h3>${message}</h3><p>Skor dihitung berdasarkan jawaban benar yang kamu pilih pada setiap soal.</p><button class="btn btn-primary" id="retryQuiz">Ulangi kuis ↻</button>`;
  document.getElementById('retryQuiz').addEventListener('click', () => {
    currentQuestion = 0;
    selectedAnswers = Array(questions.length).fill(null);
    resultEl.hidden = true;
    quizContent.hidden = false;
    renderQuestion();
  });
});
renderQuestion();

// Kalkulator edukasi zakat maal: pengguna memasukkan nilai nisab yang telah diverifikasi.
const wealthInput = document.getElementById('wealthInput');
const nisabInput = document.getElementById('nisabInput');
const calcResult = document.getElementById('calcResult');
const rupiah = value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
document.getElementById('calculateZakat').addEventListener('click', () => {
  const wealth = Number(wealthInput.value);
  const nisab = Number(nisabInput.value);
  if (!wealthInput.value || !nisabInput.value || !Number.isFinite(wealth) || !Number.isFinite(nisab) || wealth < 0 || nisab <= 0) {
    calcResult.textContent = 'Masukkan jumlah harta (minimal 0) dan nilai nisab yang valid (lebih dari 0).';
    return;
  }
  if (wealth < nisab) {
    calcResult.innerHTML = `Harta yang dimasukkan: <strong>${rupiah(wealth)}</strong>Nilai tersebut berada di bawah nisab yang kamu masukkan. Ini hanya perbandingan awal, bukan keputusan final tentang kewajiban zakat.`;
  } else {
    const estimate = wealth * 0.025;
    calcResult.innerHTML = `Estimasi 2,5%: <strong>${rupiah(estimate)}</strong>Harta yang dimasukkan: ${rupiah(wealth)}. Pastikan pula syarat lain seperti haul dan ketentuan jenis hartanya terpenuhi.`;
  }
});

// Pencarian istilah pada glosarium.
const glossarySearch = document.getElementById('glossarySearch');
const glossaryItems = [...document.querySelectorAll('.glossary-item')];
const noResults = document.getElementById('noGlossaryResults');
glossarySearch.addEventListener('input', () => {
  const query = glossarySearch.value.trim().toLocaleLowerCase('id');
  let visible = 0;
  glossaryItems.forEach(item => {
    const match = item.textContent.toLocaleLowerCase('id').includes(query);
    item.hidden = !match;
    if (match) visible++;
  });
  noResults.hidden = visible !== 0;
});
