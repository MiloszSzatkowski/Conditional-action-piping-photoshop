////////////////////////////////// ONLY OPERATE IN PHOTOSHOP ***********************

#target photoshop

////////////////////////////////// GLOBAL VARIABLES START ***********************

var actions_set_array,
  aList;

var all_action_sets = [];

var all_references = [];

var id = 0;

var children_bounds;

var HEIGHT_MODULE_TRESHOLD = 145;

//GLOBAL VALUE FOR SERIALIZATION
var DELIMITER = ';';
var PIPE_SEPERATOR = 'SET_start\n';
var NAME_OF_SET_IDENTIFIER = 'NAME_OF_SET:\n';

////////////////////////////////// GLOABAL VARIABLES END ***********************

// SCAN ALL AVAILABLE ACTIONS AND ADD THEM TO ARRAYS
populate();
// -------------

/////////////////////////////////// UI START ***********************

var W = new Window('dialog {orientation: "row", alignChildren: ["fill","fill"], size: [1200,600]}', "Conditional action piping", undefined, {
  closeButton: true
}, {resizeable: true});

var High_group = W.add('panel {orientation: "column", alignChildren: ["fill","top"]}', undefined, '');

W.onShow = function() {
  High_group.minimumSize.width = 900;
  High_group.minimumSize.height = 3000;
  container.minimumSize.width = 680;
  container.size.height = 2800;
  container.minimumSize.height = 2800;
}

var container = High_group.add ('panel {orientation: "column", alignChildren: ["fill","top"]}', undefined, '');

// intro container - width management
container.add('statictext', undefined,
' Modules   -----------------------------------------------------------------------------------------------------------------------------------------------------------------------', {
  readonly: false
}, {justify: "center"});

// container.add('edittext', undefined, '');

var Scroll_group = W.add('panel {orientation: "column", alignChildren: ["fill","fill"]}', undefined, '')

Scroll_group.maximumSize.width = 60;

var top_button =  Scroll_group.add('button', undefined, '↑↑');
var scroll_up =   Scroll_group.add('button', undefined, '↑');
var scroll_down = Scroll_group.add('button', undefined, '↓');
var down_button = Scroll_group.add('button', undefined, '↓↓');

var GLOBAL_gap = 10;
var GLOBAL_FIRST_STATIC_TEXT_HEIGHT = 14;
var scrolling_treshold = HEIGHT_MODULE_TRESHOLD + GLOBAL_gap + GLOBAL_FIRST_STATIC_TEXT_HEIGHT;

top_button.onClick = function() {
  updateUILayout(container);
}

scroll_up.onClick = function() {
  try {
    // alert( container.children[1].bounds.y )
    if ( (parseFloat(container.children[0].location.y) < 10) ) {
      for (var i = 0; i < container.children.length; i++) {
        container.children[i].location.y = container.children[i].location.y + scrolling_treshold;
      }
      if ((parseFloat(container.children[0].location.y) > GLOBAL_FIRST_STATIC_TEXT_HEIGHT)) {
        updateUILayout(container);
      }
    } else {
      updateUILayout(container);
    }
  } catch (e) {}
}

scroll_down.onClick = function() {
  try {
    if ( ! (parseFloat(container.children[container.children.length-1].location.y) < (HEIGHT_MODULE_TRESHOLD + GLOBAL_gap))) {
      for (var i = 0; i < container.children.length; i++) {
        container.children[i].location.y = container.children[i].location.y - scrolling_treshold;
      }
    }
  } catch (e) {}
}

down_button.onClick = function () {
  updateUILayout(container);
  refresh_view();
}

var Controls = W.add('panel {orientation: "column", alignChildren: ["fill","top"]}', undefined, '');

var desc_add_sub = Controls.add('statictext', undefined, 'Controls:')

hr(Controls);

var Control_Add_group = Controls.add('group {orientation:"column", alignChildren: ["fill","fill"]}', undefined, '');
var add_Action_Button = Control_Add_group.add('button', undefined, 'Add action module');
var add_Opening_Button = Control_Add_group.add('button', undefined, 'Add opening module');
var add_Saving_Button = Control_Add_group.add('button', undefined, 'Add saving module');

hr(Controls);

var Control_sub_group = Controls.add('group {orientation:"column", alignChildren: ["fill","fill"]}', undefined, '');
var subButton = Control_sub_group.add('button', undefined, 'Remove selected module');
var subButton_all = Control_sub_group.add('button', undefined, 'Remove all modules');

hr(Controls);

// var refresh_button = Controls.add('button', undefined, 'Refresh');

var execute_Pipe_button = Controls.add ('button', undefined, 'Execute');
execute_Pipe_button.onClick = function () {
  UNPACK ();
}

var close_window = Controls.add('button', undefined, 'Dismiss')

close_window.onClick = function () {
  W.close();
}

