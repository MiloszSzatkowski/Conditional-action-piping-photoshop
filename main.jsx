#target photoshop

var actions_set_array, aList;

var all_action_sets = [];

var all_references = [];

populate();

var W = new Window ('dialog {orientation: "row", alignChildren: ["fill","fill"], preferredSize: [600,400]}',
"Conditional action piping", undefined, {closeButton: true});

var container = W.add('panel {orientation: "column", alignChildren: ["fill","top"]}', undefined, 'asd');




var Controls = W.add('panel {orientation: "column"}', undefined, '');
var typeOfAction = Controls.add('treeview', undefined, ['Play action', 'Open files', 'Save Files', 'Add Condition']);
var addButton = Controls.add('button',undefined ,'+' );
var subButton = Controls.add('button',undefined ,'-' );

var sbar = W.add ("scrollbar", [0,0,20,600]);

////////////// set initial index of dropdowns:

var all_of_types_Arr = ['Action' , 'Opening' , 'Saving'];

  /////////////////////// MAIN OBJECT constructor *********************** START

      // envoked with: new Module ( 'Action', container.add( 'dropdownlist', undefined, [] ) )

      function Module(
        TYPE,
        REFERENCE
      )  {

        this.type = TYPE;
        if (this.type === all_of_types_Arr[0]) { //is action type
          this.reference = container.add('panel {orientation: "row", alignChildren: ["left","top"]}', undefined, '');
          this.reference.add('edittext', undefined, 3 ,{readonly: true});
          this.reference.add('edittext', undefined, 'Play action' ,{readonly: true});
          all_references.push(this.reference.add('dropdownlist', undefined, ''));
          all_references.push(this.reference.add('dropdownlist', undefined, ''));

          fill_dropdowns ( all_references [ (all_references.length-2) ], all_references [ (all_references.length-1) ] );
        }

      }

   /////////////////////// MAIN OBJECT constructor *********************** END

   /////////////////////// TYPES of constructors *********************** START

   // ACTION TYPE:

    function Type_Action ( REFERENCE_SETS, REFERENCE_ACTIONS) {
      // handle (  REFERENCE   ) ;;;
      REFERENCE_SETS.onChange = function () {
        alert( 'Reference function action asigned' );
        REFERENCE_ACTIONS.removeAll();
        var action_arr = all_action_sets[parseInt(REFERENCE_SETS.selection.index)].actions_Arr;
        for (var i = 0; i < action_arr.length; i++) {
          REFERENCE_ACTIONS.add('item', action_arr[i] );
        }
        try { REFERENCE_ACTIONS.selection = 0; } catch (e) {  alert (e); }
      }
    }

    // fill dropdowns of Action module:
      function fill_dropdowns (REFERENCE_SETS, REFERENCE_ACTIONS){
        for (var i = 0; i < all_action_sets.length; i++) {
          REFERENCE_SETS.add('item', all_action_sets[i].name);
        }

        for (var i = 0; i < all_action_sets[0].actions_Arr.length; i++) {
          REFERENCE_ACTIONS.add('item',   all_action_sets[0].actions_Arr[i].toString() );
        }
      }

    // ACTION TYPE END

    /////////////////////// TYPES of constructors *********************** START

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

    function populate() {

      actions_set_array = getActionSets();

        for ( var i = 0; i < actions_set_array.length; i++ ) {

          all_action_sets[i] = new Action_set (actions_set_array[i].toString());

          aList = getActions(actions_set_array[i]);
          for (var j = 0; j < aList.length; j++) {
            all_action_sets[i].actions_Arr.push( aList[j].toString() );
          }
        }
    }

    function getActionSets() {
    cTID = function(s) { return app.charIDToTypeID(s); };
    sTID = function(s) { return app.stringIDToTypeID(s); };
      var i = 1;   var sets = [];
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
      var i = 1;   var names = [];
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
            var count = desc.getInteger(cTID("NmbC"));  var names = [];
            for (var j = 1; j <= count; j++) {
              var ref = new ActionReference();
              ref.putIndex(cTID('Actn'), j);   ref.putIndex(cTID('ASet'), i);
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

    // SHOW THE WINDOW
    W.show();
