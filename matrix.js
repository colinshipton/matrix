/**
 * When the DOM is loaded, attach click handlers to the add and edit buttons
 */
$().ready(function() { 
    $('#edit-add-rows, #edit-add-cols, .matrix-settings-edit a').bind('click', matrix_element_form); //bind events to clicks on the edit button and on the add button
});

/**
 * Respond to a click event from an add or edit button
 * @param e The event
 */
function matrix_element_form (e) {
  rc = matrix_find_rc(this); //work out if we are dealing with rows or columns (rc)
  mode = $("input[name='mode']:checked").val();

  //$('#matrix-'+ rc +'-throbber').html(''); //remove the form elements
  $('#matrix-'+ rc +'-throbber').load(Drupal.settings.basePath + "matrix/throbber", {'mode': mode,'rc': rc, 'element_type': $('.matrix-'+ rc +'#edit-element-type').val(), 'element_id': this.id.split('-')[3], 'field_name': $('#edit-field-name').val()}, function() { //retrieve the element form
    $('.matrix-'+ rc +'#edit-element-type').bind('change', matrix_element_form); //bind the change event to the element-type select box - This will trigger the AJAX call to populate the rest of the fom
    
    $('#edit-save').click(function(){ //when the save button is clicked
      rc = matrix_find_rc(this); //work out if we are dealing with rows or columns (rc)
      
      jQuery.getJSON(Drupal.settings.basePath + "matrix/throbber/save", //call the save callback
        {'rc': rc, //rows or columns
         'field_name': $('#edit-field-name').val(), //CCK field name
         'element_id': $('.matrix-'+ rc +'#edit-element-id').val(), //index of the row/column
         'element_type': $('.matrix-'+ rc +'#edit-element-type').val(), //pass in all the elements
         'title': $('.matrix-'+ rc +'#edit-title').val(),
         'options': $('.matrix-'+ rc +'#edit-options').val(),
         'size': $('.matrix-'+ rc +'#edit-size').val(),
         'required': $('.matrix-'+ rc +'#edit-required').attr("checked"),
         'initial': $('.matrix-'+ rc +'#edit-initial').attr("checked"),
         'calc_method': $('.matrix-'+ rc +'#edit-calc-method').val(),
        },
        function(res) { //after the element is saved rebuild the list of elements and the data form element
          $('#edit-'+ rc +'-list').html(res.list); //this is the list of elements
          $('#edit-'+ rc +'-data').val(res.data); //this is the serialized data which will eventually go back to the database
          $('#matrix-'+ rc +'-throbber').html(''); //remove the form elements
          $('.matrix-settings-edit a').bind('click', matrix_element_form); //rebind click events on th edit buttons
        });
      return false; //this prevents the save button from reloading the form
    });

    $('#edit-cancel').click(function(){ //when the cancel button is clicked
      $('#matrix-'+ rc +'-throbber').html(''); //just remove the form elements
      return false; //this prevents the cancel button from reloading the form
    });
    
    $('#edit-delete').click(function(){ //when the delete button is clicked
      rc = matrix_find_rc(this); //work out if we are dealing with rows or columns (rc)
      
      $('#matrix-'+ rc +'-throbber').load(Drupal.settings.basePath + "matrix/throbber/delete", {'rc': rc, 'element_id': $('.matrix-'+ rc +'#edit-element-id').val(), 'field_name': $('#edit-field-name').val()}, function() { //fetch the delete button
        $('#edit-delete-confirm').bind('click', function(){ //when the confirm button is pushed
          rc = matrix_find_rc(this); //work out if we are dealing with rows or columns (rc)
        
          jQuery.getJSON(Drupal.settings.basePath + "matrix/throbber/delete",
            {'confirm' : 'confirmed',
             'rc' : rc,
             'element_id': $('#edit-element-id').val(),
             'field_name': $('#edit-field-name').val()
            },
            function(res){ //delete the element
              $('#edit-'+ rc +'-list').html(res.list); //this is the list of elements
              $('#edit-'+ rc +'-data').val(res.data); //this is the serialized data which will eventually go back to the database
              $('.matrix-settings-edit a').bind('click', matrix_element_form); //rebind events
              $('#matrix-'+ rc +'-throbber').html('Component deleted'); //remove the form elements
            });
          return false; //this prevents the delete confirmation button from reloading the form
        });
        
        $('#edit-delete-cancel').bind('click', function(){ //when the cancel button is pushed
          $('#matrix-'+ rc +'-throbber').html('');
          return false; //this prevents the cancel from reloading the form
        });
        
      });
      return false; //this prevents the delete button from reloading the form
    });    
    
  });
  return false; //this prevents the add button from reloading the form
};

/**
 * Work out if the element in question is associated with rows or columns
 * This is done by analysing one of the classes attached to the DOM object
 *
 * @param that DOM object of the (clicked) element
 * @return either "rows" or "cols" as appropriate
 */
function matrix_find_rc(that) {
  classes = that.className.split(' ');
  for (i=0; i<classes.length; i++) {
    class_parts = classes[i].split('-');
    if (class_parts[0] == 'matrix' && (class_parts[1] == 'rows' || class_parts[1] == 'cols')) {
      return class_parts[1];
    }
  }
}