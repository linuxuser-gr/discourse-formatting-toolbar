// Markdown support for special boxes

import { buildEmojiUrl, isCustomEmoji } from "pretty-text/emoji";

function imageFor(code, opts) {
  code = code.toLowerCase();
  const url = buildEmojiUrl(code, opts);
  if (url) {
    const title = `:${code}:`;
    const classes = isCustomEmoji(code, opts) ? "emoji emoji-custom" : "emoji";
    return { url, title, classes };
  }
}

function BuildBox(emoji, state, tagInfo) {
  let info = imageFor(emoji, state.md.options.discourse);

  let token = state.push("html_raw", '', 0);
  token.content = `<p class="bbInfoBox-img"><img class="${info.classes} only-emoji" src="${info.url}"></img></p>`;

  token = state.push('div_open', 'div', 1);
  token.attrs = [['class', 'bbInfoBox-box']];
}

function BuildInfoBox(state, tagInfo) {
  BuildBox('bulb', state, tagInfo);
}

function BuildWaringBox(state, tagInfo) {
  BuildBox('warning', state, tagInfo);
}

function BuildQuestionBox(state, tagInfo) {
  BuildBox('question', state, tagInfo);
}

function BuildHelpBox(state, tagInfo) {
  BuildBox('help', state, tagInfo);
}

function BuildInfoBoxClose(state) {
  state.push('div_close', 'div', -1);
}

export function setup(helper) {
  if (!helper.markdownIt) { return; }

  helper.whiteList(["div.bbInfoBox-box"]);

  helper.registerPlugin(md => {

    md.block.bbcode.ruler.push("info", {
      tag: "info",
      before: BuildInfoBox,
      after: BuildInfoBoxClose
    });

    md.block.bbcode.ruler.push("warning", {
      tag: "warning",
      before: BuildWaringBox,
      after: BuildInfoBoxClose
    });

    md.block.bbcode.ruler.push("help", {
      tag: "help",
      before: BuildHelpBox,
      after: BuildInfoBoxClose
    });

    md.block.bbcode.ruler.push("question", {
      tag: "question",
      before: BuildQuestionBox,
      after: BuildInfoBoxClose
    });

  });
}
