////////////////////////////////// ONLY OPERATE IN PHOTOSHOP ***********************

#target photoshop

////////////////////////////////// GLOABAL VARIABLES START ***********************

var actions_set_array,
  aList;

var all_action_sets = [];

var all_references = [];

var id = 0;

var children_bounds;

////////////////////////////////// GLOABAL VARIABLES END ***********************

// SCAN ALL AVAILABLE ACTIONS AND ADD THEM TO ARRAYS
populate();
// -------------

/////////////////////////////////// UI START ***********************

var W = new Window('dialog {orientation: "row", alignChildren: ["fill","fill"], size: [1200,600]}', "Conditional action piping", undefined, {
  closeButton: true
}, {resizeable: true});

var container = W.add('panel {orientation: "column", alignChildren: ["fill","top"]}', undefined, '');
container.minimumSize.width = 700;

// intro container - width management
container.add('statictext', undefined, ' ---------------------------- Modules ---------------------------- ', {
  readonly: false
}, {justify: "center"});

// container.add('edittext', undefined, '');

var Controls = W.add('panel {orientation: "column", alignChildren: ["fill","top"]}', undefined, '');

var desc_add_sub = Controls.add('statictext', undefined, 'Controls:')

var scroll_up = Controls.add('button', undefined, 'Scroll up');
var scroll_down = Controls.add('button', undefined, 'Scroll down');

hr(Controls);

var Control_Add_group = Controls.add('group {orientation:"row", alignChildren: ["fill","fill"]}', undefined, '');
var add_Action_Button = Control_Add_group.add('button', undefined, 'Add action module');
var add_Opening_Button = Control_Add_group.add('button', undefined, 'Add opening module');
var add_Saving_Button = Control_Add_group.add('button', undefined, 'Add saving module');

var Control_sub_group = Controls.add('group {orientation:"row", alignChildren: ["fill","fill"]}', undefined, '');
var subButton = Control_sub_group.add('button', undefined, 'Remove selected module');
var subButton_all = Control_sub_group.add('button', undefined, 'Remove all modules');

hr(Controls);

var refresh_button = Controls.add('button', undefined, 'Refresh');

////////////// UI FUNCTIONS: ************************************************************ START

////////////// ON SHOW    ***********-------------------------

container.onShow = function() {
  container.size.height = 10000;
}

////////////// INTERACTIONS:

// var all_of_types_Arr = ['Action', 'Opening', 'Saving'];
add_Action_Button.onClick = function() {

  all_references.push(new Module('Action'));
  updateUILayout(container);

  refresh_view();
}

add_Opening_Button.onClick = function() {

  all_references.push(new Module('Opening'));
  updateUILayout(container);

  refresh_view();
}

add_Saving_Button.onClick = function() {

  all_references.push(new Module('Saving'));
  updateUILayout(container);

  refresh_view();
}

function refresh_view() {
  // move to location of added module - workaround at this moment only
  if (container.children.length > 4) {
    for (var i = 0; i < container.children.length; i++) {
      var t_sum = reCount_children_height(container);
      container.children[i].location.y = container.children[i].location.y - t_sum;
    }
  }
}

subButton.onClick = function() {
  // delete selected modules
  var deletion_Arr = container_selection();

  if (deletion_Arr !== 0) {
    for (var i = 0; i < deletion_Arr.length; i++) {
      container.remove(deletion_Arr[i]);
    }
  }
  refresh_indexes();
  updateUILayout(container);
}

subButton_all.onClick = function() {

  //select all
  if (container.children.length > 1) {
    for (var i = 1; i < container.children.length; i++) {
      container.children[i].children[0].children[0].value = true;
    }
  }

  var deletion_Arr = container_selection();

  if (deletion_Arr !== 0) {
    for (var i = 0; i < deletion_Arr.length; i++) {
      container.remove(deletion_Arr[i]);
    }
  }

  refresh_indexes();
  updateUILayout(container);
}

var scrolling_treshold = 40;

scroll_up.onClick = function() {
  try {
    for (var i = 0; i < container.children.length; i++) {
      container.children[i].location.y = container.children[i].location.y + scrolling_treshold;
    }
  } catch (e) {}
}

scroll_down.onClick = function() {
  try {
    for (var i = 0; i < container.children.length; i++) {
      container.children[i].location.y = container.children[i].location.y - scrolling_treshold;
    }
  } catch (e) {}
}

