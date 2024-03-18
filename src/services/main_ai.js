const baseUrl = "https://mentor.chatvn.org/php/api.php";

class Utils {
  static getQuestion(content) {
    let payload = {
      prompt: content,
      ai_id: 31,
    };
    return Utils.objectToUrlEncoded(payload);
  }

  static objectToUrlEncoded(obj) {
    const encodedParams = [];

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(value);
        encodedParams.push(encodedKey + "=" + encodedValue);
      }
    }

    return encodedParams.join("&");
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

class AI {
  static async getAIAnswer(payload) {
    //close all connection, prevent socket hang up
    await new Promise((resolve) => setTimeout(resolve, 0));
    return fetch(baseUrl, {
      headers: {
        accept: "*/*",
        "accept-language":
          "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
        "content-type": "application/x-www-form-urlencoded",
        "sec-ch-ua":
          '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        Referer: "https://mentor.chatvn.org/chat/chat-gpt",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: payload,
      method: "POST",
    })
      .then((res) => res.text())
      .then((text) => text.split("\n"));
  }

  static async createChatRoom() {}
}

exports.mainAI = AI;
exports.mainUtils = Utils;
