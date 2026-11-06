// app/components/talent-mapping/talentMappingDatabase.ts

export type TalentDomain = "Thinking" | "Striving" | "Relating" | "Influencing";

export interface TalentDefinition {
  slotIndex: number; // 0..33 (Rumus Sesi 1: (noSoal - 1) % 34 === slotIndex)
  id: string;
  nama: string;
  domain: TalentDomain;
  deskripsiKuat: string;
  saranLemah: string;
  aktivitasTerkait: string[];
  typologyTerkait: string[];
}

export interface ActivityClusterItem {
  no: number; // 1..114 (Urutan Soal Sesi 2)
  kodeAktivitas: string;
  klaster: "N" | "H" | "S" | "Gi" | "Te" | "E" | "R" | "T";
  namaKlaster: string;
  pernyataan: string;
  deskripsiSingkat: string;
  bobotBakatIds: string[]; // Bakat Sesi 1 yang menyusun PSP (Personal Strength Potential)
  typology: string;
}

export interface PersonalBrandingRole {
  id: string;
  nama: string;
  kategori: string;
  deskripsi: string;
}

// ============================================================================
// 1. DEFINISI 34 BAKAT (SESUAI URUTAN MODULO-34 PADA EXCEL 1-170 & PDF)
// ============================================================================
export const DAFTAR_34_BAKAT: TalentDefinition[] = [
  {
    slotIndex: 0, // Soal 1, 35, 69, 103, 137
    id: "communication",
    nama: "Communication",
    domain: "Influencing",
    deskripsiKuat:
      "Pribadi yang senang berkomunikasi. Cerdas dalam memilih kata yang tepat untuk mengungkapkan suatu pemikiran atau perasaan. Sangat potensial dalam aktivitas komunikasi lisan maupun tulisan, mampu membuat perbincangan menjadi menarik dan mudah dimengerti.",
    saranLemah:
      "Gunakan media tertulis atau poin-poin terstruktur saat harus menyampaikan gagasan kompleks di depan umum.",
    aktivitasTerkait: ["COMMUNICATING", "PUBLICIZING", "PRESENTING", "INFORMING"],
    typologyTerkait: ["COMMUNICATOR", "AMBASADOR", "JOURNALIST"],
  },
  {
    slotIndex: 1, // Soal 2, 36, 70, 104, 138
    id: "empathy",
    nama: "Empathy",
    domain: "Relating",
    deskripsiKuat:
      "Mampu merasakan emosi dan memahami sudut pandang orang lain seolah-olah mengalaminya sendiri. Sangat peka menangkap pesan tersirat dan suasana hati orang-orang di sekitarnya.",
    saranLemah:
      "Latih kebiasaan mendengarkan aktif (active listening) dan konfirmasi perasaan rekan kerja sebelum mengambil keputusan yang berdampak pada manusia.",
    aktivitasTerkait: ["CARING", "COUNSELING", "SERVING", "SUPPORTING"],
    typologyTerkait: ["CARETAKER", "SERVER", "MEDIATOR"],
  },
  {
    slotIndex: 2, // Soal 3, 37, 71, 105, 139
    id: "harmony",
    nama: "Harmony",
    domain: "Relating",
    deskripsiKuat:
      "Selalu mencari titik temu dan kesepakatan bersama. Menghindari konflik yang tidak produktif dan berupaya mendamaikan perbedaan pandangan agar tercipta suasana kerja yang kondusif.",
    saranLemah:
      "Ketika menghadapi perbedaan pendapat, fokuslah pada tujuan bersama yang disepakati sebelum membahas detail perbedaan.",
    aktivitasTerkait: ["MEDIATING", "COOPERATING", "SUPPORTING"],
    typologyTerkait: ["MEDIATOR", "SERVER"],
  },
  {
    slotIndex: 3, // Soal 4, 38, 72, 106, 140
    id: "includer",
    nama: "Includer",
    domain: "Relating",
    deskripsiKuat:
      "Pribadi inklusif yang senang merangkul semua orang tanpa membedakan latar belakang. Tidak ingin ada satu orang pun yang merasa terabaikan atau tersisihkan di dalam kelompok.",
    saranLemah:
      "Pastikan setiap anggota tim mendapat kesempatan bicara yang setara dalam rapat atau proyek kolaboratif.",
    aktivitasTerkait: ["GREETING", "COOPERATING", "VOLUNTEERING"],
    typologyTerkait: ["AMBASADOR", "NETWORKING"],
  },
  {
    slotIndex: 4, // Soal 5, 39, 73, 107, 141
    id: "individualization",
    nama: "Individualization",
    domain: "Relating",
    deskripsiKuat:
      "Sangat tertarik dan peka terhadap keunikan masing-masing individu. Mampu dengan tepat mengenali kekuatan, gaya belajar, dan pendekatan paling efektif untuk setiap orang secara spesifik.",
    saranLemah:
      "Hindari menyamaratakan cara memotivasi anggota tim; tanyakan preferensi kerja masing-masing rekan.",
    aktivitasTerkait: ["COACHING", "ADVISING", "RECRUITING", "GUIDING"],
    typologyTerkait: ["EDUCATOR", "SELECTOR", "MOTIVATOR"],
  },
  {
    slotIndex: 5, // Soal 6, 40, 74, 108, 142
    id: "relator",
    nama: "Relator",
    domain: "Relating",
    deskripsiKuat:
      "Sangat menikmati hubungan yang dekat dengan orang lain, seperti kemitraan, persahabatan atau persaudaraan. Mendapat rasa nyaman dan kepuasan saat bisa bekerja sama dengan orang-orang yang telah dikenali baik dalam jangka panjang.",
    saranLemah:
      "Bangun kepercayaan bertahap melalui kolaborasi kecil yang konsisten dengan rekan kerja baru.",
    aktivitasTerkait: ["RELATING", "ADVISING", "MENTORING"],
    typologyTerkait: ["EDUCATOR", "MEDIATOR"],
  },
  {
    slotIndex: 6, // Soal 7, 41, 75, 109, 143
    id: "responsibility",
    nama: "Responsibility",
    domain: "Striving",
    deskripsiKuat:
      "Pribadi dengan rasa memiliki yang kuat atas komitmen atau tanggung jawabnya. Selalu bersungguh-sungguh memenuhi janji dan menyelesaikan tugas hingga tuntas dengan kualitas terbaik.",
    saranLemah:
      "Gunakan daftar cek (checklist) komitmen dan jangan mengambil janji melebihi kapasitas waktu yang tersedia.",
    aktivitasTerkait: ["COMPLIANCING", "SAFEKEEPING", "SERVING"],
    typologyTerkait: ["SERVER", "SAFEKEEPER", "ADMINISTRATOR"],
  },
  {
    slotIndex: 7, // Soal 8, 42, 76, 110, 144
    id: "command",
    nama: "Command",
    domain: "Influencing",
    deskripsiKuat:
      "Memiliki kehadiran kepemimpinan yang tegas, berani mengambil kendali situasi, dan tidak ragu mengemukakan argumen atau melakukan konfrontasi langsung demi kejelasan arah keputusan.",
    saranLemah:
      "Saat dibutuhkan ketegasan, bersandarlah pada data objektif atau aturan resmi organisasi untuk mengambil keputusan.",
    aktivitasTerkait: ["CONTROLLING", "DISPATCHING", "NEGOTIATING"],
    typologyTerkait: ["COMMANDER", "HEADMAN"],
  },
  {
    slotIndex: 8, // Soal 9, 43, 77, 111, 145
    id: "competition",
    nama: "Competition",
    domain: "Influencing",
    deskripsiKuat:
      "Terdorong untuk selalu menjadi yang terbaik dan memenangkan kompetisi. Kehadiran pesaing dan tolok ukur peringkat memicu adrenalin serta performa tertingginya.",
    saranLemah:
      "Tidak suka perbandingan, maka hindari cara membandingkan. Bisa membangun dan meraih standar yang tinggi namun bukan karena melihat orang lain. Cari sumber motivasi lain untuk memacu diri belajar lebih baik.",
    aktivitasTerkait: ["SELLING", "INFLUENCING", "SPORT"],
    typologyTerkait: ["SELLER", "MARKETER"],
  },
  {
    slotIndex: 9, // Soal 10, 44, 78, 112, 146
    id: "developer",
    nama: "Developer",
    domain: "Relating",
    deskripsiKuat:
      "Dapat melihat potensi yang dimiliki orang lain dan selalu senang untuk membantu orang lain mengembangkan potensinya tersebut. Mampu melihat kemajuan-kemajuan kecil dalam proses belajar dan mendapat kepuasan dari adanya kemajuan tersebut. Senang mengajar, melatih, atau mendidik.",
    saranLemah:
      "Bermitralah dengan rekan mentor/trainer ketika tim membutuhkan pembinaan bertahap jangka panjang.",
    aktivitasTerkait: ["TRAINING", "MENTORING", "GUIDING", "TEACHING", "DEVELOPING"],
    typologyTerkait: ["EDUCATOR", "MOTIVATOR"],
  },
  {
    slotIndex: 10, // Soal 11, 45, 79, 113, 147
    id: "maximizer",
    nama: "Maximizer",
    domain: "Influencing",
    deskripsiKuat:
      "Fokus pada kekuatan untuk mengubah sesuatu yang sudah baik menjadi luar biasa dan sempurna (excellent). Sangat mengutamakan kualitas tinggi dibanding sekadar memperbaiki kelemahan.",
    saranLemah:
      "Tetapkan standar kualitas minimum yang jelas agar pekerjaan tetap selesai tepat waktu tanpa terjebak perfeksionisme.",
    aktivitasTerkait: ["COACHING", "DEVELOPING", "BEAUTIFYING", "FINISHING"],
    typologyTerkait: ["QUALITY CONTROLLER", "MOTIVATOR"],
  },
  {
    slotIndex: 11, // Soal 12, 46, 80, 114, 148
    id: "positivity",
    nama: "Positivity",
    domain: "Relating",
    deskripsiKuat:
      "Memiliki antusiasme yang menular, optimis, ceria, dan mampu mencairkan suasana tegang menjadi penuh semangat dan kegembiraan.",
    saranLemah:
      "Sadarilah bahwa sikap tenang dan realistis Anda tetap berharga; berikan apresiasi sederhana secara berkala kepada rekan kerja.",
    aktivitasTerkait: ["MOTIVATING", "ENTERTAINING", "GREETING"],
    typologyTerkait: ["MOTIVATOR", "AMBASADOR"],
  },
  {
    slotIndex: 12, // Soal 13, 47, 81, 115, 149
    id: "woo",
    nama: "Woo",
    domain: "Influencing",
    deskripsiKuat:
      "Winning Others Over — Sangat menikmati tantangan bertemu orang baru dan mengubah rasa asing menjadi akrab. Sangat puas ketika bisa memecah kekakuan dan berhasil menciptakan keakraban. Selalu percaya diri memulai percakapan, nyaris tidak pernah kehabisan bahan obrolan.",
    saranLemah:
      "Fokuslah pada jejaring mendalam dengan orang-orang yang sudah Anda kenal baik tanpa harus memaksakan diri di keramaian baru.",
    aktivitasTerkait: ["GREETING", "LIAISING", "PUBLICIZING", "REPRESENTING"],
    typologyTerkait: ["AMBASADOR", "COMMUNICATOR", "SELLER"],
  },
  {
    slotIndex: 13, // Soal 14, 48, 82, 116, 150
    id: "achiever",
    nama: "Achiever",
    domain: "Striving",
    deskripsiKuat:
      "Memiliki stamina tinggi dan dorongan internal yang kuat untuk bekerja keras serta menghasilkan pencapaian nyata setiap harinya.",
    saranLemah:
      "Umumnya stamina terbatas ketika menanggung kesibukan yang padat. Untuk itu produktivitas tidak perlu dipadatkan dalam hitungan hari. Temukan laju kerja Anda sendiri dan ciptakan produktivitas dengan komposisi bakat Anda sendiri.",
    aktivitasTerkait: ["PRODUCING", "OPERATING", "DELIVERING"],
    typologyTerkait: ["PRODUCER", "OPERATOR"],
  },
  {
    slotIndex: 14, // Soal 15, 49, 83, 117, 151
    id: "activator",
    nama: "Activator",
    domain: "Influencing",
    deskripsiKuat:
      "Tidak sabar untuk segera mengubah gagasan atau keputusan menjadi tindakan nyata. Percaya bahwa pembelajaran terbaik datang dari eksekusi langsung.",
    saranLemah:
      "Tidak ada dorongan untuk langsung bertindak jika memiliki rencana, ide, atau melihat peluang. Buat tenggat waktu awal (kick-off) yang konkret atau berkolaborasi dengan rekan eksekutor.",
    aktivitasTerkait: ["DISPATCHING", "INFLUENCING", "MOBILIZING"],
    typologyTerkait: ["COMMANDER", "MARKETER"],
  },
  {
    slotIndex: 15, // Soal 16, 50, 84, 118, 152
    id: "adaptability",
    nama: "Adaptability",
    domain: "Relating",
    deskripsiKuat:
      "Pribadi yang sangat menyukai kehidupan dinamis, mengalir mengikuti arus yang kadang tidak terduga. Fokus pada saat ini. Sangat mampu menyesuaikan diri dengan perubahan dan situasi mendadak, mampu memilih respon dengan cepat dan tepat untuk setiap keadaan.",
    saranLemah:
      "Siapkan rencana cadangan (Plan B) tertulis agar Anda tidak stres ketika terjadi perubahan mendadak di luar jadwal.",
    aktivitasTerkait: ["ASSISTING", "SERVING", "SUPPORTING", "MEDIATING"],
    typologyTerkait: ["SERVER", "CARETAKER"],
  },
  {
    slotIndex: 16, // Soal 17, 51, 85, 119, 153
    id: "belief",
    nama: "Belief",
    domain: "Striving",
    deskripsiKuat:
      "Pribadi yang digerakkan oleh keyakinannya atas nilai-nilai hidup. Seorang idealis. Senang melayani, membantu, dan berkorban bagi orang lain. Baginya kesuksesan itu ketika mampu mewujudkan nilai-nilai yang diyakini dalam kehidupan nyata, dan menjadi pribadi yang bermanfaat bagi orang lain secara tulus.",
    saranLemah:
      "Selaraskan pekerjaan harian Anda dengan manfaat praktis atau tujuan organisasi agar tetap bermakna.",
    aktivitasTerkait: ["SERVING", "VOLUNTEERING", "SPIRITUALIZING", "GUIDING"],
    typologyTerkait: ["SERVER", "CARETAKER", "EDUCATOR"],
  },
  {
    slotIndex: 17, // Soal 18, 52, 86, 120, 154
    id: "discipline",
    nama: "Discipline",
    domain: "Striving",
    deskripsiKuat:
      "Menyukai keteraturan, struktur, jadwal yang rapi, dan sistem prosedur yang terencana dengan presisi sejak awal.",
    saranLemah:
      "Sulit untuk teratur dan tertata, tidak menikmati jadwal. Latih diri menghormati jadwal yang telah ditentukan. Pahami bahwa ketidakteraturan dapat mengganggu kinerja tim. Gunakan aplikasi kalender/pengingat otomatis.",
    aktivitasTerkait: ["SCHEDULING", "FILING", "ORGANIZING", "BOOKKEEPING"],
    typologyTerkait: ["ADMINISTRATOR", "TREASURER"],
  },
  {
    slotIndex: 18, // Soal 19, 53, 87, 121, 155
    id: "focus",
    nama: "Focus",
    domain: "Striving",
    deskripsiKuat:
      "Mampu menetapkan arah tujuan yang jelas, menyeleksi prioritas utama, dan bertahan di jalur sasaran tanpa mudah teralihkan oleh gangguan.",
    saranLemah:
      "Mudah lelah jika terkait urusan dan target panjang. Mudah teralihkan begitu ada hal lain yang lebih menarik. Pecahlah target jangka panjang menjadi target jangka pendek (milestone kecil), sehingga mudah Anda menelusuri progres Anda.",
    aktivitasTerkait: ["PLANNING", "MONITORING", "FINISHING"],
    typologyTerkait: ["STRATEGIST", "PRODUCER"],
  },
  {
    slotIndex: 19, // Soal 20, 54, 88, 122, 156
    id: "restorative",
    nama: "Restorative",
    domain: "Striving",
    deskripsiKuat:
      "Sangat terampil dan bersemangat dalam memecahkan masalah (troubleshooting), mendiagnosa kerusakan, dan memperbaiki sesuatu hingga kembali berfungsi normal.",
    saranLemah:
      "Jangan ragu mendelegasikan perbaikan teknis yang rumit kepada spesialis troubleshooting di tim Anda.",
    aktivitasTerkait: ["RESTORING", "DIAGNOSING", "MAINTAINING", "THERAPIES"],
    typologyTerkait: ["RESTORER", "QUALITY CONTROLLER"],
  },
  {
    slotIndex: 20, // Soal 21, 55, 89, 123, 157
    id: "self_assurance",
    nama: "Self-Assurance",
    domain: "Influencing",
    deskripsiKuat:
      "Memiliki kompas internal dan kepercayaan diri yang kokoh terhadap kemampuan serta keputusannya sendiri, bahkan di tengah ketidakpastian risiko.",
    saranLemah:
      "Kumpulkan data pendukung atau mintalah second opinion dari mentor terpercaya untuk memperkuat keyakinan keputusan Anda.",
    aktivitasTerkait: ["INFLUENCING", "VISIONING", "NEGOTIATING"],
    typologyTerkait: ["COMMANDER", "VISIONARY"],
  },
  {
    slotIndex: 21, // Soal 22, 56, 90, 124, 158
    id: "significance",
    nama: "Significance",
    domain: "Influencing",
    deskripsiKuat:
      "Ingin memberikan dampak besar yang diakui, dihargai, dan menonjol secara profesional serta bereputasi tinggi di mata publik.",
    saranLemah:
      "Tidak merasa nyaman menjadi sorotan, apalagi dalam audience besar. Alihkan perhatian pada karya Anda dan produktivitas yang Anda kerjakan. Bisa memilih kerja di balik layar dan temukan arti penting pesan yang Anda sampaikan.",
    aktivitasTerkait: ["PRESENTING", "REPRESENTING", "ACTING"],
    typologyTerkait: ["AMBASADOR", "COMMUNICATOR"],
  },
  {
    slotIndex: 22, // Soal 23, 57, 91, 125, 159
    id: "analytical",
    nama: "Analytical",
    domain: "Thinking",
    deskripsiKuat:
      "Berpikir logis, objektif, dan berbasis bukti data. Senang mengurai pola, mencari hubungan sebab-akibat, serta menguji keakuratan fakta secara tajam.",
    saranLemah:
      "Gunakan template analisis data atau berkolaborasi dengan rekan analis saat harus mengolah angka/statistik yang kompleks.",
    aktivitasTerkait: ["ANALYSING", "AUDITING", "VERIFYING", "RESEARCHING"],
    typologyTerkait: ["ANALYST", "EVALUATOR", "TREASURER"],
  },
  {
    slotIndex: 23, // Soal 24, 58, 92, 126, 160
    id: "arranger",
    nama: "Arranger",
    domain: "Striving",
    deskripsiKuat:
      "Piawai mengoordinasikan banyak variabel, sumber daya, dan personel secara fleksibel dan paralel untuk mencapai konfigurasi kerja paling efisien.",
    saranLemah:
      "Tangani proyek satu per satu secara berurutan agar tidak kewalahan oleh terlalu banyak perubahan mendadak.",
    aktivitasTerkait: ["COORDINATING", "ORGANIZING", "DISPATCHING"],
    typologyTerkait: ["ARRANGER", "HEADMAN", "DISTRIBUTOR"],
  },
  {
    slotIndex: 24, // Soal 25, 59, 93, 127, 161
    id: "connectedness",
    nama: "Connectedness",
    domain: "Relating",
    deskripsiKuat:
      "Meyakini bahwa segala sesuatu terjadi karena suatu alasan dan saling terhubung secara spiritual maupun kemanusiaan. Sangat menjaga etika agar tidak merugikan sesama.",
    saranLemah:
      "Bangun jembatan komunikasi yang konkret untuk menjelaskan keterkaitan pekerjaan tim dengan dampak sosial yang lebih luas.",
    aktivitasTerkait: ["SPIRITUALIZING", "COUNSELING", "CONSERVING", "ADVISING"],
    typologyTerkait: ["CARETAKER", "MEDIATOR"],
  },
  {
    slotIndex: 25, // Soal 26, 60, 94, 128, 162
    id: "consistency",
    nama: "Consistency",
    domain: "Striving",
    deskripsiKuat:
      "Pribadi yang meyakini bahwa semua orang harus diperlakukan secara sama sesuai dengan aturan yang berlaku. Tidak suka berpihak atau berat sebelah. Menjadikan aturan sebagai panduan dalam berperilaku, dan merasa senang serta tenang jika bisa mentaati aturan tersebut.",
    saranLemah:
      "Pastikan Anda memahami SOP standar organisasi agar tetap adil saat menangani pengecualian kasus.",
    aktivitasTerkait: ["COMPLIANCING", "INSPECTING", "MONITORING", "POLICING"],
    typologyTerkait: ["QUALITY CONTROLLER", "SAFEKEEPER", "ADMINISTRATOR"],
  },
  {
    slotIndex: 26, // Soal 27, 61, 95, 129, 163
    id: "context",
    nama: "Context",
    domain: "Thinking",
    deskripsiKuat:
      "Memahami masa kini dengan menelusuri sejarah, latar belakang, dan rekaman jejak masa lalu. Sangat menghargai pembelajaran dari studi kasus historis.",
    saranLemah:
      "Tidak tertarik dengan masa lalu dari sesuatu/seseorang. Cari partner yang bisa Anda percayai dalam memeriksa track record dari sesuatu. Gunakan bakat lain untuk mengenali kredibilitas dari hal yang sedang Anda tangani.",
    aktivitasTerkait: ["REPORTING", "TRANSCRIBING", "ARCHIVING", "RESEARCHING"],
    typologyTerkait: ["JOURNALIST", "ADMINISTRATOR"],
  },
  {
    slotIndex: 27, // Soal 28, 62, 96, 130, 164
    id: "deliberative",
    nama: "Deliberative",
    domain: "Striving",
    deskripsiKuat:
      "Pribadi yang teliti dan penuh kehati-hatian. Sebelum mengambil keputusan/pilihan terlebih dahulu mempertimbangkan semua kemungkinan risiko, hambatan, dan kemungkinan gagal. Dalam beraktivitas juga selalu peka terhadap hal-hal yang bisa mendatangkan risiko.",
    saranLemah:
      "Lakukan pengecekan risiko dasar sebelum mengeksekusi proyek besar agar terhindar dari kesalahan fatal.",
    aktivitasTerkait: ["PURCHASING", "AUDITING", "INSPECTING", "SECURING"],
    typologyTerkait: ["EVALUATOR", "SAFEKEEPER", "QUALITY CONTROLLER"],
  },
  {
    slotIndex: 28, // Soal 29, 63, 97, 131, 165
    id: "futuristic",
    nama: "Futuristic",
    domain: "Thinking",
    deskripsiKuat:
      "Senang memikirkan masa depan. Pikirannya selalu terinspirasi oleh ruang dan kemungkinan yang tersedia di masa depan. Selalu melihat sesuatu (pribadi, organisasi, trend, dll) lengkap dengan wujudnya di masa depan. Memiliki kemampuan untuk menginspirasi orang lain dengan visinya.",
    saranLemah:
      "Gunakan tren data saat ini atau berdiskusilah dengan rekan visioner ketika merumuskan peta jalan jangka panjang.",
    aktivitasTerkait: ["VISIONING", "PLANNING", "DESIGNING"],
    typologyTerkait: ["VISIONARY", "STRATEGIST", "CREATOR"],
  },
  {
    slotIndex: 29, // Soal 30, 64, 98, 132, 166
    id: "ideation",
    nama: "Ideation",
    domain: "Thinking",
    deskripsiKuat:
      "Pikirannya sangat aktif dan kreatif memunculkan berbagai gagasan. Mampu dengan cepat menghubungkan hal-hal yang tampaknya tidak berhubungan menjadi sebuah ide atau rancangan yang utuh. Selalu bisa menciptakan sudut pandang baru terhadap sesuatu sehingga timbul ide, konsep, dan imajinasi-imajinasi baru.",
    saranLemah:
      "Gunakan metode brainstorming terstruktur (seperti SCAMPER atau Mind Mapping) saat membutuhkan solusi kreatif.",
    aktivitasTerkait: ["IDEATING", "CREATING", "DESIGNING", "SYNTHESIZING", "CONCEPTUALIZING"],
    typologyTerkait: ["CREATOR", "DESIGNER", "SYNTHESIZER"],
  },
  {
    slotIndex: 30, // Soal 31, 65, 99, 133, 167
    id: "input",
    nama: "Input",
    domain: "Thinking",
    deskripsiKuat:
      "Memiliki rasa ingin tahu yang tinggi dan gemar mengumpulkan berbagai informasi, fakta, referensi, wawasan, atau koleksi benda yang bermanfaat sebagai perbendaharaan pengetahuan.",
    saranLemah:
      "Bangun sistem folder referensi digital yang ringkas agar mudah mencari informasi saat dibutuhkan.",
    aktivitasTerkait: ["COLLECTING", "OBSERVING", "SURVEYING", "INFORMING"],
    typologyTerkait: ["EXPLORER", "JOURNALIST"],
  },
  {
    slotIndex: 31, // Soal 32, 66, 100, 134, 168
    id: "intellection",
    nama: "Intellection",
    domain: "Thinking",
    deskripsiKuat:
      "Seorang pemikir yang ingin memahami sesuatu sampai ke intinya. Ia menikmati perenungan dalam situasi sendiri dan tenang. Cenderung introspektif, sangat menghargai perbincangan intelektual yang berkualitas. Pemikirannya menjadi sangat produktif saat bekerja dalam ketenangan seperti ini.",
    saranLemah:
      "Luangkan waktu hening sejenak sebelum mengambil keputusan strategis agar kajian Anda lebih mendalam.",
    aktivitasTerkait: ["CONCEPTUALIZING", "RESEARCHING", "WRITING"],
    typologyTerkait: ["ANALYST", "EXPLORER", "CREATOR"],
  },
  {
    slotIndex: 32, // Soal 33, 67, 101, 135, 169
    id: "learner",
    nama: "Learner",
    domain: "Thinking",
    deskripsiKuat:
      "Pribadi yang sangat senang belajar, dan ingin terus belajar untuk meningkatkan kualitas dirinya. Merasakan proses belajar sebagai hal yang lebih menarik dan lebih penting daripada subjek yang dipelajari atau hasil dari proses belajar tersebut.",
    saranLemah:
      "Pilih metode belajar praktis berbasis proyek (learning by doing) agar tetap termotivasi menguasai keahlian baru.",
    aktivitasTerkait: ["TEACHING", "TRAINING", "PROGRAMMING", "RESEARCHING"],
    typologyTerkait: ["EDUCATOR", "EXPLORER"],
  },
  {
    slotIndex: 33, // Soal 34, 68, 102, 136, 170
    id: "strategic",
    nama: "Strategic",
    domain: "Thinking",
    deskripsiKuat:
      "Pribadi yang cerdas dalam mengembangkan berbagai alternatif langkah dan proses, serta mampu cepat menilai berbagai alternatif tersebut untuk menemukan pilihan atau solusi terbaik. Selalu memahami situasi dengan melihat gambaran besarnya, dan senang melibatkan diri dalam pengambilan keputusan yang intuitif.",
    saranLemah:
      "Biasakan membuat minimal 2 opsi alternatif sebelum menetapkan langkah penyelesaian masalah.",
    aktivitasTerkait: ["STRATEGIZING", "PLANNING", "SYNTHESIZING", "GUIDING"],
    typologyTerkait: ["STRATEGIST", "SYNTHESIZER", "VISIONARY"],
  },
];