refresh_button.onClick = function() {
  refresh_indexes();
  updateUILayout(container);
}

////////////// UI MISC FUNCTIONS ***********-------------------------

function newType(ELEMENT) {
  if (ELEMENT.children[2] == 'Play action') {}
}

function functionName() {}

function hr(parent_el) {
  parent_el.add('panel', undefined, '');
}

function updateUILayout(thing) {
  thing.layout.layout(true); //Update the layout
}

function reCount_children_height(parent_el) {
  try {
    var children_bounds = parseFloat(parent_el.children[1].size.height) * (parent_el.children.length - 1);
    return children_bounds;
  } catch (e) {
    return 0;
  }
}

function container_selection() {
  var at_least_one_module_selected = false;
  if (container.children.length > 1) {
    for (var i = 1; i < container.children.length; i++) {
      if (container.children[i].children[0].children[0].value) {
        at_least_one_module_selected = true;
        break;
      }
    }
  }
  if (at_least_one_module_selected) {
    var selected = [];
    for (var i = 1; i < container.children.length; i++) {
      if (container.children[i].children[0].children[0].value) {
        selected.push(container.children[i]);
      }
    }
    return selected;
  } else {
    return 0;
  }
}

function saveModule() {
  // save modules to stringified array
}

//////////////// UI FUNCTIONS: ************************************************************ END

////////////// set initial index of dropdowns:

var all_of_types_Arr = ['Action', 'Opening', 'Saving'];

var T_Action_Set,
  T_Action_List;

/////////////////////// MAIN OBJECT constructor *********************** START

// envoked with: new Module ( 'Action' ) || new Module ( 'Opening' ) || new Module ( 'Saving' )

function Module(TYPE) {

  this.type = TYPE;

  if (this.type === all_of_types_Arr[0]) { //is action type

    this.id = id;
    id++;
    this.reference = container.add('panel {orientation: "column", alignChildren: ["fill","top"]}', undefined, '');

    this.F_group = this.reference.add('group {orientation: "row", alignChildren: ["left","top"]}', undefined, '');

      T_Checkbox = this.F_group.add('checkbox', undefined, '');
      T_Checkbox.value = false;

      this.ind = this.F_group.add('statictext', undefined, '', {readonly: false});
      this.F_group.add('statictext', undefined, 'Play action', {readonly: false});

      T_Action_Set = this.F_group.add('dropdownlist', undefined, '');
      T_Action_List = this.F_group.add('dropdownlist', undefined, '');
      fill_dropdowns(T_Action_Set, T_Action_List);

      T_Action_Set.selection = 0;
      T_Action_List.selection = 0;

    this.S_group = this.reference.add('group {orientation: "row", alignChildren: ["left","top"]}', undefined, '');

      T_Bool_Condition_Action = this.S_group.add('checkbox', undefined, 'Filename condition:');
      T_Condition_Action_Text = this.S_group.add('edittext', undefined, '');
      T_Condition_Action_Text.minimumSize.width = 150;
      T_Condition_Action_Text.minimumSize.height = 21;

    get_Index(this);

    //assign onChange callback
    Type_Action(T_Action_Set, T_Action_List);

  } else if (this.type === all_of_types_Arr[1]) { //is Opening type

    this.id = id;
    id++;
    this.reference = container.add('panel {orientation: "column", alignChildren: ["left","top"]}', undefined, '');

    this.F_group = this.reference.add('group {orientation: "row", alignChildren: ["left","top"]}', undefined, '');

      T_Checkbox = this.F_group.add('checkbox', undefined, '');
      T_Checkbox.value = false;

      this.ind = this.F_group.add('statictext', undefined, '', {readonly: false});
      this.F_group.add('statictext', undefined, 'Open files');

      T_Choose_Folder = this.F_group.add('button', undefined, 'Choose input folder');

    this.S_group = this.reference.add('group {orientation: "row", alignChildren: ["left","top"]}', undefined, '');

      this.S_group.add('statictext', undefined, 'Filter format:');

      T_jpg = this.S_group.add('checkbox', undefined, 'jpg');
      T_tif = this.S_group.add('checkbox', undefined, 'tif');
      T_psd = this.S_group.add('checkbox', undefined, 'psd');
      T_png = this.S_group.add('checkbox', undefined, 'png');
      T_jpg.value = true;
      T_tif.value = true;
      T_psd.value = true;
      T_png.value = true;

      T_Bool_Condition_Action = this.S_group.add('checkbox', undefined, 'Filename condition:');
      T_Condition_Action_Text = this.S_group.add('edittext', undefined, '');
      T_Condition_Action_Text.minimumSize.width = 150;
      T_Condition_Action_Text.minimumSize.height = 21;

    this.T_group = this.reference.add('group {orientation: "column", alignChildren: ["left","top"]}', undefined, '');

      this.T_01_group = this.T_group.add('panel {orientation: "column", alignChildren: ["left","top"]}', undefined, '');

          T_Input_Describ_ = this.T_01_group.add('statictext', undefined, 'Input path:');

          T_Input_Static_Text = this.T_01_group.add('statictext', undefined, '_______________________________________________________________');

    get_Index(this);

    //assign onChange callback ||   jpg, tif, psd, png
    Type_Open(T_Choose_Folder, T_Input_Static_Text)

  } else if (this.type === all_of_types_Arr[2]) { //is Saving type

    this.id = id;
    id++;
    this.reference = container.add('panel {orientation: "column", alignChildren: ["left","top"]}', undefined, '');

      this.F_group = this.reference.add('group {orientation: "row", alignChildren: ["left","top"]}', undefined, '');

        T_Checkbox = this.F_group.add('checkbox', undefined, '');
        T_Checkbox.value = false;

        this.ind = this.F_group.add('statictext', undefined, '', {readonly: false});
        this.F_group.add('statictext', undefined, 'Save files');

          T_Choose_Folder = this.F_group.add('button', undefined, 'Choose output folder');

          T_Flatten_Bool = this.F_group.add('checkbox', undefined, 'Flatten before saving');
          T_Flatten_Bool.value = false;

          this.F_group.add('statictext', undefined, 'File format:');
          T_Saving_Format = this.F_group.add('dropdownlist', undefined, ['jpg', 'png', 'tiff', 'psd']  );

        this.S_group = this.reference.add('group {orientation: "row", alignChildren: ["left","top"]}', undefined, '');

        this.T_02_group = this.S_group.add('panel {orientation: "column", alignChildren: ["left","top"]}', undefined, '');

            T_Output_Describ_ = this.T_02_group.add('statictext', undefined, 'Output path:');

            T_Output_Static_Text = this.T_02_group.add('statictext', undefined, '_______________________________________________________________');

    get_Index(this);

    //assign onChange callback - save
    Type_Save(T_Choose_Folder);


  }

}

