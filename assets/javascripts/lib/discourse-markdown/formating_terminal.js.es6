// Command line markdown extensions

function SVGIcon(icon,klass) {
  let svg = `<svg class="fa d-icon d-${icon} svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#${icon}"></use></svg>`
  let sideIcon = `<div class="${klass}">${svg}</div>`
  return sideIcon;
}

function BBCommand(state, tagInfo, content) {
  let token;

  token = state.push("html_raw", '', 0);
  token.content = SVGIcon("terminal", "cmdline-img");

  const numLines = (content.match(/\n/g) || '').length + 1
  if ( numLines == 1) {
    content = content.trim();
  } 
  let escapedContent = state.md.utils.escapeHtml(content);

  token = state.push("html_raw", '', 0);
  token.content = `<pre><code class="'lang-shell'">${escapedContent}</code></pre>`

  return true;
}

function BBCmdOut(state, tagInfo, content) {
  let token;
  token = state.push("html_raw", '', 0);
  token.content = SVGIcon("desktop", "cmdoutput-img");;

  token = state.push("html_raw", '', 0);
  let escapedContent = state.md.utils.escapeHtml(content);
  token.content = `<pre class="cmdoutput">${escapedContent}</pre>`;
  return true;
}

export function setup(helper) {
  if (!helper.markdownIt) { return; }

  helper.registerPlugin(md => {
    md.block.bbcode.ruler.push("cmdline", {
      tag: "cmdline",
      replace: BBCommand
    });

    md.block.bbcode.ruler.push("output", {
      tag: "output",
      replace: BBCmdOut
    });

  });
}

