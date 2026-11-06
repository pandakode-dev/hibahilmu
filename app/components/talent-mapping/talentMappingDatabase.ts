// app/components/talent-mapping/talentMappingDatabase.ts

export type TalentDomain = "Thinking" | "Striving" | "Relating" | "Influencing";

export interface TalentDefinition {
  slotIndex: number;
  id: string;
  nama: string;
  julukanRemaja: string;
  domain: TalentDomain;
  deskripsiKuat: string;
  saranLemah: string;
  aktivitasTerkait: string[];
  typologyTerkait: string[];
}

export interface ActivityClusterItem {
  no: number;
  kodeAktivitas: string;
  klaster: "N" | "H" | "S" | "Gi" | "Te" | "E" | "R" | "T";
  namaKlaster: string;
  pernyataan: string;
  deskripsiSingkat: string;
  bobotBakatIds: string[];
  typology: string;
}

export interface PersonalBrandingRole {
  id: string;
  nama: string;
  julukan: string;
  kategori: string;
  deskripsi: string;
}

// ============================================================================
// 1. DEFINISI 34 BAKAT (NARASI ORISINAL PANDA HIBAHILMU - RAMAH REMAJA & UMUM)
// ============================================================================
export const DAFTAR_34_BAKAT: TalentDefinition[] = [
  {
    slotIndex: 0,
    id: "communication",
    nama: "Communication",
    julukanRemaja: "Si Jago Cerita & Presentasi",
    domain: "Influencing",
    deskripsiKuat:
      "Kamu punya bakat alami mengubah ide yang biasa saja menjadi cerita atau penjelasan yang seru, jelas, dan enak didengar. Saat bicara di depan kelas, rapat, atau menulis konten, orang lain mudah langsung paham maksudmu.",
    saranLemah:
      "Kalau merasa kurang lancar bicara spontan di depan banyak orang, siapkan catatan poin-poin singkat atau bantuan slide visual agar pesanmu tetap tersampaikan dengan rapi.",
    aktivitasTerkait: ["COMMUNICATING", "PUBLICIZING", "PRESENTING", "INFORMING"],
    typologyTerkait: ["COMMUNICATOR", "AMBASADOR", "JOURNALIST"],
  },
  {
    slotIndex: 1,
    id: "empathy",
    nama: "Empathy",
    julukanRemaja: "Si Peka Perasaan Teman",
    domain: "Relating",
    deskripsiKuat:
      "Kamu punya radar hati yang tajam! Tanpa orang lain perlu bercerita panjang lebar, kamu bisa merasakan apakah temanmu sedang sedih, cemas, atau bahagia. Itu membuatmu jadi tempat curhat yang nyaman.",
    saranLemah:
      "Jika kamu tipe yang lebih fokus pada logika daripada perasaan, biasakan bertanya kabar teman satu tim sebelum langsung membahas tugas berat.",
    aktivitasTerkait: ["CARING", "COUNSELING", "SERVING", "SUPPORTING"],
    typologyTerkait: ["CARETAKER", "SERVER", "MEDIATOR"],
  },
  {
    slotIndex: 2,
    id: "harmony",
    nama: "Harmony",
    julukanRemaja: "Si Cinta Damai & Penengah",
    domain: "Relating",
    deskripsiKuat:
      "Kamu paling tidak suka melihat perdebatan yang membuang energi. Saat teman-temanmu beda pendapat, kamu pintar mencari jalan tengah yang adil supaya suasana kembali rukun dan kompak.",
    saranLemah:
      "Saat menghadapi situasi beda pendapat yang panas, tarik napas dulu dan ajak semua pihak fokus ke tujuan bersama yang sudah disepakati.",
    aktivitasTerkait: ["MEDIATING", "COOPERATING", "SUPPORTING"],
    typologyTerkait: ["MEDIATOR", "SERVER"],
  },
  {
    slotIndex: 3,
    id: "includer",
    nama: "Includer",
    julukanRemaja: "Si Perangkul Semua Teman",
    domain: "Relating",
    deskripsiKuat:
      "Hatimu sangat terbuka! Kamu tidak suka melihat ada teman yang sendirian atau dikucilkan. Kamu selalu berusaha mengajak siapa saja ikut bergabung tanpa membeda-bedakan latar belakang mereka.",
    saranLemah:
      "Kamu mungkin lebih nyaman dengan lingkaran pertemanan yang kecil, namun tetaplah menyapa anggota baru di kelompokmu agar mereka merasa diterima.",
    aktivitasTerkait: ["GREETING", "COOPERATING", "VOLUNTEERING"],
    typologyTerkait: ["AMBASADOR", "NETWORKING"],
  },
  {
    slotIndex: 4,
    id: "individualization",
    nama: "Individualization",
    julukanRemaja: "Si Pengamat Keunikan Orang",
    domain: "Relating",
    deskripsiKuat:
      "Di matamu, setiap orang itu punya keunikan masing-masing. Kamu cepat sekali tahu kelebihan tiap temanmu dan cara paling pas untuk mengobrol atau membagi tugas sesuai karakter mereka.",
    saranLemah:
      "Hindari menyamaratakan cara kerja semua orang. Tanyakan langsung ke rekan timmu tugas apa yang paling cocok dengan gaya kerja mereka.",
    aktivitasTerkait: ["COACHING", "ADVISING", "RECRUITING", "GUIDING"],
    typologyTerkait: ["EDUCATOR", "SELECTOR", "MOTIVATOR"],
  },
  {
    slotIndex: 5,
    id: "relator",
    nama: "Relator",
    julukanRemaja: "Si Setia Kawan & Sahabat Dekat",
    domain: "Relating",
    deskripsiKuat:
      "Kamu lebih memilih punya sahabat dekat yang benar-benar tulus dan saling percaya daripada sekadar kenal banyak orang di permukaan. Bekerja bareng sahabat membuat energimu berlipat ganda.",
    saranLemah:
      "Bangun keakraban dengan rekan baru secara bertahap lewat obrolan ringan atau kerja bareng di proyek kecil.",
    aktivitasTerkait: ["RELATING", "ADVISING", "MENTORING"],
    typologyTerkait: ["EDUCATOR", "MEDIATOR"],
  },
  {
    slotIndex: 6,
    id: "responsibility",
    nama: "Responsibility",
    julukanRemaja: "Si Pemegang Janji & Amanah",
    domain: "Striving",
    deskripsiKuat:
      "Sekali kamu bilang 'Siap!', kamu akan berusaha keras menuntaskannya sampai selesai. Bagi kamu, menjaga amanah dan menepati janji adalah kehormatan diri yang tidak boleh dilanggar.",
    saranLemah:
      "Catat setiap janji atau tugas di pengingat HP, dan jangan ragu menolak dengan sopan jika beban tugasmu sudah terlalu penuh.",
    aktivitasTerkait: ["COMPLIANCING", "SAFEKEEPING", "SERVING"],
    typologyTerkait: ["SERVER", "SAFEKEEPER", "ADMINISTRATOR"],
  },
  {
    slotIndex: 7,
    id: "command",
    nama: "Command",
    julukanRemaja: "Si Pemimpin Tegas & Berani",
    domain: "Influencing",
    deskripsiKuat:
      "Kamu punya jiwa kepemimpinan yang berani dan tegas. Saat keadaan sedang bingung atau darurat, kamu berani maju mengambil keputusan dan mengarahkan teman-temanmu dengan lugas.",
    saranLemah:
      "Jika kamu kurang nyaman bersikap keras atau mendominasi, gunakan aturan tertulis atau data fakta saat harus mengingatkan rekan satu tim.",
    aktivitasTerkait: ["CONTROLLING", "DISPATCHING", "NEGOTIATING"],
    typologyTerkait: ["COMMANDER", "HEADMAN"],
  },
  {
    slotIndex: 8,
    id: "competition",
    nama: "Competition",
    julukanRemaja: "Si Semangat Juara",
    domain: "Influencing",
    deskripsiKuat:
      "Adanya lomba, peringkat, atau skor membuat semangatmu langsung menyala! Kamu selalu ingin memberikan performa terbaik agar bisa unggul dan menjadi pemenang.",
    saranLemah:
      "Kamu tidak suka dibanding-bandingkan dengan orang lain, dan itu sangat wajar! Jadikan pencapaian dirimu kemarin sebagai target yang ingin kamu lampaui hari ini.",
    aktivitasTerkait: ["SELLING", "INFLUENCING", "SPORT"],
    typologyTerkait: ["SELLER", "MARKETER"],
  },
  {
    slotIndex: 9,
    id: "developer",
    nama: "Developer",
    julukanRemaja: "Si Pembimbing yang Sabar",
    domain: "Relating",
    deskripsiKuat:
      "Kamu paling bahagia saat melihat orang lain bertumbuh menjadi lebih pintar dan bisa! Kamu telaten mengajari teman, menghargai kemajuan sekecil apa pun, dan cocok jadi mentor atau pelatih.",
    saranLemah:
      "Saat ada anggota tim yang butuh dibimbing dari nol secara perlahan, kamu bisa berkolaborasi dengan teman yang hobi mengajar.",
    aktivitasTerkait: ["TRAINING", "MENTORING", "GUIDING", "TEACHING", "DEVELOPING"],
    typologyTerkait: ["EDUCATOR", "MOTIVATOR"],
  },
  {
    slotIndex: 10,
    id: "maximizer",
    nama: "Maximizer",
    julukanRemaja: "Si Pengjar Kualitas Terbaik",
    domain: "Influencing",
    deskripsiKuat:
      "Kamu tidak puas dengan hasil yang sekadar 'cukup'. Kamu gemar memoles hal yang sudah bagus menjadi karya yang keren, berkualitas tinggi, dan membanggakan.",
    saranLemah:
      "Tentukan batas standar selesai sejak awal agar kamu tetap bisa mengumpulkan tugas tepat waktu tanpa terlalu lama mengutak-atik detail kecil.",
    aktivitasTerkait: ["COACHING", "DEVELOPING", "BEAUTIFYING", "FINISHING"],
    typologyTerkait: ["QUALITY CONTROLLER", "MOTIVATOR"],
  },
  {
    slotIndex: 11,
    id: "positivity",
    nama: "Positivity",
    julukanRemaja: "Si Penyebar Semangat & Ceria",
    domain: "Relating",
    deskripsiKuat:
      "Kehadiranmu seperti baterai penyemangat bagi sekitarmu! Kamu mudah melihat sisi baik dari setiap kejadian, suka memuji keberhasilan teman, dan pandai mencairkan suasana yang kaku.",
    saranLemah:
      "Sikapmu yang tenang dan serius punya kelebihan tersendiri. Cukup berikan senyuman dan ucapan terima kasih sederhana untuk menyemangati rekanmu.",
    aktivitasTerkait: ["MOTIVATING", "ENTERTAINING", "GREETING"],
    typologyTerkait: ["MOTIVATOR", "AMBASADOR"],
  },
  {
    slotIndex: 12,
    id: "woo",
    nama: "Woo",
    julukanRemaja: "Si Mudah Akrab & Luwes Bergaul",
    domain: "Influencing",
    deskripsiKuat:
      "Bertemu orang baru bukanlah hal yang menakutkan buatmu, justru seru! Kamu pintar membuka obrolan, cepat mencairkan suasana, dan bisa langsung akrab dengan kenalan baru dalam hitungan menit.",
    saranLemah:
      "Kamu tidak harus memaksakan diri menjadi pusat perhatian di keramaian asing; fokuslah membangun obrolan berkualitas satu per satu.",
    aktivitasTerkait: ["GREETING", "LIAISING", "PUBLICIZING", "REPRESENTING"],
    typologyTerkait: ["AMBASADOR", "COMMUNICATOR", "SELLER"],
  },
  {
    slotIndex: 13,
    id: "achiever",
    nama: "Achiever",
    julukanRemaja: "Si Pekerja Keras Anti Mager",
    domain: "Striving",
    deskripsiKuat:
      "Kamu punya energi kerja yang luar biasa! Rasanya ada yang kurang kalau sehari saja belum mencentang daftar tugas yang selesai. Kamu produktif dan tahan bekerja tuntas.",
    saranLemah:
      "Stamina tiap orang berbeda, jadi jangan memaksakan bekerja terus-menerus tanpa istirahat. Atur ritme kerjamu sendiri dan sisihkan waktu istirahat agar tetap segar.",
    aktivitasTerkait: ["PRODUCING", "OPERATING", "DELIVERING"],
    typologyTerkait: ["PRODUCER", "OPERATOR"],
  },
  {
    slotIndex: 14,
    id: "activator",
    nama: "Activator",
    julukanRemaja: "Si Gercep Langsung Eksekusi",
    domain: "Influencing",
    deskripsiKuat:
      "Begitu ada ide bagus atau keputusan rapat, kamu ingin langsung mulai bergerak saat itu juga! Bagimu, mencoba langsung di lapangan jauh lebih seru daripada hanya rapat berjam-jam.",
    saranLemah:
      "Kamu cenderung berhati-hati dan berpikir matang sebelum mulai bergerak. Agar tidak menunda terlalu lama, tetapkan langkah kecil pertama yang harus dimulai hari ini.",
    aktivitasTerkait: ["DISPATCHING", "INFLUENCING", "MOBILIZING"],
    typologyTerkait: ["COMMANDER", "MARKETER"],
  },
  {
    slotIndex: 15,
    id: "adaptability",
    nama: "Adaptability",
    julukanRemaja: "Si Fleksibel & Tahan Kejutan",
    domain: "Relating",
    deskripsiKuat:
      "Saat rencana tiba-tiba berubah mendadak, kamu tidak gampang panik! Kamu luwes menyesuaikan diri dengan situasi baru dan sigap mencari jalan keluar di saat itu juga.",
    saranLemah:
      "Karena kamu lebih nyaman dengan rencana yang pasti, siapkan satu rencana cadangan (Plan B) agar hati tetap tenang jika ada perubahan mendadak.",
    aktivitasTerkait: ["ASSISTING", "SERVING", "SUPPORTING", "MEDIATING"],
    typologyTerkait: ["SERVER", "CARETAKER"],
  },
  {
    slotIndex: 16,
    id: "belief",
    nama: "Belief",
    julukanRemaja: "Si Berprinsip Mulia & Tulus Melayani",
    domain: "Striving",
    deskripsiKuat:
      "Kamu bekerja bukan sekadar mengejar pujian atau materi, tapi karena nilai kebaikan dan ketulusan hati. Kamu senang membantu sesama dan ingin hidupmu membawa manfaat nyata bagi banyak orang.",
    saranLemah:
      "Temukan manfaat positif dari setiap tugas yang kamu kerjakan agar kamu selalu punya alasan kuat untuk bersemangat.",
    aktivitasTerkait: ["SERVING", "VOLUNTEERING", "SPIRITUALIZING", "GUIDING"],
    typologyTerkait: ["SERVER", "CARETAKER", "EDUCATOR"],
  },
  {
    slotIndex: 17,
    id: "discipline",
    nama: "Discipline",
    julukanRemaja: "Si Rapi, Terjadwal & Teratur",
    domain: "Striving",
    deskripsiKuat:
      "Kamu suka segala sesuatu yang tertata rapi, punya jadwal jelas, dan terorganisir. Dengan jadwal dan tahapan yang terstruktur, kamu bisa menyelesaikan pekerjaan dengan sangat presisi.",
    saranLemah:
      "Kamu mungkin kurang suka dikekang oleh jadwal yang kaku. Gunakan bantuan alarm HP atau tabel to-do list sederhana agar tugas tim tetap selesai tepat waktu.",
    aktivitasTerkait: ["SCHEDULING", "FILING", "ORGANIZING", "BOOKKEEPING"],
    typologyTerkait: ["ADMINISTRATOR", "TREASURER"],
  },
  {
    slotIndex: 18,
    id: "focus",
    nama: "Focus",
    julukanRemaja: "Si Konsentrasi Tinggi Kejar Target",
    domain: "Striving",
    deskripsiKuat:
      "Kalau sudah punya satu target jelas, kamu seperti punya kacamata kuda yang fokus lurus ke depan! Kamu tidak mudah terdistraksi oleh hal-hal yang tidak berhubungan dengan tujuan utamamu.",
    saranLemah:
      "Jika mudah bosan pada proyek yang terlalu panjang, pecahlah target besar itu menjadi target-target mingguan yang pendek supaya kamu tetap semangat mencapainya.",
    aktivitasTerkait: ["PLANNING", "MONITORING", "FINISHING"],
    typologyTerkait: ["STRATEGIST", "PRODUCER"],
  },
  {
    slotIndex: 19,
    id: "restorative",
    nama: "Restorative",
    julukanRemaja: "Si Pemecah Masalah & Montir Solusi",
    domain: "Striving",
    deskripsiKuat:
      "Melihat ada alat yang error, kode program yang bug, atau masalah yang macet justru membuatmu tertantang! Kamu pintar mencari letak kerusakannya dan memperbaikinya sampai normal kembali.",
    saranLemah:
      "Saat menemukan masalah teknis yang rumit, jangan ragu meminta bantuan teman yang memang hobi mengutak-atik dan memperbaiki kesalahan.",
    aktivitasTerkait: ["RESTORING", "DIAGNOSING", "MAINTAINING", "THERAPIES"],
    typologyTerkait: ["RESTORER", "QUALITY CONTROLLER"],
  },
  {
    slotIndex: 20,
    id: "self_assurance",
    nama: "Self-Assurance",
    julukanRemaja: "Si Percaya Diri & Mandiri",
    domain: "Influencing",
    deskripsiKuat:
      "Kamu punya rasa percaya diri yang kuat dari dalam hatimu. Walau situasi sedang sulit, kamu yakin pada kemampuanmu sendiri dan berani mengambil keputusan tanpa mudah goyah.",
    saranLemah:
      "Saat merasa ragu mengambil keputusan besar sendirian, diskusikan pilihanmu dengan mentor atau sahabat yang kamu percaya.",
    aktivitasTerkait: ["INFLUENCING", "VISIONING", "NEGOTIATING"],
    typologyTerkait: ["COMMANDER", "VISIONARY"],
  },
  {
    slotIndex: 21,
    id: "significance",
    nama: "Significance",
    julukanRemaja: "Si Ingin Berkarya Hebat & Dikenal",
    domain: "Influencing",
    deskripsiKuat:
      "Kamu punya cita-cita tinggi untuk menghasilkan karya yang berdampak besar, diakui kualitasnya, dan meninggalkan jejak prestasi yang membanggakan.",
    saranLemah:
      "Kamu lebih nyaman bekerja tenang di balik layar daripada tampil menjadi pusat sorotan panggung. Biarkan hasil karyamu yang berbicara mewakili kehebatanmu!",
    aktivitasTerkait: ["PRESENTING", "REPRESENTING", "ACTING"],
    typologyTerkait: ["AMBASADOR", "COMMUNICATOR"],
  },
  {
    slotIndex: 22,
    id: "analytical",
    nama: "Analytical",
    julukanRemaja: "Si Detektif Data & Logika",
    domain: "Thinking",
    deskripsiKuat:
      "Kamu tidak mudah percaya kabar burung sebelum melihat data dan buktinya! Kamu suka mengamati angka, mencari sebab-akibat secara logis, dan membuktikan kebenaran suatu informasi.",
    saranLemah:
      "Gunakan bantuan grafik visual atau berpasanganlah dengan teman yang teliti menghitung data saat harus mengolah angka yang rumit.",
    aktivitasTerkait: ["ANALYSING", "AUDITING", "VERIFYING", "RESEARCHING"],
    typologyTerkait: ["ANALYST", "EVALUATOR", "TREASURER"],
  },
  {
    slotIndex: 23,
    id: "arranger",
    nama: "Arranger",
    julukanRemaja: "Si Koordinator Serba Bisa",
    domain: "Striving",
    deskripsiKuat:
      "Bagaikan dirigen orkestra, kamu pintar mengatur banyak kegiatan dan membagi tugas ke banyak orang secara bersamaan agar semuanya berjalan kompak dan efisien.",
    saranLemah:
      "Selesaikan satu pekerjaan dulu baru pindah ke pekerjaan berikutnya agar pikiranmu tidak kewalahan mengurus terlalu banyak hal sekaligus.",
    aktivitasTerkait: ["COORDINATING", "ORGANIZING", "DISPATCHING"],
    typologyTerkait: ["ARRANGER", "HEADMAN", "DISTRIBUTOR"],
  },
  {
    slotIndex: 24,
    id: "connectedness",
    nama: "Connectedness",
    julukanRemaja: "Si Pencari Makna & Hikmah",
    domain: "Relating",
    deskripsiKuat:
      "Kamu percaya bahwa setiap kejadian di dunia ini saling terhubung dan pasti ada hikmahnya. Kamu sangat menjaga sikap agar perbuatanmu membawa kebaikan bagi lingkungan dan sesama.",
    saranLemah:
      "Bantu teman-temanmu memahami bagaimana tugas kecil yang mereka kerjakan punya dampak besar bagi kesuksesan bersama.",
    aktivitasTerkait: ["SPIRITUALIZING", "COUNSELING", "CONSERVING", "ADVISING"],
    typologyTerkait: ["CARETAKER", "MEDIATOR"],
  },
  {
    slotIndex: 25,
    id: "consistency",
    nama: "Consistency",
    julukanRemaja: "Si Adil & Taat Aturan",
    domain: "Striving",
    deskripsiKuat:
      "Kamu sangat menjunjung tinggi keadilan! Menurutmu, aturan dibuat supaya semua orang diperlakukan setara tanpa pilih kasih. Kamu merasa tenang saat bekerja di lingkungan yang tertib dan jelas SOP-nya.",
    saranLemah:
      "Sambil tetap menjaga aturan dasar, berikan sedikit ruang fleksibilitas jika ada teman yang memiliki kondisi khusus yang darurat.",
    aktivitasTerkait: ["COMPLIANCING", "INSPECTING", "MONITORING", "POLICING"],
    typologyTerkait: ["QUALITY CONTROLLER", "SAFEKEEPER", "ADMINISTRATOR"],
  },
  {
    slotIndex: 26,
    id: "context",
    nama: "Context",
    julukanRemaja: "Si Pembelajar Sejarah & Latar Belakang",
    domain: "Thinking",
    deskripsiKuat:
      "Supaya paham kondisi sekarang, kamu suka menelusuri bagaimana sejarah dan asal-usulnya di masa lalu. Mempelajari kisah sukses dan pengalaman terdahulu membuat keputusanmu lebih bijak.",
    saranLemah:
      "Karena kamu lebih suka langsung menatap masa depan daripada menoleh ke masa lalu, ajaklah rekan tim yang rajin mencatat dokumentasi untuk memeriksa rekam jejak proyek.",
    aktivitasTerkait: ["REPORTING", "TRANSCRIBING", "ARCHIVING", "RESEARCHING"],
    typologyTerkait: ["JOURNALIST", "ADMINISTRATOR"],
  },
  {
    slotIndex: 27,
    id: "deliberative",
    nama: "Deliberative",
    julukanRemaja: "Si Hati-Hati & Penakar Risiko",
    domain: "Striving",
    deskripsiKuat:
      "Kamu tidak suka asal melangkah! Sebelum mengambil keputusan, kamu sudah memikirkan kemungkinan risiko atau hambatan di depan serta menyiapkan pengamanannya dengan cermat.",
    saranLemah:
      "Biasakan mengecek ulang hal-hal penting sebelum mengambil keputusan besar agar terhindar dari kesalahan yang tidak perlu.",
    aktivitasTerkait: ["PURCHASING", "AUDITING", "INSPECTING", "SECURING"],
    typologyTerkait: ["EVALUATOR", "SAFEKEEPER", "QUALITY CONTROLLER"],
  },
  {
    slotIndex: 28,
    id: "futuristic",
    nama: "Futuristic",
    julukanRemaja: "Si Visioner Masa Depan",
    domain: "Thinking",
    deskripsiKuat:
      "Imajinasimu sering melompat jauh ke masa depan! Kamu senang membayangkan teknologi, impian, dan peluang-peluang keren di tahun-tahun mendatang serta membuat orang lain ikut bersemangat.",
    saranLemah:
      "Jika kamu lebih fokus pada tugas hari ini, sesekali ngobrollah dengan teman yang visioner untuk menyusun cita-cita jangka panjangmu.",
    aktivitasTerkait: ["VISIONING", "PLANNING", "DESIGNING"],
    typologyTerkait: ["VISIONARY", "STRATEGIST", "CREATOR"],
  },
  {
    slotIndex: 29,
    id: "ideation",
    nama: "Ideation",
    julukanRemaja: "Si Gudang Ide Kreatif",
    domain: "Thinking",
    deskripsiKuat:
      "Otakmu tidak pernah kehabisan ide-ide segar dan kreatif! Kamu pintar menggabungkan hal-hal unik menjadi terobosan baru yang belum pernah terpikirkan oleh orang lain sebelumnya.",
    saranLemah:
      "Saat membutuhkan ide baru, kamu bisa mencari referensi dari internet atau melakukan diskusi curah pendapat (brainstorming) bersama teman.",
    aktivitasTerkait: ["IDEATING", "CREATING", "DESIGNING", "SYNTHESIZING", "CONCEPTUALIZING"],
    typologyTerkait: ["CREATOR", "DESIGNER", "SYNTHESIZER"],
  },
  {
    slotIndex: 30,
    id: "input",
    nama: "Input",
    julukanRemaja: "Si Kolektor Ilmu & Informasi",
    domain: "Thinking",
    deskripsiKuat:
      "Rasa ingin tahumu sangat besar! Kamu suka membaca, menyimpan artikel menarik, mengumpulkan buku, data, atau benda-benda unik karena yakin suatu saat pasti akan berguna.",
    saranLemah:
      "Simpan dokumen atau tautan materi penting di satu folder khusus supaya mudah ditemukan kembali saat kamu membutuhkannya.",
    aktivitasTerkait: ["COLLECTING", "OBSERVING", "SURVEYING", "INFORMING"],
    typologyTerkait: ["EXPLORER", "JOURNALIST"],
  },
  {
    slotIndex: 31,
    id: "intellection",
    nama: "Intellection",
    julukanRemaja: "Si Pemikir Mendalam & Filosofis",
    domain: "Thinking",
    deskripsiKuat:
      "Kamu senang merenung dan memikirkan suatu topik sampai benar-benar paham ke akarnya. Suasana yang tenang membuat pikiranmu sangat tajam dan melahirkan pemikiran yang berbobot.",
    saranLemah:
      "Luangkan waktu tenang 10–15 menit untuk memikirkan dampak jangka panjang sebelum terburu-buru menyetujui sesuatu.",
    aktivitasTerkait: ["CONCEPTUALIZING", "RESEARCHING", "WRITING"],
    typologyTerkait: ["ANALYST", "EXPLORER", "CREATOR"],
  },
  {
    slotIndex: 32,
    id: "learner",
    nama: "Learner",
    julukanRemaja: "Si Pembelajar Cepat & Haus Ilmu",
    domain: "Thinking",
    deskripsiKuat:
      "Belajar hal baru adalah kesukaanmu! Kamu sangat menikmati proses dari yang awalnya belum tahu menjadi mahir, baik itu belajar koding, bahasa asing, alat musik, maupun keterampilan baru lainnya.",
    saranLemah:
      "Pilih cara belajar yang seru seperti menonton video tutorial singkat atau langsung praktik agar kamu tidak cepat bosan.",
    aktivitasTerkait: ["TEACHING", "TRAINING", "PROGRAMMING", "RESEARCHING"],
    typologyTerkait: ["EDUCATOR", "EXPLORER"],
  },
  {
    slotIndex: 33,
    id: "strategic",
    nama: "Strategic",
    julukanRemaja: "Si Perancang Taktik & Jalan Pintas Terbaik",
    domain: "Thinking",
    deskripsiKuat:
      "Saat menghadapi masalah yang rumit, kamu seperti pemain catur handal! Kamu cepat melihat gambaran besarnya dan langsung menemukan beberapa jalur alternatif paling cerdas untuk mencapai tujuan.",
    saranLemah:
      "Biasakan menuliskan 2 pilihan cara sebelum memulai proyek besar agar kamu punya rute cadangan jika jalan pertama macet.",
    aktivitasTerkait: ["STRATEGIZING", "PLANNING", "SYNTHESIZING", "GUIDING"],
    typologyTerkait: ["STRATEGIST", "SYNTHESIZER", "VISIONARY"],
  },
];

