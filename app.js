'use strict';

const STORAGE_KEY = 'pengingat-tugas-v1';
const TICK_MS = 30 * 1000;
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const STATUS_LABEL = { belum: 'Belum dikerjakan', proses: 'Sedang dikerjakan', selesai: 'Selesai' };
const PRIORITY_LABEL = { tinggi: 'Sangat penting', sedang: 'Cukup penting', rendah: 'Kurang penting' };

// Data awal dari Kartu Rencana Pendidikan Mahasiswa semester gasal 2026/2027.
const SEED_COURSES = [
  { kode: '120210032', nama: 'Kapita Selekta', dosen: 'Dr. Heriyanto, A.Md., S.Kom., M.Cs.', sks: 2, kelas: 'SI-A' },
  { kode: '124210153', nama: 'Perencanaan Strategis TI', dosen: 'Hari Prapcoyo, S.Kom., M.ICT.', sks: 3, kelas: 'SI-E' },
  { kode: '124210162', nama: 'Rekayasa Kebutuhan Perangkat Lunak', dosen: 'Simon Pulung Nugroho, S.Kom., M.Cs.', sks: 2, kelas: 'SI-A' },
  { kode: '124210172', nama: 'Sistem Pendukung Keputusan', dosen: 'Dr. Herlina Jayadianti, S.T., M.T.', sks: 2, kelas: 'SI-A' },
  { kode: '124210182', nama: 'Keamanan Aset Informasi', dosen: 'Herry Sofyan, S.T., M.Kom.', sks: 2, kelas: 'SI-B' },
  { kode: '124210192', nama: 'Desain & Manajemen Jaringan Komputer', dosen: 'Dessyanto Boedi P, S.T., M.T.', sks: 2, kelas: 'SI-C' },
  { kode: '124210202', nama: 'Metode Survey dan Pengolahan Data', dosen: 'Daniel Eliazar Latumaerissa, S.Pd., M.Si.D.', sks: 2, kelas: 'SI-B' },
  { kode: '124210212', nama: 'Interaksi Manusia & Komputer', dosen: 'Hari Prapcoyo, S.Kom., M.ICT.', sks: 2, kelas: 'SI-E' },
  { kode: '124210232', nama: 'Sistem Informasi Manajemen Bencana', dosen: 'Herry Sofyan, S.T., M.Kom.', sks: 2, kelas: 'SI-C' },
  { kode: '124210241', nama: 'Praktikum Desain & Manajemen Jaringan Komputer', dosen: 'Rifki Indra P, S.Kom., M.Eng.', sks: 1, kelas: 'SI-F' },
  { kode: '124210251', nama: 'Praktikum Rekayasa Kebutuhan Perangkat Lunak', dosen: 'Simon Pulung Nugroho, S.Kom., M.Cs.', sks: 1, kelas: 'SI-B' },
  { kode: '124210352', nama: 'Etika Profesi TI', dosen: 'Oliver Samuel S., S.Kom., M.Eng.', sks: 2, kelas: 'SI-B' },
];

// Naikkan angka ini jika SEED_TASKS berubah. Tugas yang id-nya belum ada akan ditambahkan sekali.
const SEED_VERSION = 3;