/////////////////////// MAIN OBJECT constructor *********************** END

/////////////////////// FUNCTIONS FOR MODULES *********************** START

function get_Index(MODULE) {
  try {
    for (i = 0; i < container.children.length; i++) {
      if (container.children[i] == MODULE.reference) {
        MODULE.ind.text = i;
        return;
      }
    }
  } catch (variable) {};
}

function refresh_indexes() {
  for (var i = 0; i < all_references.length; i++) {
    try {
      get_Index(all_references[i]);
    } catch (e) {
      all_references.splice(i, 1);
    }
  }
}

/////////////////////// FUNCTIONS FOR MODULES *********************** END

/////////////////////// TYPES of constructors *********************** START

// ACTION TYPE:

function Type_Action(REFERENCE_SETS, REFERENCE_ACTIONS) {
  // handle (  REFERENCE   ) ;;;
  REFERENCE_SETS.onChange = function() {
    // alert( 'Reference function action asigned' );
    REFERENCE_ACTIONS.removeAll();
    var action_arr = all_action_sets[parseInt(REFERENCE_SETS.selection.index)].actions_Arr;
    for (var i = 0; i < action_arr.length; i++) {
      REFERENCE_ACTIONS.add('item', action_arr[i]);
    }
    try {
      REFERENCE_ACTIONS.selection = 0;
    } catch (e) {
      alert(e);
    }
  }
}

// fill dropdowns of Action module:
function fill_dropdowns(REFERENCE_SETS, REFERENCE_ACTIONS) {
  for (var i = 0; i < all_action_sets.length; i++) {
    REFERENCE_SETS.add('item', all_action_sets[i].name);
  }

  for (var i = 0; i < all_action_sets[0].actions_Arr.length; i++) {
    REFERENCE_ACTIONS.add('item', all_action_sets[0].actions_Arr[i].toString());
  }
}