// ============================================================================
// 2. DEFINISI 30 STRENGTH TYPOLOGY (BAHASA SEGAR & MUDAH DIPAHAMI REMAJA/UMUM)
// ============================================================================
export const DAFTAR_30_PERSONAL_BRANDING: PersonalBrandingRole[] = [
  { id: "ARRANGER", nama: "ARRANGER", julukan: "Pengatur Tim & Sumber Daya", kategori: "HEADMAN", deskripsi: "Kamu pintar mengatur pembagian tugas, peralatan, dan jadwal banyak orang secara luwes agar proyek selesai dengan kompak." },
  { id: "COMMANDER", nama: "COMMANDER", julukan: "Kapten Pengambil Keputusan", kategori: "HEADMAN", deskripsi: "Kamu berani memimpin di depan, memberi arahan yang jelas saat situasi genting, dan memastikan tim mencapai target." },
  { id: "MEDIATOR", nama: "MEDIATOR", julukan: "Juru Damai yang Adil", kategori: "HEADMAN", deskripsi: "Kamu bijaksana dalam menengahi perbedaan pendapat dan mendamaikan teman atau pihak yang sedang berselisih." },
  { id: "SELLER", nama: "SELLER", julukan: "Negosiator & Pemasar Ulung", kategori: "HEADMAN", deskripsi: "Kamu jago meyakinkan orang lain tentang keunggulan sebuah karya, ide, atau produk hingga mereka tertarik bekerja sama." },
  { id: "SELECTOR", nama: "SELECTOR", julukan: "Pencari Bakat Terbaik", kategori: "HEADMAN", deskripsi: "Kamu punya kepekaan tajam dalam memilih dan menempatkan teman satu tim di posisi yang paling pas dengan keahlian mereka." },

  { id: "AMBASADOR", nama: "AMBASADOR", julukan: "Duta Persahabatan & Jejaring", kategori: "NETWORKING", deskripsi: "Kamu ramah, mudah akrab dengan orang baru, dan cocok mewakili sekolah, kampus, atau organisasi di acara luar." },
  { id: "COMMUNICATOR", nama: "COMMUNICATOR", julukan: "Bintang Komunikasi & Presentasi", kategori: "NETWORKING", deskripsi: "Kamu pandai menjelaskan topik yang rumit menjadi obrolan, presentasi, atau tulisan yang seru dan mudah dimengerti siapa saja." },
  { id: "EDUCATOR", nama: "EDUCATOR", julukan: "Pendidik & Pembimbing Sabar", kategori: "NETWORKING", deskripsi: "Kamu telaten dan sabar mengajari orang lain sampai mereka benar-benar paham dan berkembang sesuai gaya belajar mereka." },
  { id: "MOTIVATOR", nama: "MOTIVATOR", julukan: "Penyulut Semangat & Inspirasi", kategori: "NETWORKING", deskripsi: "Kamu senang menyemangati teman-temanmu agar percaya diri dan berani mengeluarkan kemampuan terbaik mereka." },

  { id: "CARETAKER", nama: "CARETAKER", julukan: "Sahabat Peduli & Penolong", kategori: "SERVICING", deskripsi: "Kamu penuh empati, tulus merawat, dan selalu sigap mendampingi orang lain yang sedang membutuhkan bantuan fisik maupun hati." },
  { id: "SERVER", nama: "SERVER", julukan: "Pelayan Terbaik & Amanah", kategori: "SERVICING", deskripsi: "Kamu punya hati yang tulus untuk membantu, melayani kebutuhan banyak orang dengan ramah, dan sangat bertanggung jawab." },

  { id: "CREATOR", nama: "CREATOR", julukan: "Pencipta Ide & Karya Baru", kategori: "GENERATING IDEA", deskripsi: "Kepalamu penuh dengan ide kreatif dan imajinasi segar untuk menciptakan karya atau terobosan yang belum pernah ada." },
  { id: "DESIGNER", nama: "DESIGNER", julukan: "Perancang Desain & Sistem", kategori: "GENERATING IDEA", deskripsi: "Kamu ahli memadukan keindahan visual dengan rancangan teknis untuk membuat sketsa, cetak biru, atau desain aplikasi." },
  { id: "MARKETER", nama: "MARKETER", julukan: "Perancang Strategi Promosi", kategori: "GENERATING IDEA", deskripsi: "Kamu pintar meracik strategi kreatif supaya sebuah kegiatan, produk, atau karya dikenal luas dan disukai banyak orang." },
  { id: "STRATEGIST", nama: "STRATEGIST", julukan: "Arsitek Taktik & Strategi", kategori: "GENERATING IDEA", deskripsi: "Kamu mampu melihat gambaran besar masalah dan menyusun langkah-langkah paling cerdas untuk mencapai cita-cita." },
  { id: "SYNTHESIZER", nama: "SYNTHESIZER", julukan: "Peramu Berbagai Gagasan", kategori: "GENERATING IDEA", deskripsi: "Kamu pandai menggabungkan berbagai informasi dan ide yang terpisah-pisah menjadi satu kesimpulan baru yang utuh." },
  { id: "VISIONARY", nama: "VISIONARY", julukan: "Penatap Masa Depan", kategori: "GENERATING IDEA", deskripsi: "Kamu mampu melihat peluang masa depan lebih awal dan menginspirasi teman-temanmu untuk mengejar impian besar." },

  { id: "ANALYST", nama: "ANALYST", julukan: "Pembedah Data & Logika", kategori: "THINKING", deskripsi: "Kamu suka mengolah data, mencari pola logika, dan mengupas tuntas penyebab suatu kejadian secara objektif." },
  { id: "TREASURER", nama: "TREASURER", julukan: "Bendahara & Pengelola Dana", kategori: "THINKING", deskripsi: "Kamu teliti, jujur, dan rapi dalam mencatat keluar-masuknya uang serta menyusun rencana anggaran biaya." },
  { id: "EVALUATOR", nama: "EVALUATOR", julukan: "Pemeriksa Mutu & Akurasi", kategori: "THINKING", deskripsi: "Kamu cermat menilai kualitas suatu pekerjaan, mengecek kebenaran data, dan menakar risiko sebelum bertindak." },
  { id: "EXPLORER", nama: "EXPLORER", julukan: "Peneliti & Penjelajah Ilmu", kategori: "THINKING", deskripsi: "Kamu punya rasa ingin tahu yang tinggi untuk terus belajar, mengamati fenomena, dan melakukan riset mendalam." },
  { id: "RESTORER", nama: "RESTORER", julukan: "Ahli Pemulihan & Troubleshooting", kategori: "THINKING", deskripsi: "Kamu tangguh mencari letak kerusakan pada alat, program, atau sistem kerja dan memperbaikinya sampai lancar kembali." },

  { id: "ADMINISTRATOR", nama: "ADMINISTRATOR", julukan: "Penata Dokumen & Aturan", kategori: "ELEMENTARY", deskripsi: "Kamu rapi dalam mengurus arsip, jadwal kegiatan, dan memastikan semua prosedur berjalan tertib sesuai aturan." },
  { id: "INTERPRETER", nama: "INTERPRETER", julukan: "Penerjemah Bahasa & Makna", kategori: "ELEMENTARY", deskripsi: "Kamu terampil menerjemahkan bahasa maupun menguraikan istilah sulit agar mudah dipahami oleh semua kalangan." },
  { id: "JOURNALIST", nama: "JOURNALIST", julukan: "Penulis Berita & Dokumentasi", kategori: "ELEMENTARY", deskripsi: "Kamu cekatan menulis laporan, menyunting naskah, dan mendokumentasikan peristiwa secara menarik dan akurat." },

  { id: "DISTRIBUTOR", nama: "DISTRIBUTOR", julukan: "Penyalur Logistik & Informasi", kategori: "TECHNICAL", deskripsi: "Kamu sigap mengatur pengiriman dan pembagian barang, perlengkapan, atau informasi agar sampai tepat waktu." },
  { id: "OPERATOR", nama: "OPERATOR", julukan: "Pengendali Alat & Mesin", kategori: "TECHNICAL", deskripsi: "Kamu terampil mengoperasikan perangkat keras, mesin, atau peralatan teknis di lapangan dengan stabil dan aman." },
  { id: "PRODUCER", nama: "PRODUCER", julukan: "Pembangun & Penghasil Karya Nyata", kategori: "TECHNICAL", deskripsi: "Kamu senang bekerja praktik merakit, membangun, dan menghasilkan produk nyata sampai benar-benar siap dipakai." },
  { id: "QUALITY CONTROLLER", nama: "QUALITY CONTROLLER", julukan: "Penjaga Standar Kualitas", kategori: "TECHNICAL", deskripsi: "Kamu teliti memeriksa hasil akhir pekerjaan dan menguji alat agar berfungsi sempurna tanpa cacat." },
  { id: "SAFEKEEPER", nama: "SAFEKEEPER", julukan: "Pelindung Keamanan & Keselamatan", kategori: "TECHNICAL", deskripsi: "Kamu waspada dan bertanggung jawab menjaga keselamatan teman, keamanan lingkungan, serta keutuhan inventaris." },
];

