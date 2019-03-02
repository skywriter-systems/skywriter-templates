grapesjs.plugins.add('skywriter', function(editor, opts) {
  var opt = opts || {};
  var config = editor.getConfig();
  var pfx = editor.getConfig().stylePrefix;
  var modal = editor.Modal;
  var $ = window.$ || grapesjs.$;

  config.showDevices = 0;

  var updateTooltip = function(coll, pos) {
    coll.each(function(item) {
      var attrs = item.get('attributes');
      attrs['data-tooltip-pos'] = pos || 'bottom';
      item.set('attributes', attrs);
    });
  }

  /****************** IMPORTER *************************/

  var codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
  var container = document.createElement('div');
  var btnImp = document.createElement('button');

  // Init import button
  btnImp.innerHTML = 'Import';
  btnImp.className = pfx + 'btn-prim ' + pfx + 'btn-import';
  btnImp.onclick = function() {
    var code = codeViewer.editor.getValue();
    editor.DomComponents.getWrapper().set('content', '');
    editor.setComponents(code.trim());
    modal.close();
  };

  // Init code viewer
  codeViewer.set({
    codeName: 'htmlmixed',
    theme: opt.codeViewerTheme || 'hopscotch',
    readOnly: 0
  });


  /****************** COMMANDS *************************/

  var cmdm = editor.Commands;
  cmdm.add('undo', {
    run: function(editor, sender) {
      sender.set('active', 0);
      editor.UndoManager.undo(1);
    }
  });
  cmdm.add('redo', {
    run: function(editor, sender) {
      sender.set('active', 0);
      editor.UndoManager.redo(1);
    }
  });
  cmdm.add('set-device-desktop', {
    run: function(editor) {
      editor.setDevice('Desktop');
    }
  });
  cmdm.add('set-device-tablet', {
    run: function(editor) {
      editor.setDevice('Tablet');
    }
  });
  cmdm.add('set-device-mobile', {
    run: function(editor) {
      editor.setDevice('Mobile portrait');
    }
  });
  cmdm.add('clean-all', {
    run: function(editor, sender) {
      sender && sender.set('active',false);
      if(confirm('Are you sure you want to clean the canvas?')){
        var comps = editor.DomComponents.clear();
        setTimeout(function(){
          localStorage.clear()
        },0)
      }
    }
  });

  cmdm.add('html-import', {
    run: function(editor, sender) {
      sender && sender.set('active', 0);

      var modalContent = modal.getContentEl();
      var viewer = codeViewer.editor;
      modal.setTitle('Import Template');

      // Init code viewer if not yet instantiated
      if (!viewer) {
        var txtarea = document.createElement('textarea');
        var labelEl = document.createElement('div');
        labelEl.className = pfx + 'import-label';
        labelEl.innerHTML = 'Paste your HTML/CSS here and click Import';
        container.appendChild(labelEl);
        container.appendChild(txtarea);
        container.appendChild(btnImp);
        codeViewer.init(txtarea);
        viewer = codeViewer.editor;
      }

      modal.setContent('');
      modal.setContent(container);
      codeViewer.setContent(
          '<div class="txt-red">Hello world!</div>' +
          '<style>\n.txt-red {color: red;padding: 30px\n}</style>'
      );
      modal.open();
      viewer.refresh();
    }
  });

  /****************** BLOCKS *************************/
  var bm = editor.BlockManager;



bm.add('my-sec', {
    label: 'Section',
    category: 'Basic',
    content: '<section class="gpd-section"><div class="gpd-container"></div></section>',
    attributes: {class:'gjs-fonts gjs-f-b1 gjs-block gjs-one-bg gjs-four-color-h'},
  });


  bm.add('my-div', {
    label: 'Divider',
    category: 'Basic',
    content: '<div></div>',
    attributes: {class:'gjs-fonts gjs-f-divider gjs-block gjs-one-bg gjs-four-color-h'},
  });

  bm.add('my-header1', {
    label: 'Large Header',
    category: 'Basic',
    content: '<h1>Insert your large header text here</h1>',
    attributes: {class:'fa fa-header gjs-block gjs-one-bg gjs-four-color-h'},
  });

  bm.add('my-header3', {
    label: 'Small Header',
    category: 'Basic',
    content: '<h3>Insert your small header text here</h3>',
    attributes: {class:'fa fa-header gjs-block gjs-one-bg gjs-four-color-h'},
  });

  bm.add('my-grid', {
    label: 'Grid',
    category: 'Basic',
    content: '<div title= "grid" class="row" style="height:50px; border-width:0px"><div class="cell"></div><div class="cell"></div><div class="cell"></div></div>',
    attributes: {class:'gjs-fonts gjs-f-b3 gjs-block gjs-one-bg gjs-four-color-h'},
    style:{
        'width': '33vw',
    }  });

  bm.add('my-text', {
    label: 'Text',
    category: 'Basic',
    content: '<div title="Text">Insert your text here</div>',
    attributes: {class:'gjs-fonts gjs-f-text gjs-block gjs-one-bg gjs-four-color-h'},
  });

  bm.add('my-link', {
    label: 'Link',
    category: 'Basic',
    content: '<a>Link</a>',
    attributes: {class:'fa fa-link gjs-block gjs-one-bg gjs-four-color-h'},
  });

  bm.add('my-image', {
    label: 'Image',
    category: 'Basic',
    content: '<img />',
    attributes: {class:'gjs-fonts gjs-f-image gjs-block gjs-one-bg gjs-four-color-h'},
  });

  bm.add('my-video', {
    label: 'Video',
    category: 'Basic',
    content: '<video allowfullscreen="allowfullscreen" controls="controls"></video>',
    attributes: {class:'fa fa-youtube-play gjs-block gjs-one-bg gjs-four-color-h'},
  });

  bm.add('my-map', {
    label: 'Map',
    category: 'Basic',
    content: '<iframe frameborder="0" id="imzth" src="https://maps.google.com/maps?&z=1&t=q&output=embed"></iframe>',

    attributes: {class:'fa fa-map-o gjs-block gjs-one-bg gjs-four-color-h'},
  });

/*  Add if a Tabs block is desired, but style will need to be added first
    bm.add('my-tabs', {
    label: '<svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><path d="M22 9.3c0-.8-.5-1.3-1.3-1.3H3.4C2.5 8 2 8.5 2 9.3v7.4c0 .8.5 1.3 1.3 1.3h17.4c.8 0 1.3-.5 1.3-1.3V9.3zM21 17H3V9h18v8z" fill-rule="nonzero"></path><rect x="3" y="5" width="4" height="2" rx=".5"></rect><rect x="8" y="5" width="4" height="2" rx=".5"></rect><rect x="13" y="5" width="4" height="2" rx=".5"></rect></g></svg><br>Tabs',
    category: 'Extra',
    content:{
        content:'<div data-tabs="1" id="iyy7i"><nav data-tab-container="1" class="tab-container"><a href="#tab1" data-tab="1" class="tab">Tab 1</a><a href="#tab2" data-tab="1" class="tab">Tab 2</a><a href="#tab3" data-tab="1" class="tab">Tab 3</a></nav><div id="tab1" data-tab-content="1" class="tab-content"><div>Tab 1 Content</div></div><div id="tab2" data-tab-content="1" class="tab-content"><div>Tab 2 Content</div></div><div id="tab3" data-tab-content="1" class="tab-content"><div>Tab 3 Content</div></div></div>'
            },
    attributes: {class:'gjs-block gjs-blocks-c gjs-block-label gjs-one-bg gjs-four-color-h',
        
    },
  });*/
 
  bm.add('my-slider', {
    label: '<svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 7.6c0-1-.5-1.6-1.3-1.6H3.4C2.5 6 2 6.7 2 7.6v9.8c0 1 .5 1.6 1.3 1.6h17.4c.8 0 1.3-.6 1.3-1.6V7.6zM21 18H3V7h18v11z" fill-rule="nonzero"></path><path d="M4 12.5L6 14v-3zM20 12.5L18 14v-3z"></path></svg><br>Slider',
    category: 'Extra',
    content: '<div id="ir0jg"><div class="gjs-lory-frame" id="ibgq4"><div class="gjs-lory-slides" id="intqn"><div class="gjs-lory-slide" id="ib2ji"></div><div class="gjs-lory-slide" id="i8nf8"></div><div class="gjs-lory-slide" id="i7leb"></div></div></div><span class="gjs-lory-prev" id="irdg1"><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 501.5 501.5"><g><path fill="#2E435A" d="M302.67 90.877l55.77 55.508L254.575 250.75 358.44 355.116l-55.77 55.506L143.56 250.75z"></path></g></svg></span><span class="gjs-lory-next" id="i5s4e"><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 501.5 501.5"><g><path fill="#2E435A" d="M199.33 410.622l-55.77-55.508L247.425 250.75 143.56 146.384l55.77-55.507L358.44 250.75z"></path></g></svg></span></div>',
    attributes: {class:'gjs-block gjs-block-label gjs-one-bg gjs-four-color-h',
        
    },
  });
  
 
  /****************** BUTTONS *************************/

  var pnm = editor.Panels;
  pnm.addButton('options', [{
    id: 'undo',
    className: 'fa fa-undo icon-undo',
    command: 'undo',
    attributes: { title: 'Undo (CTRL/CMD + Z)'}
  },{
    id: 'redo',
    className: 'fa fa-repeat icon-redo',
    command: 'redo',
    attributes: { title: 'Redo (CTRL/CMD + SHIFT + Z)' }
  },{
    id: 'import',
    className: 'fa fa-download',
    command: 'html-import',
    attributes: { title: 'Import' }
  },{
    id: 'clean-all',
    className: 'fa fa-trash icon-blank',
    command: 'clean-all',
    attributes: { title: 'Empty canvas' }
  },]);

  // Add devices buttons
  var panelDevices = pnm.addPanel({id: 'devices-c'});
  var deviceBtns = panelDevices.get('buttons');
  deviceBtns.add([{
    id: 'deviceDesktop',
    command: 'set-device-desktop',
    className: 'fa fa-desktop',
    attributes: {'title': 'Desktop'},
    active: 1,
  },{
    id: 'deviceTablet',
    command: 'set-device-tablet',
    className: 'fa fa-tablet',
    attributes: {'title': 'Tablet'},
  },{
    id: 'deviceMobile',
    command: 'set-device-mobile',
    className: 'fa fa-mobile',
    attributes: {'title': 'Mobile'},
  }]);
  updateTooltip(deviceBtns);
  updateTooltip(pnm.getPanel('options').get('buttons'));
  updateTooltip(pnm.getPanel('options').get('buttons'));
  updateTooltip(pnm.getPanel('views').get('buttons'));



  /****************** EVENTS *************************/

  // On component change show the Style Manager
editor.on('component:selected', () => {
	const openSmBtn = editor.Panels.getButton('views', 'open-sm');
	openSmBtn.set('active', 1);
});

  // Do stuff on load
  editor.on('load', function() {
    // Load and show settings
    var openTmBtn = pnm.getButton('views', 'open-tm');
    openTmBtn && openTmBtn.set('active', 1);


    // Open block manager
    var openBlocksBtn = editor.Panels.getButton('views', 'open-blocks');
    openBlocksBtn && openBlocksBtn.set('active', 1);
  });

});    

 var images = [];
          