// ACTION TYPE END

// OPEN TYPE START:

function Type_Open(OPEN_BUTTON, INPUT_PATH_STATIC_TEXT) {
  OPEN_BUTTON.onClick = function() {
    //get array of formats

    var _jpg = OPEN_BUTTON.parent.parent.children[1].children[1];
    var _tif = OPEN_BUTTON.parent.parent.children[1].children[2];
    var _psd = OPEN_BUTTON.parent.parent.children[1].children[3];
    var _png = OPEN_BUTTON.parent.parent.children[1].children[4];
    var T_EXTENSIONS_FILTER_ARRAY = [];

    if (_jpg.value) {
      T_EXTENSIONS_FILTER_ARRAY.push('jpg');
    }
    if (_tif.value) {
      T_EXTENSIONS_FILTER_ARRAY.push('tif');
    }
    if (_psd.value) {
      T_EXTENSIONS_FILTER_ARRAY.push('psd');
    }
    if (_png.value) {
      T_EXTENSIONS_FILTER_ARRAY.push('png');
    }

    // alert('Selected formats are:' + T_EXTENSIONS_FILTER_ARRAY);

    if (true) {
      var inputFolder = Folder.selectDialog("Input folder");
      if (inputFolder == null) {
        alert("No input folder selected.");
        return;

      } else {

        // alert(inputFolder);

        INPUT_PATH_STATIC_TEXT.text = '';
        INPUT_PATH_STATIC_TEXT.text = decodeURI(inputFolder.toString());

        inputFiles = inputFolder.getFiles();

        //
        cleanList(inputFiles, T_EXTENSIONS_FILTER_ARRAY);

        // alert(inputFiles);

      }
    }
  }
}

function cleanList(inputFiles, EXTENSIONS_FILTER_ARRAY) {
  var files_to_pr = [];

  if (EXTENSIONS_FILTER_ARRAY.length === 0) {
    alert('No format was not selected.');
    return;
  }

  for (var i = 0; i < inputFiles.length; i++) {
    splitPath = inputFiles[i].toString().split(".");
    extension = splitPath[splitPath.length - 1];
    if (extension_of_file_is_in_filter_array(extension, EXTENSIONS_FILTER_ARRAY)) {
      files_to_pr.push(inputFiles[i]);

    }
  }
  if (files_to_pr != null) {
    return files_to_pr;
  } else {
    alert('No files met provided conditions.');
  }
}

function elaborate_on_extension_array(EXTENSIONS_FILTER_ARRAY) {
  //this function helps to pick up files with various similar extensions, that would be normally omitted
  if (EXTENSIONS_FILTER_ARRAY.length !== 0) {
    for (var i = 0; i < EXTENSIONS_FILTER_ARRAY.length; i++) {
      // lower case every extension
      EXTENSIONS_FILTER_ARRAY[i] = EXTENSIONS_FILTER_ARRAY[i].toLowerCase();
      if (EXTENSIONS_FILTER_ARRAY[i] == 'jpg') {
        EXTENSIONS_FILTER_ARRAY.push('jpeg');
      }
      if (EXTENSIONS_FILTER_ARRAY[i] == 'tif') {
        EXTENSIONS_FILTER_ARRAY.push('tiff');
      }
    }
    // add uppercase copies of every extension
    for (var j = 0; j < EXTENSIONS_FILTER_ARRAY.length; j++) {
      EXTENSIONS_FILTER_ARRAY.push(EXTENSIONS_FILTER_ARRAY[j].toUpperCase());
    }
    return EXTENSIONS_FILTER_ARRAY;
  } else {
    alert('Function cannot elaborate on an empty extension array.')
    return;
  }
}

function extension_of_file_is_in_filter_array(extension, EXTENSIONS_FILTER_ARRAY) {
  for (var i = 0; i < EXTENSIONS_FILTER_ARRAY.length; i++) {
    if (extension == EXTENSIONS_FILTER_ARRAY[i]) {
      return true;
      break;
    }
  }
  // no matching extension
  return false;
}

// OPEN TYPE END

//SAVE TYPE START