// ============================================================================
// 3. DAFTAR 170 SOAL SESI 1 (MODIFIKASI BEBAS HAK CIPTA)
// ============================================================================
export const SOAL_SESI_1_170: { no: number; pernyataan: string; slotIndex: number }[] = [
  { no: 1, slotIndex: 0, pernyataan: "Saya memiliki kemampuan membawakan presentasi yang memikat audiens." },
  { no: 2, slotIndex: 1, pernyataan: "Saya mampu menangkap pesan tersirat maupun emosi yang tidak diungkapkan secara langsung." },
  { no: 3, slotIndex: 2, pernyataan: "Saat terjadi perdebatan, saya berupaya menemukan titik temu dasar yang dapat diterima kedua pihak." },
  { no: 4, slotIndex: 3, pernyataan: "Saya merasa nyaman berada di lingkungan inklusif yang tidak membedakan latar belakang maupun kepribadian." },
  { no: 5, slotIndex: 4, pernyataan: "Secara alami, saya peka dalam mengenali titik kekuatan serta area pengembangan setiap orang." },
  { no: 6, slotIndex: 5, pernyataan: "Saya mengutamakan membangun hubungan yang lebih mendalam dengan rekan yang sudah dikenal." },
  { no: 7, slotIndex: 6, pernyataan: "Memegang teguh dan melunasi setiap komitmen yang saya buat adalah prinsip utama saya." },
  { no: 8, slotIndex: 7, pernyataan: "Saya tidak ragu mengemukakan dan mempertahankan argumen agar diikuti orang lain." },
  { no: 9, slotIndex: 8, pernyataan: "Bagi saya, mencapai posisi puncak dan kemenangan adalah orientasi utama." },
  { no: 10, slotIndex: 9, pernyataan: "Saya merasakan kepuasan batin ketika menyaksikan pertumbuhan dan kemajuan orang lain." },
  { no: 11, slotIndex: 10, pernyataan: "Saya tertantang untuk memoles sesuatu yang sudah bagus agar mencapai tingkat kesempurnaan lebih tinggi." },
  { no: 12, slotIndex: 11, pernyataan: "Saya menjalani rutinitas harian dengan antusiasme dan gairah yang tinggi." },
  { no: 13, slotIndex: 12, pernyataan: "Saya luwes dalam mendobrak kekakuan pembicaraan awal di lingkungan baru." },
  { no: 14, slotIndex: 13, pernyataan: "Dinamika lingkungan kerja yang padat dan penuh mobilitas justru meningkatkan motivasi saya." },
  { no: 15, slotIndex: 14, pernyataan: "Saya terdorong untuk segera mengeksekusi langkah nyata tanpa terlalu lama menunggu." },
  { no: 16, slotIndex: 15, pernyataan: "Menurut pandangan saya, ritme kehidupan menuntut ketepatan dan kecepatan dalam bertindak." },
  { no: 17, slotIndex: 16, pernyataan: "Saya bersedia mendahulukan kebutuhan orang lain di atas kepentingan pribadi." },
  { no: 18, slotIndex: 17, pernyataan: "Saya senantiasa merancang skedul kerja yang rapi dan terstruktur." },
  { no: 19, slotIndex: 18, pernyataan: "Adanya target yang jelas menjadi pendorong utama bagi setiap langkah tindakan saya." },
  { no: 20, slotIndex: 19, pernyataan: "Saya memiliki ketahanan tinggi dalam menyelesaikan persoalan yang berulang tanpa kehilangan fokus." },
  { no: 21, slotIndex: 20, pernyataan: "Ketika saya sudah meyakini suatu kebenaran, pendirian saya kokoh dan tidak gampang digoyahkan." },
  { no: 22, slotIndex: 21, pernyataan: "Saya berkeinginan untuk dikenal atas keunikan dan keistimewaan yang saya miliki." },
  { no: 23, slotIndex: 22, pernyataan: "Saya menyukai data karena menyajikan fakta objektif yang terbebas dari bias personal." },
  { no: 24, slotIndex: 23, pernyataan: "Saya menguasai berbagai akses dan sarana untuk menuntaskan pekerjaan dengan baik." },
  { no: 25, slotIndex: 24, pernyataan: "Saya meyakini adanya pertolongan tak terlihat dan takdir di balik setiap peristiwa." },
  { no: 26, slotIndex: 25, pernyataan: "Saya menerapkan standar perlakuan yang adil dan seragam kepada semua orang sesuai aturan baku." },
  { no: 27, slotIndex: 26, pernyataan: "Mengkaji sejarah dan rekaman peristiwa masa lalu senantiasa menarik minat saya." },
  { no: 28, slotIndex: 27, pernyataan: "Kewaspadaan membuat saya memperhitungkan segala kemungkinan secara matang sebelum melangkah." },
  { no: 29, slotIndex: 28, pernyataan: "Saya gemar memvisualisasikan ide-ide serta skenario positif mengenai masa depan." },
  { no: 30, slotIndex: 29, pernyataan: "Merumuskan konsep abstrak menjadi bentuk kerangka kerja yang jelas adalah keahlian saya." },
  { no: 31, slotIndex: 30, pernyataan: "Rasa dorongan ingin tahu yang tinggi membuat saya selalu mengeksplorasi ragam hal baru." },
  { no: 32, slotIndex: 31, pernyataan: "Saya meluangkan waktu untuk berkontemplasi dan mengevaluasi pemikiran serta tindakan pribadi." },
  { no: 33, slotIndex: 32, pernyataan: "Saya tertarik berada di bidang industri yang mengalami perubahan serta inovasi cepat." },
  { no: 34, slotIndex: 33, pernyataan: "Saya mampu merancang bermacam rute alternatif untuk merealisasikan sasaran." },
  { no: 35, slotIndex: 0, pernyataan: "Saya terbiasa menyederhanakan gagasan rumit agar mudah dipahami oleh orang lain." },
  { no: 36, slotIndex: 1, pernyataan: "Perasaan saya sangat peka sehingga mudah tersentuh oleh momen emosional." },
  { no: 37, slotIndex: 2, pernyataan: "Saya selalu berusaha menempatkan diri pada sudut pandang orang lain." },
  { no: 38, slotIndex: 3, pernyataan: "Dalam pandangan saya, setiap individu memiliki bobot kepentingan dan nilai yang sederajat." },
  { no: 39, slotIndex: 4, pernyataan: "Saya peka mengamati keunikan karakter serta perbedaan mendasar pada tiap-tiap orang." },
  { no: 40, slotIndex: 5, pernyataan: "Membangun hubungan ikatan pertemanan yang tulus dan jujur adalah hal yang sangat saya hargai." },
  { no: 41, slotIndex: 6, pernyataan: "Saya memiliki dorongan kuat untuk memastikan pekerjaan diselesaikan secara benar." },
  { no: 42, slotIndex: 7, pernyataan: "Saya memegang teguh prinsip pribadi, walaupun terkadang dinilai agak keras kepala." },
  { no: 43, slotIndex: 8, pernyataan: "Suasana kompetisi justru memberi warna dan daya tarik tersendiri dalam aktivitas saya." },
  { no: 44, slotIndex: 9, pernyataan: "Saya merasa bahagia saat bisa memfasilitasi dan mengantarkan orang lain menuju sukses." },
  { no: 45, slotIndex: 10, pernyataan: "Fokus utama saya tertuju pada pengembangan potensi positif ketimbang meratapi kelemahan." },
  { no: 46, slotIndex: 11, pernyataan: "Saya senantiasa menyebarkan aura ceria dan optimisme kepada orang-orang di sekitar." },
  { no: 47, slotIndex: 12, pernyataan: "Saya jarang mengalami kesulitan dalam merangkai kata-kata saat berkomunikasi." },
  { no: 48, slotIndex: 13, pernyataan: "Tingkat energi dan semangat saya mendadak turun apabila tidak ada kegiatan." },
  { no: 49, slotIndex: 14, pernyataan: "Saat keputusan resmi disepakati, saya segera bergerak mengeksekusinya." },
  { no: 50, slotIndex: 15, pernyataan: "Saya memiliki fleksibilitas tinggi dalam menyesuaikan diri dengan situasi apa pun." },
  { no: 51, slotIndex: 16, pernyataan: "Saya senang mengulurkan bantuan tanpa mengharapkan imbalan balik." },
  { no: 52, slotIndex: 17, pernyataan: "Saya menikmati proses menciptakan sistem dan struktur yang teratur." },
  { no: 53, slotIndex: 18, pernyataan: "Saya selalu menetapkan prioritas kerja berdasarkan urutan target sasaran." },
  { no: 54, slotIndex: 19, pernyataan: "Menganalisis kerusakan atau kendala dan memperbaikinya adalah kesukaan saya." },
  { no: 55, slotIndex: 20, pernyataan: "Saya memiliki intuisi yang tajam dalam merasakan hal-hal yang belum terjadi." },
  { no: 56, slotIndex: 21, pernyataan: "Menjaga nama baik, kehormatan, dan reputasi adalah aspek penting bagi saya." },
  { no: 57, slotIndex: 22, pernyataan: "Saya rajin mengonfirmasi validitas data untuk menjamin keakuratannya." },
  { no: 58, slotIndex: 23, pernyataan: "Saya dapat melihat potensi kerja sama dari penggabungan kekuatan orang yang berbeda-beda." },
  { no: 59, slotIndex: 24, pernyataan: "Pola pikir dan tindakan saya berlandaskan pada nilai-nilai spiritualitas." },
  { no: 60, slotIndex: 25, pernyataan: "Saya menjaga sikap netral dan tidak memihak dalam memutus perkara." },
  { no: 61, slotIndex: 26, pernyataan: "Mempelajari dan membedah studi kasus nyata memberikan pembelajaran berharga bagi saya." },
  { no: 62, slotIndex: 27, pernyataan: "Saya bersikap hati-hati dalam memberikan apresiasi agar penilaian tetap objektif." },
  { no: 63, slotIndex: 28, pernyataan: "Saya senang memetakan dan menceritakan visi masa depan yang penuh peluang." },
  { no: 64, slotIndex: 29, pernyataan: "Pikiran saya tidak pernah berhenti menghasilkan ide-ide baru dan inovatif." },
  { no: 65, slotIndex: 30, pernyataan: "Saya gemar mengumpulkan dan mengoleksi berbagai informasi atau benda yang menarik." },
  { no: 66, slotIndex: 31, pernyataan: "Aktivitas olah pikir dan pemecahan logika teka-teki sangat menantang bagi saya." },
  { no: 67, slotIndex: 32, pernyataan: "Saya menyukai tantangan dalam mempelajari konsep dan keterampilan baru." },
  { no: 68, slotIndex: 33, pernyataan: "Saya merasa bersemangat ketika merencanakan strategi jangka menengah dan panjang." },
  { no: 69, slotIndex: 0, pernyataan: "Saya mampu mengemas gagasan biasa menjadi menarik dan bernilai jual." },
  { no: 70, slotIndex: 1, pernyataan: "Saya mahir mengekspresikan perasaan dengan diksi dan intonasi suara yang pas." },
  { no: 71, slotIndex: 2, pernyataan: "Saya memprioritaskan konsensus dan dukungan bersama ketimbang memaksakan kehendak." },
  { no: 72, slotIndex: 3, pernyataan: "Saya berupaya merangkul dan memperluas jejaring agar semua orang merasa diterima." },
  { no: 73, slotIndex: 4, pernyataan: "Secara spontan, saya suka mengamati bagaimana orang lain memproses pemikirannya." },
  { no: 74, slotIndex: 5, pernyataan: "Menjalin dan memelihara hubungan persahabatan adalah hal yang menyenangkan bagi saya." },
  { no: 75, slotIndex: 6, pernyataan: "Jika terjadi kekeliruan, saya bertanggung jawab memperbaikinya tanpa menghitung biaya dan waktu." },
  { no: 76, slotIndex: 7, pernyataan: "Saya menyukai peran kepemimpinan dan mengambil kendali atas keputusan penting." },
  { no: 77, slotIndex: 8, pernyataan: "Saya berpendirian teguh dan enggan untuk sekadar mengalah." },
  { no: 78, slotIndex: 9, pernyataan: "Saya senang membimbing dan mempersiapkan generasi muda untuk masa depan mereka." },
  { no: 79, slotIndex: 10, pernyataan: "Saya enggan membuang energi untuk pekerjaan yang hasilnya tergolong biasa-biasa saja." },
  { no: 80, slotIndex: 11, pernyataan: "Saya mampu mencairkan suasana dan membawa semangat kegembiraan dalam kelompok." },
  { no: 81, slotIndex: 12, pernyataan: "Saya mudah meraih kepercayaan awal saat pertama kali berinteraksi dengan orang lain." },
  { no: 82, slotIndex: 13, pernyataan: "Bagi saya, kerja keras merupakan bahan bakar utama motivasi diri." },
  { no: 83, slotIndex: 14, pernyataan: "Saya tetap melangkah mengambil tindakan walau dihadapkan pada rintangan berat." },
  { no: 84, slotIndex: 15, pernyataan: "Perubahan alur rencana yang mendadak tidak sampai mengganggu fokus dan emosi saya." },
  { no: 85, slotIndex: 16, pernyataan: "Saya terbiasa mendahulukan kepentingan bersama dibandingkan kebutuhan pribadi." },
  { no: 86, slotIndex: 17, pernyataan: "Kehidupan harian saya dikelola secara tertata dan sistematis." },
  { no: 87, slotIndex: 18, pernyataan: "Saya konsisten berjalan di jalur dan komitmen yang telah ditetapkan awal." },
  { no: 88, slotIndex: 19, pernyataan: "Memberikan perbaikan hingga kondisi kembali sedia kala memberikan kepuasan tersendiri." },
  { no: 89, slotIndex: 20, pernyataan: "Saya percaya diri atas kemampuan khas yang membedakan saya dari orang lain." },
  { no: 90, slotIndex: 21, pernyataan: "Saya memiliki ambisi untuk diakui sebagai sosok yang profesional, teruji, dan tepercaya." },
  { no: 91, slotIndex: 22, pernyataan: "Saya cermat dalam mengurai pola dan keterkaitan yang tersirat di dalam sekumpulan data." },
  { no: 92, slotIndex: 23, pernyataan: "Saya mampu menangani beberapa proyek sekaligus secara paralel tanpa kehilangan kendali." },
  { no: 93, slotIndex: 24, pernyataan: "Saya meyakini bahwa setiap kesulitan selalu menyimpan pelajaran berharga." },
  { no: 94, slotIndex: 25, pernyataan: "Prinsip yang saya pegang adalah menjunjung tinggi keadilan tanpa tebang pilih." },
  { no: 95, slotIndex: 26, pernyataan: "Saya rutin merekap intisari pertemuan sebagai dokumen rujukan di kemudian hari." },
  { no: 96, slotIndex: 27, pernyataan: "Kewaspadaan membuat saya menyusun rencana secara mendetail dan terperinci." },
  { no: 97, slotIndex: 28, pernyataan: "Saya mampu menangkap dengan jelas berbagai proyeksi masa depan." },
  { no: 98, slotIndex: 29, pernyataan: "Saya senang menghubungkan berbagai gagasan yang tampaknya tidak berkaitan." },
  { no: 99, slotIndex: 30, pernyataan: "Dorongan rasa ingin tahu memicu saya untuk terus menggali informasi variatif." },
  { no: 100, slotIndex: 31, pernyataan: "Saya menikmati dinamika proses berpikir dan mendalami pengetahuan baru." },
  { no: 101, slotIndex: 32, pernyataan: "Saya antusias untuk mempelajari berbagai wawasan baru." },
  { no: 102, slotIndex: 33, pernyataan: "Kerumitan perencanaan yang dirasakan orang lain tampak sederhana bagi saya karena pola utamanya terlihat transparan." },
  { no: 103, slotIndex: 0, pernyataan: "Saya percaya diri dan menikmati momen tampil berbicara di hadapan publik." },
  { no: 104, slotIndex: 1, pernyataan: "Saya dapat meletakkan perasaan saya pada posisi emosi orang lain." },
  { no: 105, slotIndex: 2, pernyataan: "Saya bersikap terbuka dan toleran terhadap keberagaman cara pandang." },
  { no: 106, slotIndex: 3, pernyataan: "Saya tertantang untuk membuat setiap anggota kelompok merasa dihargai dan penting." },
  { no: 107, slotIndex: 4, pernyataan: "Saya memiliki insting untuk mengetahui pendekatan paling efektif bagi tiap-tiap orang." },
  { no: 108, slotIndex: 5, pernyataan: "Saya secara proaktif menjaga komunikasi untuk mengetahui kabar dan kondisi kawan-kawan." },
  { no: 109, slotIndex: 6, pernyataan: "Saya tidak kompromi terhadap kualitas hanya demi mengejar kecepatan waktu." },
  { no: 110, slotIndex: 7, pernyataan: "Saya memiliki keberanian untuk melakukan konfrontasi langsung saat diperlukan." },
  { no: 111, slotIndex: 8, pernyataan: "Target saya adalah selalu mencapai predikat yang terbaik dan nomor satu." },
  { no: 112, slotIndex: 9, pernyataan: "Saya selalu siap mengulurkan ketulusan untuk membantu orang yang membutuhkan." },
  { no: 113, slotIndex: 10, pernyataan: "Hasil yang sekadar rata-rata tidak cukup bagi saya; kesempurnaan dan kualitas tertinggi adalah keharusan." },
  { no: 114, slotIndex: 11, pernyataan: "Saya memanfaatkan selera humor untuk meredam kekakuan maupun ketegangan suasana." },
  { no: 115, slotIndex: 12, pernyataan: "Saya merasa penasaran jika belum menyapa orang di sekitar yang belum saya kenal." },
  { no: 116, slotIndex: 13, pernyataan: "Saya merasa kurang puas apabila tidak menghasilkan output konkret setiap harinya." },
  { no: 117, slotIndex: 14, pernyataan: "Bagi saya, eksekusi cepat jauh lebih berharga daripada analisis perencanaan yang berkepanjangan." },
  { no: 118, slotIndex: 15, pernyataan: "Saya sangat adaptif terhadap perubahan situasi maupun tantangan baru." },
  { no: 119, slotIndex: 16, pernyataan: "Menjaga tata krama dan etika kesopanan merupakan hal mutlak dalam pandangan saya." },
  { no: 120, slotIndex: 17, pernyataan: "Segala alur kegiatan idealnya dapat diprediksi dan dirancang sejak awal." },
  { no: 121, slotIndex: 18, pernyataan: "Saya disiplin dalam menyeleksi dan memprioritaskan tugas-tugas terpenting saja." },
  { no: 122, slotIndex: 19, pernyataan: "Kehadiran permasalahan baru justru membangkitkan gairah berpikir saya." },
  { no: 123, slotIndex: 20, pernyataan: "Saya yakin dan tidak ragu atas ketepatan keputusan yang telah saya tetapkan." },
  { no: 124, slotIndex: 21, pernyataan: "Apresiasi dan pengakuan atas capaian kemampuan memberi dorongan positif bagi saya." },
  { no: 125, slotIndex: 22, pernyataan: "Saya selalu menuntut pembuktian berbasis fakta dan bukti empiris yang valid." },
  { no: 126, slotIndex: 23, pernyataan: "Saya memegang keyakinan bahwa senantiasa tersedia solusi alternatif untuk tiap rintangan." },
  { no: 127, slotIndex: 24, pernyataan: "Saya menolak memanfaatkan orang lain demi keuntungan pribadi semata." },
  { no: 128, slotIndex: 25, pernyataan: "Saya merasa nyaman bekerja pada sistem yang konsisten menerapkan regulasi baku." },
  { no: 129, slotIndex: 26, pernyataan: "Mempelajari perjalanan sejarah dan latar belakang masa lalu selalu memikat minat saya." },
  { no: 130, slotIndex: 27, pernyataan: "Saya senantiasa bersikap mawas diri dan berhati-hati sebelum melangkah." },
  { no: 131, slotIndex: 28, pernyataan: "Saya menyimpan banyak visi dan impian besar mengenai kemajuan masa depan." },
  { no: 132, slotIndex: 29, pernyataan: "Saya gemar mengeksplorasi suatu masalah dari bermacam sudut pandang yang berbeda." },
  { no: 133, slotIndex: 30, pernyataan: "Saya merasa wawasan yang saya miliki belum pernah cukup dan selalu ingin belajar lagi." },
  { no: 134, slotIndex: 31, pernyataan: "Saya menyukai ruang diskusi yang membedah pandangan hidup dan pemikiran filosofis." },
  { no: 135, slotIndex: 32, pernyataan: "Keterlibatan pada tugas yang memperluas kapasitas ilmu pengetahuan sangat memotivasi saya." },
  { no: 136, slotIndex: 33, pernyataan: "Saya mahir mengurai benturan masalah rumit menjadi opsi tindakan terbaik." },
  { no: 137, slotIndex: 0, pernyataan: "Saya terampil mentransformasi kisah sederhana menjadi paparan naratif yang memikat." },
  { no: 138, slotIndex: 1, pernyataan: "Sensitivitas emosional saya tinggi terhadap suasana hati orang-orang di sekitar." },
  { no: 139, slotIndex: 2, pernyataan: "Saya terdorong untuk menjembatani dan mendamaikan perbedaan pandangan antarpihak." },
  { no: 140, slotIndex: 3, pernyataan: "Bagi saya, tidak ada satu orang pun yang layak diabaikan atau disisihkan." },
  { no: 141, slotIndex: 4, pernyataan: "Saya memiliki fleksibilitas pendekatan yang disesuaikan dengan keunikan tiap individu." },
  { no: 142, slotIndex: 5, pernyataan: "Berada di tengah lingkaran sahabat memberikan suntikan energi positif bagi saya." },
  { no: 143, slotIndex: 6, pernyataan: "Janji yang telah terucap menjadi beban moral yang wajib saya penuhi." },
  { no: 144, slotIndex: 7, pernyataan: "Saya lebih menyukai komunikasi yang lugas, terbuka, dan jujur tanpa tendensi tertutup." },
  { no: 145, slotIndex: 8, pernyataan: "Saya tergerak untuk senantiasa mengungguli pencapaian standar orang lain." },
  { no: 146, slotIndex: 9, pernyataan: "Saya meyakini bahwa membantu sesama pada hakikatnya akan membawa kebaikan bagi diri sendiri." },
  { no: 147, slotIndex: 10, pernyataan: "Hal-hal yang bersifat megah, luar biasa, dan berstandar tinggi selalu menarik perhatian saya." },
  { no: 148, slotIndex: 11, pernyataan: "Saya tidak segan melontarkan pujian tulus atas pencapaian orang lain." },
  { no: 149, slotIndex: 12, pernyataan: "Bagi saya tidak ada istilah 'orang asing', mereka adalah teman yang belum sempat berkenalan." },
  { no: 150, slotIndex: 13, pernyataan: "Saya memiliki stamina tinggi untuk bekerja dalam durasi waktu yang panjang." },
  { no: 151, slotIndex: 14, pernyataan: "Saya berani mengambil tindakan cepat walau informasi yang tersedia belum sempurna." },
  { no: 152, slotIndex: 15, pernyataan: "Saya selalu dalam posisi sigap untuk merespons tuntutan keadaan kapan saja." },
  { no: 153, slotIndex: 16, pernyataan: "Cita-cita terbesar saya adalah memberikan kontribusi bermanfaat bagi kemanusiaan dan lingkungan." },
  { no: 154, slotIndex: 17, pernyataan: "Saya kurang nyaman apabila terjadi pergeseran alur yang melenceng dari rencana awal." },
  { no: 155, slotIndex: 18, pernyataan: "Secara naluriah, saya melangkah seirama dengan tujuan utama yang telah disepakati." },
  { no: 156, slotIndex: 19, pernyataan: "Saya cepat mengidentifikasi akar masalah yang sering kali terlewatkan oleh orang lain." },
  { no: 157, slotIndex: 20, pernyataan: "Saya selalu mempunyai gambaran tindakan cepat dalam mengantisipasi skenario yang terjadi." },
  { no: 158, slotIndex: 21, pernyataan: "Tampil di hadapan khalayak ramai justru memicu antusiasme dan energi saya." },
  { no: 159, slotIndex: 22, pernyataan: "Saya mengandalkan ketajaman bernalar dan alur berpikir logis yang kuat." },
  { no: 160, slotIndex: 23, pernyataan: "Saya menikmati skenario pengelolaan banyak elemen yang rumit dan beragam." },
  { no: 161, slotIndex: 24, pernyataan: "Saya sangat menghindari tindakan yang berpotensi menyakiti atau mengganggu kenyamanan orang lain." },
  { no: 162, slotIndex: 25, pernyataan: "Saya menentang praktik nepotisme atau perlakuan khusus berbasis ikatan kekeluargaan." },
  { no: 163, slotIndex: 26, pernyataan: "Saya merasa perlu membedah konteks historis sebelum menangani masalah atau orang baru." },
  { no: 164, slotIndex: 27, pernyataan: "Saya selalu menakar risiko dan dampak negatif potensi kegagalan sebelum bertindak." },
  { no: 165, slotIndex: 28, pernyataan: "Saya sangat menyukai sesi penyusunan visi dan strategi arah masa depan." },
  { no: 166, slotIndex: 29, pernyataan: "Saya senang bertukar ide, wawasan, serta inspirasi kepada orang banyak." },
  { no: 167, slotIndex: 30, pernyataan: "Saya gemar menghimpun referensi, materi, dan barang-barang yang unik." },
  { no: 168, slotIndex: 31, pernyataan: "Saya menikmati proses perenungan mendalam untuk menemukan gagasan segar." },
  { no: 169, slotIndex: 32, pernyataan: "Setiap tantangan baru saya pandang sebagai wadah meningkatkan kapasitas diri." },
  { no: 170, slotIndex: 33, pernyataan: "Saya peka dalam mengantisipasi timbulnya masalah sekaligus menyiapkan solusinya." },
];