grapesjs.init({

  container: "#app",

canvas: {
    styles: ['styles/base.css','styles/style.css'] 
},
  
  storageManager: {
  	type: "local",
  	autosave: true,
  	setStepsBeforeSave: 1,
  },

  assetManager: {
    embedAsBase64: 1,
    assets: images,
  },


  fromElement: true,
  plugins: ['skywriter','grapesjs-custom-code','gjs-component-countdown'],
  styleManager: {
      sectors: [{
          name: 'Font Style',
          open: true,
          buildProps: ['font-family', 'font-size', 'font-weight', 'color', 'text-align','text-shadow'],
          properties:[
            { name: 'Font', property: 'font-family'},
            { name: 'Weight', property: 'font-weight'},
            { name:  'Font color', property: 'color'},              
            {
                property: 'text-align',
                type: 'radio',
                defaults: 'left',
                list: [
                  { value : 'left',  name : 'Left',    className: 'fa fa-align-left'},
                  { value : 'center',  name : 'Center',  className: 'fa fa-align-center' },
                  { value : 'right',   name : 'Right',   className: 'fa fa-align-right'},
                  { value : 'justify', name : 'Justify',   className: 'fa fa-align-justify'}
                    ],
                  },
            {
                property: 'text-shadow',
                properties: [
                  { name: 'Horizontal position', property: 'text-shadow-h'},
                  { name: 'Vertical position', property: 'text-shadow-v'},
                  { name: 'Blur', property: 'text-shadow-blur'},
                  { name: 'Color', property: 'text-shadow-color'}
                ],
            }],
      },{
          name: 'Sizing',
          open: false,
          buildProps: ['width', 'height'],
      },{
          name: 'Positioning',
          open: false,
          buildProps: ['position', 'top', 'left', 'margin'],
      },{
          name: 'Decorations',
          open: false,
          buildProps: 
          ['opacity', 'background-color', 'border', 'box-shadow', 'background'],
                properties: [{
                  type: 'slider',
                  property: 'opacity',
                  defaults: 1,
                  step: 0.01,
                  max: 1,
                  min:0,
                },{
                  property: 'box-shadow',
                  properties: [
                    { name: 'X position', property: 'box-shadow-h'},
                    { name: 'Y position', property: 'box-shadow-v'},
                    { name: 'Blur', property: 'box-shadow-blur'},
                    { name: 'Spread', property: 'box-shadow-spread'},
                    { name: 'Color', property: 'box-shadow-color'},
                    { name: 'Shadow type', property: 'box-shadow-type'}
                  ],
                },
                {
                    property: 'background',
                    properties: [
                        { name: 'Image', property: 'background-image'},
                        { name: 'Repeat', property:   'background-repeat'},
                        { name: 'Position', property: 'background-position'},
                        { name: 'Attachment', property: 'background-attachment'},
                        { name: 'Size', property: 'background-size'}
                    ],
                }],
        },
    ]}    

});
