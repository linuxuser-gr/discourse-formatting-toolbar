# name: discourse-formatting-toolbar
# about: Add formatting options on your post (Discourse)
# version: 3.2
# authors: Steven, iunctis.fr - Thanks to ZogStrip, eviltrout, cpradio and Sam Saffron
# url: https://github.com/iunctis/discourse-formatting-toolbar.git

enabled_site_setting :formattingtlb_enabled

register_asset 'stylesheets/formatting.scss'
register_asset 'stylesheets/terminal.scss'
register_asset 'stylesheets/info_boxes.scss'


register_svg_icon "fa-underline" if respond_to?(:register_svg_icon)
register_svg_icon "fa-align-left" if respond_to?(:register_svg_icon)
register_svg_icon "fa-align-center" if respond_to?(:register_svg_icon)
register_svg_icon "fa-palette" if respond_to?(:register_svg_icon)
register_svg_icon "fa-font" if respond_to?(:register_svg_icon)
register_svg_icon "fa-terminal" if respond_to?(:register_svg_icon)
register_svg_icon "fa-keyboard" if respond_to?(:register_svg_icon)
register_svg_icon "fa-strikethrough" if respond_to?(:register_svg_icon)
register_svg_icon "fa-square-root-alt" if respond_to?(:register_svg_icon)
register_svg_icon "fa-text-width" if respond_to?(:register_svg_icon)
register_svg_icon "fa-project-diagram" if respond_to?(:register_svg_icon)
register_svg_icon "fa-directions" if respond_to?(:register_svg_icon)
register_svg_icon "fa-rss-square" if respond_to?(:register_svg_icon)

register_svg_icon "fa-file-code" if respond_to?(:register_svg_icon)

# Support man pages
register_svg_icon "fa-book-open" if respond_to?(:register_svg_icon)

# Support for terminal actions
register_svg_icon "fa-terminal" if respond_to?(:register_svg_icon)
register_svg_icon "fa-desktop" if respond_to?(:register_svg_icon)