const { AI_SERVER_VN, AI_SERVER_GLOBAL } = require("../consts/ai_server");
const { mainAI, mainUtils } = require("../services/main_ai"); // main AI
const { secondaryAI, secondaryUtils } = require("../services/secondary_ai"); // secondary AI

const hightlightStyle = "androidstudio";
const hightlightScript = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/${hightlightStyle}.min.css"><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script><script>hljs.highlightAll();</script>`;

function toHtmlFormat(message) {
  message = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // wrap code block
  let html = "";
  let isCode = false;
  let isIgnoring = false;

  for (let char of message) {
    if (char === "\n") isIgnoring = false;

    if (html.endsWith("```")) {
      html = html.replace("```", "");
      isIgnoring = true;
      if (isCode) {
        html += "</code></pre>";
      } else {
        html += "<pre><code >";
      }
      isCode = !isCode;
    } else if (!isIgnoring) {
      html += char;
    }
  }

  //wrap content in ` ` into <pre><code></code></pre>
  html = html.replace(
    /`([^`]+)`/g,
    "<pre style='display : inline !important'><code style='display: inline; padding : 1px; font-style: italic;'>$1</code></pre>"
  );

  return `<div>${html}<div/>`;
}

module.exports.getHtmlResponeFromPayload = async function (
  payload,
  server = AI_SERVER_VN
) {
  switch (server) {
    case AI_SERVER_VN: {
      let data = await mainAI.getAIAnswer(mainUtils.getQuestion(payload));
      let message = mainUtils.getMessageFromData(data);
      let html = `${hightlightScript} ${toHtmlFormat(message)}`;
      return html;
    }
    case AI_SERVER_GLOBAL: {
      let data = await secondaryAI.getAIAnswer(
        secondaryUtils.getQuestion(payload)
      );
      let message = secondaryUtils.getMessageFromData(data);
      let html = `${hightlightScript} ${toHtmlFormat(message)}`;
      return html;
    }
    default:
      return new Error("Can not find ai server");
  }
};

module.exports.getJsonResponeFromPayload = async function (
  payload,
  server = AI_SERVER_VN
) {
  switch (server) {
    case AI_SERVER_VN: {
      let data = await mainAI.getAIAnswer(mainUtils.getQuestion(payload));
      let message = mainUtils.getMessageFromData(data);

      console.log(data);

      return { from: "VN", message };
    }

    case AI_SERVER_GLOBAL: {
      let data = await secondaryAI.getAIAnswer(
        secondaryUtils.getQuestion(payload)
      );
      let message = secondaryUtils.getMessageFromData(data);
      console.log(data);
      return { from: "GLOBAL", message };
    }
    default:
      return new Error("Can not find ai server");
  }
};