////////////// UI FUNCTIONS: ************************************************************ START

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
  if (true) {
    // move to location of added module - workaround at this moment only
    if (container.children.length > 4) {
      // alert(container.children[1].location.y + ' ' + container.children[2].location.y  )
      // alert(container.children[0].size.height)
      var size_of_first_element_statix_text = container.children[0].size.height;
      var gap = 10;
      for (var i = 0; i < container.children.length; i++) {
        var t_sum = ((HEIGHT_MODULE_TRESHOLD + gap) * (container.children.length - 3)) + size_of_first_element_statix_text;
        container.children[i].location.y = container.children[i].location.y - t_sum + HEIGHT_MODULE_TRESHOLD;
      }
    }
  }
}

subButton.onClick = function() {
  delete_selected_modules();
}

subButton_all.onClick = function() {
  //select all
  if (container.children.length > 1) {
    for (var i = 1; i < container.children.length; i++) {
      container.children[i].children[0].children[0].value = true;
    }
  }
  delete_selected_modules();
}

function delete_selected_modules() {
  var deletion_Arr = container_selection();

  if (deletion_Arr !== 0) {
    for (var i = 0; i < deletion_Arr.length; i++) {
      container.remove(deletion_Arr[i]);
    }
  }
  refresh_indexes();
  updateUILayout(container);
}



// refresh_button.onClick = function() {
//   updateUILayout(container);
// }

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

function reCount_children_height(gap) {
  var accum = 0;
  for (var i = 1; i < container.children.length; i++) {
    accum = accum + container.children[i].size.height + gap;
  }
  return accum;
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

//////////////// UI FUNCTIONS: ************************************************************ END

////////////// SAVE MODULES

hr(Controls);

var FILE = new File((new File($.fileName)).parent + "/" + "Pipes.xml");

var Save_Current_Modules_butt = Controls.add('button', undefined, 'Save selected set of modules');
Save_Current_Modules_butt.onClick = function () {       saveModule(false, false);  }

var Overwrite_Current_Modules_butt = Controls.add('button', undefined, 'Overwrite selected set of modules');
Overwrite_Current_Modules_butt.onClick = function () {  saveModule(true, false);   }

// var Load_Selected_Modules_butt = Controls.add('button', undefined, 'Load selected set of modules');
function Load_Selected_Modules () {
    if (Saved_sets_of_modules.items.length > 0) {

      //remove all visible modules
      if (container.children.length > 1) {
        for (var i = 1; i < container.children.length; i++) {
          container.children[i].children[0].children[0].value = true;
        }
        delete_selected_modules();
      }

      var Name_of_a_set_ = Saved_sets_of_modules.selection.text;

      FILE.encoding = "UTF8";

      FILE.open('r');
      var XML_FILE = new XML( FILE.read() );
      FILE.close();

      var xml_sets_names = read_modules_from_file();

      var current_selection_index ;

      for (var i = 0; i < xml_sets_names.length; i++) {
        if (xml_sets_names[i] == Name_of_a_set_) {
          current_selection_index = i;
          break;
        }
      }

      var PP = 0;
      while (true) {
        try {
          XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP];
          var THIS_TYPE = XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].TYPE;
            if        (THIS_TYPE == 'Play action') {
              var this_module = new Module('Action');
              var this_module = this_module.reference;

              var SET_NAME    = XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].SET_NAME;
              var correct_S_N = true;

              if (this_module.children[0].children[3].items.length > 0) {
                for (var _ind_ = 0; _ind_ < this_module.children[0].children[3].items.length; _ind_++) {
                  if (SET_NAME == this_module.children[0].children[3].items[_ind_].text){
                    this_module.children[0].children[3].selection = _ind_;
                    var correct_S_N = true;
                  }
                }
                if (correct_S_N == false) {
                  alert( 'Set in module nr ' + PP + ' was moved , deleted or renamed. Set name changed to default.')
                }
              }

              var ACTION_NAME = XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].ACTION_NAME;
              var correct_A_N = false;

              if (this_module.children[0].children[4].items.length > 0) {
                for (var _ind_02 = 0; _ind_02 < this_module.children[0].children[4].items.length; _ind_02++) {
                  if (ACTION_NAME == this_module.children[0].children[4].items[_ind_02].text){
                    this_module.children[0].children[4].selection = _ind_02;
                    correct_A_N = true;
                  }
                }
                if (correct_A_N == false) {
                  alert( 'Action in module nr ' + PP + ' was moved , deleted or renamed. Action name set to default.')
                }
              }

              var COND_BOOL =    this_module.children[1].children[0].value = (XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].CONDITION_BOOL == true);
              if (XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].CONDITION_BOOL == true) {
                var CONTENT_BOOL = this_module.children[1].children[1].text  = XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].CONTENT_OF_CONDITION;
              }
            } else if (THIS_TYPE == 'Open files') {
              var this_module = new Module('Opening');
              var this_module = this_module.reference;
              var OPEN_BUTTON = this_module.children[0].children[3];
              var inputFolder = this_module.children[2].children[0].children[1].text = XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].INPUT_FOLDER;
              this_module.children[2].children[0].children[1].minimumSize.width = 500;
              var cond_bool = this_module.children[1].children[5].value = (XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].CONDITION_BOOL == true);
              if (XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].CONDITION_BOOL == true) {
                var cond_text = this_module.children[1].children[6].text  = XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].CONTENT_OF_CONDITION;
              }
              var _format_shortcut = OPEN_BUTTON.parent.parent.children[1];
              var _jpg = _format_shortcut.children[1].value = XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].JPG;
              var _tif = _format_shortcut.children[2].value = XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].TIF;
              var _psd = _format_shortcut.children[3].value = XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].PSD;
              var _png = _format_shortcut.children[4].value = XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].PNG;
            } else if (THIS_TYPE == 'Save files') {
              var this_module = new Module('Saving');
              var this_module = this_module.reference;

              var BOOL_CL = this_module.children[0].children[7].value = (XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].BOOL_CLOSE == true);

              var flatten_bool = this_module.children[0].children[4].value =            (XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].FLATTEN_BOOL == true);
              var outputFolder = this_module.children[1].children[0].children[1].text = XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].OUTPUT_FOLDER;
              this_module.children[1].children[0].children[1].minimumSize.width = 500;
              var extension =    this_module.children[0].children[6].selection.text   = XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].EXTENSION;
              var rename_bool =  this_module.children[2].children[0].value = (XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].RENAME_BOOL == true);
              if (XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].RENAME_BOOL == true) {
                var prefix =       this_module.children[2].children[2].text = XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].PREFIX;
                var replace_text = this_module.children[2].children[4].text = XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].REPLACE_TEXT;
                var replace_with = this_module.children[2].children[6].text = XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].REPLACE_WITH;
                var sufix =        this_module.children[2].children[8].text = XML_FILE.SETS.elements()[current_selection_index].MODULES.elements()[PP].SUFIX;
              }
            }
          PP++;
        } catch (e) {
          break;
        }
      }
      updateUILayout(container);
    } else {
      // alert("There are no sets to load.")
    }
  }

