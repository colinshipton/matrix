<?php
// $Id$

/**
* @file
* Views hooks implemented for the Matrix module.
*/

/**
 * Implementation of hook_views_data()
 */
function matrix_views_data() {
  foreach (content_fields() as $field) {
    if ($field['type'] == 'matrix') {
      $data['node_data_'. $field['field_name']] = array(
        'table' => array(
          'group' => 'Content',
          'join' => array(
            'node' => array(
              'table' => 'content_type_'. $field['type_name'], //need to auto this
              'left_field' => 'vid',
              'field' => 'vid',
            ),
          ),
        ),
        $field['field_name'] .'_value' => array(
          'field' => array(
            'title' => $field['widget']['label'] .' ('. $field['field_name'] .')',
            'help' => t('Matrix - Appears in: %type_name', array('%type_name' => $field['type_name'])),//auto this
            'handler' => 'matrix_handler_field',
            'content_field_name' => $field['field_name'],
          ),
        ),
      );
    }
  }
  return $data;
}

/**
 * Implementation of hook_views_handlers().
 */
function matrix_views_handlers() {
  return array(
    'info' => array(
      'path' => drupal_get_path('module', 'matrix'),
    ),
    'handlers' => array(
      'matrix_handler_field' => array(
        'parent' => 'views_handler_field',
        'file' => 'matrix_handler_field.inc',
      ),
    ),
  );
}