// Tugas awal dari folder kuliah. Deadline adalah perkiraan dari Schedule per mata kuliah:
// setiap Minggu N berakhir pada hari Minggu, dan Minggu 10 berakhir 1 November 2026.
const SEED_TASKS = [
  {
    id: 'seed-imk-minggu-10',
    title: 'Prototype interaktif dan user flow (Minggu 10)',
    courseId: '124210212',
    deadline: '2026-11-01T23:59',
    priority: 'tinggi',
    status: 'belum',
    remindMinutes: 1440,
    estimated: true,
    notes: 'Yang dibuat: sitemap, alur tugas dan alur pengguna, wireframe, panduan desain, dan prototype yang bisa diklik.\nTanggal ini perkiraan dari jadwal kuliah. Tanyakan tanggal pastinya ke dosen.',
  },
  {
    id: 'seed-imk-minggu-11',
    title: 'Usability testing, revisi, dan laporan akhir (Minggu 11)',
    courseId: '124210212',
    deadline: '2026-11-08T23:59',
    priority: 'tinggi',
    status: 'belum',
    remindMinutes: 4320,
    estimated: true,
    notes: 'Yang dibuat: hasil uji coba ke pengguna, tabel temuan, prototype yang sudah direvisi, matriks keterlacakan, dan laporan akhir.\nTanggal ini perkiraan dari jadwal kuliah. Tanyakan tanggal pastinya ke dosen.',
  },
  {
    id: 'seed-psti-minggu-10',
    title: 'Portofolio aplikasi dan roadmap (Minggu 10)',
    courseId: '124210153',
    deadline: '2026-11-01T23:59',
    priority: 'tinggi',
    status: 'belum',
    remindMinutes: 1440,
    estimated: true,
    notes: 'Yang dibuat: portofolio program, urutan program yang diutamakan, dan roadmap (peta rencana) 3 sampai 5 tahun.\nTanggal ini perkiraan dari jadwal kuliah. Tanyakan tanggal pastinya ke dosen.',
  },
  {
    id: 'seed-psti-minggu-11',
    title: 'Business plan, laporan final, dan presentasi (Minggu 11)',
    courseId: '124210153',
    deadline: '2026-11-08T23:59',
    priority: 'tinggi',
    status: 'belum',
    remindMinutes: 4320,
    estimated: true,
    notes: 'Yang dibuat: business plan SI/TI, laporan akhir, dan bahan presentasi.\nTanggal ini perkiraan dari jadwal kuliah. Tanyakan tanggal pastinya ke dosen.',
  },
  {
    id: 'spada-rkpl-tugas-7',
    title: 'Tugas 7: Activity Diagram',
    courseId: '124210251',
    deadline: '2026-11-02T13:00',
    priority: 'tinggi',
    status: 'belum',
    remindMinutes: 1440,
    notes: 'Dari kalender Spada.\nBuat Activity Diagram di lembar jawab yang disediakan.\nKumpulkan berupa link Google Docs (akses editor), dengan nama Tugas7_NIM.',
  },
  {
    id: 'spada-jarkom-final-project',
    title: 'Final Project jaringan komputer',
    courseId: '124210241',
    deadline: '2026-11-17T10:30',
    priority: 'sedang',
    status: 'belum',
    remindMinutes: 4320,
    notes: 'Dari kalender Spada.\nPenting: kumpulkan paling lambat 1 hari sebelum jadwal responsi, bisa lebih awal dari batas waktu di atas.\nKelompok 2 orang. Tema bebas, tapi tidak boleh sama dengan kelompok lain.\nMateri Modul 2 sampai 7: subnetting (FLSM atau VLSM), access point, web dan DNS server, routing (minimal 2), redistribute, VLAN dan inter-VLAN.\nPresentasi maksimal 10 menit. Tidak ada laporan.',
  },
];

const dateFormat = new Intl.DateTimeFormat('id-ID', {
  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});
const todayFormat = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

let storageOk = true;
let state = loadState();

/* ---------- Penyimpanan ---------- */

function defaultState() {
  return applySeedTasks({
    courses: SEED_COURSES.map((course) => ({ id: course.kode, ...course })),
    tasks: [],
    seedVersion: 0,
  });
}

function applySeedTasks(data) {
  if (data.seedVersion >= SEED_VERSION) return data;
  const existing = new Map(data.tasks.map((t) => [t.id, t]));
  for (const task of SEED_TASKS) {
    const current = existing.get(task.id);
    if (!current) {
      data.tasks.push({ firedFor: null, alertPending: false, ...task });
      continue;
    }
    // Tugas awal yang sudah tersimpan hanya diperbarui teks catatan dan penanda perkiraannya.
    current.notes = task.notes;
    if (task.estimated) current.estimated = true;
  }
  data.seedVersion = SEED_VERSION;
  return data;
}

function normalizeState(data) {
  if (!data || !Array.isArray(data.courses) || !Array.isArray(data.tasks)) return null;

  const courses = data.courses
    .filter((c) => c && typeof c.nama === 'string')
    .map((c) => ({ ...c, id: String(c.id ?? uid('mk-')) }));

  const tasks = data.tasks
    .filter((t) => t && typeof t.title === 'string' && !Number.isNaN(new Date(t.deadline).getTime()))
    .map((t) => ({ ...t, id: String(t.id ?? uid('t-')) }));

  return { courses, tasks, seedVersion: Number(data.seedVersion) || 0 };
}