var Delete_Current_Modules_butt = Controls.add('button', undefined, 'Delete selected set of modules');
Delete_Current_Modules_butt.onClick = function () {  saveModule(true, true);
    //remove all visible modules
    // if (container.children.length > 1) {
    //   for (var i = 1; i < container.children.length; i++) {
    //     container.children[i].children[0].children[0].value = true;
    //   }
    //   delete_selected_modules();
    // }
  }

var Desc_saved_sets_of_modules = Controls.add('statictext', undefined, 'List of saved sets of modules:');
var Saved_sets_of_modules      = Controls.add('dropdownlist', undefined, []);

update_Dropdownlist_of_sets();

Saved_sets_of_modules.onChange = function () {
  Load_Selected_Modules();
}

function update_Dropdownlist_of_sets() {
  try {
    var xml_sets_names_for_dropdown = read_modules_from_file();
      try {
        Saved_sets_of_modules.removeAll();
      } catch (e) {   }
    for (var i = 0; i < xml_sets_names_for_dropdown.length; i++) {
      Saved_sets_of_modules.add ('item', xml_sets_names_for_dropdown[i])
    }
    Saved_sets_of_modules.selection = 0;
  } catch (e) {
  }
}

function saveTxt(txt , NAME_OF_A_SET, overwrite, deletion) {
  FILE.encoding = "UTF8";

  FILE.open('r');
  var XML_FILE = new XML( FILE.read() );
  FILE.close();
  var xml_sets_names = read_modules_from_file();

  if (overwrite && !deletion) {
    for (var i = 0; i < xml_sets_names.length; i++) {
      if (xml_sets_names[i] == NAME_OF_A_SET) {
        // XML_FILE.SETS.elements()[i].removeNamespace();

        delete  XML_FILE.SETS.elements()[i];
        XML_FILE.elements()[0].appendChild( new XML(  txt ) );

        FILE.open("w");
        FILE.writeln('');
        FILE.close();

        FILE.open("e", "TEXT");
        FILE.writeln(XML_FILE);
        FILE.close();

        alert('Set overwritten.')
      }
    }
  } else if (deletion) {
    for (var i = 0; i < xml_sets_names.length; i++) {
      if (xml_sets_names[i] == NAME_OF_A_SET) {
        delete  XML_FILE.SETS.elements()[i];

        // alert(XML_FILE)

        FILE.open("w");
        FILE.writeln('');
        FILE.close();

        FILE.open("e", "TEXT");
        FILE.writeln(XML_FILE);
        FILE.close();

        // alert('Set deleted.')
      }
    }
  } else {

    FILE.open("w");
    FILE.writeln('');
    FILE.close();

    FILE.open("e", "TEXT");
    XML_FILE.elements()[0].appendChild( new XML(  txt ) );
    FILE.writeln(XML_FILE);
    FILE.close();
  }

}

// <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
// <DOCUMENT>
//   <PIPES>
//   </PIPES>
// </DOCUMENT>