// ============================================================================
// 2. DEFINISI 30 STRENGTH TYPOLOGY (PERSONAL BRANDING & KESIMPULAN PERAN)
// ============================================================================
export const DAFTAR_30_PERSONAL_BRANDING: PersonalBrandingRole[] = [
  { id: "ARRANGER", nama: "ARRANGER", kategori: "HEADMAN", deskripsi: "Anda seorang pengatur sumber daya dan manusia yang luwes, mampu mengoordinasikan banyak aktivitas secara paralel dan efisien." },
  { id: "COMMANDER", nama: "COMMANDER", kategori: "HEADMAN", deskripsi: "Anda seorang pemimpin tegas yang berani mengambil kendali, memberi komando jelas, dan memastikan target tercapai." },
  { id: "MEDIATOR", nama: "MEDIATOR", kategori: "HEADMAN", deskripsi: "Anda seorang penengah yang objektif dan bijaksana dalam menjembatani perbedaan serta menyelesaikan konflik antarpihak." },
  { id: "SELLER", nama: "SELLER", kategori: "HEADMAN", deskripsi: "Anda seorang negosiator dan pemasar persuasif yang piawai meyakinkan orang lain untuk mencapai kesepakatan bernilai tinggi." },
  { id: "SELECTOR", nama: "SELECTOR", kategori: "HEADMAN", deskripsi: "Anda memiliki kepekaan tajam dalam menyeleksi, merekrut, dan menempatkan orang yang tepat sesuai keunikan potensinya." },

  { id: "AMBASADOR", nama: "AMBASADOR", kategori: "NETWORKING", deskripsi: "Anda seorang duta jejaring yang ramah, mudah mencairkan suasana, dan piawai membangun kemitraan baru bagi organisasi." },
  { id: "COMMUNICATOR", nama: "COMMUNICATOR", kategori: "NETWORKING", deskripsi: "Anda seorang yang senang menerangkan sesuatu secara jelas dan menarik, baik itu dalam bentuk lisan ataupun tulisan." },
  { id: "EDUCATOR", nama: "EDUCATOR", kategori: "NETWORKING", deskripsi: "Anda seorang yang sabar dan telaten dalam memberikan penjelasan dan bimbingan kepada orang lain sesuai dengan karakteristik unik masing-masing." },
  { id: "MOTIVATOR", nama: "MOTIVATOR", kategori: "NETWORKING", deskripsi: "Anda seorang yang suka membuat orang lain maju dan berkembang sesuai dengan potensi uniknya masing-masing, dengan cara memberi semangat, inspirasi atau contoh yang baik." },

  { id: "CARETAKER", nama: "CARETAKER", kategori: "SERVICING", deskripsi: "Anda seorang yang penuh empati dan kepedulian dalam merawat, mendampingi, serta memulihkan kesejahteraan fisik maupun psikologis sesama." },
  { id: "SERVER", nama: "SERVER", kategori: "SERVICING", deskripsi: "Anda seorang yang memiliki jiwa pelayanan yang tinggi, selalu siap membantu, bertanggung jawab dan senang berinteraksi dengan orang lain." },

  { id: "CREATOR", nama: "CREATOR", kategori: "GENERATING IDEA", deskripsi: "Anda adalah seorang yang punya banyak ide, yang belum pernah terpikirkan sebelumnya, dan Anda tahu benar cara mewujudkan ide Anda tersebut." },
  { id: "DESIGNER", nama: "DESIGNER", kategori: "GENERATING IDEA", deskripsi: "Anda seorang perancang konsep dan cetak biru visual maupun sistem yang memadukan imajinasi kreatif dengan presisi teknis." },
  { id: "MARKETER", nama: "MARKETER", kategori: "GENERATING IDEA", deskripsi: "Anda seorang perumus strategi pemasaran dan kampanye komunikasi yang mampu mengemas keunggulan produk agar diminati publik." },
  { id: "STRATEGIST", nama: "STRATEGIST", kategori: "GENERATING IDEA", deskripsi: "Anda seorang pemikir strategis yang mampu melihat gambaran besar dan merancang rute alternatif terbaik menuju sasaran masa depan." },
  { id: "SYNTHESIZER", nama: "SYNTHESIZER", kategori: "GENERATING IDEA", deskripsi: "Anda piawai memadukan berbagai konsep, tren, dan gagasan yang terpisah menjadi sebuah sintesis solusi baru yang utuh." },
  { id: "VISIONARY", nama: "VISIONARY", kategori: "GENERATING IDEA", deskripsi: "Anda seorang pemimpi masa depan yang mampu memproyeksikan peluang jangka panjang dan menginspirasi perubahan besar." },

  { id: "ANALYST", nama: "ANALYST", kategori: "THINKING", deskripsi: "Anda seorang pemikir analitis dan objektif yang gemar mengurai data, struktur logika, serta pola sebab-akibat secara mendalam." },
  { id: "TREASURER", nama: "TREASURER", kategori: "THINKING", deskripsi: "Anda seorang pengelola anggaran, akuntansi, dan perbendaharaan keuangan yang cermat, terstruktur, dan berintegritas." },
  { id: "EVALUATOR", nama: "EVALUATOR", kategori: "THINKING", deskripsi: "Anda seorang penguji dan auditor yang teliti dalam menakar risiko, memverifikasi keabsahan data, dan menjaga mutu standar." },
  { id: "EXPLORER", nama: "EXPLORER", kategori: "THINKING", deskripsi: "Anda seorang peneliti dan pembelajar sejati yang selalu haus menggali pengetahuan baru, observasi ilmiah, dan eksplorasi fakta." },
  { id: "RESTORER", nama: "RESTORER", kategori: "THINKING", deskripsi: "Anda seorang pemecah masalah (troubleshooter) yang handal dalam mendiagnosa akar kerusakan dan memulihkannya hingga normal." },

  { id: "ADMINISTRATOR", nama: "ADMINISTRATOR", kategori: "ELEMENTARY", deskripsi: "Anda seorang penata tata kelola administrasi, kepatuhan aturan, dan penjadwalan organisasi yang rapi, taat, dan sistematis." },
  { id: "INTERPRETER", nama: "INTERPRETER", kategori: "ELEMENTARY", deskripsi: "Anda seorang penerjemah dan pengurai pesan lintas bahasa maupun lintas konsep agar mudah dipahami oleh berbagai kalangan." },
  { id: "JOURNALIST", nama: "JOURNALIST", kategori: "ELEMENTARY", deskripsi: "Anda seorang penyusun laporan, penulis naskah, dan pendokumentasi informasi yang terstruktur dan komunikatif." },

  { id: "DISTRIBUTOR", nama: "DISTRIBUTOR", kategori: "TECHNICAL", deskripsi: "Anda seorang pelaksana distribusi dan penyaluran logistik maupun informasi secara tepat sasaran dan tepat waktu." },
  { id: "OPERATOR", nama: "OPERATOR", kategori: "TECHNICAL", deskripsi: "Anda seorang pengendali peralatan teknis, mesin, dan prosedur operasional lapangan yang tangguh dan konsisten." },
  { id: "PRODUCER", nama: "PRODUCER", kategori: "TECHNICAL", deskripsi: "Anda seorang pekerja keras berorientasi output yang mampu merakit, membangun, dan memproduksi karya nyata hingga tuntas." },
  { id: "QUALITY CONTROLLER", nama: "QUALITY CONTROLLER", kategori: "TECHNICAL", deskripsi: "Anda seorang penjaga standar mutu dan kepatuhan yang memastikan setiap hasil kerja bebas dari cacat dan sesuai aturan." },
  { id: "SAFEKEEPER", nama: "SAFEKEEPER", kategori: "TECHNICAL", deskripsi: "Anda seorang pelindung keamanan aset, keselamatan kerja, dan ketertiban lingkungan yang penuh kewaspadaan dan tanggung jawab." },
];

