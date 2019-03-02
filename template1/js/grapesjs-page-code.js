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
  
//'PLACEHOLDER FOR BUTTON
  bm.add('button', {
  label: 'Button',
  category: 'Basic',
  content: '<div class="my-block">This is a simple block</div>',
  attributes: {class: 'fa fa-th-large'},
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

 /* 
  bm.add('my-map', {
    label: 'Map',
    category: 'Basic',
    content: '<iframe frameborder="0" id="imzth" src="https://maps.google.com/maps?&z=1&t=q&output=embed"></iframe>',

    attributes: {class:'fa fa-map-o gjs-block gjs-one-bg gjs-four-color-h'},
  });*/

//'PLACEHOLDER FOR SUBSCRIBE
    bm.add('subscribe', {
    label: 'Subscribe',
    category: 'Basic',
    content: '<div class="my-block">This is a simple block</div>',
    attributes: {class:'fa fa-address-card'},
  });

//'PLACEHOLDER FOR NAVIGATION
    bm.add('navigation', {
    label: 'Navigation',
    category: 'Basic',
    content: '<div class="my-block">This is a simple block</div>',
    attributes: {class: 'fa fa-sitemap'},
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
          name: 'Alignment',
          open: true,
          buildProps: ['text-align'],
          properties:[{
                property: 'text-align',
                type: 'radio',
                defaults: 'center',
                list: [
                  { value : 'left',  name : 'Left',    className: 'fa fa-align-left'},
                  { value : 'center',  name : 'Center',  className: 'fa fa-align-center' },
                  { value : 'right',   name : 'Right',   className: 'fa fa-align-right'},
                  { value : 'justify', name : 'Justify',   className: 'fa fa-align-justify'}
                    ],
                  }
          ],
      },{
          name: 'Font Style',
          open: true,
          buildProps: ['font-family', 'font-size', 'font-weight', 'color'],
          properties:[
            { name: 'Font', property: 'font-family'},
            { name: 'Weight', property: 'font-weight'},
            { name:  'Font color', property: 'color'},              
           ],
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