function read_modules_from_file() {
  FILE.encoding = "UTF8";

    FILE.open('r');
    var XML_FILE = new XML( FILE.read() );
    FILE.close();
    xml_sets_names = [];

    var ll = 0;
      while (true) {
        try {
          xml_sets_names.push( XML_FILE.SETS.elements()[ll].NAME );
          ll++;
        } catch (e) {
          break;
        }
      }

    return xml_sets_names;
}

///////////////////////// SAVE AND LOAD MODULES FROM FILE

function saveModule(overwrite, deletion) {
    if        (!overwrite) {
      var NAME_OF_A_SET = prompt('Provide a custom name for a new set of modules:', ' ');
      if (Saved_sets_of_modules.items.length > 0) {
        for (var i = 0; i < Saved_sets_of_modules.items.length; i++) {
          if (NAME_OF_A_SET == Saved_sets_of_modules.items[i].text){
            NAME_OF_A_SET = '';
            alert("Name already taken.");
            return;
            break;
          }
        }
      }
    } else if ( overwrite){
      if (Saved_sets_of_modules.items.length === 0) {
        alert ('There are no modules to overwrite nor delete.');
        return;
      } else {
        var NAME_OF_A_SET = Saved_sets_of_modules.selection.text;
      }
    } else {
      alert ('Argument in a function "saveModule" was not provided.');
    }

    if ( (NAME_OF_A_SET != null) && (NAME_OF_A_SET != ' ')) {
      if (container.children.length > 1 || deletion) {
        var string_to_save = '';

          // save modules to stringified array
          for (var i = 1; i < container.children.length; i++) {

            var TYPE = container.children[i].children[0].children[2].text;
            var MODULE = container.children[i];

            if (i === 1) {
              string_to_save = SERIALIZE_current_module(MODULE , TYPE);
            } else if (i > 1) {
              string_to_save = string_to_save + SERIALIZE_current_module(MODULE , TYPE);
            }
          }

          string_to_save = '\r' + "<SET>" + '\r' + "<NAME>" + NAME_OF_A_SET + "</NAME>" + '\r' +"<MODULES>" + string_to_save + "</MODULES>" + '\r' + "</SET>";

          try {  saveTxt( string_to_save , NAME_OF_A_SET , overwrite , deletion);
              if (!deletion) {
                if (!overwrite) {
                  Saved_sets_of_modules.add('item', NAME_OF_A_SET);
                  alert ('Set "' + NAME_OF_A_SET + '" saved');
                  try {   Saved_sets_of_modules.selection = Saved_sets_of_modules.items.length -1 ;   } catch (e) {       }
                }
              } else {
                Saved_sets_of_modules.remove(Saved_sets_of_modules.items[Saved_sets_of_modules.selection.index]);
                try {   Saved_sets_of_modules.selection = 0 ;   } catch (e) {       }
                alert ('Set "' + NAME_OF_A_SET + '" removed');
              }
          } catch (e) {    alert  (e);   }

      } else {
        alert ('No modules to save.');
        return;
      }
    } else {
      alert ('Set was not saved.');
      return;
    }
}

function SERIALIZE_current_module(MODULE, TYPE) {

  if        (TYPE == 'Play action') {

    var SET_NAME    =  MODULE.children[0].children[3].selection.text;
    var ACTION_NAME =  MODULE.children[0].children[4].selection.text;
    var COND_BOOL =    MODULE.children[1].children[0].value;
    var CONTENT_BOOL = MODULE.children[1].children[1].text;

    var xmlFIle =       '\r' + indent (1) + "<MODULE>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<TYPE>"                 + TYPE +         "</TYPE>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<SET_NAME>"             + SET_NAME +     "</SET_NAME>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<ACTION_NAME>"          + ACTION_NAME +  "</ACTION_NAME>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<CONDITION_BOOL>"       + COND_BOOL +    "</CONDITION_BOOL>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<CONTENT_OF_CONDITION>" + CONTENT_BOOL + "</CONTENT_OF_CONDITION>";
    xmlFIle = xmlFIle + '\r' + indent (1) + "</MODULE>" ;

    return xmlFIle;

  } else if (TYPE == 'Open files') {

    var OPEN_BUTTON = MODULE.children[0].children[3];
    var inputFolder = MODULE.children[2].children[0].children[1].text;

    var cond_bool = MODULE.children[1].children[5].value;
    var cond_text = MODULE.children[1].children[6].text;

    var _format_shortcut = OPEN_BUTTON.parent.parent.children[1];
    var _jpg = _format_shortcut.children[1].value;      var _tif = _format_shortcut.children[2].value;
    var _psd = _format_shortcut.children[3].value;      var _png = _format_shortcut.children[4].value;

    var xmlFIle =       '\r' + indent (1) + "<MODULE>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<TYPE>"                 + TYPE +         "</TYPE>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<INPUT_FOLDER>"         + inputFolder +  "</INPUT_FOLDER>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<CONDITION_BOOL>"       + cond_bool +    "</CONDITION_BOOL>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<CONTENT_OF_CONDITION>" + cond_text +    "</CONTENT_OF_CONDITION>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<JPG>"                  + _jpg +         "</JPG>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<TIF>"                  + _tif +         "</TIF>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<PSD>"                  + _psd +         "</PSD>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<PNG>"                  + _png +         "</PNG>";
    xmlFIle = xmlFIle + '\r' + indent (1) + "</MODULE>" ;

    return xmlFIle;

  } else if (TYPE == 'Save files') {

    var flatten_bool = MODULE.children[0].children[4].value;

    var extension =    MODULE.children[0].children[6].selection.text;
    var outputFolder = MODULE.children[1].children[0].children[1].text;

    var rename_bool =  MODULE.children[2].children[0].value;

    var prefix =       MODULE.children[2].children[2].text;
    var replace_text = MODULE.children[2].children[4].text;
    var replace_with = MODULE.children[2].children[6].text;
    var sufix =        MODULE.children[2].children[8].text;

    var BOOL_CLOSING = MODULE.children[0].children[7].value;

    var xmlFIle =       '\r' + indent (1) + "<MODULE>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<TYPE>"          + TYPE +         "</TYPE>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<FLATTEN_BOOL>"  + flatten_bool + "</FLATTEN_BOOL>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<OUTPUT_FOLDER>" + outputFolder + "</OUTPUT_FOLDER>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<EXTENSION>"     + extension +    "</EXTENSION>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<RENAME_BOOL>"   + rename_bool +  "</RENAME_BOOL>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<PREFIX>"        + prefix +       "</PREFIX>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<REPLACE_TEXT>"  + replace_text + "</REPLACE_TEXT>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<REPLACE_WITH>"  + replace_with + "</REPLACE_WITH>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<BOOL_CLOSE>"    + BOOL_CLOSING +   "</BOOL_CLOSE>";
    xmlFIle = xmlFIle + '\r' + indent (2) + "<SUFIX>"         + sufix +        "</SUFIX>";
    xmlFIle = xmlFIle + '\r' + indent (1) + "</MODULE>" ;

    return xmlFIle;

  }
}

