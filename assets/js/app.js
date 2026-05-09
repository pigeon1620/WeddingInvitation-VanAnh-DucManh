const config = window.WEDDING_CONFIG || {};
config.text = config.text || {};
config.couple = config.couple || {};
config.dates = config.dates || {};
config.images = config.images || {};
config.ui = config.ui || {};
config.ui.sections = config.ui.sections || {};
config.ui.blocks = config.ui.blocks || {};
config.events = Array.isArray(config.events) ? config.events : [];
config.album = Array.isArray(config.album) ? config.album : [];
config.bank = config.bank || {};

const cover = document.getElementById("cover");
const mainContent = document.getElementById("mainContent");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const autoScrollToggle = document.getElementById("autoScrollToggle");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");

let autoScrollTimer = null;
let isAutoScrolling = false;
let weddingDate = new Date(config.dates.weddingDate);
let selectedEventKey = config.ui?.selectedEventKey || config.events?.[0]?.key || "";

function $(id) {
  return document.getElementById(id);
}

function text(id, value) {
  const el = $(id);
  if (el) el.textContent = value || "";
}

function attr(id, name, value) {
  const el = $(id);
  if (!el) return;
  if (value) {
    el.setAttribute(name, value);
  } else {
    el.removeAttribute(name);
  }
}

