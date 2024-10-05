    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
    import { getDatabase, ref, get, set, update } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js';

    // Konfigurasi Firebase (sesuaikan dengan project Firebase kamu)
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        databaseURL: "https://ruang-belajar-digital-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // Inisialisasi Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);


    // Fungsi untuk memperbarui view count
    function updatePostView(postElement) {
    const domainName = window.location.hostname;
    const getLink = window.location.href;
    const urlObj = new URL(getLink);

    // Ambil nama file terakhir dari path
    const getLinkFileName = urlObj.pathname.split('/').pop();
    const fullPath = urlObj.pathname.substring(1);  // Mendapatkan path lengkap

    const appName = postElement.getAttribute('appname-id');
    const postViewsElement = postElement.parentElement.querySelector("#postviews");
    postViewsElement.classList.add("view-load");

    // Referensi ke Firebase Database untuk semua counter-viewers
    const counterRef = ref(database, 'counter-viewers/' + appName);

    // Ambil semua data dari Firebase
    get(counterRef).then((snapshot) => {
        const data = snapshot.val();
        let pageId;
        let isNewPost = false;

        // Jika ada data, cek apakah fullPath sudah ada
        if (data) {
            // Cari apakah fullPath sudah ada di data
            for (const key in data) {
                if (data[key].page === fullPath) {
                    pageId = data[key].pageid;  // Jika ditemukan, gunakan pageId yang sudah ada
                    break;
                }
            }
        }

        // Jika pageId tidak ditemukan, berarti ini adalah post baru
        if (!pageId) {
            // Jika tidak ditemukan, buat pageId baru berdasarkan jumlah total entry
            pageId = Object.keys(data || {}).length + 1;
            isNewPost = true;
        }

        // Referensi Firebase untuk post spesifik berdasarkan pageId
        const postRef = ref(database, 'counter-viewers/' + appName + '/' + pageId);

        // Ambil data spesifik untuk post ini
        get(postRef).then((snapshot) => {
            let postData = snapshot.val();

            if (isNewPost) {
                // Jika data tidak ditemukan, buat entry baru dengan pageId baru
                postData = {
                    pageid: pageId,          // Page ID baru
                    countviews: 0,           // Inisialisasi view count
                    domain: domainName,      // Domain tempat post berada
                    page: fullPath           // Full path dari halaman
                };
            }

            // Update tampilan jumlah view
            postViewsElement.classList.remove("view-load");
            postViewsElement.textContent = postData.countviews + " x";

            // Tambahkan view count
            postData.countviews++;

            // Simpan data baru atau update data yang sudah ada di Firebase
            if (isNewPost) {
                set(postRef, postData);  // Jika post baru, simpan semua data
            } else {
                update(postRef, { countviews: postData.countviews }); // Jika post sudah ada, hanya update view count
            }
        }).catch((error) => {
            console.error('Gagal mengambil data dari Firebase:', error);
        });

    }).catch((error) => {
        console.error('Gagal mengambil data dari Firebase:', error);
    });
}




    // Fungsi untuk memulai proses pada semua elemen dengan class `.data-view`
    function initPostViews() {
        const postElements = document.querySelectorAll(".data-view[appname-id]");

        postElements.forEach((postElement) => {
            updatePostView(postElement);
        });
    }

    // Jalankan fungsi ketika halaman dimuat
    document.addEventListener('DOMContentLoaded', initPostViews);