// ============================================================================
// 4. DAFTAR 114 AKTIVITAS SESI 2 (BAHASA DESKRIPSI SEGAR & MUDAH DIPAHAMI)
// ============================================================================
export const SOAL_SESI_2_114_SCM: ActivityClusterItem[] = [
  { no: 1, kodeAktivitas: "CONCEPTUALIZING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Merancang acuan dan garis besar langkah masa depan berdasarkan pengamatan, pengalaman, serta keyakinan pribadi.", deskripsiSingkat: "Menyusun konsep dasar dan kerangka berpikir utama dari suatu gagasan", bobotBakatIds: ["ideation", "intellection", "strategic"], typology: "CREATOR" },
  { no: 2, kodeAktivitas: "EDITING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Mengedit dan menyempurnakan karangan naskah sebelum dipublikasikan ke publik.", deskripsiSingkat: "Memperbaiki dan merapikan naskah tulisan agar enak dibaca", bobotBakatIds: ["communication", "maximizer", "discipline"], typology: "JOURNALIST" },
  { no: 3, kodeAktivitas: "REDACTING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Menentukan pokok gagasan serta merestrukturisasi berkas tulisan yang siap diedarkan.", deskripsiSingkat: "Menata ulang alur dan pokok pikiran dokumen publikasi", bobotBakatIds: ["communication", "input", "arranger"], typology: "JOURNALIST" },
  { no: 4, kodeAktivitas: "REPORTING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Melaporkan dan mengomunikasikan perkembangan situasi yang sedang atau telah berlangsung secara lisan maupun tertulis.", deskripsiSingkat: "Menyampaikan laporan kejadian atau progres kegiatan secara jelas", bobotBakatIds: ["communication", "context", "responsibility"], typology: "JOURNALIST" },
  { no: 5, kodeAktivitas: "WRITING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Menyusun karya tulis, materi edukasi, cerita, maupun gagasan konseptual.", deskripsiSingkat: "Menulis artikel, cerita, modul belajar, atau ide tertulis", bobotBakatIds: ["communication", "ideation", "intellection"], typology: "JOURNALIST" },
  { no: 6, kodeAktivitas: "INTERPRETING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Menerangkan dan menguraikan substansi serta makna mendasar dari suatu topik.", deskripsiSingkat: "Menguraikan arti penting dari suatu istilah atau topik rumit", bobotBakatIds: ["communication", "intellection", "individualization"], typology: "INTERPRETER" },
  { no: 7, kodeAktivitas: "TRANSCRIBING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Menyadur ulang isi ringkasan atau naskah steno secara terperinci dan rinci.", deskripsiSingkat: "Mencatat ulang hasil pembicaraan atau rapat secara lengkap", bobotBakatIds: ["discipline", "context", "responsibility"], typology: "ADMINISTRATOR" },
  { no: 8, kodeAktivitas: "TRANSLATING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Mengalihbahasakan pesan lisan maupun tertulis agar mudah dimengerti audiens dari latar bahasa berbeda.", deskripsiSingkat: "Menerjemahkan bahasa asing agar mudah dipahami", bobotBakatIds: ["communication", "learner", "input"], typology: "INTERPRETER" },
  { no: 9, kodeAktivitas: "COMPLIANCING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Menjalankan serta menegakkan kedisiplinan sesuai ketentuan dan regulasi baku.", deskripsiSingkat: "Menjaga ketertiban dan memastikan aturan bersama dipatuhi", bobotBakatIds: ["consistency", "responsibility", "deliberative", "belief"], typology: "ADMINISTRATOR" },
  { no: 10, kodeAktivitas: "FILING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Mengarsip berkas pada tempat yang tepat agar mempermudah proses pencarian ulang.", deskripsiSingkat: "Merapikan penyimpanan file dan dokumen agar mudah dicari", bobotBakatIds: ["discipline", "consistency", "input"], typology: "ADMINISTRATOR" },
  { no: 11, kodeAktivitas: "HOUSEKEEPING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Menata, membersihkan, serta merapikan sarana kerja maupun area ruangan.", deskripsiSingkat: "Menata kebersihan dan kerapian ruang belajar atau ruang kerja", bobotBakatIds: ["discipline", "responsibility", "belief"], typology: "SERVER" },
  { no: 12, kodeAktivitas: "ORGANISING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Merancang dan mengoordinasikan susunan acara, tata kerja, serta mekanisme prosedur.", deskripsiSingkat: "Menyusun kepanitiaan, alur acara, dan tata cara kerja", bobotBakatIds: ["arranger", "discipline", "responsibility"], typology: "ADMINISTRATOR" },
  { no: 13, kodeAktivitas: "SCHEDULING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Menyusun urutan prioritas tindakan untuk periode waktu tertentu.", deskripsiSingkat: "Membuat jadwal kegiatan harian/mingguan yang teratur", bobotBakatIds: ["discipline", "focus", "arranger"], typology: "ADMINISTRATOR" },
  { no: 14, kodeAktivitas: "TYPEWRITING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Menginput data dan mengetik dokumen untuk menghasilkan laporan atau artikel.", deskripsiSingkat: "Mengetik dokumen dan memasukkan data administrasi dengan rapi", bobotBakatIds: ["discipline", "achiever", "consistency"], typology: "ADMINISTRATOR" },
  { no: 15, kodeAktivitas: "ASSEMBLING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Merakit berbagai elemen komponen menjadi kesatuan produk utuh yang siap difungsikan.", deskripsiSingkat: "Merakit komponen alat atau perangkat elektronik hingga menyala", bobotBakatIds: ["arranger", "achiever", "restorative"], typology: "PRODUCER" },
  { no: 16, kodeAktivitas: "BUILDING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Mengonstruksi fasilitas fisik seperti hunian, gedung, jembatan, atau infrastruktur bangunan.", deskripsiSingkat: "Membangun konstruksi bangunan atau karya fisik", bobotBakatIds: ["achiever", "focus", "responsibility"], typology: "PRODUCER" },
  { no: 17, kodeAktivitas: "INSTALLING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Memasang dan memasangkan komponen mekanis (seperti baut/mur) agar mesin beroperasi sempurna.", deskripsiSingkat: "Memasang perangkat teknis atau instalasi peralatan", bobotBakatIds: ["restorative", "discipline", "achiever"], typology: "OPERATOR" },
  { no: 18, kodeAktivitas: "PRODUCING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Memproduksi barang setengah jadi maupun produk akhir secara nyata.", deskripsiSingkat: "Menghasilkan produk atau karya nyata secara konsisten", bobotBakatIds: ["achiever", "focus", "consistency"], typology: "PRODUCER" },
  { no: 19, kodeAktivitas: "FINISHING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Mengeksekusi penyelesaian tahap akhir (finishing) dari rangkaian proyek atau manufaktur.", deskripsiSingkat: "Menyempurnakan sentuhan akhir sebuah karya atau proyek", bobotBakatIds: ["maximizer", "responsibility", "focus"], typology: "QUALITY CONTROLLER" },
  { no: 20, kodeAktivitas: "TESTING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Menguji coba kinerja sistem atau alat untuk memastikan fungsi operasionalnya sesuai standar.", deskripsiSingkat: "Menguji coba alat atau aplikasi agar bebas dari error", bobotBakatIds: ["deliberative", "analytical", "restorative"], typology: "QUALITY CONTROLLER" },
  { no: 21, kodeAktivitas: "DELIVERING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Mengirimkan paket, dokumen, atau pesanan barang ke alamat tujuan dengan tepat.", deskripsiSingkat: "Mengantarkan kiriman atau amanah tugas sampai ke tujuan", bobotBakatIds: ["responsibility", "adaptability", "achiever"], typology: "DISTRIBUTOR" },
  { no: 22, kodeAktivitas: "DISTRIBUTING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Mendistribusikan berkas, materi, atau informasi secara serentak ke berbagai wilayah tujuan.", deskripsiSingkat: "Membagikan perlengkapan atau informasi ke banyak penerima", bobotBakatIds: ["arranger", "consistency", "responsibility"], typology: "DISTRIBUTOR" },
  { no: 23, kodeAktivitas: "MAINTAINING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Melakukan perawatan rutin untuk menjaga keandalan fasilitas, mesin, atau sarana fisik.", deskripsiSingkat: "Merawat perangkat dan fasilitas agar awet dan siap pakai", bobotBakatIds: ["restorative", "responsibility", "consistency"], typology: "OPERATOR" },
  { no: 24, kodeAktivitas: "OPERATING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Mengoperasikan serta mengendalikan peralatan mekanis, mesin, atau alur proses operasional.", deskripsiSingkat: "Mengendalikan mesin atau peralatan kerja teknis", bobotBakatIds: ["adaptability", "consistency", "focus"], typology: "OPERATOR" },
  { no: 25, kodeAktivitas: "RESTORING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Memperbaiki dan merestorasi alat atau kondisi seseorang agar kembali berfungsi normal.", deskripsiSingkat: "Memperbaiki perangkat atau sistem yang rusak hingga normal", bobotBakatIds: ["restorative", "analytical", "strategic"], typology: "RESTORER" },
  { no: 26, kodeAktivitas: "TENDING ANIMAL", klaster: "Te", namaKlaster: "Technical", pernyataan: "Merawat, memelihara, melatih, serta membudidayakan hewan ternak atau peliharaan.", deskripsiSingkat: "Menyayangi, melatih, dan merawat hewan peliharaan/ternak", bobotBakatIds: ["empathy", "developer", "responsibility"], typology: "CARETAKER" },
  { no: 27, kodeAktivitas: "SPORT", klaster: "Te", namaKlaster: "Technical", pernyataan: "Berpartisipasi aktif dalam kegiatan cabang olahraga hingga meraih pencapaian dan prestasi.", deskripsiSingkat: "Berlatih olahraga dan menjaga kebugaran fisik untuk berprestasi", bobotBakatIds: ["competition", "achiever", "focus"], typology: "PRODUCER" },
  { no: 28, kodeAktivitas: "PLANTING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Bercocok tanam, mengolah media tanam, serta memelihara pertumbuhan tanaman.", deskripsiSingkat: "Menanam dan merawat tumbuhan hingga tumbuh subur", bobotBakatIds: ["developer", "connectedness", "responsibility"], typology: "CARETAKER" },
  { no: 29, kodeAktivitas: "PHYSICAL SKILL", klaster: "Te", namaKlaster: "Technical", pernyataan: "Menggunakan ketangkasan dan koordinasi motorik tubuh dalam menangani peralatan atau aktivitas fisik berat.", deskripsiSingkat: "Mengandalkan ketangkasan gerak tubuh di lapangan", bobotBakatIds: ["achiever", "adaptability", "activator"], typology: "OPERATOR" },
  { no: 30, kodeAktivitas: "MANUAL SKILL", klaster: "Te", namaKlaster: "Technical", pernyataan: "Mengerjakan tugas-tugas yang mengandalkan keahlian manual serta kerajinan tangan.", deskripsiSingkat: "Membuat prakarya dan kerajinan tangan dengan terampil", bobotBakatIds: ["maximizer", "focus", "deliberative"], typology: "PRODUCER" },
  { no: 31, kodeAktivitas: "VISUAL ART", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengembangkan karya seni visual seperti lukisan, ilustrasi, patung, atau rancangan grafis.", deskripsiSingkat: "Menggambar ilustrasi, melukis, atau membuat desain grafis", bobotBakatIds: ["ideation", "maximizer", "futuristic"], typology: "DESIGNER" },
  { no: 32, kodeAktivitas: "SINGING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Menampilkan pertunjukan olah vokal atau bernyanyi di hadapan khalayak umum.", deskripsiSingkat: "Bernyanyi dan menampilkan seni olah suara", bobotBakatIds: ["communication", "significance", "positivity"], typology: "AMBASADOR" },
  { no: 33, kodeAktivitas: "MUSICAL ART", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengarang lagu, memainkan instrumen, atau berkarya di bidang seni musik.", deskripsiSingkat: "Memainkan alat musik atau menciptakan aransemen lagu", bobotBakatIds: ["ideation", "empathy", "harmony"], typology: "CREATOR" },
  { no: 34, kodeAktivitas: "MODELLING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Peran memperagakan busana dan menjadi peraga mode (fashion model).", deskripsiSingkat: "Tampil percaya diri memperagakan karya busana atau produk", bobotBakatIds: ["significance", "woo", "self_assurance"], typology: "AMBASADOR" },
  { no: 35, kodeAktivitas: "DRAMATIZING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengemas ulang narasi atau cerita agar terasa lebih emosional dan memikat pendengar.", deskripsiSingkat: "Membawakan cerita dengan penuh penghayatan agar menyentuh hati", bobotBakatIds: ["communication", "empathy", "ideation"], typology: "COMMUNICATOR" },
  { no: 36, kodeAktivitas: "DANCING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengekspresikan seni gerak tari yang indah dan harmonis sesuai irama musik.", deskripsiSingkat: "Menampilkan keindahan gerak tari sesuai irama", bobotBakatIds: ["adaptability", "positivity", "harmony"], typology: "CREATOR" },
  { no: 37, kodeAktivitas: "COOKING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengolah bahan masakan dan menciptakan produk seni kuliner.", deskripsiSingkat: "Memasak dan berkreasi membuat hidangan kuliner lezat", bobotBakatIds: ["ideation", "arranger", "belief"], typology: "CREATOR" },
  { no: 38, kodeAktivitas: "CONSERVING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Melestarikan warisan budaya serta kelestarian alam dari ancaman kerusakan atau kepunahan.", deskripsiSingkat: "Menjaga kelestarian alam, lingkungan hijau, dan budaya", bobotBakatIds: ["connectedness", "belief", "context"], typology: "SAFEKEEPER" },
  { no: 39, kodeAktivitas: "BEAUTIFYING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Memoles serta memperindah estetika tampilan visual objek atau penampilan seseorang.", deskripsiSingkat: "Menghias dan mempercantik tampilan ruangan, karya, atau objek", bobotBakatIds: ["maximizer", "ideation", "individualization"], typology: "DESIGNER" },
  { no: 40, kodeAktivitas: "ACTING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Memerankan watak atau karakter yang berbeda dari kepribadian asli di panggung/pentas.", deskripsiSingkat: "Berakting memerankan tokoh di drama, film, atau pentas seni", bobotBakatIds: ["significance", "communication", "empathy"], typology: "COMMUNICATOR" },
  { no: 41, kodeAktivitas: "VISIONING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Memproyeksikan kecenderungan masa depan serta menetapkan target sasaran secara presisi.", deskripsiSingkat: "Melihat tren masa depan dan menentukan cita-cita jangka panjang", bobotBakatIds: ["futuristic", "strategic", "ideation"], typology: "VISIONARY" },
  { no: 42, kodeAktivitas: "STRATEGIZING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Merumuskan strategi dan opsi rute terbaik menuju sasaran yang belum terpikirkan pihak lain.", deskripsiSingkat: "Menyusun taktik jitu dan jalur alternatif terbaik menuju target", bobotBakatIds: ["strategic", "ideation", "futuristic"], typology: "STRATEGIST" },
  { no: 43, kodeAktivitas: "PLANNING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Merancang rencana kerja, mengonstruksi skedul prioritas, serta mengevaluasi kebijakan organisasi.", deskripsiSingkat: "Merencanakan langkah kerja dan persiapan kegiatan secara matang", bobotBakatIds: ["strategic", "deliberative", "focus"], typology: "STRATEGIST" },
  { no: 44, kodeAktivitas: "PUBLICIZING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengomunikasikan keunggulan produk atau informasi agar dikenal dan diminati khalayak luas.", deskripsiSingkat: "Mempublikasikan info penting atau karya agar dikenal luas oleh masyarakat", bobotBakatIds: ["communication", "woo", "ideation"], typology: "COMMUNICATOR" },
  { no: 45, kodeAktivitas: "MARKETING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Merancang strategi pemasaran komprehensif agar calon konsumen tertarik membeli produk/jasa secara berkelanjutan.", deskripsiSingkat: "Merancang strategi pemasaran agar produk/karya diminati banyak orang", bobotBakatIds: ["strategic", "communication", "ideation", "woo"], typology: "MARKETER" },
  { no: 46, kodeAktivitas: "DEVELOPING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mendorong pembaruan untuk mengubah kondisi sesuatu/seseorang menjadi lebih berkembang, kuat, dan maju.", deskripsiSingkat: "Mengembangkan program atau sistem agar makin maju dan meningkat", bobotBakatIds: ["developer", "ideation", "futuristic"], typology: "MOTIVATOR" },
  { no: 47, kodeAktivitas: "ADVERTISING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Menyusun kampanye promosi di media massa guna menggenjot daya tarik jasa atau produk.", deskripsiSingkat: "Membuat konten poster, video, atau kampanye iklan yang kreatif", bobotBakatIds: ["ideation", "communication", "woo"], typology: "MARKETER" },
  { no: 48, kodeAktivitas: "SYNTHESIZING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengombinasikan ragam konsep dan gagasan terpisah menjadi inovasi baru yang utuh.", deskripsiSingkat: "Menggabungkan berbagai ide bagus menjadi satu solusi baru yang utuh", bobotBakatIds: ["ideation", "strategic", "intellection"], typology: "SYNTHESIZER" },
  { no: 49, kodeAktivitas: "IDEATING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mencetuskan ide-ide segar dan memberikan sumbang saran pemikiran pada berbagai kesempatan.", deskripsiSingkat: "Melahirkan ide-ide kreatif dan solusi unik untuk berbagai hal", bobotBakatIds: ["ideation", "futuristic", "strategic", "learner"], typology: "CREATOR" },
  { no: 50, kodeAktivitas: "CREATING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengayunkan daya imajinasi untuk merancang penemuan produk, layanan, atau desain baru.", deskripsiSingkat: "Menciptakan karya orisinal atau penemuan baru yang bermanfaat", bobotBakatIds: ["ideation", "futuristic", "intellection"], typology: "CREATOR" },
  { no: 51, kodeAktivitas: "ANIMATING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengolah deretan gambar diam menjadi tayangan animasi dinamis yang tampak bergerak.", deskripsiSingkat: "Membuat karya animasi bergerak dan multimedia interaktif", bobotBakatIds: ["ideation", "learner", "communication"], typology: "DESIGNER" },
  { no: 52, kodeAktivitas: "DRAFTING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Merancang sketsa dan visualisasi gambar teknik (technical drawing).", deskripsiSingkat: "Menggambar sketsa awal dan rancangan teknis", bobotBakatIds: ["ideation", "deliberative", "analytical"], typology: "DESIGNER" },
  { no: 53, kodeAktivitas: "DESIGNING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Membuat gambar cetak biru (blueprint) desain secara rinci beserta spesifikasi detailnya.", deskripsiSingkat: "Merancang desain tampilan produk, web, atau arsitektur sistem", bobotBakatIds: ["ideation", "strategic", "futuristic"], typology: "DESIGNER" },
  { no: 54, kodeAktivitas: "SERVING", klaster: "S", namaKlaster: "Serving", pernyataan: "Menyediakan pelayanan bagi sesama secara tulus sebagai bentuk pengabdian yang bernilai mulia.", deskripsiSingkat: "Melayani dan membantu kebutuhan orang lain dengan sepenuh hati", bobotBakatIds: ["belief", "developer", "adaptability", "responsibility"], typology: "SERVER" },
  { no: 55, kodeAktivitas: "INFORMING", klaster: "S", namaKlaster: "Serving", pernyataan: "Membagikan wawasan, berita, atau materi pengetahuan kepada pihak lain.", deskripsiSingkat: "Membagikan informasi bermanfaat dan pengetahuan baru kepada teman", bobotBakatIds: ["communication", "woo", "input", "developer"], typology: "COMMUNICATOR" },
  { no: 56, kodeAktivitas: "GREETING", klaster: "S", namaKlaster: "Serving", pernyataan: "Menyapa dan menyambut orang lain secara ramah dan sopan, baik kenalan maupun orang baru.", deskripsiSingkat: "Menyapa dan menyambut tamu atau teman baru dengan hangat dan santun", bobotBakatIds: ["woo", "communication", "includer", "adaptability"], typology: "AMBASADOR" },
  { no: 57, kodeAktivitas: "ASSISTING", klaster: "S", namaKlaster: "Serving", pernyataan: "Mendukung dan membantu penyelesaian tugas atasan atau rekan kerja dari posisi pendukung.", deskripsiSingkat: "Membantu rekan atau ketua tim menuntaskan pekerjaan bersama", bobotBakatIds: ["adaptability", "belief", "responsibility", "developer"], typology: "SERVER" },
  { no: 58, kodeAktivitas: "VOLUNTEERING", klaster: "S", namaKlaster: "Serving", pernyataan: "Melakukan aksi kerelawanan dan bakti sosial tanpa memikirkan pamrih imbalan.", deskripsiSingkat: "Menjadi relawan kegiatan sosial dan kemanusiaan secara tulus", bobotBakatIds: ["belief", "includer", "responsibility"], typology: "CARETAKER" },
  { no: 59, kodeAktivitas: "THERAPIES", klaster: "S", namaKlaster: "Serving", pernyataan: "Menjalankan tindakan pemulihan dan rehabilitasi kondisi fisik, mental, atau perilaku seseorang.", deskripsiSingkat: "Mendampingi pemulihan kesehatan fisik atau semangat seseorang", bobotBakatIds: ["restorative", "empathy", "developer"], typology: "CARETAKER" },
  { no: 60, kodeAktivitas: "SPIRITUALIZING", klaster: "S", namaKlaster: "Serving", pernyataan: "Melakoni ibadah, pembinaan spiritual, kontemplasi, serta memberikan teladan atau nasihat keagamaan.", deskripsiSingkat: "Menjaga nilai ibadah, akhlak mulia, dan memberikan teladan kebaikan", bobotBakatIds: ["belief", "connectedness", "intellection"], typology: "EDUCATOR" },
  { no: 61, kodeAktivitas: "COUNSELING", klaster: "S", namaKlaster: "Serving", pernyataan: "Membantu individu mengurai persoalan pribadi maupun kendala psikologis yang dihadapi.", deskripsiSingkat: "Menjadi pendengar yang baik dan membantu teman keluar dari masalahnya", bobotBakatIds: ["empathy", "developer", "relator", "belief"], typology: "CARETAKER" },
  { no: 62, kodeAktivitas: "CARING", klaster: "S", namaKlaster: "Serving", pernyataan: "Memberikan perhatian, layanan kesehatan, atau bantuan kesejahteraan bagi masyarakat.", deskripsiSingkat: "Memberikan perhatian dan kepedulian nyata kepada sesama", bobotBakatIds: ["empathy", "belief", "responsibility"], typology: "CARETAKER" },
  { no: 63, kodeAktivitas: "INTERVIEWING", klaster: "H", namaKlaster: "Headman", pernyataan: "Menerapkan teknik penggalian pertanyaan untuk mengumpulkan informasi berharga.", deskripsiSingkat: "Menggali informasi mendalam lewat tanya-jawab dan wawancara", bobotBakatIds: ["communication", "individualization", "input"], typology: "SELECTOR" },
  { no: 64, kodeAktivitas: "RECRUITING", klaster: "H", namaKlaster: "Headman", pernyataan: "Melakukan seleksi dan merekrut calon anggota atau karyawan yang sesuai kualifikasi.", deskripsiSingkat: "Mengajak dan menyeleksi anggota tim yang tepat untuk bergabung", bobotBakatIds: ["individualization", "woo", "deliberative"], typology: "SELECTOR" },
  { no: 65, kodeAktivitas: "SELLING", klaster: "H", namaKlaster: "Headman", pernyataan: "Melakukan aktivitas penjualan produk/jasa dengan pendekatan persuasif kepada calon pembeli.", deskripsiSingkat: "Menawarkan karya atau produk dengan ramah hingga orang tertarik membeli", bobotBakatIds: ["woo", "communication", "competition"], typology: "SELLER" },
  { no: 66, kodeAktivitas: "INFLUENCING", klaster: "H", namaKlaster: "Headman", pernyataan: "Mempengaruhi sudut pandang orang lain agar bersedia mengikuti pemikiran atau saran kita.", deskripsiSingkat: "Meyakinkan orang lain agar mendukung ide atau gerakan positif", bobotBakatIds: ["communication", "woo", "command"], typology: "MOTIVATOR" },
  { no: 67, kodeAktivitas: "ENTERTAINING", klaster: "N", namaKlaster: "Networking", pernyataan: "Menghibur dan menceriakan suasana bagi seseorang atau kelompok khalayak.", deskripsiSingkat: "Menghibur teman-teman dan membuat suasana acara jadi hidup", bobotBakatIds: ["woo", "positivity", "communication"], typology: "AMBASADOR" },
  { no: 68, kodeAktivitas: "BROKERING", klaster: "H", namaKlaster: "Headman", pernyataan: "Menjadi fasilitator penghubung (mediator/broker) dalam merealisasikan transaksi bisnis.", deskripsiSingkat: "Menghubungkan dua pihak agar bisa saling bekerja sama", bobotBakatIds: ["woo", "arranger", "strategic"], typology: "SELLER" },
  { no: 69, kodeAktivitas: "PURCHASING", klaster: "H", namaKlaster: "Headman", pernyataan: "Mengupayakan perolehan nilai/manfaat maksimal saat bertransaksi pembelian barang/jasa.", deskripsiSingkat: "Memilih dan membeli barang berkualitas terbaik dengan harga paling hemat", bobotBakatIds: ["deliberative", "strategic", "consistency", "responsibility"], typology: "EVALUATOR" },
  { no: 70, kodeAktivitas: "NEGOTIATING", klaster: "H", namaKlaster: "Headman", pernyataan: "Melakukan negosiasi untuk mencapai titik temu dan kesepakatan yang menguntungkan kedua pihak.", deskripsiSingkat: "Berunding mencari kesepakatan yang adil dan menguntungkan semua pihak", bobotBakatIds: ["strategic", "communication", "harmony"], typology: "MEDIATOR" },
  { no: 71, kodeAktivitas: "INVESTIGATING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Menyelidiki serta mengumpulkan fakta lapangan secara detail demi menyingkap kebenaran suatu kasus.", deskripsiSingkat: "Menelusuri bukti dan fakta lapangan layaknya detektif", bobotBakatIds: ["analytical", "deliberative", "input"], typology: "ANALYST" },
  { no: 72, kodeAktivitas: "INTERROGATING", klaster: "H", namaKlaster: "Headman", pernyataan: "Mengajukan pertanyaan tajam dan mendalam untuk membongkar kronologi fakta peristiwa.", deskripsiSingkat: "Mengajukan pertanyaan kritis untuk menguji kebenaran informasi", bobotBakatIds: ["command", "analytical", "deliberative"], typology: "COMMANDER" },
  { no: 73, kodeAktivitas: "CONTROLLING", klaster: "H", namaKlaster: "Headman", pernyataan: "Menggunakan wewenang kepemimpinan untuk mengarahkan serta memantau kinerja tim.", deskripsiSingkat: "Memimpin dan mengawasi jalannya kegiatan tim agar tetap sesuai target", bobotBakatIds: ["command", "responsibility", "consistency"], typology: "COMMANDER" },
  { no: 74, kodeAktivitas: "COLLECTING", klaster: "H", namaKlaster: "Headman", pernyataan: "Menagih kewajiban pembayaran sesuai kesepakatan klausul kontrak kerja sama.", deskripsiSingkat: "Mengumpulkan iuran, data, atau komitmen yang sudah disepakati bersama", bobotBakatIds: ["consistency", "responsibility", "command"], typology: "TREASURER" },
  { no: 75, kodeAktivitas: "MEDIATING", klaster: "H", namaKlaster: "Headman", pernyataan: "Turun tangan dalam memediasi dan menyelesaikan pertikaian atau konflik yang terjadi.", deskripsiSingkat: "Menjadi penengah yang mendamaikan teman yang sedang berselisih", bobotBakatIds: ["harmony", "consistency", "adaptability"], typology: "MEDIATOR" },
  { no: 76, kodeAktivitas: "DISPATCHING", klaster: "H", namaKlaster: "Headman", pernyataan: "Menginduksi dan mengutus personel untuk melaksanakan misi tugas di tempat tujuan.", deskripsiSingkat: "Mengatur penugasan anggota tim ke lapangan dengan cepat", bobotBakatIds: ["arranger", "command", "activator"], typology: "ARRANGER" },
  { no: 77, kodeAktivitas: "COORDINATING", klaster: "H", namaKlaster: "Headman", pernyataan: "Membagi-bagikan porsi pekerjaan kepada anggota tim agar target bersama tercapai.", deskripsiSingkat: "Mengatur kerja sama antarbagian agar berjalan kompak", bobotBakatIds: ["arranger", "consistency", "communication"], typology: "ARRANGER" },
  { no: 78, kodeAktivitas: "COOPERATING", klaster: "N", namaKlaster: "Networking", pernyataan: "Bekerja sama secara aktif dalam tim demi mewujudkan sasaran kelompok yang telah disepakati.", deskripsiSingkat: "Bekerja sama dengan kompak di dalam kelompok", bobotBakatIds: ["adaptability", "relator", "includer"], typology: "SERVER" },
  { no: 79, kodeAktivitas: "PRESENTING", klaster: "N", namaKlaster: "Networking", pernyataan: "Menyampaikan penjelasan secara gamblang dan mudah dicerna, baik format formal maupun santai.", deskripsiSingkat: "Membawakan presentasi di depan kelas atau forum dengan menarik", bobotBakatIds: ["communication", "woo", "learner"], typology: "COMMUNICATOR" },
  { no: 80, kodeAktivitas: "CORRESPONDING", klaster: "N", namaKlaster: "Networking", pernyataan: "Menjalin korespondensi tertulis secara teratur melalui surat elektronik (email) atau pesan resmi.", deskripsiSingkat: "Menjaga komunikasi pesan tertulis atau email secara santun", bobotBakatIds: ["communication", "relator", "responsibility"], typology: "COMMUNICATOR" },
  { no: 81, kodeAktivitas: "COMMUNICATING", klaster: "N", namaKlaster: "Networking", pernyataan: "Mengungkapkan pemikiran, perasaan, atau instruksi melalui lisan, tulisan, maupun gestur tubuh.", deskripsiSingkat: "Menyampaikan ide dan pikiran secara lisan maupun tulisan agar mudah dipahami orang lain", bobotBakatIds: ["communication", "woo", "ideation", "adaptability"], typology: "COMMUNICATOR" },
  { no: 82, kodeAktivitas: "REPRESENTING", klaster: "N", namaKlaster: "Networking", pernyataan: "Bertindak sebagai juru bicara yang mewakili kepentingan pihak atau institusi lain.", deskripsiSingkat: "Menjadi juru bicara atau duta yang mewakili kelompok/sekolah", bobotBakatIds: ["woo", "communication", "belief"], typology: "AMBASADOR" },
  { no: 83, kodeAktivitas: "RELATING", klaster: "N", namaKlaster: "Networking", pernyataan: "Membangun hubungan jalinan persahabatan atas dasar saling pengertian dan kepedulian.", deskripsiSingkat: "Menjalin persahabatan yang akrab dan saling percaya", bobotBakatIds: ["relator", "woo", "developer"], typology: "AMBASADOR" },
  { no: 84, kodeAktivitas: "LIAISING", klaster: "N", namaKlaster: "Networking", pernyataan: "Menjadi perwakilan organisasi untuk memperluas kemitraan dan membina hubungan baik dengan klien.", deskripsiSingkat: "Menjadi penghubung kerja sama dengan komunitas atau lembaga luar", bobotBakatIds: ["woo", "communication", "relator"], typology: "AMBASADOR" },
  { no: 85, kodeAktivitas: "GUIDING", klaster: "N", namaKlaster: "Networking", pernyataan: "Mengarahkan dan menuntun langkah pihak lain agar konsisten menuju sasaran yang tepat.", deskripsiSingkat: "Menuntun dan mengarahkan teman agar tetap berada di jalur yang benar", bobotBakatIds: ["developer", "belief", "strategic", "consistency"], typology: "EDUCATOR" },
  { no: 86, kodeAktivitas: "MOTIVATING", klaster: "N", namaKlaster: "Networking", pernyataan: "Menyuntikkan motivasi dan optimisme agar orang lain mampu mengeluarkan potensi terbaiknya.", deskripsiSingkat: "Memberikan semangat agar teman-teman berani maju dan berkembang", bobotBakatIds: ["developer", "communication", "futuristic", "belief"], typology: "MOTIVATOR" },
  { no: 87, kodeAktivitas: "SUPPORTING", klaster: "N", namaKlaster: "Networking", pernyataan: "Memberikan sokongan dan fasilitas agar kelompok kerja dapat beroperasi secara efektif.", deskripsiSingkat: "Memberikan dukungan agar tim bisa bekerja dengan nyaman dan optimal", bobotBakatIds: ["developer", "adaptability", "belief", "relator"], typology: "SERVER" },
  { no: 88, kodeAktivitas: "ADVISING", klaster: "N", namaKlaster: "Networking", pernyataan: "Memberikan sumbang saran, konsultasi, dan nasihat konstruktif bagi sesama.", deskripsiSingkat: "Memberikan masukan dan saran bijak yang membangun bagi teman", bobotBakatIds: ["developer", "strategic", "belief", "intellection"], typology: "EDUCATOR" },
  { no: 89, kodeAktivitas: "COACHING", klaster: "N", namaKlaster: "Networking", pernyataan: "Bermitra untuk memperjelas visi tujuan dan mengoptimalkan potensi keunggulan rekan kerja.", deskripsiSingkat: "Mendampingi teman menggali potensi terbaiknya untuk meraih prestasi", bobotBakatIds: ["developer", "maximizer", "individualization"], typology: "MOTIVATOR" },
  { no: 90, kodeAktivitas: "CONSULTING", klaster: "N", namaKlaster: "Networking", pernyataan: "Merumuskan panduan strategi yang disesuaikan dengan profil dan keunikan masing-masing individu.", deskripsiSingkat: "Memberikan konsultasi solusi sesuai kebutuhan unik tiap orang", bobotBakatIds: ["strategic", "ideation", "developer"], typology: "STRATEGIST" },
  { no: 91, kodeAktivitas: "MENTORING", klaster: "N", namaKlaster: "Networking", pernyataan: "Mentransfer keterampilan dan membimbing bawahan/anak didik agar berhasil dalam pekerjaannya.", deskripsiSingkat: "Membimbing adik kelas atau rekan baru dengan memberi contoh nyata", bobotBakatIds: ["developer", "learner", "communication", "relator"], typology: "EDUCATOR" },
  { no: 92, kodeAktivitas: "TEACHING", klaster: "N", namaKlaster: "Networking", pernyataan: "Mengajar serta membagikan wawasan ilmu pengetahuan dengan metode pedagogi yang efektif.", deskripsiSingkat: "Mengajarkan ilmu pengetahuan dengan cara yang asyik dan mudah dipahami", bobotBakatIds: ["developer", "communication", "learner"], typology: "EDUCATOR" },
  { no: 93, kodeAktivitas: "TRAINING", klaster: "N", namaKlaster: "Networking", pernyataan: "Melatih keahlian teknis dan metode praktis guna menaikkan kompetensi seseorang di bidang khusus.", deskripsiSingkat: "Melatih keterampilan praktik secara bertahap sampai seseorang mahir", bobotBakatIds: ["developer", "learner", "communication", "consistency"], typology: "EDUCATOR" },
  { no: 94, kodeAktivitas: "ANALYSING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Menelaah sebab-akibat secara mendalam untuk mendeteksi latar belakang fenomena atau proyeksi masa depan.", deskripsiSingkat: "Menganalisis data dan hubungan sebab-akibat secara logis", bobotBakatIds: ["analytical", "intellection", "strategic"], typology: "ANALYST" },
  { no: 95, kodeAktivitas: "BOOKKEEPING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Membukukan alur transaksi keuangan (pemasukan/pengeluaran) sesuai kaidah akuntansi baku.", deskripsiSingkat: "Mencatat pembukuan uang masuk dan keluar dengan rapi", bobotBakatIds: ["consistency", "discipline", "deliberative"], typology: "TREASURER" },
  { no: 96, kodeAktivitas: "PROGRAMMING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Merancang program aplikasi, arsitektur piranti lunak, atau antarmuka komputasi.", deskripsiSingkat: "Menulis kode pemrograman (coding) dan membuat aplikasi", bobotBakatIds: ["ideation", "learner", "intellection", "strategic"], typology: "CREATOR" },
  { no: 97, kodeAktivitas: "BUDGETING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Mengelola alokasi, penyimpanan, serta distribusi anggaran keuangan secara teratur.", deskripsiSingkat: "Mengatur rencana anggaran dan pembagian dana kegiatan", bobotBakatIds: ["deliberative", "consistency", "strategic"], typology: "TREASURER" },
  { no: 98, kodeAktivitas: "CASHIERING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Menangani alur penerimaan dan pengeluaran kas sesuai regulasi serta mencatatnya dengan rapi.", deskripsiSingkat: "Mengelola kas keuangan dengan jujur dan teliti", bobotBakatIds: ["consistency", "responsibility", "deliberative"], typology: "TREASURER" },
  { no: 99, kodeAktivitas: "COSTING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Memantau dan mengaudit kesesuaian realisasi anggaran belanja proyek terhadap perencanaannya.", deskripsiSingkat: "Menghitung rincian biaya agar pengeluaran tetap hemat dan sesuai rencana", bobotBakatIds: ["deliberative", "analytical", "consistency"], typology: "TREASURER" },
  { no: 100, kodeAktivitas: "ESTIMATING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Keahlian menghitung estimasi Rencana Anggaran Biaya (RAB) untuk keperluan tender penawaran.", deskripsiSingkat: "Memperkirakan kebutuhan biaya, waktu, dan bahan sebelum proyek dimulai", bobotBakatIds: ["strategic", "deliberative", "analytical"], typology: "EVALUATOR" },
  { no: 101, kodeAktivitas: "AUDITING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Melakukan audit dan koreksi terhadap kelayakan laporan keuangan berkala.", deskripsiSingkat: "Memeriksa ketepatan laporan keuangan dan kepatuhan aturan", bobotBakatIds: ["consistency", "deliberative", "analytical"], typology: "EVALUATOR" },
  { no: 102, kodeAktivitas: "INSPECTING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Meneliti rincian pekerjaan secara presisi guna menjamin standar kualitas dan kebenaran.", deskripsiSingkat: "Memeriksa detail hasil kerja dengan teliti agar sesuai standar mutu", bobotBakatIds: ["consistency", "deliberative", "responsibility"], typology: "QUALITY CONTROLLER" },
  { no: 103, kodeAktivitas: "VERIFYING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Melakukan verifikasi dan komparasi data untuk membuktikan keakuratan informasi.", deskripsiSingkat: "Mengecek ulang kebenaran data dan fakta sebelum dipublikasikan", bobotBakatIds: ["deliberative", "consistency", "analytical"], typology: "EVALUATOR" },
  { no: 104, kodeAktivitas: "MONITORING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Mengawasi serta mendeteksi potensi penyimpangan atau ketidakseimbangan dalam proses kerja.", deskripsiSingkat: "Memantau jalannya sistem atau kegiatan agar tetap aman dan lancar", bobotBakatIds: ["consistency", "deliberative", "responsibility"], typology: "SAFEKEEPER" },
  { no: 105, kodeAktivitas: "SAFEKEEPING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Menjaga prosedur keselamatan kerja dan melindungi personel/aset dari potensi bahaya kecelakaan.", deskripsiSingkat: "Menjaga keselamatan bersama dan mencegah terjadinya bahaya", bobotBakatIds: ["responsibility", "deliberative", "consistency"], typology: "SAFEKEEPER" },
  { no: 106, kodeAktivitas: "SECURING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Mengamankan aset dan inventaris perusahaan dari risiko pencurian, kehilangan, atau kerusakan.", deskripsiSingkat: "Mengamankan barang inventaris dan sistem dari risiko kehilangan/kerusakan", bobotBakatIds: ["deliberative", "responsibility", "consistency"], typology: "SAFEKEEPER" },
  { no: 107, kodeAktivitas: "DIAGNOSING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Melakukan diagnosa mendalam untuk menemukan akar penyebab suatu masalah (troubleshooting).", deskripsiSingkat: "Menemukan sumber penyebab utama dari sebuah kendala atau penyakit sistem", bobotBakatIds: ["restorative", "analytical", "strategic"], typology: "RESTORER" },
  { no: 108, kodeAktivitas: "IDENTIFYING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Melakukan verifikasi identitas guna memastikan keabsahan objek atau profil seseorang.", deskripsiSingkat: "Mengenali ciri-ciri khusus dan keaslian suatu data atau objek", bobotBakatIds: ["deliberative", "individualization", "analytical"], typology: "EVALUATOR" },
  { no: 109, kodeAktivitas: "APPRAISING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Melakukan appraisal/penilaian taksiran harga terhadap aset seperti properti, tanah, atau produk.", deskripsiSingkat: "Menaksir nilai atau kualitas suatu barang dan karya secara tepat", bobotBakatIds: ["deliberative", "analytical", "strategic"], typology: "EVALUATOR" },
  { no: 110, kodeAktivitas: "EVALUATING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Menimbang dan mengevaluasi kualitas, bobot kepentingan, atau nilai kondisi suatu objek.", deskripsiSingkat: "Mengevaluasi kelebihan dan kekurangan suatu kegiatan secara bijak", bobotBakatIds: ["strategic", "deliberative", "intellection"], typology: "EVALUATOR" },
  { no: 111, kodeAktivitas: "OBSERVING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Melakukan pengamatan ilmiah secara cermat terhadap fenomena atau objek studi.", deskripsiSingkat: "Mengamati kejadian alam atau lingkungan sekitar secara saksama", bobotBakatIds: ["intellection", "learner", "input"], typology: "EXPLORER" },
  { no: 112, kodeAktivitas: "RESEARCHING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Menjalankan penelitian terstruktur untuk menguji hipotesis, memperbarui teori, atau merumuskan solusi.", deskripsiSingkat: "Melakukan eksperimen dan penelitian ilmiah untuk menemukan solusi baru", bobotBakatIds: ["learner", "intellection", "ideation", "strategic"], typology: "EXPLORER" },
  { no: 113, kodeAktivitas: "SURVEYING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Menyusun laporan atau evaluasi hasil survei atas pelaksanaan kegiatan yang telah rampung.", deskripsiSingkat: "Mengumpulkan pendapat atau data lapangan melalui kegiatan survei", bobotBakatIds: ["input", "learner", "consistency"], typology: "EXPLORER" },
  { no: 114, kodeAktivitas: "REVIEWING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Mencermati perkembangan situasi/individu secara saksama untuk keperluan penyusunan rekomendasi/opini.", deskripsiSingkat: "Meninjau ulang hasil kerja dan memberikan saran peningkatan", bobotBakatIds: ["deliberative", "intellection", "strategic"], typology: "EVALUATOR" },
];