function loadState() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    storageOk = false;
  }
  if (!raw) return defaultState();

  try {
    const data = normalizeState(JSON.parse(raw));
    return data ? applySeedTasks(data) : defaultState();
  } catch {
    return defaultState();
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    storageOk = true;
  } catch {
    storageOk = false;
  }
}

/* ---------- Helper ---------- */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const field = (form, name) => form.elements.namedItem(name);

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

function uid(prefix) {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function toInputValue(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function defaultDeadline() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  date.setHours(23, 59, 0, 0);
  return toInputValue(date);
}

const findTask = (id) => state.tasks.find((t) => t.id === id);
const isActive = (task) => task.status !== 'selesai';
const deadlineMs = (task) => new Date(task.deadline).getTime();
const formatDeadline = (task) => dateFormat.format(new Date(task.deadline));
const courseName = (task) => state.courses.find((c) => c.id === task.courseId)?.nama ?? 'Tanpa mata kuliah';

// Pengingat berbunyi `remindMinutes` menit sebelum deadline.
function remindAtMs(task) {
  if (task.remindMinutes == null) return null;
  return deadlineMs(task) - task.remindMinutes * MINUTE;
}

function urgencyOf(task, now = Date.now()) {
  if (!isActive(task)) return 'done';
  const left = deadlineMs(task) - now;
  if (left < 0) return 'overdue';
  if (left < DAY) return 'soon';
  if (left < 3 * DAY) return 'near';
  return 'normal';
}

function relativeLabel(task, now = Date.now()) {
  if (!isActive(task)) return 'Selesai';
  const left = deadlineMs(task) - now;
  const abs = Math.abs(left);
  let amount;
  if (abs < HOUR) amount = `${Math.max(1, Math.round(abs / MINUTE))} menit`;
  else if (abs < DAY) amount = `${Math.floor(abs / HOUR)} jam`;
  else amount = `${Math.floor(abs / DAY)} hari`;
  return left < 0 ? `Terlambat ${amount}` : `${amount} lagi`;
}

// Tugas aktif lebih dulu, lalu diurutkan dari deadline paling dekat.
function compareTasks(a, b) {
  if (isActive(a) !== isActive(b)) return isActive(a) ? -1 : 1;
  return deadlineMs(a) - deadlineMs(b);
}

/* ---------- Pengingat ---------- */

function checkReminders(now = Date.now()) {
  let fired = false;
  for (const task of state.tasks) {
    const remindAt = remindAtMs(task);
    if (!isActive(task) || remindAt === null || task.firedFor === remindAt) continue;
    if (now >= remindAt && now < deadlineMs(task)) {
      task.firedFor = remindAt;
      task.alertPending = true;
      notifyBrowser(task);
      fired = true;
    }
  }
  return fired;
}

function notifyBrowser(task) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(`Pengingat: ${task.title}`, {
      body: `${courseName(task)} · batas ${formatDeadline(task)}`,
      tag: task.id,
    });
  } catch {
    // Beberapa browser (misalnya saat dibuka dari file lokal) membatasi notifikasi.
  }
}

function tick() {
  if (checkReminders()) save();
  renderDashboard();
  renderAlerts();
  refreshTaskLabels();
  $('#today-label').textContent = todayFormat.format(new Date());
}

/* ---------- Render ---------- */

function renderAll() {
  renderDashboard();
  renderAlerts();
  renderTasks();
  renderCourses();
  fillCourseSelect($('#filter-matkul'), 'Semua mata kuliah');
  renderNotifStatus();
}

function renderDashboard() {
  const now = Date.now();
  const active = state.tasks.filter(isActive).sort(compareTasks);
  const overdue = active.filter((t) => deadlineMs(t) < now);
  const withinWeek = active.filter((t) => deadlineMs(t) >= now && deadlineMs(t) <= now + 7 * DAY);

  $('#stat-aktif').textContent = active.length;
  $('#stat-terlambat').textContent = overdue.length;
  $('#stat-minggu').textContent = withinWeek.length;
  $('#stat-selesai').textContent = state.tasks.length - active.length;

  $('#upcoming').innerHTML = active.length
    ? active.slice(0, 8).map(taskItemHtml).join('')
    : '<li class="empty">Tidak ada tugas yang belum selesai.</li>';
}

