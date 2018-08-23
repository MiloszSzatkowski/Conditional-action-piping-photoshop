#target photoshop

var actions_set_array, aList;

var all_action_sets = [];

// constructor for actions
function Action_set(_name) {
  this.name = _name;
  this.actions_Arr = [];
}  ;

var W = new Window ('dialog {orientation: "row", alignChildren: ["fill","fill"], preferredSize: [600,400]}',
"Conditional action piping", undefined, {closeButton: true});

var Middle_Group = W.add('panel {orientation: "column", alignChildren: ["fill","top"]}', undefined, 'asd');
var Middle_Group_Desc = Middle_Group.add('statictext', undefined, 'Action set:');
var Action_Set_Dropdown = Middle_Group.add('dropdownlist', undefined, '');


var Right_Group = W.add('panel {orientation: "column", alignChildren: ["fill","top"]}', undefined, 'asd' );
var Right_Group_Desc = Right_Group.add('statictext', undefined, 'Actions:');
var Actions_Dropdown = Right_Group.add('dropdownlist', undefined, '');

var sbar = W.add ("scrollbar", [0,0,20,600]);

populate();

Action_Set_Dropdown.onChange = function () {
  Actions_Dropdown.removeAll();
  var action_arr = all_action_sets[parseInt(Action_Set_Dropdown.selection.index)].actions_Arr;
  for (var i = 0; i < action_arr.length; i++) {
    Actions_Dropdown.add('item', action_arr[i] );
  }
  try { Actions_Dropdown.selection = 0; } catch (e) {  alert (e); }
}

////////////// set initial index of dropdowns:
try { Action_Set_Dropdown.selection = 0; } catch (e) {  alert (e); }
try { Actions_Dropdown.selection = 0; } catch (e) {  alert (e); }

var b = write

W.show();


    function populate() {

      actions_set_array = getActionSets();

        for ( var i = 0; i < actions_set_array.length; i++ ) {

          all_action_sets[i] = new Action_set (actions_set_array[i].toString());

          aList = getActions(actions_set_array[i]);
          for (var j = 0; j < aList.length; j++) {
            all_action_sets[i].actions_Arr.push( aList[j].toString() );
          }
        }

        for (var i = 0; i < all_action_sets.length; i++) {
          Action_Set_Dropdown.add('item', all_action_sets[i].name);
        }

        for (var i = 0; i < all_action_sets[0].actions_Arr.length; i++) {
          Actions_Dropdown.add('item',   all_action_sets[0].actions_Arr[i].toString() );
        }

    }

    function saveTxt(txt)
    {
    var Name = app.activeDocument.name.replace(/\.[^\.]+$/, '');
    var Ext = decodeURI(app.activeDocument.name).replace(/^.*\./,'');
    if (Ext.toLowerCase() != 'psd')
        return;

    var Path = app.activeDocument.path;
    var saveFile = File(Path + "/" + Name +".txt");

    if(saveFile.exists)
        saveFile.remove();

    saveFile.encoding = "UTF8";
    saveFile.open("e", "TEXT", "????");
    saveFile.writeln(txt);
    saveFile.close();
    }

    function getActionSets() {
    cTID = function(s) { return app.charIDToTypeID(s); };
    sTID = function(s) { return app.stringIDToTypeID(s); };
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
          break;    // all done
        } finally {
          $.level = lvl;
        }
        if (desc.hasKey(cTID("Nm  "))) {
          var set = {};
          set.index = i;
          set.name = desc.getString(cTID("Nm  "));
          set.toString = function() { return this.name; };
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
    cTID = function(s) { return app.charIDToTypeID(s); };
    sTID = function(s) { return app.stringIDToTypeID(s); };
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
          break;    // all done
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