function indent (n) {
  var s = " "; for (var i = 0; i < n; i++) {s += "\t";}
  return s;
}

// get name from between identifiers
var getFromBetween = {
    results:[],
    string:"",
    getFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1)+sub1.length;
        var string1 = this.string.substr(0,SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP,TP);
    },
    removeFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
        this.string = this.string.replace(removal,"");
    },
    getAllResults:function (sub1,sub2) {
        // first check to see if we do have both substrings
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1,sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1,sub2);

        // if there's more substrings
        if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1,sub2);
        }
        else return;
    },
    get:function (string,sub1,sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1,sub2);
        return this.results;
    }
};

//usage: var result = getFromBetween.get(string,"first_delimiter","second_delimiter");

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

      T_Bool_Condition_Action = this.S_group.add('checkbox', undefined, 'Apply condition');
      var T_Condition_Action_Text = this.S_group.add('statictext', undefined, '');
      T_Condition_Action_Text.minimumSize.width = 150;

      T_Bool_Condition_Action.onClick = function  ()  {
        if (this.value) {
          var catch_condition = prompt('Type in a text to be used as a condition. \nIf a file contains this string, the action will be played.','');
          if ((catch_condition == null) || (catch_condition == undefined) || ( catch_condition == '')) {
            this.value = false;
            this.text ='Apply condition';
            this.parent.children[1].text = '';
          } else {
            this.value = true;
            this.text ='Apply condition :';
            this.parent.children[1].text = catch_condition;
          }
        } else {
          this.parent.children[1].text = '';
          this.value = false;
          this.text ='Apply condition';
        }
      }

    refresh_indexes();

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

      T_Bool_Condition_Action = this.S_group.add('checkbox', undefined, 'Apply condition');
      var T_Condition_Action_Text = this.S_group.add('statictext', undefined, '');
      T_Condition_Action_Text.minimumSize.width = 150;

      T_Bool_Condition_Action.onClick = function  ()  {
        if (this.value) {
          var catch_condition = prompt('Type in a text to be used as a condition. \nIf a file contains this string, the file will be opened.','');
          if ((catch_condition == null) || (catch_condition == undefined) || ( catch_condition == '')) {
            this.value = false;
            this.text ='Apply condition';
            this.parent.children[6].text = '';
          } else {
            this.value = true;
            this.text ='Apply condition:';
            this.parent.children[6].text = catch_condition;
          }
        } else {
          this.parent.children[6].text = '';
          this.value = false;
          this.text ='Apply condition';
        }
      }

    this.T_group = this.reference.add('group {orientation: "column", alignChildren: ["left","top"]}', undefined, '');

      this.T_01_group = this.T_group.add('panel {orientation: "column", alignChildren: ["left","top"]}', undefined, '');

          T_Input_Describ_ = this.T_01_group.add('statictext', undefined, 'Input path:');

          T_Input_Static_Text = this.T_01_group.add('statictext', undefined, '_______________________________________________________________');

      refresh_indexes();

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
          T_Saving_Format = this.F_group.add('dropdownlist', undefined, ['','jpg', 'png', 'tiff', 'psd']  );
          T_Saving_Format.selection = 0;

          var close_after_saving = this.F_group.add('checkbox', undefined, 'Close after saving');

          close_after_saving.value = true;

        this.S_group = this.reference.add('group {orientation: "row", alignChildren: ["left","top"]}', undefined, '');

        this.T_02_group = this.S_group.add('panel {orientation: "column", alignChildren: ["left","top"]}', undefined, '');

            T_Output_Describ_ = this.T_02_group.add('statictext', undefined, 'Output path:');

            T_Output_Static_Text = this.T_02_group.add('statictext', undefined, '_______________________________________________________________');


        this.L_group = this.reference.add('group {orientation: "row", alignChildren: ["left","top"]}', undefined, '');

        T_Bool_Condition_Action = this.L_group.add('checkbox', undefined, 'Filename operations');
        T_Bool_Condition_Action.minimumSize.width = 130;

        var Prefix_T = this.L_group.add('statictext', undefined, 'Prefix:');
        var Prefix = this.L_group.add('statictext', undefined, '');
        Prefix.minimumSize.width = 60;

        var Replace_T = this.L_group.add('statictext', undefined, 'Text to be replaced:');
        var Replace = this.L_group.add('statictext', undefined, '');
        Replace.minimumSize.width = 60;

        var Replace_With_T = this.L_group.add('statictext', undefined, 'Replace with:');
        var Replace_With = this.L_group.add('statictext', undefined, '');
        Replace_With.minimumSize.width = 60;

        var Suffix_T = this.L_group.add('statictext', undefined, 'Suffix:');
        var Suffix = this.L_group.add('statictext', undefined, '');
        Suffix.minimumSize.width = 60;

        T_Bool_Condition_Action.onClick = function  ()  {
          var PARENT_OF_THIS_BUTTON = this.parent;
          if (this.value) {
            var T_W = new Window('dialog {orientation: "column", alignChildren: ["fill","fill"]}', "Change name of a saved file", undefined, {
              closeButton: true  }, {resizeable: true});

              var edit_Prefix_T = T_W.add('statictext', undefined, 'Prefix')
              var edit_Prefix   = T_W.add('edittext', undefined, '');
              edit_Prefix.text = this.parent.children[2].text;

              var edit_Replace_T = T_W.add('statictext', undefined, 'Replace')
              var edit_Replace   = T_W.add('edittext', undefined, '');
              edit_Replace.text = this.parent.children[4].text;

              var replace_all = T_W.add('checkbox', undefined, 'Replace all');
              replace_all.onClick = function () {
                if (this.value) {
                  edit_Replace.text = '';
                  edit_Replace.text = '*all*';
                } else {
                  edit_Replace.text = '';
                  this.value = false;
                }
              }

              var edit_Replace_With_T = T_W.add('statictext', undefined, 'Replace with')
              var edit_Replace_With   = T_W.add('edittext', undefined, '');
              edit_Replace_With.text = this.parent.children[6].text;

              var edit_Suffix_T = T_W.add('statictext', undefined, 'Suffix')
              var edit_Suffix   = T_W.add('edittext', undefined, '');
              edit_Suffix.text = this.parent.children[8].text;

              var desc = T_W.add ('statictext', undefined, "Tip: If you want to put an index of a file in a specific place, simply write '#index'")

              var ok_button = T_W.add('button', undefined, 'Apply');
              ok_button.onClick = function () {
                PARENT_OF_THIS_BUTTON.children[2].text = edit_Prefix.text ;
                PARENT_OF_THIS_BUTTON.children[4].text = edit_Replace.text ;
                if (edit_Replace.text == '') {
                  edit_Replace_With.text = '';
                }
                PARENT_OF_THIS_BUTTON.children[6].text = edit_Replace_With.text ;
                PARENT_OF_THIS_BUTTON.children[8].text = edit_Suffix.text ;
                T_W.close();
              }

              var cancel_button = T_W.add('button', undefined, 'Cancel');
              cancel_button.onClick = function () {
                T_W.close();
              }

            T_W.show();
          } else {
            this.value = false;

          }
        }

    refresh_indexes();

    //assign onChange callback - save
    Type_Save(T_Choose_Folder);


  }

  this.reference.minimumSize.height = HEIGHT_MODULE_TRESHOLD;

}

