////////////////////////////////// ONLY OPERATE IN PHOTOSHOP ***********************

#target photoshop

////////////////////////////////// GLOABAL VARIABLES START ***********************

var actions_set_array, aList;

var all_action_sets = [];

var all_references = [];

var id = 0;

var children_bounds;

////////////////////////////////// GLOABAL VARIABLES END ***********************


// SCAN ALL AVAILABLE ACTIONS AND ADD THEM TO ARRAYS
populate();
// -------------

/////////////////////////////////// UI START ***********************

var W = new Window ('dialog {orientation: "row", alignChildren: ["fill","fill"], size: [1100,600]}',
"Conditional action piping", undefined, {closeButton: true}, {resizeable:true});

var container = W.add('panel {orientation: "column", alignChildren: ["fill","top"]}', undefined, '');

// intro container - width management
container.add( 'statictext', undefined,
' ---------------------------- Modules ---------------------------- ',
{readonly: true},
{justify: "center"});

var Controls = W.add('panel {orientation: "column", alignChildren: ["fill","fill"]}', undefined, '');
var typeOfAction = Controls.add('dropdownlist', undefined, ['Play action', 'Open files', 'Save Files', 'Add Condition']);

var desc_add_sub = Controls.add ('statictext', undefined, 'Controls:')

var scroll_up = Controls.add ('button', undefined, 'Scroll up' );
var scroll_down = Controls.add ('button', undefined, 'Scroll down' );

hr(Controls);

var addButton = Controls.add('button',undefined ,'+ Add module +' );
var subButton = Controls.add('button',undefined ,'- Substract module -' );

hr(Controls);

var refresh_button = Controls.add('button', undefined, 'Refresh');

//////////////// UI FUNCTIONS: ************************************************************ START

  ////////////// ON SHOW    ***********-------------------------

  container.onShow = function () {
    container.size.height = 10000;
  }

  ////////////// INTERACTIONS:

  var scrolling_treshold = 40;

  addButton.onClick = function () {
    all_references.push ( new Module ('Action') );
    updateUILayout (container);

    if (container.children.length > 11) {
      for (var i = 0; i < container.children.length; i++) {
        var t_sum = reCount_children_height(container) ;
        container.children[i].location.y = container.children[i].location.y - t_sum - container.children.length;
      }
    }

  }

  subButton.onClick = function () {
    // if any module is selected
    if (true) {

    }
  }

  function container_selection () {
    container.children[i].
  }

  scroll_up.onClick = function () {
    try {
      for (var i = 0; i < container.children.length; i++) {
        container.children[i].location.y = container.children[i].location.y + scrolling_treshold;
      }
    } catch (e) {    }
  }

  scroll_down.onClick = function () {
    try {
      for (var i = 0; i < container.children.length; i++) {
        container.children[i].location.y = container.children[i].location.y - scrolling_treshold;
      }
    } catch (e) {    }
  }

  refresh_button.onClick = function   () {
    refresh_indexes ();
  }

  ////////////// UI MISC FUNCTIONS ***********-------------------------

  function hr (parent_el) {
    parent_el.add('panel', undefined, '');
  }

  function updateUILayout(thing){
      thing.layout.layout(true);    //Update the layout
  }

  function reCount_children_height (parent_el) {
    try{
      var children_bounds = parseFloat(parent_el.children[1].size.height) * (parent_el.children.length-1);
      return children_bounds;
    } catch (e) {
      return 0;
    }
  }

  //////////////// UI FUNCTIONS: ************************************************************ END

////////////// set initial index of dropdowns:

var all_of_types_Arr = ['Action' , 'Opening' , 'Saving'];

var T_Action_Set, T_Action_List;

  /////////////////////// MAIN OBJECT constructor *********************** START

      // envoked with: new Module ( 'Action' ) || new Module ( 'Opening' ) || new Module ( 'Saving' )

      function Module(
        TYPE
      )  {


        this.type = TYPE;

        if (this.type === all_of_types_Arr[0]) { //is action type

          this.id = id; id++;
          this.reference = container.add('panel {orientation: "row", alignChildren: ["fill","top"]}', undefined, '');

          T_Checkbox = this.reference.add('checkbox', undefined, '');
          T_Checkbox.value = false;

          this.ind = this.reference.add('statictext', undefined, '' ,{readonly: true});
          this.reference.add('statictext', undefined, 'Play action' ,{readonly: true});


          T_Action_Set = this.reference.add('dropdownlist', undefined, '');
          T_Action_List = this.reference.add('dropdownlist', undefined, '');
          fill_dropdowns ( T_Action_Set, T_Action_List );

            T_Action_Set.selection = 0;
            T_Action_List.selection = 0;

          get_Index( this );

          //assign onChange callback
          Type_Action ( T_Action_Set, T_Action_List );

        } else if ( this.type === all_of_types_Arr[1] ) {  //is Opening type
          this.reference = container.add('panel {orientation: "row", alignChildren: ["left","top"]}', undefined, '');
          this.ind = this.reference.add('edittext', undefined, '' ,{readonly: true});


        }

      }

   /////////////////////// MAIN OBJECT constructor *********************** END

   /////////////////////// FUNCTIONS FOR MODULES *********************** START

   function get_Index ( MODULE )  {
     try {
       for (i = 0; i < container.children.length; i++){
         if (container.children[i] == MODULE.reference) {
           MODULE.ind.text = i;
           return;
         }
       }
       alert ("No idex found");
     } catch (variable) {   alert( variable)   } ;
   }

   function refresh_indexes () {
     for (var i = 0; i < all_references.length; i++) {
       get_Index(all_references[i]);
     }
   }

   /////////////////////// FUNCTIONS FOR MODULES *********************** END

   /////////////////////// TYPES of constructors *********************** START

   // ACTION TYPE:

    function Type_Action ( REFERENCE_SETS, REFERENCE_ACTIONS) {
      // handle (  REFERENCE   ) ;;;
      REFERENCE_SETS.onChange = function () {
        // alert( 'Reference function action asigned' );
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

    /////////////////////// TYPES of constructors *********************** END

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

    ////////////// FUNCTION FOR SCANNING ACTION SETS START **********

    function Action_Set (name) {
      this.name = name;
      this.actions_Arr = [];
    }

    function populate() {

      actions_set_array = getActionSets();

        for ( var i = 0; i < actions_set_array.length; i++ ) {

          all_action_sets[i] = new Action_Set (actions_set_array[i].toString() );

          aList = getActions(actions_set_array[i]);

          for (var j = 0; j < aList.length; j++) {
            all_action_sets[i].actions_Arr[j] = aList[j].toString() ;
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

    ////////////// FUNCTION FOR SCANNING ACTION SETS END **********


    // SHOW THE WINDOW
    W.show();
