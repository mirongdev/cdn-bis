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


    function updatePostView(postElement) {
        const domainName = window.location.hostname;
        const getLink = window.location.href;
        const urlObj = new URL(getLink);
        // Ambil nama file terakhir dari path
        const getLinkFileName = urlObj.pathname.split('/').pop();


        const fullPath = urlObj.pathname.substring(1);

        const postViewsElement = postElement.parentElement.querySelector("#postviews");

        postViewsElement.classList.add("view-load");


        const appName = postElement.getAttribute('appname');
        const pageId = postElement.getAttribute('page-id');
        // const pageId = 1;

        // Referensi ke Firebase Database untuk post ini
        const postRef = ref(database, 'counter-viewers/' + appName + "/" + pageId);

        // Ambil data dari Firebase Database sekali (one-time)
        get(postRef).then((snapshot) => {
            let postData = snapshot.val();
            let isNewPost = false;

            if (postData === null) {
                // Jika data tidak ditemukan, buat entry baru
                postData = {
                    pageid: pageId,
                    countviews: 0,
                    // fullurl: getLink,
                    domain: domainName,
                    page: getLinkFileName

                };
                isNewPost = true;
            }

            // Update tampilan jumlah view
            postViewsElement.classList.remove("view-load");
            postViewsElement.textContent = postData.countviews + " x";

            // Tambahkan view count
            postData.countviews++;

            // Update data di Firebase
            if (isNewPost) {
                set(postRef, postData); // Jika post baru, simpan semua data
            } else {
                update(postRef, { countviews: postData.countviews }); // Jika post sudah ada, hanya update view count
            }
        }).catch((error) => {
            console.error('Gagal mengambil data dari Firebase:', error);
        });
    }

    // Fungsi untuk memulai proses pada semua elemen dengan class `.data-view`
    function initPostViews() {
        const postElements = document.querySelectorAll(".data-view[appname]");

        postElements.forEach((postElement) => {
            updatePostView(postElement);
        });
    }

    // Jalankan fungsi ketika halaman dimuat
    document.addEventListener('DOMContentLoaded', initPostViews);