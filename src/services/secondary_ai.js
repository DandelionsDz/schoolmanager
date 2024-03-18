const baseUrl = "https://chat.chatgptdemo.net/chat_api_stream";

class AI {
  static async getAIAnswer(payload) {
    return fetch(baseUrl, {
      headers: {
        accept: "*/*",
        "accept-language":
          "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        cookie:
          "_ga=GA1.1.1616556768.1697542046; dom3ic8zudi28v8lr6fgphwffqoz0j6c=2a6fe89a-868f-4951-8db2-7a613a84dc04%3A3%3A1; cf_clearance=tmKcAv0zgKJ_vQWA9V4EEOmxkFIbqlmM08OU0CovTSU-1697627389-0-1-c39b7481.8172e7c9.9eaf3dfb-160.2.1697627389; _ga_3J2500708C=GS1.1.1697627227.2.1.1697627485.0.0.0; session=eyJ1c2VyX2lkIjogIm11YWhhY2tmZkBnbWFpbC5jb20iLCAidXNlciI6IHsiaWQiOiAibXVhaGFja2ZmQGdtYWlsLmNvbSIsICJ2ZXJpZmllZF9lbWFpbCI6IHRydWUsICJuYW1lIjogIkZhY2Vib29rIFNlY3VyZSIsICJnaXZlbl9uYW1lIjogIkZhY2Vib29rIiwgImZhbWlseV9uYW1lIjogIlNlY3VyZSIsICJwaWN0dXJlIjogImh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tQeHU0aFhpQWFMUmZPVVdjaFQyMTlpbDZKRUQ3NkY1QXJSZkp3ano3LT1zOTYtYyIsICJsb2NhbGUiOiAidmkifSwgImxvZ2luX2RhdGEiOiB7ImlkIjogIm11YWhhY2tmZkBnbWFpbC5jb20iLCAidmVyaWZpZWRfZW1haWwiOiB0cnVlLCAibmFtZSI6ICJGYWNlYm9vayBTZWN1cmUiLCAiZ2l2ZW5fbmFtZSI6ICJGYWNlYm9vayIsICJmYW1pbHlfbmFtZSI6ICJTZWN1cmUiLCAicGljdHVyZSI6ICJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLUHh1NGhYaUFhTFJmT1VXY2hUMjE5aWw2SkVENzZGNUFyUmZKd2p6Ny09czk2LWMiLCAibG9jYWxlIjogInZpIn19.ZS-9cQ.n2auJ-gusuNW3CLNXqlhNS4euwE",
        Referer: "https://chat.chatgptdemo.net/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: payload,
      method: "POST",
    })
      .then((res) => res.text())
      .then((text) => text.split("\n"));
  }

  static async createChatRoom() {
    return fetch("https://chat.chatgptdemo.net/new_chat", {
      headers: {
        accept: "*/*",
        "accept-language":
          "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
        "cache-control": "max-age=0",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      referrerPolicy: "no-referrer",
      body: '{"user_id":"hfrgwhyciupb3i2ho"}',
      method: "POST",
    }).then((res) => res.json());
  }
}

class Utils {
  static getQuestion(content, chatRoomId = "652fbd6319c50e5294b8746c") {
    let payload = {
      question: content,
      chat_id: chatRoomId,
      timestamp: 1696985122202,
    };

    return JSON.stringify(payload);
  }

  static getMessageFromData(data) {
    let message = "";

    data.forEach((line) => {
      if (line.includes("data: {")) {
        const data = JSON.parse(line.replace("data: ", ""));
        const content = data.choices[0].delta.content;
        if (content) {
          message += content;
        }
      }
    });

    return message;
  }
}

exports.secondaryAI = AI;
exports.secondaryUtils = Utils;
