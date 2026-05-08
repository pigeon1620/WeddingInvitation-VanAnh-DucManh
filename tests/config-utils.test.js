var fso = new ActiveXObject("Scripting.FileSystemObject");
var shell = new ActiveXObject("WScript.Shell");
var root = shell.CurrentDirectory;
var utilsPath = root + "\\assets\\js\\config-utils.js";

if (!fso.FileExists(utilsPath)) {
  throw new Error("Missing config utils file: " + utilsPath);
}

var file = fso.OpenTextFile(utilsPath, 1, false, 0);
var source = file.ReadAll();
file.Close();
eval(source);

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message + ". Expected: " + expected + ". Actual: " + actual);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

var config = WeddingConfigUtils.normalizeConfig({
  couple: {
    brideName: "Lan",
    groomName: "Minh"
  },
  dates: {
    weddingDate: "2026-12-20T18:00:00+07:00",
    displayDate: "20.12.2026"
  },
  images: {
    cover: "assets/images/custom-cover.jpg",
    couple: "assets/images/custom-couple.jpg"
  },
  events: [
    {
      key: "groom",
      label: "Nha trai",
      title: "Le cuoi",
      time: "18:00",
      address: "Ha Noi",
      mapUrl: "https://maps.example.com",
      image: "assets/images/map.jpg",
      imageAlt: "Map"
    },
    {
      key: "bride",
      label: "Nha gai",
      title: "Le vu quy",
      time: "08:00",
      address: "Hung Yen",
      mapUrl: "https://maps.example.com/bride",
      image: "assets/images/map-2.jpg",
      imageAlt: "Map 2"
    }
  ],
  album: [
    { src: "assets/images/a.jpg", alt: "Album 1" }
  ],
  ui: {
    selectedEventKey: "bride",
    sections: {
      rsvp: false
    },
    blocks: {
      bankInfo: false
    }
  },
  bank: {
    accountNumber: "999999"
  }
});

assertEqual(config.couple.brideName, "Lan", "bride name should come from config");
assertEqual(config.couple.groomName, "Minh", "groom name should come from config");
assertEqual(config.couple.displayName, "Lan & Minh", "display name should be composed from names");
assertEqual(config.dates.weddingDate, "2026-12-20T18:00:00+07:00", "wedding date should come from config");
assertEqual(config.images.cover, "assets/images/custom-cover.jpg", "cover image should come from config");
assertEqual(config.events.length, 2, "events should come from config");
assertEqual(config.events[0].address, "Ha Noi", "event address should come from config");
assertEqual(config.events[1].key, "bride", "event key should come from config");
assertEqual(config.album[0].src, "assets/images/a.jpg", "album image should come from config");
assertEqual(config.bank.accountNumber, "999999", "bank account should come from config");
assertEqual(config.ui.selectedEventKey, "bride", "selected event key should come from config");
assertEqual(config.ui.sections.rsvp, false, "section visibility should come from config");
assertEqual(config.ui.blocks.bankInfo, false, "block visibility should come from config");
assert(config.story.length > 0, "default story items should be retained");

var fallbackConfig = WeddingConfigUtils.normalizeConfig({
  events: [
    {
      key: "custom-event",
      title: "Le an hoi",
      time: "09:00",
      address: "Phu Tho",
      image: "assets/images/map.jpg"
    }
  ],
  ui: {
    selectedEventKey: "missing-event"
  }
});

assertEqual(fallbackConfig.ui.selectedEventKey, "custom-event", "selected event key should fall back to first event key when invalid");

WScript.Echo("config-utils tests passed");
