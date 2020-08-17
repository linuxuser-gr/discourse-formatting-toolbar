import { withPluginApi } from 'discourse/lib/plugin-api';
import { onToolbarCreate } from 'discourse/components/d-editor';


function initializePlugin(api)
{
  const siteSettings = api.container.lookup('site-settings:main');

  if (siteSettings.formattingtlb_enabled) {

    api.onToolbarCreate(toolbar => {
        toolbar.addButton({
          id: "underline_ui_button",
          group: "fontStyles",
          icon: "underline",
          perform: e => e.applySurround('[u]', '[/u]', 'underline_ui_default_text')
        });
    });

    api.onToolbarCreate(toolbar => {
        toolbar.addButton({
          id: "strikethrough_ui_button",
          group: "fontStyles",
          icon: "strikethrough",
          perform: e => e.applySurround('[s]', '[/s]', 'strikethrough_ui_default_text')
        });
    });

    api.onToolbarCreate(toolbar => {
        toolbar.addButton({
          id: "center_ui_button",
          group: "extras",
          icon: "align-center",
          perform: e => e.applySurround('[center]', '[/center]', 'center_ui_default_text')
        });
    });


    api.onToolbarCreate(toolbar => {
        toolbar.addButton({
            id: "code_button",
            group: "insertions",
            icon: "terminal",
            perform: e => e.applySurround('\n```shell\n', '\n```\n', 'code_bash_text', { multiline: false } )
        });
    });

    
  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
        action: "palette",
        icon: "palette",
        label: "composer.color_ui_button_title"
    };
  });
    
  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
        action: "fontsize",
        icon: "font",
        label: "composer.size_ui_button_title"
    };
  });

  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
        action: "mathbtn",
        icon: "square-root-alt",
        label: "composer.math_ui_button_title"
    };
  }); 
  
  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
        action: "keyboardbtn",
        icon: "keyboard",
        label: "composer.kbd_ui_button_title"
    };
  }); 

  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
        action: "diagrambtn",
        icon: "project-diagram",
        label: "composer.graph_ui_button_title"
    };
  }); 

  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
        action: "prebtn",
        icon: "text-width",
        label: "composer.pre_button_title"
    };
  }); 

  api.modifyClass("controller:composer", {
    actions: {
      fontsize() {
        this.get("toolbarEvent").applySurround('[size=4]', '[/size]', 'size_ui_default_text');
      },
      palette() {
        this.get("toolbarEvent").applySurround('[color=red]', '[/color]', 'color_ui_default_text');
      },
      mathbtn() {
        this.get("toolbarEvent").applySurround('$', '$', 'math_ui_default_text');
      },
      keyboardbtn() {
        this.get("toolbarEvent").applySurround('<kbd>', '</kbd>', 'kbd_ui_default_text');
      },
      prebtn() {
        this.get("toolbarEvent").applySurround('<pre>', '</pre>', 'pre_ui_default_text');
      },
      diagrambtn() {
        this.get("toolbarEvent").applySurround('\n', '\n', 'graph_ui_default_text', { multiline: false } );
      }

    }
  });



  }
}

export default
{
  name: 'formattingtlb-ui',
  initialize(container)
  {
    withPluginApi('0.1', api => initializePlugin(api), { noApi: () => priorToApi(container) });
  }
};
