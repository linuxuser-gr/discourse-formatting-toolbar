// Markdown support for manpages

export function setup(helper) {
  if (!helper.markdownIt) { return; }

  helper.registerOptions((opts, siteSettings) => {
    opts.features.mermaid = siteSettings.discourse_mermaid_enabled;
  });

  helper.registerPlugin(md => {
    md.inline.bbcode.ruler.push("man", {
      tag: "man",

      replace: function (state, tagInfo, content) {
        let regExp = /(.*)\(([^)]+)\)/;
        let text = content.trim();
        let matches = regExp.exec(text);
        let baseURL = 'https://man7.org/linux/man-pages';
        let manSection =`man${parseInt(matches[2])}`
        let manpageURL = `${baseURL}/${manSection}/${matches[1]}.${matches[2]}.html`;
        let escaped = state.md.utils.escapeHtml(text);

        let svgName = "book-open";
        let icon = `<svg class="fa d-icon d-${svgName} svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#${svgName}"></use></svg>`

        const token = state.push("html_raw", '', 0);
        token.content = `<a class="manpage" href="${manpageURL}" target="_blank">${icon} ${escaped}</a>`;
        return true;
      }
    });
  });
}