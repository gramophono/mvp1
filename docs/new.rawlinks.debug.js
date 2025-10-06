/*
 * new.rawlinks.debug.js
 * Ενισχυμένη έκδοση με logging για διάγνωση σφαλμάτων φόρτωσης playlist
 */

(function() {
  console.log("✅ new.rawlinks.debug.js: Script loaded successfully.");

  // Εδώ βάλε τη διεύθυνση του εξωτερικού playlist JSON
  const playlistURL = window.playlistURL || "https://example.com/playlist.json";

  async function loadPlaylist(url) {
    console.log("🎵 Προσπάθεια φόρτωσης playlist από:", url);
    try {
      const response = await fetch(url, { cache: "no-cache" });
      console.log("📡 HTTP Response status:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error("Αποτυχία φόρτωσης. HTTP status " + response.status);
      }

      const data = await response.json();
      console.log("✅ Επιτυχής φόρτωση playlist:", data);

      if (!data || data.length === 0) {
        console.warn("⚠️ Το playlist είναι κενό ή δεν έχει έγκυρη δομή.");
        showMessage("Δεν υπάρχουν διαθέσιμα κομμάτια στο playlist.");
        return;
      }

      renderPlaylist(data);
    } catch (error) {
      console.error("❌ Σφάλμα κατά τη φόρτωση του playlist:", error);
      showMessage("Αποτυχία φόρτωσης playlist.<br>Δες την κονσόλα (F12 → Console) για λεπτομέρειες.");
    }
  }

  function renderPlaylist(data) {
    console.log("🎶 Απόπειρα εμφάνισης playlist...");

    const container = document.getElementById("mvp-playlist-list");
    if (!container) {
      console.error("❌ Δεν βρέθηκε container με id='mvp-playlist-list'.");
      showMessage("Το playlist δεν μπορεί να εμφανιστεί (λείπει το στοιχείο #mvp-playlist-list).");
      return;
    }

    container.innerHTML = ""; // καθάρισε παλιό περιεχόμενο

    data.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "mvp-playlist-item";
      div.dataset.type = item.type || "audio";
      div.dataset.path = item.path || "";
      div.dataset.title = item.title || `Τραγούδι ${index + 1}`;

      div.textContent = item.title || `Track ${index + 1}`;
      container.appendChild(div);
    });

    console.log("✅ Το playlist εμφανίστηκε επιτυχώς.");
  }

  function showMessage(html) {
    const msg = document.createElement("div");
    msg.style.background = "#ffeecc";
    msg.style.padding = "10px";
    msg.style.border = "1px solid #ddaa00";
    msg.style.margin = "10px 0";
    msg.innerHTML = html;
    document.body.appendChild(msg);
  }

  // Ενεργοποίηση μετά τη φόρτωση DOM
  document.addEventListener("DOMContentLoaded", () => {
    console.log("🌐 DOM loaded, starting playlist fetch...");
    loadPlaylist(playlistURL);
  });
})();
