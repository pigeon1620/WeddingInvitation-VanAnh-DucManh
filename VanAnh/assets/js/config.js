window.WEDDING_CONFIG = {
  siteTitle: "Thiệp Cưới - Đức Mạnh & Vân Anh",
  description: "Thiệp cưới online của Đức Mạnh & Vân Anh.",

  couple: {
    brideName: "Vân Anh",
    groomName: "Đức Mạnh"
  },

  dates: {
    weddingDate: "2026-05-24T17:00:00+07:00",
    coverDate: "Chủ nhật, 24 tháng 05, 2026",
    displayDate: "24.05.2026"
  },

  text: {
    coverEyebrow: "Wedding Invitation",
    openButton: "Mở thiệp",
    heroEyebrow: "Trân trọng kính mời khách quý tới dự tiệc cưới",
    heroDescription: "Chúng tôi rất hân hạnh được mời bạn đến chung vui trong ngày đặc biệt của hai gia đình.",
    invitationEyebrow: "Together With Their Families",
    invitationTitle: "Tiệc cưới",
    invitationDescription: "Chúng tôi trân trọng kính mời bạn đến tham dự lễ cưới và chung vui cùng gia đình.",
    storyEyebrow: "Our Story",
    storyTitle: "Câu chuyện tình yêu",
    eventEyebrow: "Wedding Event",
    eventTitle: "Thông tin buổi lễ thành hôn",
    albumEyebrow: "Wedding Album",
    albumTitle: "Album ảnh",
    giftEyebrow: "Wedding Gift",
    giftTitle: "Gửi lời chúc",
    bankTitle: "Thông tin mừng cưới mẫu",
    thanksTitle: "Cảm ơn bạn!",
    thanksMessage: "Sự hiện diện của bạn là niềm vui và vinh hạnh cho gia đình chúng tôi."
  },

  images: {
    cover: "assets/images/backgrounds/background1.svg",
    couple: "assets/images/main_couple.jpg",
    gift: "assets/images/d3.svg",
    thanks: ""
  },

  ui: {
    selectedEventKey: "bride", // selectedEventKey chọn tiệc cưới: "bride" hoặc "groom"
    sections: {
      story: true,
      invitation: true,
      event: true,
      album: true,
      gift: false,
      rsvp: false,
      thanks: true
    },
    blocks: {
      eventSelector: false,
      bankInfo: true
    }
  },

  events: [
    {
      key: "groom",
      label: "Nhà trai",

      ceremony: {
        title: "Lễ tân hôn - Nhà trai",
        time: "12:00, 25/05/2026"
      },

      reception: {
        title: "Tiệc cưới - Nhà trai",
        time: "12:00, 25/05/2026"
      },

      address: "Khu 7, Xã Thanh Thuỷ, Tỉnh Phú Thọ",
      mapUrl: "https://www.google.com/maps/place/21%C2%B010'27.7%22N+105%C2%B016'41.9%22E/@21.1712979,105.2729513,15z/data=!4m4!3m3!8m2!3d21.1743611!4d105.2783056!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D",
      image: "assets/images/map_groom.png",
      imageAlt: "Bản đồ nhà trai"
    },
    {
      key: "bride",
      label: "Nhà gái",

      ceremony: {
        title: "Lễ vu quy - Nhà gái",
        time: "07:00, 25/05/2026"
      },

      reception: {
        title: "Tiệc cưới - Nhà gái",
        time: "17:00, 24/05/2026"
      },

      address: "Thôn Đông Hải, Phường Trần Lãm, Tỉnh Hưng Yên (Xã Vũ Chính, Thành phố Thái Bình, Tỉnh Thái Bình cũ)",
      mapUrl: "https://www.google.com/maps/dir/21.0280115,105.9449027/20.4294765,106.3586792/@20.7286297,105.817904,10z/data=!3m1!4b1!4m6!4m5!1m1!4e1!1m1!4e1!3e0!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D",
      image: "assets/images/map_bride.png",
      imageAlt: "Bản đồ nhà gái"
    }
  ],

  album: [
    { src: "assets/images/album_1.jpg", alt: "Ảnh album 1" },
    { src: "assets/images/album_2.jpg", alt: "Ảnh album 2" },
    { src: "assets/images/album_3.jpg", alt: "Ảnh album 3" }
  ],

  bank: {
    bankName: "AduBank",
    accountOwner: "Adu",
    accountNumber: "ADU123"
  }
};
