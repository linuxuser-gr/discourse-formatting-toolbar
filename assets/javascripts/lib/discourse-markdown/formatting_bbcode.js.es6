import { registerOption } from 'pretty-text/pretty-text';

registerOption(
  (siteSettings, opts) => (opts.features["formatting_bbcode"] = true)
);

function replaceFontColor (text) {
  while (text !== (text = text.replace(/\[color=([^\]]+)\]((?:(?!\[color=[^\]]+\]|\[\/color\])[\S\s])*)\[\/color\]/ig, function (match, p1, p2) {
    return `<font color='${p1}'>${p2}</font>`;
  })));
  return text;
}

function replaceFontSize (text) {
  while (text !== (text = text.replace(/\[size=([^\]]+)\]((?:(?!\[size=[^\]]+\]|\[\/size\])[\S\s])*)\[\/size\]/ig, function (match, p1, p2) {
    return `<font size='${p1}'>${p2}</font>`;
  })));
  return text;
}

function wrap(tag, attr, callback) {
  return function(startToken, finishToken, tagInfo) {
    startToken.tag = finishToken.tag = tag;
    startToken.content = finishToken.content = '';

    startToken.type = 'bbcode_open';
    finishToken.type = 'bbcode_close';

    startToken.nesting = 1;
    finishToken.nesting = -1;

    startToken.attrs = [[attr, callback ? callback(tagInfo) : tagInfo.attrs._default]];
  };
}

function setupMarkdownIt(md) {
  const ruler = md.inline.bbcode.ruler;
  const block = md.block.bbcode.ruler;

  ruler.push('size', {
    tag: 'size',
    wrap: wrap('font', 'size')
  });

  ruler.push('color', {
    tag: 'color',
    wrap: wrap('font', 'color')
  });

  ruler.push('small',{
    tag: 'small',
    wrap: wrap('span', 'style', ()=>'font-size:x-small')
  });

  ruler.push('floatl', {
    tag: 'floatl',
    wrap: wrap('div', 'class', ()=>'floatl')
  });

  ruler.push('floatr', {
    tag: 'floatr',
    wrap: wrap('div', 'class', ()=>'floatr')
  });

  ruler.push('floatc', {
    tag: 'floatc',
    wrap: wrap('div', 'class', ()=>'floatc')
  });

  ruler.push('left', {
    tag: 'left',
    wrap: wrap('div', 'class', ()=>'bbcodeleft')
  });

  ruler.push('center', {
    tag: 'center',
    wrap: wrap('div', 'class', ()=>'bbcodecenter')
  });

  ruler.push('right', {
    tag: 'right',
    wrap: wrap('div', 'class', ()=>'bbcoderight')
  });

  ruler.push('justify', {
    tag: 'justify',
    wrap: wrap('div', 'class', ()=>'bbcodejustify')
  });

  ruler.push("cmdline",{
    tag: "cmdline",

    replace: function(state, tagInfo, content) {
      let token;
      token = state.push('div_open', 'div', 1);
      token.attrs = [['class', 'cmdline-img']];
      token = state.push('div_close', 'div', -1);
      token = state.push('pre_open', 'pre', 1);
      token.attrs = [['class', 'cmdline']];
      token = state.push('code_open', 'code', 1);
      token = state.push('text', '', 0);
      token.content = content.trim();
      token = state.push('code_close', 'code', -1);
      token = state.push('pre_close', 'pre', -1);
      return true;
    }
  });

  ruler.push("man",{
    tag: "man",
    replace: function(state, tagInfo, content) {
      let token = state.push('html_raw', '', 0);
      var regExp = /(.*)\(([^)]+)\)/;
      var text=content.trim();
      var matches = regExp.exec(text);
      token.content = `<a class="manpage" href="https://man7.org/linux/man-pages/man${matches[2]}/${matches[1]}.${matches[2]}.html" target="_blank">${text}</a>`;
      return true;
    }
  });

  block.push("output",{
    tag: "output",
    replace: function(state, tagInfo, content) {
      let token = state.push('html_raw', '', 0);
      const escaped = state.md.utils.escapeHtml(content);
      token.content = `<div class="cmdoutput-img"></div><pre class='cmdoutput'>\n${escaped}\n</pre>\n`;
      return true;
    }
  });


  md.block.bbcode.ruler.push('snippet', {
    tag: 'snippet',
    wrap: function(token, tagInfo) {
      token.attrs = [
        ['class', 'discourse-snippet'],
        ['data-name', tagInfo.attrs['name'] || 'Text Blaze Snippet']
      ];

      if (tagInfo.attrs['shortcut']) {
        token.attrs.push(['data-shortcut', tagInfo.attrs['shortcut']]);
      }

      if (tagInfo.attrs['quickentry']) {
        token.attrs.push(['data-quickentry', tagInfo.attrs['quickentry']]);
      }

      return true;
    }
  });


}

export function setup(helper) {

  helper.whiteList([
    'div.floatl',
    'div.floatr',
    'div.floatc',
    'div.bbcodeleft',
    'div.bbcodecenter',
    'div.bbcoderight',
    'div.bbcodejustify',
    'pre.cmdline',
    'div.cmdline-img',
    'pre.cmdoutput',
    'div.cmdoutput-img',
    'a.manpage',
    'font[color=*]',
    'font[size=*]'
  ]);



  helper.whiteList({
    custom(tag, name, value) {
      if (tag === 'span' && name === 'style') {
        return /^font-size:.*$/.exec(value);
      }
    }
  });

  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
    return;
  }

  const builders = requirejs('pretty-text/engines/discourse-markdown/bbcode').builders;
  const { register, replaceBBCode, rawBBCode, replaceBBCodeParamsRaw } = builders(helper);

  replaceBBCode("small", contents => ['span', {'style': 'font-size:x-small'}].concat(contents));
  replaceBBCode("floatl", contents => ['div', {'class': 'floatl'}].concat(contents));
  replaceBBCode("floatr", contents => ['div', {'class': 'floatr'}].concat(contents));
  replaceBBCode("floatc", contents => ['div', {'class': 'floatc'}].concat(contents));
  replaceBBCode("left", contents => ['div', {'class': 'bbcodeleft'}].concat(contents));
  replaceBBCode("center", contents => ['div', {'class': 'bbcodecenter'}].concat(contents));
  replaceBBCode("right", contents => ['div', {'class': 'bbcoderight'}].concat(contents));
  replaceBBCode("justify", contents => ['div', {'class': 'bbcodejustify'}].concat(contents));
  // replaceBBCode("cmdline", contents => [].concat(contents));
  // replaceBBCode("output", contents => [].concat(contents));
  // replaceBBCode("output", contents => ['pre', {'class': 'cmdoutput'}].concat(contents));
  //replaceBBCode("cmdline", contents => ['pre', {'class': 'cmdline'}].concat(contents));


  helper.addPreProcessor(replaceFontColor);
  helper.addPreProcessor(replaceFontSize);

}