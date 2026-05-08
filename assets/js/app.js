const rawConfig = window.WEDDING_CONFIG || {};
const config = window.WeddingConfigUtils
  ? window.WeddingConfigUtils.normalizeConfig(rawConfig)
  : rawConfig;

const cover = document.getElementById("cover");
const mainContent = document.getElementById("mainContent");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const autoScrollToggle = document.getElementById("autoScrollToggle");

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
  if (el && value) el.setAttribute(name, value);
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

  text("storyEyebrow", config.text.storyEyebrow);
  text("storyTitle", config.text.storyTitle);
  text("storyIntro", "Một cuộc gặp gỡ bình dị, một hành trình đồng hành và hôm nay là lời hẹn ước cho chặng đường dài phía trước.");

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
  attr("thanksImage", "src", config.images.thanks);

  applyVisibilityConfig();
  renderStory();
  renderEventSelector();
  renderInviteSummary();
  renderEvents();
  renderAlbum();
}

function renderStory() {
  const storyList = $("storyList");
  if (!storyList) return;

  storyList.innerHTML = config.story.map(item => `
    <article>
      <span>${escapeHtml(item.year)}</span>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.description)}</p>
      </div>
    </article>
  `).join("");
}

function renderInviteSummary() {
  const inviteGrid = $("inviteGrid");
  if (!inviteGrid) return;

  const selectedEvent = getSelectedEvent();
  inviteGrid.innerHTML = `
    <div>
      <span>Thời gian</span>
      <strong>${escapeHtml(selectedEvent.time || config.dates.coverDate)}</strong>
    </div>
    <div>
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

function renderEventsLegacy() {
  const eventGrid = $("eventGrid");
  if (!eventGrid) return;

  const selectedEvent = getSelectedEvent();
  eventGrid.innerHTML = `
    <article class="event-card">
      <img src="${escapeHtml(selectedEvent.image || "")}" alt="${escapeHtml(selectedEvent.imageAlt || selectedEvent.title || "")}" />
      <div>
        <span class="badge">${index === 0 ? "Nhà trai" : "Nhà gái"}</span>
        <h4>${escapeHtml(event.title)}</h4>
        <p><b>Thời gian:</b> ${escapeHtml(event.time)}</p>
        <p><b>Địa điểm:</b> ${escapeHtml(event.address)}</p>
        <a class="outline-btn" href="${escapeHtml(event.mapUrl || "#")}" target="_blank" rel="noreferrer">Xem bản đồ</a>
      </div>
    </article>
  `;
}

function renderEvents() {
  const eventGrid = $("eventGrid");
  if (!eventGrid) return;

  const selectedEvent = getSelectedEvent();
  eventGrid.innerHTML = `
    <article class="event-card">
      <img src="${escapeHtml(selectedEvent.image || "")}" alt="${escapeHtml(selectedEvent.imageAlt || selectedEvent.title || "")}" />
      <div>
        <span class="badge">${escapeHtml(selectedEvent.label || "")}</span>
        <h4>${escapeHtml(selectedEvent.title || "")}</h4>
        <p><b>Thời gian:</b> ${escapeHtml(selectedEvent.time || "")}</p>
        <p><b>Địa điểm:</b> ${escapeHtml(selectedEvent.address || "")}</p>
        <a class="outline-btn" href="${escapeHtml(selectedEvent.mapUrl || "#")}" target="_blank" rel="noreferrer">Xem bản đồ</a>
      </div>
    </article>
  `;
}

function renderAlbum() {
  const albumGrid = $("albumGrid");
  if (!albumGrid) return;

  const classes = ["portrait", "landscape", "square", "tall"];
  albumGrid.innerHTML = config.album.map((item, index) => `
    <button class="album-item ${classes[index % classes.length]}" type="button" data-img="${escapeHtml(item.src)}">
      <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || "Ảnh album")}" />
    </button>
  `).join("");

  bindAlbumLightbox();
}

function updateCountdown() {
  const now = new Date();
  const diff = Math.max(0, weddingDate - now);

  text("days", Math.floor(diff / (1000 * 60 * 60 * 24)));
  text("hours", Math.floor(diff / (1000 * 60 * 60)) % 24);
  text("minutes", Math.floor(diff / (1000 * 60)) % 60);
  text("seconds", Math.floor(diff / 1000) % 60);
}

function setMusicButtonState() {
  if (bgMusic.paused) {
    musicToggle.classList.remove("active");
  } else {
    musicToggle.classList.add("active");
  }
}

async function playMusic() {
  bgMusic.volume = 0.45;
  try {
    await bgMusic.play();
  } catch (error) {
    // Browser may block autoplay. User can press the music button.
  }
  setMusicButtonState();
}

$("openInvite").addEventListener("click", () => {
  cover.remove();
  mainContent.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  playMusic();

  setTimeout(() => {
    startAutoScroll();
  }, 2000);
});

musicToggle.addEventListener("click", async () => {
  if (bgMusic.paused) {
    await playMusic();
  } else {
    bgMusic.pause();
    setMusicButtonState();
  }
});

function startAutoScroll() {
  if (autoScrollTimer) return;

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
  isAutoScrolling = false;
  autoScrollToggle.classList.remove("active");
  autoScrollToggle.textContent = "⇣";
  clearInterval(autoScrollTimer);
  autoScrollTimer = null;
}

autoScrollToggle.addEventListener("click", () => {
  if (isAutoScrolling) stopAutoScroll();
  else startAutoScroll();
});

window.addEventListener("wheel", () => {
  if (isAutoScrolling) stopAutoScroll();
}, { passive: true });

window.addEventListener("touchmove", () => {
  if (isAutoScrolling) stopAutoScroll();
}, { passive: true });

const lightbox = $("lightbox");
const lightboxImage = $("lightboxImage");

function bindAlbumLightbox() {
  document.querySelectorAll(".album-item").forEach(button => {
    button.addEventListener("click", () => {
      lightboxImage.src = button.dataset.img;
      lightbox.showModal();
    });
  });
}

$("closeLightbox").addEventListener("click", () => {
  lightbox.close();
});

$("copyBank").addEventListener("click", async () => {
  const message = $("copyMessage");
  const account = $("bankAccount").textContent.trim();

  try {
    await navigator.clipboard.writeText(account);
    message.textContent = "Đã copy số tài khoản.";
  } catch {
    message.textContent = `Không copy được. Bạn vui lòng copy thủ công: ${account}`;
  }
});

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

$("clearRsvp").addEventListener("click", () => {
  if (!confirm("Xóa toàn bộ RSVP local?")) return;
  localStorage.removeItem(rsvpKey);
  renderRsvps();
});

$("exportRsvp").addEventListener("click", () => {
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