// ============================================================================
// 3. DAFTAR 170 SOAL SESI 1 (MODIFIKASI BEBAS HAK CIPTA DARI EXCEL 1-170)
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
// 4. DAFTAR 114 AKTIVITAS SESI 2 (SCM MAP: E, Te, Gi, S, H, N, T, R)
// ============================================================================
export const SOAL_SESI_2_114_SCM: ActivityClusterItem[] = [
  { no: 1, kodeAktivitas: "CONCEPTUALIZING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Merancang acuan dan garis besar langkah masa depan berdasarkan pengamatan, pengalaman, serta keyakinan pribadi.", deskripsiSingkat: "Merumuskan konsep dasar dan kerangka acuan pemikiran", bobotBakatIds: ["ideation", "intellection", "strategic"], typology: "CREATOR" },
  { no: 2, kodeAktivitas: "EDITING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Mengedit dan menyempurnakan karangan naskah sebelum dipublikasikan ke publik.", deskripsiSingkat: "Menyunting dan memperbaiki kualitas naskah tulisan", bobotBakatIds: ["communication", "maximizer", "discipline"], typology: "JOURNALIST" },
  { no: 3, kodeAktivitas: "REDACTING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Menentukan pokok gagasan serta merestrukturisasi berkas tulisan yang siap diedarkan.", deskripsiSingkat: "Menyusun redaksi dan struktur naskah publikasi", bobotBakatIds: ["communication", "input", "arranger"], typology: "JOURNALIST" },
  { no: 4, kodeAktivitas: "REPORTING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Melaporkan dan mengomunikasikan perkembangan situasi yang sedang atau telah berlangsung secara lisan maupun tertulis.", deskripsiSingkat: "Melaporkan fakta dan perkembangan peristiwa secara akurat", bobotBakatIds: ["communication", "context", "responsibility"], typology: "JOURNALIST" },
  { no: 5, kodeAktivitas: "WRITING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Menyusun karya tulis, materi edukasi, cerita, maupun gagasan konseptual.", deskripsiSingkat: "Menuangkan gagasan dan pengetahuan ke dalam karya tulis", bobotBakatIds: ["communication", "ideation", "intellection"], typology: "JOURNALIST" },
  { no: 6, kodeAktivitas: "INTERPRETING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Menerangkan dan menguraikan substansi serta makna mendasar dari suatu topik.", deskripsiSingkat: "Menafsirkan dan menjelaskan makna dari suatu informasi", bobotBakatIds: ["communication", "intellection", "individualization"], typology: "INTERPRETER" },
  { no: 7, kodeAktivitas: "TRANSCRIBING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Menyadur ulang isi ringkasan atau naskah steno secara terperinci dan rinci.", deskripsiSingkat: "Menyalin dan mendokumentasikan rekaman percakapan secara rinci", bobotBakatIds: ["discipline", "context", "responsibility"], typology: "ADMINISTRATOR" },
  { no: 8, kodeAktivitas: "TRANSLATING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Mengalihbahasakan pesan lisan maupun tertulis agar mudah dimengerti audiens dari latar bahasa berbeda.", deskripsiSingkat: "Menerjemahkan bahasa secara akurat dan mudah dipahami", bobotBakatIds: ["communication", "learner", "input"], typology: "INTERPRETER" },
  { no: 9, kodeAktivitas: "COMPLIANCING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Menjalankan serta menegakkan kedisiplinan sesuai ketentuan dan regulasi baku.", deskripsiSingkat: "Menjalankan dan menjaga kepatuhan serta ketaatan terhadap aturan yang berlaku", bobotBakatIds: ["consistency", "responsibility", "deliberative", "belief"], typology: "ADMINISTRATOR" },
  { no: 10, kodeAktivitas: "FILING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Mengarsip berkas pada tempat yang tepat agar mempermudah proses pencarian ulang.", deskripsiSingkat: "Menata dan mengarsipkan dokumen secara sistematis", bobotBakatIds: ["discipline", "consistency", "input"], typology: "ADMINISTRATOR" },
  { no: 11, kodeAktivitas: "HOUSEKEEPING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Menata, membersihkan, serta merapikan sarana kerja maupun area ruangan.", deskripsiSingkat: "Menjaga kerapian, kebersihan, dan kenyamanan fasilitas", bobotBakatIds: ["discipline", "responsibility", "service"], typology: "SERVER" },
  { no: 12, kodeAktivitas: "ORGANISING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Merancang dan mengoordinasikan susunan acara, tata kerja, serta mekanisme prosedur.", deskripsiSingkat: "Mengorganisir alur kerja dan tata laksana kegiatan", bobotBakatIds: ["arranger", "discipline", "responsibility"], typology: "ADMINISTRATOR" },
  { no: 13, kodeAktivitas: "SCHEDULING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Menyusun urutan prioritas tindakan untuk periode waktu tertentu.", deskripsiSingkat: "Menyusun jadwal dan alokasi waktu kegiatan secara teratur", bobotBakatIds: ["discipline", "focus", "arranger"], typology: "ADMINISTRATOR" },
  { no: 14, kodeAktivitas: "TYPEWRITING", klaster: "E", namaKlaster: "Elementary", pernyataan: "Menginput data dan mengetik dokumen untuk menghasilkan laporan atau artikel.", deskripsiSingkat: "Mengetik dan mengolah dokumen administrasi dengan cepat", bobotBakatIds: ["discipline", "achiever", "consistency"], typology: "ADMINISTRATOR" },
  { no: 15, kodeAktivitas: "ASSEMBLING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Merakit berbagai elemen komponen menjadi kesatuan produk utuh yang siap difungsikan.", deskripsiSingkat: "Merakit komponen-komponen teknis menjadi produk utuh", bobotBakatIds: ["arranger", "achiever", "restorative"], typology: "PRODUCER" },
  { no: 16, kodeAktivitas: "BUILDING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Mengonstruksi fasilitas fisik seperti hunian, gedung, jembatan, atau infrastruktur bangunan.", deskripsiSingkat: "Membangun konstruksi fisik dan infrastruktur", bobotBakatIds: ["achiever", "focus", "responsibility"], typology: "PRODUCER" },
  { no: 17, kodeAktivitas: "INSTALLING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Memasang dan memasangkan komponen mekanis (seperti baut/mur) agar mesin beroperasi sempurna.", deskripsiSingkat: "Memasang perangkat keras dan instalasi peralatan teknis", bobotBakatIds: ["restorative", "discipline", "achiever"], typology: "OPERATOR" },
  { no: 18, kodeAktivitas: "PRODUCING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Memproduksi barang setengah jadi maupun produk akhir secara nyata.", deskripsiSingkat: "Menghasilkan produk secara konsisten sesuai target produksi", bobotBakatIds: ["achiever", "focus", "consistency"], typology: "PRODUCER" },
  { no: 19, kodeAktivitas: "FINISHING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Mengeksekusi penyelesaian tahap akhir (finishing) dari rangkaian proyek atau manufaktur.", deskripsiSingkat: "Menyempurnakan detail akhir dari suatu pekerjaan atau produk", bobotBakatIds: ["maximizer", "responsibility", "focus"], typology: "QUALITY CONTROLLER" },
  { no: 20, kodeAktivitas: "TESTING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Menguji coba kinerja sistem atau alat untuk memastikan fungsi operasionalnya sesuai standar.", deskripsiSingkat: "Menguji fungsi dan keandalan suatu sistem atau produk", bobotBakatIds: ["deliberative", "analytical", "restorative"], typology: "QUALITY CONTROLLER" },
  { no: 21, kodeAktivitas: "DELIVERING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Mengirimkan paket, dokumen, atau pesanan barang ke alamat tujuan dengan tepat.", deskripsiSingkat: "Mengantarkan barang atau penugasan sampai ke tujuan dengan aman", bobotBakatIds: ["responsibility", "adaptability", "achiever"], typology: "DISTRIBUTOR" },
  { no: 22, kodeAktivitas: "DISTRIBUTING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Mendistribusikan berkas, materi, atau informasi secara serentak ke berbagai wilayah tujuan.", deskripsiSingkat: "Menyalurkan logistik atau informasi ke berbagai titik penerima", bobotBakatIds: ["arranger", "consistency", "responsibility"], typology: "DISTRIBUTOR" },
  { no: 23, kodeAktivitas: "MAINTAINING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Melakukan perawatan rutin untuk menjaga keandalan fasilitas, mesin, atau sarana fisik.", deskripsiSingkat: "Merawat peralatan dan sistem agar tetap berfungsi optimal", bobotBakatIds: ["restorative", "responsibility", "consistency"], typology: "OPERATOR" },
  { no: 24, kodeAktivitas: "OPERATING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Mengoperasikan serta mengendalikan peralatan mekanis, mesin, atau alur proses operasional.", deskripsiSingkat: "Mengoperasikan mesin atau sistem kerja teknis secara handal", bobotBakatIds: ["adaptability", "consistency", "focus"], typology: "OPERATOR" },
  { no: 25, kodeAktivitas: "RESTORING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Memperbaiki dan merestorasi alat atau kondisi seseorang agar kembali berfungsi normal.", deskripsiSingkat: "Memulihkan fungsi peralatan atau sistem yang mengalami gangguan", bobotBakatIds: ["restorative", "analytical", "problem_solving"], typology: "RESTORER" },
  { no: 26, kodeAktivitas: "TENDING ANIMAL", klaster: "Te", namaKlaster: "Technical", pernyataan: "Merawat, memelihara, melatih, serta membudidayakan hewan ternak atau peliharaan.", deskripsiSingkat: "Memelihara dan merawat kesehatan serta pertumbuhan satwa", bobotBakatIds: ["empathy", "developer", "responsibility"], typology: "CARETAKER" },
  { no: 27, kodeAktivitas: "SPORT", klaster: "Te", namaKlaster: "Technical", pernyataan: "Berpartisipasi aktif dalam kegiatan cabang olahraga hingga meraih pencapaian dan prestasi.", deskripsiSingkat: "Menjalankan aktivitas ketangkasan fisik dan keolahragaan", bobotBakatIds: ["competition", "achiever", "focus"], typology: "PRODUCER" },
  { no: 28, kodeAktivitas: "PLANTING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Bercocok tanam, mengolah media tanam, serta memelihara pertumbuhan tanaman.", deskripsiSingkat: "Membudidayakan dan merawat tanaman hingga tumbuh subur", bobotBakatIds: ["developer", "connectedness", "responsibility"], typology: "CARETAKER" },
  { no: 29, kodeAktivitas: "PHYSICAL SKILL", klaster: "Te", namaKlaster: "Technical", pernyataan: "Menggunakan ketangkasan dan koordinasi motorik tubuh dalam menangani peralatan atau aktivitas fisik berat.", deskripsiSingkat: "Mengandalkan kekuatan dan koordinasi fisik dalam bekerja", bobotBakatIds: ["achiever", "adaptability", "activator"], typology: "OPERATOR" },
  { no: 30, kodeAktivitas: "MANUAL SKILL", klaster: "Te", namaKlaster: "Technical", pernyataan: "Mengerjakan tugas-tugas yang mengandalkan keahlian manual serta kerajinan tangan.", deskripsiSingkat: "Menggunakan keterampilan tangan secara teliti dan terampil", bobotBakatIds: ["maximizer", "focus", "deliberative"], typology: "PRODUCER" },
  { no: 31, kodeAktivitas: "VISUAL ART", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengembangkan karya seni visual seperti lukisan, ilustrasi, patung, atau rancangan grafis.", deskripsiSingkat: "Menciptakan karya estetika seni rupa dan desain visual", bobotBakatIds: ["ideation", "maximizer", "futuristic"], typology: "DESIGNER" },
  { no: 32, kodeAktivitas: "SINGING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Menampilkan pertunjukan olah vokal atau bernyanyi di hadapan khalayak umum.", deskripsiSingkat: "Mengekspresikan keindahan suara melalui seni tarik suara", bobotBakatIds: ["communication", "significance", "positivity"], typology: "AMBASADOR" },
  { no: 33, kodeAktivitas: "MUSICAL ART", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengarang lagu, memainkan instrumen, atau berkarya di bidang seni musik.", deskripsiSingkat: "Menggubah harmoni nada dan memainkan instrumen musik", bobotBakatIds: ["ideation", "empathy", "harmony"], typology: "CREATOR" },
  { no: 34, kodeAktivitas: "MODELLING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Peran memperagakan busana dan menjadi peraga mode (fashion model).", deskripsiSingkat: "Mempresentasikan karya busana atau prototipe di depan publik", bobotBakatIds: ["significance", "woo", "self_assurance"], typology: "AMBASADOR" },
  { no: 35, kodeAktivitas: "DRAMATIZING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengemas ulang narasi atau cerita agar terasa lebih emosional dan memikat pendengar.", deskripsiSingkat: "Menghidupkan alur cerita agar menyentuh emosi audiens", bobotBakatIds: ["communication", "empathy", "ideation"], typology: "COMMUNICATOR" },
  { no: 36, kodeAktivitas: "DANCING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengekspresikan seni gerak tari yang indah dan harmonis sesuai irama musik.", deskripsiSingkat: "Menyelaraskan gerak tubuh dengan irama secara artistik", bobotBakatIds: ["adaptability", "positivity", "harmony"], typology: "CREATOR" },
  { no: 37, kodeAktivitas: "COOKING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengolah bahan masakan dan menciptakan produk seni kuliner.", deskripsiSingkat: "Meracik bahan pangan menjadi hidangan kuliner berkualitas", bobotBakatIds: ["ideation", "arranger", "serving"], typology: "CREATOR" },
  { no: 38, kodeAktivitas: "CONSERVING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Melestarikan warisan budaya serta kelestarian alam dari ancaman kerusakan atau kepunahan.", deskripsiSingkat: "Menjaga kelestarian lingkungan alam dan nilai warisan budaya", bobotBakatIds: ["connectedness", "belief", "context"], typology: "SAFEKEEPER" },
  { no: 39, kodeAktivitas: "BEAUTIFYING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Memoles serta memperindah estetika tampilan visual objek atau penampilan seseorang.", deskripsiSingkat: "Meningkatkan keindahan estetika suatu ruang, objek, atau tampilan", bobotBakatIds: ["maximizer", "ideation", "individualization"], typology: "DESIGNER" },
  { no: 40, kodeAktivitas: "ACTING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Memerankan watak atau karakter yang berbeda dari kepribadian asli di panggung/pentas.", deskripsiSingkat: "Menjiwai dan menampilkan peran karakter di hadapan audiens", bobotBakatIds: ["significance", "communication", "empathy"], typology: "COMMUNICATOR" },
  { no: 41, kodeAktivitas: "VISIONING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Memproyeksikan kecenderungan masa depan serta menetapkan target sasaran secara presisi.", deskripsiSingkat: "Merumuskan visi jauh ke depan dan menginspirasi arah perubahan", bobotBakatIds: ["futuristic", "strategic", "ideation"], typology: "VISIONARY" },
  { no: 42, kodeAktivitas: "STRATEGIZING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Merumuskan strategi dan opsi rute terbaik menuju sasaran yang belum terpikirkan pihak lain.", deskripsiSingkat: "Menyusun skenario dan alternatif langkah strategis terbaik", bobotBakatIds: ["strategic", "ideation", "futuristic"], typology: "STRATEGIST" },
  { no: 43, kodeAktivitas: "PLANNING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Merancang rencana kerja, mengonstruksi skedul prioritas, serta mengevaluasi kebijakan organisasi.", deskripsiSingkat: "Merencanakan tahapan program dan alokasi sumber daya", bobotBakatIds: ["strategic", "deliberative", "focus"], typology: "STRATEGIST" },
  { no: 44, kodeAktivitas: "PUBLICIZING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengomunikasikan keunggulan produk atau informasi agar dikenal dan diminati khalayak luas.", deskripsiSingkat: "Mengumumkan atau memberitakan sesuatu dengan cara yang mudah dipahami agar diketahui banyak orang", bobotBakatIds: ["communication", "woo", "ideation"], typology: "COMMUNICATOR" },
  { no: 45, kodeAktivitas: "MARKETING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Merancang strategi pemasaran komprehensif agar calon konsumen tertarik membeli produk/jasa secara berkelanjutan.", deskripsiSingkat: "Membangun daya tarik pasar dan strategi pemasaran produk/jasa", bobotBakatIds: ["strategic", "communication", "ideation", "woo"], typology: "MARKETER" },
  { no: 46, kodeAktivitas: "DEVELOPING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mendorong pembaruan untuk mengubah kondisi sesuatu/seseorang menjadi lebih berkembang, kuat, dan maju.", deskripsiSingkat: "Mengembangkan kapasitas sistem, produk, atau potensi manusia", bobotBakatIds: ["developer", "ideation", "futuristic"], typology: "MOTIVATOR" },
  { no: 47, kodeAktivitas: "ADVERTISING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Menyusun kampanye promosi di media massa guna menggenjot daya tarik jasa atau produk.", deskripsiSingkat: "Merancang materi periklanan yang kreatif dan memikat publik", bobotBakatIds: ["ideation", "communication", "woo"], typology: "MARKETER" },
  { no: 48, kodeAktivitas: "SYNTHESIZING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengombinasikan ragam konsep dan gagasan terpisah menjadi inovasi baru yang utuh.", deskripsiSingkat: "Memadukan berbagai elemen ide menjadi satu kesatuan konsep baru", bobotBakatIds: ["ideation", "strategic", "intellection"], typology: "SYNTHESIZER" },
  { no: 49, kodeAktivitas: "IDEATING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mencetuskan ide-ide segar dan memberikan sumbang saran pemikiran pada berbagai kesempatan.", deskripsiSingkat: "Memiliki gagasan kreatif terhadap berbagai hal", bobotBakatIds: ["ideation", "futuristic", "strategic", "learner"], typology: "CREATOR" },
  { no: 50, kodeAktivitas: "CREATING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengayunkan daya imajinasi untuk merancang penemuan produk, layanan, atau desain baru.", deskripsiSingkat: "Menciptakan terobosan atau karya orisinal yang belum pernah ada", bobotBakatIds: ["ideation", "futuristic", "intellection"], typology: "CREATOR" },
  { no: 51, kodeAktivitas: "ANIMATING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Mengolah deretan gambar diam menjadi tayangan animasi dinamis yang tampak bergerak.", deskripsiSingkat: "Membuat visualisasi animasi dan karya multimedia bergerak", bobotBakatIds: ["ideation", "learner", "communication"], typology: "DESIGNER" },
  { no: 52, kodeAktivitas: "DRAFTING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Merancang sketsa dan visualisasi gambar teknik (technical drawing).", deskripsiSingkat: "Menyusun rancangan draf dan sketsa teknis", bobotBakatIds: ["ideation", "deliberative", "analytical"], typology: "DESIGNER" },
  { no: 53, kodeAktivitas: "DESIGNING", klaster: "Gi", namaKlaster: "Generating Idea", pernyataan: "Membuat gambar cetak biru (blueprint) desain secara rinci beserta spesifikasi detailnya.", deskripsiSingkat: "Merancang arsitektur sistem, produk, atau antarmuka secara utuh", bobotBakatIds: ["ideation", "strategic", "futuristic"], typology: "DESIGNER" },
  { no: 54, kodeAktivitas: "SERVING", klaster: "S", namaKlaster: "Serving", pernyataan: "Menyediakan pelayanan bagi sesama secara tulus sebagai bentuk pengabdian yang bernilai mulia.", deskripsiSingkat: "Melayani orang lain dengan tulus dan profesional", bobotBakatIds: ["belief", "developer", "adaptability", "responsibility"], typology: "SERVER" },
  { no: 55, kodeAktivitas: "INFORMING", klaster: "S", namaKlaster: "Serving", pernyataan: "Membagikan wawasan, berita, atau materi pengetahuan kepada pihak lain.", deskripsiSingkat: "Menyampaikan informasi, kabar, atau pengetahuan kepada orang lain", bobotBakatIds: ["communication", "woo", "input", "developer"], typology: "COMMUNICATOR" },
  { no: 56, kodeAktivitas: "GREETING", klaster: "S", namaKlaster: "Serving", pernyataan: "Menyapa dan menyambut orang lain secara ramah dan sopan, baik kenalan maupun orang baru.", deskripsiSingkat: "Memberikan sapaan yang santun kepada orang lain, baik yang sudah dikenalnya maupun yang belum", bobotBakatIds: ["woo", "communication", "includer", "adaptability"], typology: "AMBASADOR" },
  { no: 57, kodeAktivitas: "ASSISTING", klaster: "S", namaKlaster: "Serving", pernyataan: "Mendukung dan membantu penyelesaian tugas atasan atau rekan kerja dari posisi pendukung.", deskripsiSingkat: "Membantu seseorang menyelesaikan tugasnya dengan menempatkan diri sebagai mitra pendukung", bobotBakatIds: ["adaptability", "belief", "responsibility", "developer"], typology: "SERVER" },
  { no: 58, kodeAktivitas: "VOLUNTEERING", klaster: "S", namaKlaster: "Serving", pernyataan: "Melakukan aksi kerelawanan dan bakti sosial tanpa memikirkan pamrih imbalan.", deskripsiSingkat: "Terjun sukarela membantu kegiatan kemanusiaan dan sosial", bobotBakatIds: ["belief", "includer", "responsibility"], typology: "CARETAKER" },
  { no: 59, kodeAktivitas: "THERAPIES", klaster: "S", namaKlaster: "Serving", pernyataan: "Menjalankan tindakan pemulihan dan rehabilitasi kondisi fisik, mental, atau perilaku seseorang.", deskripsiSingkat: "Memberikan terapi pemulihan bagi individu yang membutuhkan", bobotBakatIds: ["restorative", "empathy", "developer"], typology: "CARETAKER" },
  { no: 60, kodeAktivitas: "SPIRITUALIZING", klaster: "S", namaKlaster: "Serving", pernyataan: "Melakoni ibadah, pembinaan spiritual, kontemplasi, serta memberikan teladan atau nasihat keagamaan.", deskripsiSingkat: "Membina nilai-nilai spiritualitas, etika, dan keteladanan hidup", bobotBakatIds: ["belief", "connectedness", "intellection"], typology: "EDUCATOR" },
  { no: 61, kodeAktivitas: "COUNSELING", klaster: "S", namaKlaster: "Serving", pernyataan: "Membantu individu mengurai persoalan pribadi maupun kendala psikologis yang dihadapi.", deskripsiSingkat: "Mendampingi dan memberikan konseling pemecahan masalah personal", bobotBakatIds: ["empathy", "developer", "relator", "belief"], typology: "CARETAKER" },
  { no: 62, kodeAktivitas: "CARING", klaster: "S", namaKlaster: "Serving", pernyataan: "Memberikan perhatian, layanan kesehatan, atau bantuan kesejahteraan bagi masyarakat.", deskripsiSingkat: "Merawat dan memberikan kepedulian tulus kepada sesama", bobotBakatIds: ["empathy", "belief", "responsibility"], typology: "CARETAKER" },
  { no: 63, kodeAktivitas: "INTERVIEWING", klaster: "H", namaKlaster: "Headman", pernyataan: "Menerapkan teknik penggalian pertanyaan untuk mengumpulkan informasi berharga.", deskripsiSingkat: "Mewawancarai narasumber atau kandidat untuk menggali profil mendalam", bobotBakatIds: ["communication", "individualization", "input"], typology: "SELECTOR" },
  { no: 64, kodeAktivitas: "RECRUITING", klaster: "H", namaKlaster: "Headman", pernyataan: "Melakukan seleksi dan merekrut calon anggota atau karyawan yang sesuai kualifikasi.", deskripsiSingkat: "Menyeleksi dan menempatkan talenta terbaik ke dalam organisasi", bobotBakatIds: ["individualization", "woo", "deliberative"], typology: "SELECTOR" },
  { no: 65, kodeAktivitas: "SELLING", klaster: "H", namaKlaster: "Headman", pernyataan: "Melakukan aktivitas penjualan produk/jasa dengan pendekatan persuasif kepada calon pembeli.", deskripsiSingkat: "Meyakinkan calon klien/pembeli hingga terjadi transaksi", bobotBakatIds: ["woo", "communication", "competition"], typology: "SELLER" },
  { no: 66, kodeAktivitas: "INFLUENCING", klaster: "H", namaKlaster: "Headman", pernyataan: "Mempengaruhi sudut pandang orang lain agar bersedia mengikuti pemikiran atau saran kita.", deskripsiSingkat: "Menggerakkan audiens atau rekan agar mendukung suatu gagasan", bobotBakatIds: ["communication", "woo", "command"], typology: "MOTIVATOR" },
  { no: 67, kodeAktivitas: "ENTERTAINING", klaster: "N", namaKlaster: "Networking", pernyataan: "Menghibur dan menceriakan suasana bagi seseorang atau kelompok khalayak.", deskripsiSingkat: "Menciptakan suasana hangat, ceria, dan menghibur bagi audiens", bobotBakatIds: ["woo", "positivity", "communication"], typology: "AMBASADOR" },
  { no: 68, kodeAktivitas: "BROKERING", klaster: "H", namaKlaster: "Headman", pernyataan: "Menjadi fasilitator penghubung (mediator/broker) dalam merealisasikan transaksi bisnis.", deskripsiSingkat: "Menghubungkan berbagai pihak untuk menciptakan peluang kerja sama", bobotBakatIds: ["woo", "arranger", "strategic"], typology: "SELLER" },
  { no: 69, kodeAktivitas: "PURCHASING", klaster: "H", namaKlaster: "Headman", pernyataan: "Mengupayakan perolehan nilai/manfaat maksimal saat bertransaksi pembelian barang/jasa.", deskripsiSingkat: "Membeli sesuatu untuk mendapatkan nilai ekonomis terbaik melalui usaha yang cermat dan teliti", bobotBakatIds: ["deliberative", "strategic", "consistency", "responsibility"], typology: "EVALUATOR" },
  { no: 70, kodeAktivitas: "NEGOTIATING", klaster: "H", namaKlaster: "Headman", pernyataan: "Melakukan negosiasi untuk mencapai titik temu dan kesepakatan yang menguntungkan kedua pihak.", deskripsiSingkat: "Berunding mencari kesepakatan strategis yang saling menguntungkan", bobotBakatIds: ["strategic", "communication", "harmony"], typology: "MEDIATOR" },
  { no: 71, kodeAktivitas: "INVESTIGATING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Menyelidiki serta mengumpulkan fakta lapangan secara detail demi menyingkap kebenaran suatu kasus.", deskripsiSingkat: "Menelusuri jejak bukti dan fakta untuk mengungkap suatu persoalan", bobotBakatIds: ["analytical", "deliberative", "input"], typology: "ANALYST" },
  { no: 72, kodeAktivitas: "INTERROGATING", klaster: "H", namaKlaster: "Headman", pernyataan: "Mengajukan pertanyaan tajam dan mendalam untuk membongkar kronologi fakta peristiwa.", deskripsiSingkat: "Menguji kebenaran keterangan melalui pertanyaan kritis", bobotBakatIds: ["command", "analytical", "deliberative"], typology: "COMMANDER" },
  { no: 73, kodeAktivitas: "CONTROLLING", klaster: "H", namaKlaster: "Headman", pernyataan: "Menggunakan wewenang kepemimpinan untuk mengarahkan serta memantau kinerja tim.", deskripsiSingkat: "Mengendalikan jalannya operasional agar sesuai sasaran organisasi", bobotBakatIds: ["command", "responsibility", "consistency"], typology: "COMMANDER" },
  { no: 74, kodeAktivitas: "COLLECTING", klaster: "H", namaKlaster: "Headman", pernyataan: "Menagih kewajiban pembayaran sesuai kesepakatan klausul kontrak kerja sama.", deskripsiSingkat: "Mengumpulkan pemenuhan kewajiban atau sumber daya yang menjadi hak organisasi", bobotBakatIds: ["consistency", "responsibility", "command"], typology: "TREASURER" },
  { no: 75, kodeAktivitas: "MEDIATING", klaster: "H", namaKlaster: "Headman", pernyataan: "Turun tangan dalam memediasi dan menyelesaikan pertikaian atau konflik yang terjadi.", deskripsiSingkat: "Menjadi penengah yang adil dalam menyelesaikan perselisihan", bobotBakatIds: ["harmony", "consistency", "adaptability"], typology: "MEDIATOR" },
  { no: 76, kodeAktivitas: "DISPATCHING", klaster: "H", namaKlaster: "Headman", pernyataan: "Menginduksi dan mengutus personel untuk melaksanakan misi tugas di tempat tujuan.", deskripsiSingkat: "Menugaskan dan mengerahkan anggota tim ke titik penugasan", bobotBakatIds: ["arranger", "command", "activator"], typology: "ARRANGER" },
  { no: 77, kodeAktivitas: "COORDINATING", klaster: "H", namaKlaster: "Headman", pernyataan: "Membagi-bagikan porsi pekerjaan kepada anggota tim agar target bersama tercapai.", deskripsiSingkat: "Menyelaraskan pembagian peran antarbagian agar sinergis", bobotBakatIds: ["arranger", "consistency", "communication"], typology: "ARRANGER" },
  { no: 78, kodeAktivitas: "COOPERATING", klaster: "N", namaKlaster: "Networking", pernyataan: "Bekerja sama secara aktif dalam tim demi mewujudkan sasaran kelompok yang telah disepakati.", deskripsiSingkat: "Berkolaborasi secara harmonis di dalam kerja kelompok", bobotBakatIds: ["adaptability", "relator", "includer"], typology: "SERVER" },
  { no: 79, kodeAktivitas: "PRESENTING", klaster: "N", namaKlaster: "Networking", pernyataan: "Menyampaikan penjelasan secara gamblang dan mudah dicerna, baik format formal maupun santai.", deskripsiSingkat: "Memaparkan materi atau gagasan secara meyakinkan di depan audiens", bobotBakatIds: ["communication", "woo", "learner"], typology: "COMMUNICATOR" },
  { no: 80, kodeAktivitas: "CORRESPONDING", klaster: "N", namaKlaster: "Networking", pernyataan: "Menjalin korespondensi tertulis secara teratur melalui surat elektronik (email) atau pesan resmi.", deskripsiSingkat: "Menjaga komunikasi tertulis yang santun dan berkesinambungan", bobotBakatIds: ["communication", "relator", "responsibility"], typology: "COMMUNICATOR" },
  { no: 81, kodeAktivitas: "COMMUNICATING", klaster: "N", namaKlaster: "Networking", pernyataan: "Mengungkapkan pemikiran, perasaan, atau instruksi melalui lisan, tulisan, maupun gestur tubuh.", deskripsiSingkat: "Menyampaikan perasaan atau pikiran melalui bahasa lisan, tulisan, atau gerakan tubuh, agar orang lain memahami apa yang disampaikan", bobotBakatIds: ["communication", "woo", "ideation", "adaptability"], typology: "COMMUNICATOR" },
  { no: 82, kodeAktivitas: "REPRESENTING", klaster: "N", namaKlaster: "Networking", pernyataan: "Bertindak sebagai juru bicara yang mewakili kepentingan pihak atau institusi lain.", deskripsiSingkat: "Mewakili citra dan suara institusi di hadapan pihak eksternal", bobotBakatIds: ["woo", "communication", "belief"], typology: "AMBASADOR" },
  { no: 83, kodeAktivitas: "RELATING", klaster: "N", namaKlaster: "Networking", pernyataan: "Membangun hubungan jalinan persahabatan atas dasar saling pengertian dan kepedulian.", deskripsiSingkat: "Menjalin keakraban dan kepercayaan interpersonal yang kuat", bobotBakatIds: ["relator", "woo", "developer"], typology: "AMBASADOR" },
  { no: 84, kodeAktivitas: "LIAISING", klaster: "N", namaKlaster: "Networking", pernyataan: "Menjadi perwakilan organisasi untuk memperluas kemitraan dan membina hubungan baik dengan klien.", deskripsiSingkat: "Menjadi penghubung komunikasi strategis antarlembaga", bobotBakatIds: ["woo", "communication", "relator"], typology: "AMBASADOR" },
  { no: 85, kodeAktivitas: "GUIDING", klaster: "N", namaKlaster: "Networking", pernyataan: "Mengarahkan dan menuntun langkah pihak lain agar konsisten menuju sasaran yang tepat.", deskripsiSingkat: "Membimbing orang atau pihak lain untuk menemukan sasaran atau jalan yang telah ditetapkan", bobotBakatIds: ["developer", "belief", "strategic", "consistency"], typology: "EDUCATOR" },
  { no: 86, kodeAktivitas: "MOTIVATING", klaster: "N", namaKlaster: "Networking", pernyataan: "Menyuntikkan motivasi dan optimisme agar orang lain mampu mengeluarkan potensi terbaiknya.", deskripsiSingkat: "Memberikan dorongan semangat dan inspirasi kemajuan bagi orang lain", bobotBakatIds: ["developer", "communication", "futuristic", "belief"], typology: "MOTIVATOR" },
  { no: 87, kodeAktivitas: "SUPPORTING", klaster: "N", namaKlaster: "Networking", pernyataan: "Memberikan sokongan dan fasilitas agar kelompok kerja dapat beroperasi secara efektif.", deskripsiSingkat: "Mendukung orang atau kelompok lain agar dapat melaksanakan tugasnya secara optimal", bobotBakatIds: ["developer", "adaptability", "belief", "relator"], typology: "SERVER" },
  { no: 88, kodeAktivitas: "ADVISING", klaster: "N", namaKlaster: "Networking", pernyataan: "Memberikan sumbang saran, konsultasi, dan nasihat konstruktif bagi sesama.", deskripsiSingkat: "Memberikan nasihat atau saran kepada orang lain", bobotBakatIds: ["developer", "strategic", "belief", "intellection"], typology: "EDUCATOR" },
  { no: 89, kodeAktivitas: "COACHING", klaster: "N", namaKlaster: "Networking", pernyataan: "Bermitra untuk memperjelas visi tujuan dan mengoptimalkan potensi keunggulan rekan kerja.", deskripsiSingkat: "Mendampingi seseorang menggali potensi terbaik untuk mencapai targetnya", bobotBakatIds: ["developer", "maximizer", "individualization"], typology: "MOTIVATOR" },
  { no: 90, kodeAktivitas: "CONSULTING", klaster: "N", namaKlaster: "Networking", pernyataan: "Merumuskan panduan strategi yang disesuaikan dengan profil dan keunikan masing-masing individu.", deskripsiSingkat: "Memberikan solusi kepakaran untuk menyelesaikan masalah klien/organisasi", bobotBakatIds: ["strategic", "ideation", "developer"], typology: "STRATEGIST" },
  { no: 91, kodeAktivitas: "MENTORING", klaster: "N", namaKlaster: "Networking", pernyataan: "Mentransfer keterampilan dan membimbing bawahan/anak didik agar berhasil dalam pekerjaannya.", deskripsiSingkat: "Mengajarkan orang lain dengan memberikan contoh dan arahan agar mereka mencapai keberhasilan", bobotBakatIds: ["developer", "learner", "communication", "relator"], typology: "EDUCATOR" },
  { no: 92, kodeAktivitas: "TEACHING", klaster: "N", namaKlaster: "Networking", pernyataan: "Mengajar serta membagikan wawasan ilmu pengetahuan dengan metode pedagogi yang efektif.", deskripsiSingkat: "Menjelaskan ilmu pengetahuan secara sistematis di ruang belajar", bobotBakatIds: ["developer", "communication", "learner"], typology: "EDUCATOR" },
  { no: 93, kodeAktivitas: "TRAINING", klaster: "N", namaKlaster: "Networking", pernyataan: "Melatih keahlian teknis dan metode praktis guna menaikkan kompetensi seseorang di bidang khusus.", deskripsiSingkat: "Mengajarkan keterampilan, prosedur, metode, keahlian untuk mengembangkan kemampuan seseorang", bobotBakatIds: ["developer", "learner", "communication", "consistency"], typology: "EDUCATOR" },
  { no: 94, kodeAktivitas: "ANALYSING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Menelaah sebab-akibat secara mendalam untuk mendeteksi latar belakang fenomena atau proyeksi masa depan.", deskripsiSingkat: "Mengurai permasalahan kompleks menjadi komponen logis yang terukur", bobotBakatIds: ["analytical", "intellection", "strategic"], typology: "ANALYST" },
  { no: 95, kodeAktivitas: "BOOKKEEPING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Membukukan alur transaksi keuangan (pemasukan/pengeluaran) sesuai kaidah akuntansi baku.", deskripsiSingkat: "Mencatat dan membukukan transaksi keuangan secara tertib", bobotBakatIds: ["consistency", "discipline", "deliberative"], typology: "TREASURER" },
  { no: 96, kodeAktivitas: "PROGRAMMING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Merancang program aplikasi, arsitektur piranti lunak, atau antarmuka komputasi.", deskripsiSingkat: "Menulis kode algoritma dan membangun sistem perangkat lunak", bobotBakatIds: ["ideation", "learner", "intellection", "strategic"], typology: "CREATOR" },
  { no: 97, kodeAktivitas: "BUDGETING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Mengelola alokasi, penyimpanan, serta distribusi anggaran keuangan secara teratur.", deskripsiSingkat: "Menyusun rencana anggaran pendapatan dan belanja secara tepat", bobotBakatIds: ["deliberative", "consistency", "strategic"], typology: "TREASURER" },
  { no: 98, kodeAktivitas: "CASHIERING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Menangani alur penerimaan dan pengeluaran kas sesuai regulasi serta mencatatnya dengan rapi.", deskripsiSingkat: "Melayani transaksi pembayaran kas dengan teliti dan jujur", bobotBakatIds: ["consistency", "responsibility", "deliberative"], typology: "TREASURER" },
  { no: 99, kodeAktivitas: "COSTING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Memantau dan mengaudit kesesuaian realisasi anggaran belanja proyek terhadap perencanaannya.", deskripsiSingkat: "Menghitung dan mengendalikan komponen biaya produksi/proyek", bobotBakatIds: ["deliberative", "analytical", "consistency"], typology: "TREASURER" },
  { no: 100, kodeAktivitas: "ESTIMATING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Keahlian menghitung estimasi Rencana Anggaran Biaya (RAB) untuk keperluan tender penawaran.", deskripsiSingkat: "Menaksir kebutuhan biaya, waktu, dan material proyek secara akurat", bobotBakatIds: ["strategic", "deliberative", "analytical"], typology: "EVALUATOR" },
  { no: 101, kodeAktivitas: "AUDITING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Melakukan audit dan koreksi terhadap kelayakan laporan keuangan berkala.", deskripsiSingkat: "Memeriksa kepatuhan dan akurasi laporan terhadap standar baku", bobotBakatIds: ["consistency", "deliberative", "analytical"], typology: "EVALUATOR" },
  { no: 102, kodeAktivitas: "INSPECTING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Meneliti rincian pekerjaan secara presisi guna menjamin standar kualitas dan kebenaran.", deskripsiSingkat: "Melakukan inspeksi mutu secara cermat terhadap objek/proses kerja", bobotBakatIds: ["consistency", "deliberative", "responsibility"], typology: "QUALITY CONTROLLER" },
  { no: 103, kodeAktivitas: "VERIFYING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Melakukan verifikasi dan komparasi data untuk membuktikan keakuratan informasi.", deskripsiSingkat: "Memastikan kebenaran dan keabsahan data sebelum diputuskan", bobotBakatIds: ["deliberative", "consistency", "analytical"], typology: "EVALUATOR" },
  { no: 104, kodeAktivitas: "MONITORING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Mengawasi serta mendeteksi potensi penyimpangan atau ketidakseimbangan dalam proses kerja.", deskripsiSingkat: "Memantau indikator jalannya sistem agar tetap berada di batas aman", bobotBakatIds: ["consistency", "deliberative", "responsibility"], typology: "SAFEKEEPER" },
  { no: 105, kodeAktivitas: "SAFEKEEPING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Menjaga prosedur keselamatan kerja dan melindungi personel/aset dari potensi bahaya kecelakaan.", deskripsiSingkat: "Melindungi keselamatan jiwa, K3, dan keamanan lingkungan kerja", bobotBakatIds: ["responsibility", "deliberative", "consistency"], typology: "SAFEKEEPER" },
  { no: 106, kodeAktivitas: "SECURING", klaster: "Te", namaKlaster: "Technical", pernyataan: "Mengamankan aset dan inventaris perusahaan dari risiko pencurian, kehilangan, atau kerusakan.", deskripsiSingkat: "Menjaga sistem pengamanan fisik maupun digital dari ancaman", bobotBakatIds: ["deliberative", "responsibility", "consistency"], typology: "SAFEKEEPER" },
  { no: 107, kodeAktivitas: "DIAGNOSING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Melakukan diagnosa mendalam untuk menemukan akar penyebab suatu masalah (troubleshooting).", deskripsiSingkat: "Mengidentifikasi gejala dan sumber utama permasalahan", bobotBakatIds: ["restorative", "analytical", "strategic"], typology: "RESTORER" },
  { no: 108, kodeAktivitas: "IDENTIFYING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Melakukan verifikasi identitas guna memastikan keabsahan objek atau profil seseorang.", deskripsiSingkat: "Mengenali karakteristik spesifik dari suatu masalah atau subjek", bobotBakatIds: ["deliberative", "individualization", "analytical"], typology: "EVALUATOR" },
  { no: 109, kodeAktivitas: "APPRAISING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Melakukan appraisal/penilaian taksiran harga terhadap aset seperti properti, tanah, atau produk.", deskripsiSingkat: "Menilai kelayakan dan nilai ekonomis dari suatu aset", bobotBakatIds: ["deliberative", "analytical", "strategic"], typology: "EVALUATOR" },
  { no: 110, kodeAktivitas: "EVALUATING", klaster: "T", namaKlaster: "Thinking", pernyataan: "Menimbang dan mengevaluasi kualitas, bobot kepentingan, atau nilai kondisi suatu objek.", deskripsiSingkat: "Menakar efektivitas program serta mengambil kesimpulan evaluasi", bobotBakatIds: ["strategic", "deliberative", "intellection"], typology: "EVALUATOR" },
  { no: 111, kodeAktivitas: "OBSERVING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Melakukan pengamatan ilmiah secara cermat terhadap fenomena atau objek studi.", deskripsiSingkat: "Mengamati perilaku atau fenomena secara teliti sebagai bahan kajian", bobotBakatIds: ["intellection", "learner", "input"], typology: "EXPLORER" },
  { no: 112, kodeAktivitas: "RESEARCHING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Menjalankan penelitian terstruktur untuk menguji hipotesis, memperbarui teori, atau merumuskan solusi.", deskripsiSingkat: "Melakukan riset mendalam untuk menemukan temuan dan inovasi baru", bobotBakatIds: ["learner", "intellection", "ideation", "strategic"], typology: "EXPLORER" },
  { no: 113, kodeAktivitas: "SURVEYING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Menyusun laporan atau evaluasi hasil survei atas pelaksanaan kegiatan yang telah rampung.", deskripsiSingkat: "Mengumpulkan data lapangan melalui pengamatan dan pemetaan survei", bobotBakatIds: ["input", "learner", "consistency"], typology: "EXPLORER" },
  { no: 114, kodeAktivitas: "REVIEWING", klaster: "R", namaKlaster: "Reasoning", pernyataan: "Mencermati perkembangan situasi/individu secara saksama untuk keperluan penyusunan rekomendasi/opini.", deskripsiSingkat: "Meninjau ulang dokumen atau proses kerja untuk memberikan rekomendasi perbaikan", bobotBakatIds: ["deliberative", "intellection", "strategic"], typology: "EVALUATOR" },
];