function renderAlerts() {
  const pending = state.tasks.filter((t) => t.alertPending && isActive(t));
  const parts = [];

  if (!storageOk) {
    parts.push('<p class="alert-warning">Data tidak bisa disimpan di browser ini, jadi perubahan bisa hilang saat halaman ditutup. Simpan cadangan di menu Pengaturan.</p>');
  }
  if (pending.length) {
    parts.push(`<h2>Batas waktu tugas ini sudah dekat</h2><ul class="task-list">${pending.map(alertItemHtml).join('')}</ul>`);
  }

  const box = $('#alerts');
  box.innerHTML = parts.join('');
  box.hidden = parts.length === 0;
  document.title = pending.length ? `(${pending.length}) Pengingat Tugas` : 'Pengingat Tugas';
}

function alertItemHtml(task) {
  return `
    <li class="alert-item">
      <div>
        <strong>${esc(task.title)}</strong>
        <div class="small muted">${esc(courseName(task))} · <strong>${esc(relativeLabel(task))}</strong> · ${esc(formatDeadline(task))}</div>
      </div>
      <button class="btn btn-small" type="button" data-action="ack-alert" data-id="${esc(task.id)}">Tutup</button>
    </li>`;
}

function filteredTasks() {
  const status = $('#filter-status').value;
  const courseId = $('#filter-matkul').value;
  const query = $('#search').value.trim().toLowerCase();
  const now = Date.now();

  const matchesStatus = {
    aktif: (t) => isActive(t),
    semua: () => true,
    belum: (t) => t.status === 'belum',
    proses: (t) => t.status === 'proses',
    terlambat: (t) => isActive(t) && deadlineMs(t) < now,
    selesai: (t) => !isActive(t),
  }[status];

  return state.tasks
    .filter((t) => matchesStatus(t)
      && (!courseId || t.courseId === courseId)
      && (!query || [t.title, t.notes, courseName(t)].join(' ').toLowerCase().includes(query)))
    .sort(compareTasks);
}

function renderTasks() {
  const list = $('#task-list');
  if (!state.tasks.length) {
    list.innerHTML = '<li class="empty">Belum ada tugas. Tekan "Tambah tugas" untuk mulai.</li>';
    return;
  }
  const tasks = filteredTasks();
  list.innerHTML = tasks.length
    ? tasks.map(taskItemHtml).join('')
    : '<li class="empty">Tidak ada tugas yang cocok. Coba ganti kata pencarian atau pilihan di atas.</li>';
}

function taskItemHtml(task) {
  const id = esc(task.id);
  const done = !isActive(task);
  return `
    <li class="task urgency-${urgencyOf(task)}" data-task-id="${id}">
      <input class="task-check" type="checkbox" data-action="toggle-done" data-id="${id}"
        ${done ? 'checked' : ''} aria-label="Tandai selesai: ${esc(task.title)}">
      <div class="task-body">
        <div class="task-title${done ? ' is-done' : ''}">${esc(task.title)}</div>
        <div class="task-meta">
          <span class="badge">${esc(courseName(task))}</span>
          <span class="badge prio-${esc(task.priority)}">${esc(PRIORITY_LABEL[task.priority] ?? task.priority)}</span>
          <span class="badge badge-neutral">${esc(STATUS_LABEL[task.status] ?? task.status)}</span>
        </div>
        <div class="task-deadline"><span class="rel">${esc(relativeLabel(task))}</span> · ${esc(formatDeadline(task))}${task.estimated ? ' <span class="badge badge-estimate">tanggal perkiraan</span>' : ''}</div>
        ${task.notes ? `<p class="task-notes">${esc(task.notes)}</p>` : ''}
      </div>
      <div class="task-actions">
        <button class="icon-btn" type="button" data-action="edit-task" data-id="${id}">Ubah</button>
        <button class="icon-btn danger" type="button" data-action="delete-task" data-id="${id}">Hapus</button>
      </div>
    </li>`;
}

