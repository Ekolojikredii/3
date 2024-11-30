import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsxMZh6GuZDn322Jrt0pq-j0QzWut6Pio",
  authDomain: "ekolojikkredi-c4565.firebaseapp.com",
  projectId: "ekolojikkredi-c4565",
  storageBucket: "ekolojikkredi-c4565.appspot.com",
  messagingSenderId: "598301088730",
  appId: "1:598301088730:web:b83ab9a52628f99bcb7ee3",
  measurementId: "G-7Y60508Q75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

function toggleMenu() {
    var menuContent = document.getElementById('menuContent');
    menuContent.style.display = (menuContent.style.display === 'block') ? 'none' : 'block';
}

function showSection(sectionId) {
    var sections = document.querySelectorAll('.section');
    sections.forEach(function (section) {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Butonlara tıklamayı etkinleştirmek için
document.querySelectorAll('.right button').forEach(button => {
    button.addEventListener('click', event => {
        const sectionId = event.target.getAttribute('onclick').replace("showSection('", "").replace("')", "");
        showSection(sectionId);
    });
});

// Kayıt Ol formunu işleme
document.getElementById('kayitForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    try {
        await addDoc(collection(db, 'users'), data);
        alert('Kayıt başarılı!');
        event.target.reset();
    } catch (error) {
        console.error('Error:', error);
    }
});

// Veri Görme formunu işleme
async function veriGoruntuleme() {
    try {
        const userSnapshot = await getDocs(collection(db, 'users'));
        userSnapshot.forEach(doc => {
            const user = doc.data();
            document.getElementById('veriGoruntulemeIsim').innerText = user.isim;
            document.getElementById('veriGoruntulemePuan').innerText = user.puan;
        });

        const dataSnapshot = await getDocs(collection(db, 'data'));
        const teslimlerList = document.getElementById('gecmisTeslimler');
        teslimlerList.innerHTML = '';
        dataSnapshot.forEach(doc => {
            const data = doc.data();
            const li = document.createElement('li');
            li.innerText = `Okul: ${data.okulIsmi}, Atık Türü: ${data.atikTuru}, Atık Kütlesi: ${data.atikKutlesi} kg`;
            teslimlerList.appendChild(li);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Veri Girişi formunu işleme
document.getElementById('veriGirisiForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    try {
        await addDoc(collection(db, 'data'), data);
        alert('Veri girişi başarılı!');
        event.target.reset();
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('veriGoruntuleme').addEventListener('click', veriGoruntuleme);