function Type_Save(BROWSE_FILE_BUTTON) {
  BROWSE_FILE_BUTTON.onClick = function () {
    outputFolder = Folder.selectDialog("Output folder");
    if (outputFolder != null) {

      // alert(outputFolder);

      OUTPUT_PATH_STATIC_TEXT.text = '';
      OUTPUT_PATH_STATIC_TEXT.text = decodeURI(outputFolder.toString());
    } else {
      alert("No output folder selected.");
      return;

    }
  }
}

//SAVE TYPE END

// GENERAL FUNCTIONS

function this_string_contains(string, substring)  {
  // if (string.indexOf(substring) !== (parseInt('-1'))) {
  if ((string.indexOf(substring) > 0) || (string.indexOf(substring) === 0)) {
    return true;
  } else {
    return false;
  }
}

/////////////////////// TYPES of constructors *********************** END

function saveTxt(txt) {
  var Name = app.activeDocument.name.replace(/\.[^\.]+$/, '');
  var Ext = decodeURI(app.activeDocument.name).replace(/^.*\./, '');
  if (Ext.toLowerCase() != 'psd')
    return;

  var Path = app.activeDocument.path;
  var saveFile = File(Path + "/" + Name + ".txt");

  if (saveFile.exists)
    saveFile.remove();

  saveFile.encoding = "UTF8";
  saveFile.open("e", "TEXT", "????");
  saveFile.writeln(txt);
  saveFile.close();
}

////////////// FUNCTION FOR SCANNING ACTION SETS START **********

function Action_Set(name) {
  this.name = name;
  this.actions_Arr = [];
}

function populate() {

  actions_set_array = getActionSets();

  for (var i = 0; i < actions_set_array.length; i++) {

    all_action_sets[i] = new Action_Set(actions_set_array[i].toString());

    aList = getActions(actions_set_array[i]);

    for (var j = 0; j < aList.length; j++) {
      all_action_sets[i].actions_Arr[j] = aList[j].toString();
    }
  }
}

function getActionSets() {
  cTID = function(s) {
    return app.charIDToTypeID(s);
  };
  sTID = function(s) {
    return app.stringIDToTypeID(s);
  };
  var i = 1;
  var sets = [];
  while (true) {
    var ref = new ActionReference();
    ref.putIndex(cTID("ASet"), i);
    var desc;
    var lvl = $.level;
    $.level = 0;
    try {
      desc = executeActionGet(ref);
    } catch (e) {
      break; // all done
    } finally {
      $.level = lvl;
    }
    if (desc.hasKey(cTID("Nm  "))) {
      var set = {};
      set.index = i;
      set.name = desc.getString(cTID("Nm  "));
      set.toString = function() {
        return this.name;
      };
      set.count = desc.getInteger(cTID("NmbC"));
      set.actions = [];
      for (var j = 1; j <= set.count; j++) {
        var ref = new ActionReference();
        ref.putIndex(cTID('Actn'), j);
        ref.putIndex(cTID('ASet'), set.index);
        var adesc = executeActionGet(ref);
        var actName = adesc.getString(cTID('Nm  '));
        set.actions.push(actName);
      }
      sets.push(set);
    }
    i++;
  }
  return sets;
};

function getActions(aset) {
  cTID = function(s) {
    return app.charIDToTypeID(s);
  };
  sTID = function(s) {
    return app.stringIDToTypeID(s);
  };
  var i = 1;
  var names = [];
  if (!aset) {
    throw "Action set must be specified";
  }
  while (true) {
    var ref = new ActionReference();
    ref.putIndex(cTID("ASet"), i);
    var desc;
    try {
      desc = executeActionGet(ref);
    } catch (e) {
      break; // all done
    }
    if (desc.hasKey(cTID("Nm  "))) {
      var name = desc.getString(cTID("Nm  "));
      if (name == aset) {
        var count = desc.getInteger(cTID("NmbC"));
        var names = [];
        for (var j = 1; j <= count; j++) {
          var ref = new ActionReference();
          ref.putIndex(cTID('Actn'), j);
          ref.putIndex(cTID('ASet'), i);
          var adesc = executeActionGet(ref);
          var actName = adesc.getString(cTID('Nm  '));
          names.push(actName);
        }
        break;
      }
    }
    i++;
  }
  return names;
};

////////////// FUNCTION FOR SCANNING ACTION SETS END **********

///////////// MAIN ALGORITHMS ********** START ************

/////////////////////////////////// *** Process Folder

// SHOW THE WINDOW
W.show();