// Memperbarui hitung mundur tanpa membangun ulang daftar (agar fokus keyboard tidak hilang).
function refreshTaskLabels() {
  const now = Date.now();
  $$('[data-task-id]').forEach((item) => {
    const task = findTask(item.dataset.taskId);
    if (!task) return;
    item.className = `task urgency-${urgencyOf(task, now)}`;
    item.querySelector('.rel').textContent = relativeLabel(task, now);
  });
}

function renderCourses() {
  const list = $('#course-list');
  if (!state.courses.length) {
    list.innerHTML = '<li class="empty">Belum ada mata kuliah.</li>';
    return;
  }
  list.innerHTML = state.courses.map((c) => {
    const id = esc(c.id);
    const active = state.tasks.filter((t) => t.courseId === c.id && isActive(t)).length;
    return `
      <li class="course-row">
        <div>
          <div class="course-name">${esc(c.nama)}</div>
          <div class="small muted">${esc(c.kode || '-')} · ${esc(c.sks ?? 0)} SKS · Kelas ${esc(c.kelas || '-')}</div>
          <div class="small muted">${esc(c.dosen || 'Dosen belum diisi')}</div>
        </div>
        <div class="course-side">
          <span class="badge">${active} tugas belum selesai</span>
          <button class="icon-btn danger" type="button" data-action="delete-course" data-id="${id}">Hapus</button>
        </div>
      </li>`;
  }).join('');
}

function fillCourseSelect(select, placeholder) {
  const previous = select.value;
  const options = state.courses.map((c) =>
    `<option value="${esc(c.id)}">${esc(c.nama)}${c.kelas ? ` (${esc(c.kelas)})` : ''}</option>`);
  select.innerHTML = `<option value="">${esc(placeholder)}</option>${options.join('')}`;
  select.value = state.courses.some((c) => c.id === previous) ? previous : '';
}

function renderNotifStatus() {
  const text = $('#notif-status');
  const button = $('#notif-button');
  if (!('Notification' in window)) {
    text.textContent = 'Browser ini tidak mendukung notifikasi. Pengingat tetap tampil di halaman.';
    button.hidden = true;
    return;
  }
  const labels = {
    granted: 'Notifikasi sudah diizinkan.',
    denied: 'Notifikasi diblokir. Ubah izinnya di pengaturan situs browser jika ingin mengaktifkannya.',
    default: 'Notifikasi belum diizinkan.',
  };
  text.textContent = labels[Notification.permission] ?? '';
  button.hidden = Notification.permission !== 'default';
}

/* ---------- Navigasi & dialog ---------- */

function showView(name) {
  $$('.view').forEach((view) => {
    view.hidden = view.id !== `view-${name}`;
  });
  $$('.tab').forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.view === name);
  });
}

function openTaskDialog(task = null) {
  const form = $('#task-form');
  form.reset();
  fillCourseSelect($('#task-matkul'), state.courses.length ? '— Pilih mata kuliah —' : 'Tambahkan mata kuliah dulu');

  $('#task-dialog-title').textContent = task ? 'Ubah tugas' : 'Tambah tugas';
  field(form, 'taskId').value = task?.id ?? '';
  field(form, 'title').value = task?.title ?? '';
  field(form, 'courseId').value = task?.courseId ?? '';
  field(form, 'deadline').value = task ? task.deadline : defaultDeadline();
  field(form, 'priority').value = task?.priority ?? 'sedang';
  field(form, 'status').value = task?.status ?? 'belum';
  field(form, 'remindMinutes').value = task?.remindMinutes == null ? '' : String(task.remindMinutes);
  field(form, 'notes').value = task?.notes ?? '';

  $('#task-dialog').showModal();
  field(form, 'title').focus();
}

/* ---------- Aksi ---------- */

function onTaskSubmit(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const title = data.title.trim();
  if (!title || Number.isNaN(new Date(data.deadline).getTime())) return;

  const values = {
    title,
    courseId: data.courseId || null,
    deadline: data.deadline,
    priority: data.priority,
    status: data.status,
    remindMinutes: data.remindMinutes === '' ? null : Number(data.remindMinutes),
    notes: data.notes.trim(),
  };

  const existing = data.taskId ? findTask(data.taskId) : undefined;
  if (existing) {
    // Tanggal yang diubah sendiri oleh pengguna dianggap sudah pasti.
    if (existing.deadline !== values.deadline) existing.estimated = false;
    Object.assign(existing, values);
  } else {
    state.tasks.push({ id: uid('t-'), ...values, firedFor: null, alertPending: false });
  }

  checkReminders();
  save();
  $('#task-dialog').close();
  renderAll();
}

function onCourseSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form));
  const nama = data.nama.trim();
  if (!nama) return;

  state.courses.push({
    id: uid('mk-'),
    kode: data.kode.trim(),
    nama,
    dosen: data.dosen.trim(),
    sks: Number(data.sks) || 0,
    kelas: data.kelas.trim(),
  });
  form.reset();
  save();
  renderAll();
}

function setDone(id, done) {
  const task = findTask(id);
  if (!task) return;
  task.status = done ? 'selesai' : 'belum';
  save();
  renderAll();
}

function deleteTask(id) {
  const task = findTask(id);
  if (!task || !confirm(`Hapus tugas "${task.title}"?`)) return;
  state.tasks = state.tasks.filter((t) => t.id !== id);
  save();
  renderAll();
}

function acknowledgeAlert(id) {
  const task = findTask(id);
  if (!task) return;
  task.alertPending = false;
  save();
  renderAlerts();
}

function deleteCourse(id) {
  const course = state.courses.find((c) => c.id === id);
  if (!course) return;
  if (!confirm(`Hapus mata kuliah "${course.nama}"? Tugas yang terkait tetap ada tanpa mata kuliah.`)) return;
  state.courses = state.courses.filter((c) => c.id !== id);
  state.tasks.forEach((t) => {
    if (t.courseId === id) t.courseId = null;
  });
  save();
  renderAll();
}

async function requestNotifications() {
  if (!('Notification' in window)) return;
  await Notification.requestPermission();
  renderNotifStatus();
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `pengingat-tugas-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function onImportChange(event) {
  const input = event.currentTarget;
  const file = input.files[0];
  input.value = '';
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    let imported = null;
    try {
      imported = normalizeState(JSON.parse(reader.result));
    } catch {
      imported = null;
    }
    if (!imported) {
      alert('File ini bukan cadangan dari website ini. Pilih file cadangan yang pernah kamu simpan.');
      return;
    }
    if (!confirm('Data sekarang akan diganti dengan isi file cadangan. Lanjutkan?')) return;
    state = imported;
    save();
    renderAll();
  };
  reader.readAsText(file);
}

function resetData() {
  if (!confirm('Tugas yang kamu tambah atau ubah akan hilang, dan data kembali seperti awal. Lanjutkan?')) return;
  state = defaultState();
  save();
  renderAll();
}

/* ---------- Event ---------- */

function onClick(event) {
  const el = event.target.closest('[data-action]');
  if (!el) return;

  const { action, id } = el.dataset;
  switch (action) {
    case 'new-task': openTaskDialog(); break;
    case 'edit-task': openTaskDialog(findTask(id)); break;
    case 'delete-task': deleteTask(id); break;
    case 'ack-alert': acknowledgeAlert(id); break;
    case 'delete-course': deleteCourse(id); break;
    case 'close-dialog': el.closest('dialog').close(); break;
    case 'export': exportData(); break;
    case 'import': $('#import-file').click(); break;
    case 'reset': resetData(); break;
    case 'enable-notif': requestNotifications(); break;
  }
}

function onChange(event) {
  const el = event.target;
  if (el.dataset.action === 'toggle-done') {
    setDone(el.dataset.id, el.checked);
  }
}

function bindEvents() {
  document.addEventListener('click', onClick);
  document.addEventListener('change', onChange);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tick();
  });

  $$('.tab').forEach((tab) => {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  });

  $('#search').addEventListener('input', renderTasks);
  $('#filter-status').addEventListener('change', renderTasks);
  $('#filter-matkul').addEventListener('change', renderTasks);
  $('#task-form').addEventListener('submit', onTaskSubmit);
  $('#course-form').addEventListener('submit', onCourseSubmit);
  $('#import-file').addEventListener('change', onImportChange);
}

bindEvents();
save();
renderAll();
tick();
setInterval(tick, TICK_MS);