function on(id, eventName, handler) {
  const el = $(id);
  if (el) el.addEventListener(eventName, handler);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function setHidden(id, hidden) {
  const el = $(id);
  if (!el) return;
  el.classList.toggle("hidden", Boolean(hidden));
}

function getSelectedEvent() {
  return config.events.find(event => event.key === selectedEventKey) || config.events[0] || {};
}

function getCeremony(event) {
  if (!event) return {};
  return event.ceremony || {
    title: event.title || "",
    time: event.time || ""
  };
}

function getReception(event) {
  if (!event) return {};
  return event.reception || {};
}

function applyVisibilityConfig() {
  const sections = config.ui?.sections || {};
  const blocks = config.ui?.blocks || {};

  setHidden("story", sections.story === false);
  setHidden("invitation", sections.invitation === false);
  setHidden("event", sections.event === false);
  setHidden("album", sections.album === false);
  setHidden("gift", sections.gift === false);
  setHidden("rsvp", sections.rsvp === false);
  setHidden("thanks", sections.thanks === false);
  setHidden("bankBox", blocks.bankInfo === false);
}

function renderConfig() {
  document.title = config.siteTitle || "Thiệp Cưới";
  attr("pageDescription", "content", config.description || "");

  text("coverEyebrow", config.text.coverEyebrow);
  text("coverBrideName", config.couple.brideName);
  text("coverGroomName", config.couple.groomName);
  text("coverDate", config.dates.coverDate);
  text("coverDescription", config.text.heroDescription);
  text("openInvite", config.text.openButton);

  text("heroEyebrow", config.text.heroEyebrow);
  text("heroBrideName", config.couple.brideName);
  text("heroGroomName", config.couple.groomName);
  text("heroDate", config.dates.displayDate);
  text("heroDescription", config.text.heroDescription);

  text("invitationEyebrow", config.text.invitationEyebrow || "Together With Their Families");
  text("invitationTitle", config.text.invitationTitle || "Lễ thành hôn");
  text("invitationDescription", config.text.invitationDescription || "Chúng tôi trân trọng kính mời bạn đến tham dự lễ cưới và chung vui cùng gia đình.");

  text("eventEyebrow", config.text.eventEyebrow);
  text("eventTitle", config.text.eventTitle);
  text("albumEyebrow", config.text.albumEyebrow);
  text("albumTitle", config.text.albumTitle);
  text("giftEyebrow", config.text.giftEyebrow);
  text("giftTitle", config.text.giftTitle);
  text("bankTitle", config.text.bankTitle);
  text("bankName", config.bank.bankName);
  text("bankOwner", config.bank.accountOwner);
  text("bankAccount", config.bank.accountNumber);
  text("thanksTitle", config.text.thanksTitle);
  text("thanksMessage", config.text.thanksMessage);

  attr("coverImage", "src", config.images.cover);
  attr("coupleImage", "src", config.images.couple);
  attr("giftImage", "src", config.images.gift);

  applyVisibilityConfig();
  renderEventSelector();
  renderInviteSummary();
  renderEvents();
  renderAlbum();
}

function renderInviteSummary() {
  const inviteGrid = $("inviteGrid");
  if (!inviteGrid) return;

  const selectedEvent = getSelectedEvent();
  const ceremony = getCeremony(selectedEvent);
  const reception = getReception(selectedEvent);

  // Tiệc cưới
  inviteGrid.innerHTML = `
    <div>
      <span>Tiệc cưới</span>
      <strong>${escapeHtml(reception.time || "Đang cập nhật")}</strong>
    </div>
    <div class="invite-address">
      <span>Địa điểm</span>
      <strong>${escapeHtml(selectedEvent.address || "")}</strong>
    </div>
  `;
}

function renderEventSelector() {
  const eventSelector = $("eventSelector");
  if (!eventSelector) return;

  const showSelector = config.ui?.blocks?.eventSelector !== false && config.events.length > 1;
  eventSelector.classList.toggle("hidden", !showSelector);

  if (!showSelector) {
    eventSelector.innerHTML = "";
    return;
  }

  eventSelector.innerHTML = config.events.map(event => `
    <button class="event-selector-btn ${event.key === selectedEventKey ? "active" : ""}" type="button" data-event-key="${escapeHtml(event.key)}">
      ${escapeHtml(event.label || event.title)}
    </button>
  `).join("");

  eventSelector.querySelectorAll("[data-event-key]").forEach(button => {
    button.addEventListener("click", () => {
      selectedEventKey = button.dataset.eventKey || selectedEventKey;
      config.ui.selectedEventKey = selectedEventKey;
      renderEventSelector();
      renderInviteSummary();
      renderEvents();
    });
  });
}

// Render cho lễ thành hôn và tiệc cưới. Nếu có 2 sự kiện, mặc định sẽ hiển thị sự kiện của nhà gái. Khách mời có thể chọn xem thông tin của nhà trai nếu muốn.
function renderEvents() {
  const eventGrid = $("eventGrid");
  if (!eventGrid) return;

  const selectedEvent = getSelectedEvent();
  const ceremony = getCeremony(selectedEvent);
  const reception = getReception(selectedEvent);

  eventGrid.innerHTML = `
    <article class="event-card">
      <img src="${escapeHtml(selectedEvent.image || "")}" alt="${escapeHtml(selectedEvent.imageAlt || selectedEvent.label || "")}" />
      
      <div>
        <span class="badge">${escapeHtml(selectedEvent.label || "")}</span>

        <div class="event-time-block">
          <h4>${escapeHtml(ceremony.title || "Lễ thành hôn")}</h4>
          <p><b>Thời gian:</b> ${escapeHtml(ceremony.time || "")}</p>
        </div>

        <p><b>Địa điểm:</b> ${escapeHtml(selectedEvent.address || "")}</p>
        <a class="outline-btn" href="${escapeHtml(selectedEvent.mapUrl || "#")}" target="_blank" rel="noreferrer">Xem bản đồ</a>
      </div>
    </article>
  `;
}

function renderAlbum() {
  const albumGrid = $("albumGrid");
  if (!albumGrid) return;

  albumGrid.innerHTML = config.album.map(item => `
    <button class="album-item" type="button" data-img="${escapeHtml(item.src)}">
      <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || "Ảnh album")}" />
    </button>
  `).join("");

  bindAlbumLightbox();
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date();
  const diff = Math.max(0, weddingDate - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const seconds = Math.floor(diff / 1000) % 60;

  text("days", days);
  text("hours", pad2(hours));
  text("minutes", pad2(minutes));
  text("seconds", pad2(seconds));
}

function setMusicButtonState() {
  if (!musicToggle || !bgMusic) return;

  if (bgMusic.paused) {
    musicToggle.classList.remove("active");
  } else {
    musicToggle.classList.add("active");
  }
}

async function playMusic() {
  if (!bgMusic) return;

  bgMusic.volume = 0.45;
  try {
    await bgMusic.play();
  } catch (error) {
    // Browser may block autoplay. User can press the music button.
  }
  setMusicButtonState();
}

function startAutoScroll() {
  if (autoScrollTimer || !autoScrollToggle) return;

  isAutoScrolling = true;
  autoScrollToggle.classList.add("active");
  autoScrollToggle.textContent = "❚❚";

  autoScrollTimer = setInterval(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    if (window.scrollY >= maxScroll - 4) {
      stopAutoScroll();
      return;
    }

    window.scrollBy({ top: 5, behavior: "auto" });
  }, 16);
}

function stopAutoScroll() {
  if (!autoScrollToggle) return;

  isAutoScrolling = false;
  autoScrollToggle.classList.remove("active");
  autoScrollToggle.textContent = "⇣";
  clearInterval(autoScrollTimer);
  autoScrollTimer = null;
}

function bindAlbumLightbox() {
  if (!lightbox || !lightboxImage) return;

  document.querySelectorAll(".album-item").forEach(button => {
    button.addEventListener("click", () => {
      lightboxImage.src = button.dataset.img;
      lightbox.showModal();
    });
  });
}

const rsvpKey = "wedding-rsvp-list";
const rsvpForm = $("rsvpForm");
const guestList = $("guestList");

function getRsvps() {
  return JSON.parse(localStorage.getItem(rsvpKey) || "[]");
}

function saveRsvps(items) {
  localStorage.setItem(rsvpKey, JSON.stringify(items));
}

function renderRsvps() {
  if (!guestList) return;

  const items = getRsvps();
  if (items.length === 0) {
    guestList.innerHTML = "<li>Chưa có xác nhận nào.</li>";
    return;
  }

  guestList.innerHTML = items.map(item => `
    <li>
      <b>${escapeHtml(item.name)}</b> - ${escapeHtml(item.status)} - ${Number(item.guests)} khách
      ${item.message ? `<br><em>${escapeHtml(item.message)}</em>` : ""}
    </li>
  `).join("");
}

on("openInvite", "click", () => {
  if (cover) cover.remove();
  if (mainContent) mainContent.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  playMusic();

  setTimeout(() => {
    startAutoScroll();
  }, 2000);
});

on("musicToggle", "click", async () => {
  if (!bgMusic) return;

  if (bgMusic.paused) {
    await playMusic();
  } else {
    bgMusic.pause();
    setMusicButtonState();
  }
});

on("autoScrollToggle", "click", () => {
  if (isAutoScrolling) stopAutoScroll();
  else startAutoScroll();
});

window.addEventListener("wheel", () => {
  if (isAutoScrolling) stopAutoScroll();
}, { passive: true });

window.addEventListener("touchmove", () => {
  if (isAutoScrolling) stopAutoScroll();
}, { passive: true });

on("closeLightbox", "click", () => {
  if (lightbox) lightbox.close();
});

on("copyBank", "click", async () => {
  const message = $("copyMessage");
  const account = $("bankAccount")?.textContent.trim();
  if (!message || !account) return;

  try {
    await navigator.clipboard.writeText(account);
    message.textContent = "Đã copy số tài khoản.";
  } catch {
    message.textContent = `Không copy được. Bạn vui lòng copy thủ công: ${account}`;
  }
});

if (rsvpForm) {
  rsvpForm.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(rsvpForm);
    const item = {
      name: formData.get("name"),
      guests: formData.get("guests"),
      status: formData.get("status"),
      message: formData.get("message"),
      createdAt: new Date().toISOString()
    };

    const items = getRsvps();
    items.unshift(item);
    saveRsvps(items);

    rsvpForm.reset();
    renderRsvps();
    alert("Đã lưu xác nhận trên trình duyệt local.");
  });
}

on("clearRsvp", "click", () => {
  if (!confirm("Xóa toàn bộ RSVP local?")) return;
  localStorage.removeItem(rsvpKey);
  renderRsvps();
});

on("exportRsvp", "click", () => {
  const data = JSON.stringify(getRsvps(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "rsvp-list.json";
  link.click();

  URL.revokeObjectURL(url);
});

renderConfig();
updateCountdown();
setInterval(updateCountdown, 1000);
renderRsvps();