/////////////////////// MAIN OBJECT constructor *********************** END

/////////////////////// FUNCTIONS FOR MODULES *********************** START

function refresh_indexes() {
  for (var i = 1; i < container.children.length; i++) {
    var this_module = container.children[i];
    var module_index_text = this_module.children[0].children[1].text;
    // alert (module_index_text);
    this_module.children[0].children[1].text = i;
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
    if (true) {
      var inputFolder = Folder.selectDialog("Input folder");
      if (inputFolder == null) {
        alert("No input folder selected.");        return;
      } else {
        INPUT_PATH_STATIC_TEXT.text = '';
        INPUT_PATH_STATIC_TEXT.text = decodeURI(inputFolder.toString());

      }
    }
  }
}

// OPEN TYPE END

//SAVE TYPE START

function Type_Save(BROWSE_FILE_BUTTON) {
  BROWSE_FILE_BUTTON.onClick = function () {
    outputFolder = Folder.selectDialog("Output folder");
    if (outputFolder != null) {

      OUTPUT_PATH_STATIC_TEXT = BROWSE_FILE_BUTTON.parent.parent.children[1].children[0].children[1];
      // alert (OUTPUT_PATH_STATIC_TEXT)

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

// UNPACK ALL MODULES

function UNPACK() {
  ///////////////////////////////// CHECKING SECTION

  ///////////////////////////////// CHECKING SECTION END

  //////////////////////////////// * SERIALIZE PIPE
  // alert(container.children[1].children[0].children[2].text)

  for (var i = 1; i < container.children.length; i++) {
    var self_reference = container.children[i];
    var type_of_module = self_reference.children[0].children[2].text;

    if        (type_of_module === 'Play action') {

      if (app.documents.length === 0) {
        alert ( 'You cannot play action in a module nr ' + i + ' without a document' );
        return;
      }

      var action_set_text = self_reference.children[0].children[3].selection.text;
      var action_text = self_reference.children[0].children[4].selection.text;
      // alert('Action set is ' + action_set_text + ' and action to be played is called: ' + action_text);

      if        (action_set_text == null) {
        alert ( 'Action set in a module nr ' + i + ' is not specified' );
        return;
      } else if (action_text     == null ) {
        alert ( 'Action in a module nr ' + i + ' is not specified' );
        return;
      }

      var apply_condition = self_reference.children[1].children[0].value;
      var condition_text  = self_reference.children[1].children[1].text;
      if (app.documents.length === 1) {
        //Filename condition
        var NAME = app.activeDocument.name.replace(/\.[^\.]+$/, '');
        if (apply_condition) {
          if (this_string_contains(NAME, condition_text)) {
            app.doAction(action_text , action_set_text);
          }
        } else {
          app.doAction(action_text , action_set_text);
        }
      } else (app.documents.length > 1) {
        for (var j = 0; j < app.documents.length; j++) {
          app.activeDocument = app.documents[j];
          //Filename condition
          var NAME = app.activeDocument.name.replace(/\.[^\.]+$/, '');
          if (apply_condition) {
            if (this_string_contains(NAME, condition_text)) {
              app.doAction(action_text , action_set_text);
            }
          } else {
            app.doAction(action_text , action_set_text);
          }
        }
      }


    } else if (type_of_module === 'Open files') {
      // alert(type_of_module)


      var OPEN_BUTTON = self_reference.children[0].children[3];
      //get array of formats
      var inputFolder = new Folder (self_reference.children[2].children[0].children[1].text);

      try {
        // alert ( inputFiles )
        var inputFiles = inputFolder.getFiles();
        var inputFiles_are_valid = true;
        // alert( 'Input files: \n' + inputFiles.toString());
      } catch (e) {
        alert ( e + ' ' + inputFiles + ' \n' + 'Input folder was not found in module nr ' + i );
      }

      if (inputFiles_are_valid) {

        // alert( 'Opening has started ')
        // alert (self_reference.children[1].children[5].value)

        if (self_reference.children[1].children[5].value) {
          var cond_text = self_reference.children[1].children[6].text;
        } else {        cond_text = '';      }

        // alert( cond_text );

        var _format_shortcut = OPEN_BUTTON.parent.parent.children[1];
        var _jpg = _format_shortcut.children[1];      var _tif = _format_shortcut.children[2];
        var _psd = _format_shortcut.children[3];      var _png = _format_shortcut.children[4];

        var T_EXTENSIONS_FILTER_ARRAY = [];

        if (_jpg.value) {        T_EXTENSIONS_FILTER_ARRAY.push('jpg');      }
        if (_tif.value) {        T_EXTENSIONS_FILTER_ARRAY.push('tif');      }
        if (_psd.value) {        T_EXTENSIONS_FILTER_ARRAY.push('psd');      }
        if (_png.value) {        T_EXTENSIONS_FILTER_ARRAY.push('png');      }

        // alert( T_EXTENSIONS_FILTER_ARRAY )

        var files_to_open = cleanList(inputFiles, T_EXTENSIONS_FILTER_ARRAY, cond_text);
        // alert( files_to_open )

        for (var d = 0; d < files_to_open.length; d++) {
          openFile(files_to_open[d]);
        }

      }

    } else if (type_of_module === 'Save files') {
      // alert(type_of_module)

      // alert( app.documents.length );

            if (app.documents.length === 0 ) {
                alert('No open files to save at module nr ' + i);
                return;
            }

      var NAME;
      var PATH;

      var outputFolder = new Folder (self_reference.children[1].children[0].children[1].text);
      var extension = self_reference.children[0].children[6].selection.text;


      for (var p = 0; p < app.documents.length; p++) {

        app.activeDocument = app.documents[p];

        var NAME = app.activeDocument.name.replace(/\.[^\.]+$/, '');

        //renaming
        if (self_reference.children[2].children[0].value) {

          var prefix =       self_reference.children[2].children[2].text;

          var replace_text = self_reference.children[2].children[4].text;

          var replace_with = self_reference.children[2].children[6].text;

          var sufix =        self_reference.children[2].children[8].text;

          // alert( prefix + '\n'  + replace_text + '\n'  + replace_with + '\n'  + sufix + '\n'  );

          if (replace_text !== '') {
            if (this_string_contains(  replace_text, '*all*') ) {
              NAME = NAME.replace( NAME, replace_with );
            } else {
              NAME = NAME.replace( replace_text, replace_with );
            }
          }

          NAME = prefix + NAME + sufix;

          //check for index injection
          if (this_string_contains (NAME, '#index')) {
            NAME = NAME.replace ('#index', p );
          }

          // alert( NAME );

        }

        var PATH = new Folder (outputFolder + '/' + NAME + '.' + extension) ;
        // alert (PATH);

        try {

          if (self_reference.children[0].children[4].value) {
            // alert (self_reference.children[0].children[4].value);
            app.activeDocument.flatten();
          }

          saveFile (PATH, extension);
          //then try to close


        } catch (e) {
          alert ( e + ' ' + outputFolder + ' ' + extension  + ' \n' + 'Output folder was not found in module nr ' + i );
        }

      }

      // alert( self_reference.children[0].children[7].value )
      if (self_reference.children[0].children[7].value) {
        var lll = app.documents.length - 1;
        var looping = true;
        while (looping) {
          try {
            app.documents[lll].close(SaveOptions.DONOTSAVECHANGES);
            lll = lll - 1;
          } catch (e) {
            // alert ( lll + ' ' + e);
            looping = false;
          }
        }
      }

    }

  }

  alert( 'Execution finished' );

}

function cleanList(inputFiles, EXTENSIONS_FILTER_ARRAY, condition_string) {
  var files_to_pr = [];

  if (EXTENSIONS_FILTER_ARRAY.length === 0) {
    alert('No format was selected.');
    return;
  }

  for (var i = 0; i < inputFiles.length; i++) {

    var T_name_without_extension = decodeURI(inputFiles[i]).toString().replace(/\.[^\.]+$/, '').split("/");
    var name_without_extension   = T_name_without_extension[T_name_without_extension.length - 1];
    var extension                = decodeURI(inputFiles[i]).toString().replace(/^.*\./, '');

    // alert('You"re in cleanList loop')
    // alert(name_without_extension);

    if ((condition_string == '') || (condition_string == null)) {
      if (extension_of_file_is_in_filter_array(extension, EXTENSIONS_FILTER_ARRAY)) {
        files_to_pr.push(inputFiles[i]);

      }
    } else {
      if (extension_of_file_is_in_filter_array(extension, EXTENSIONS_FILTER_ARRAY)
          && this_string_contains(name_without_extension, condition_string)) {
        files_to_pr.push(inputFiles[i]);

      }
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

function openFile(imagePath) {
app.open(File(imagePath));
}

function saveFile( saveFile, extension ) {

  if        (extension == 'psd') {

         var psdSaveOptions = new PhotoshopSaveOptions();
         psdSaveOptions.embedColorProfile = true;
         psdSaveOptions.alphaChannels = true;
         app.activeDocument.saveAs(saveFile, psdSaveOptions, true, Extension.LOWERCASE);

  } else if (extension == 'jpg') {

        var jpegQuality = 12;
        var jpgSaveOptions = new JPEGSaveOptions();
        jpgSaveOptions.embedColorProfile = true;
        jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
        jpgSaveOptions.matte = MatteType.NONE;
        jpgSaveOptions.quality = jpegQuality;
        app.activeDocument.saveAs(saveFile, jpgSaveOptions, true, Extension.LOWERCASE);

  } else if (extension == 'tiff')  {

        var tiffSaveOptions = new TiffSaveOptions();
        tiffSaveOptions.embedColorProfile = true;
        tiffSaveOptions.alphaChannels = true;
        tiffSaveOptions.layers = true;
        tiffSaveOptions.imageCompression = TIFFEncoding.TIFFLZW;
        app.activeDocument.saveAs(saveFile, tiffSaveOptions, true, Extension.LOWERCASE);

  } else if (extension == 'png')  {

        var pngSaveOptions = new PNGSaveOptions ();
        //from 0 to 9
        pngSaveOptions.compression = 9;
        pngSaveOptions.interlaced = false;
        activeDocument.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE);

  }

}

//check if actions exists
function actionExists( setName , actionName){

   var res = false;

   try{
      var ref = new ActionReference();
      ref.putName( charIDToTypeID( 'Actn' ), actionName );
      ref.putName( charIDToTypeID( "ASet" ), setName );
      executeActionGet( ref );
      res = true;

   }catch(e){}
   return res;
}

/////////////////////////////////// *** Process Folder

// load first AVAILABLE settings
try {
  Load_Selected_Modules();
} catch (e) {   }

// SHOW THE WINDOW
W.show();
