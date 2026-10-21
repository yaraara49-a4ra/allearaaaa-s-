const KUNCI = "allear-notes";

let materi = [];
let sedangEdit = null;

// Membaca catatan yang tersimpan
try {
  materi = JSON.parse(localStorage.getItem(KUNCI) || "[]");

  if (!Array.isArray(materi)) {
    materi = [];
  }
} catch (error) {
  materi = [];
}

// Menyimpan catatan ke browser
function simpanData() {
  try {
    localStorage.setItem(KUNCI, JSON.stringify(materi));
    return true;
  } catch (error) {
    alert("Catatan gagal disimpan. Coba periksa penyimpanan browser.");
    return false;
  }
}

// Menyimpan catatan baru atau perubahan
function simpan() {
  const judul = document.getElementById("judul").value.trim();
  const kategori = document.getElementById("kategori").value;
  const isi = document.getElementById("isi").value.trim();

  if (!judul || !isi) {
    alert("Judul dan isi catatan jangan kosong, ya! 🎀");
    return;
  }

  if (sedangEdit !== null) {
    const index = materi.findIndex(item => item.id === sedangEdit);

    if (index === -1) {
      alert("Catatan tidak ditemukan.");
      batalEdit();
      return;
    }

    materi[index].judul = judul;
    materi[index].kategori = kategori;
    materi[index].isi = isi;
    materi[index].tanggal = new Date().toLocaleString("id-ID");
  } else {
    materi.unshift({
      id: Date.now().toString(),
      judul,
      kategori,
      isi,
      tanggal: new Date().toLocaleString("id-ID")
    });
  }

  if (!simpanData()) return;

  batalEdit();
  tampilkan();

  alert("Yeay! Catatan berhasil disimpan! 🍓💗");
}

// Menampilkan semua catatan
function tampilkan() {
  const daftar = document.getElementById("daftar");
  const total = document.getElementById("total");
  const cari = document.getElementById("cari");
  const filter = document.getElementById("filter");

  if (!daftar) return;

  const pencarian = cari ? cari.value.trim().toLowerCase() : "";
  const kategoriFilter = filter ? filter.value : "";

  daftar.replaceChildren();

  total.textContent = materi.length;

  const hasil = materi.filter(item => {
    const cocokKategori = !kategoriFilter || item.kategori === kategoriFilter;

    const teks = `${item.judul} ${item.kategori} ${item.isi}`.toLowerCase();
    const cocokCari = teks.includes(pencarian);

    return cocokKategori && cocokCari;
  });

  if (hasil.length === 0) {
    const kosong = document.createElement("p");
    kosong.className = "kosong";
    kosong.textContent = materi.length === 0
      ? "🍓 Belum ada catatan. Yuk, buat catatan pertamamu!"
      : "🎀 Catatan yang kamu cari belum ditemukan.";

    daftar.appendChild(kosong);
    return;
  }

  hasil.forEach(item => {
    const kartu = document.createElement("article");
    kartu.className = "materi";

    const judul = document.createElement("h3");
    judul.textContent = "🎀 " + item.judul;

    const kategori = document.createElement("p");
    kategori.className = "kategori";
    kategori.textContent = "🌷 " + item.kategori;

    const isi = document.createElement("p");
    isi.className = "isi-materi";
    isi.textContent = item.isi;

    const tanggal = document.createElement("small");
    tanggal.textContent = "Disimpan: " + item.tanggal;

    const aksi = document.createElement("div");
    aksi.className = "aksi";

    const edit = document.createElement("button");
    edit.textContent = "✏️ Edit";
    edit.onclick = () => mulaiEdit(item.id);

    const hapus = document.createElement("button");
    hapus.textContent = "🗑️ Hapus";
    hapus.onclick = () => hapusMateri(item.id);

    aksi.append(edit, hapus);
    kartu.append(judul, kategori, isi, tanggal, aksi);
    daftar.appendChild(kartu);
  });
}

// Mengedit catatan
function mulaiEdit(id) {
  const item = materi.find(catatan => catatan.id === id);
  if (!item) return;

  sedangEdit = id;

  document.getElementById("judul").value = item.judul;
  document.getElementById("kategori").value = item.kategori;
  document.getElementById("isi").value = item.isi;

  const tombol = document.getElementById("tombolSimpan");
  if (tombol) tombol.textContent = "♡ Simpan Perubahan ♡";

  const batal = document.getElementById("tombolBatal");
  if (batal) batal.hidden = false;
}

// Membatalkan edit
function batalEdit() {
  sedangEdit = null;

  document.getElementById("judul").value = "";
  document.getElementById("isi").value = "";

  const tombol = document.getElementById("tombolSimpan");
  if (tombol) tombol.textContent = "♡ Simpan Materi ♡";

  const batal = document.getElementById("tombolBatal");
  if (batal) batal.hidden = true;
}

// Menghapus catatan
function hapusMateri(id) {
  if (!confirm("Yakin ingin menghapus catatan ini? 💗")) return;

  const sebelumnya = materi;
  materi = materi.filter(item => item.id !== id);

  if (!simpanData()) {
    materi = sebelumnya;
    return;
  }

  if (sedangEdit === id) batalEdit();

  tampilkan();
}

// Menampilkan catatan saat halaman dibuka
document.addEventListener("DOMContentLoaded", tampilkan);
