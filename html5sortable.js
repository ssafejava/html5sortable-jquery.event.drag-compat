/*
 * HTML5 Sortable jQuery Plugin
 * Based on
 * http://farhadi.ir/projects/html5sortable
 *
 * Modified for jquery.event.drag compatibility by Samuel Reed, 2013
 *
 * Copyright 2012, Ali Farhadi
 * Released under the MIT license.
 */
(function($) {
'use strict';

$.fn.sortable = function(options) {
  var method = String(options), previousEvent = {}, dragging;
  var defaults = {
    // Dragging mode - values: 'horizontal', 'vertical'
    mode: 'horizontal',
    // Default css props on items we're dragging
    draggingCSS: {
      'z-index': 100,
      position: 'absolute'
    }
  };
  options = $.extend(defaults, options);

  // Configure horizontal/vertical modes. Default is vertical.
  var props;
  if (options.mode === 'horizontal'){
    props = {offset: 'offsetX', dimension: 'width', position: 'left'};
  } else {
    props = {offset: 'offsetY', dimension: 'height', position: 'top'};
  }

  return this.each(function() {

    // Destroy?
    var items;
    if (/^enable|disable|destroy$/.test(method)) {
      // Enable/disable draggable attr. If draggable is false, the item won't move.
      items = $(this).children($(this).data('items')).attr('draggable', method == 'enable');
      // Not really sure if this works with $.event.drag plugin
      if (method == 'destroy') {
        items.add(this).removeData('items')
          .off('.sortable');
        $(this).find('.sortable-placeholder').remove();
      }
      return;
    }

    // Store some refs
    var startIndex, parent = $(this), parentOffset = parent.offset(), originalStyle;
    items = $(this).children(options.items);

    // Create placeholder
    var placeholder = $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder">');

    // Cache items config so we can remove draggability later on
    $(this).data('items', options.items);

    // Configure items!
    items.attr('draggable', 'true')
    // Start dragging
    .drag('start.sortable', function(e, dd) {
      if ($(this).attr('draggable') != 'true') return; // allows 'disable' to work.
      // Cache ref for speed.
      dragging = $(this);
      startIndex = dragging.index();
      
      // Trigger events
      parent.trigger('sortstart', {item: dragging});

      // Take this item out the flow (pos:a) and position it.
      var originalStyle = dragging.attr('style');
      var cssProps = $.extend({}, options.draggingCSS);
      cssProps[props.position] = dd[props.offset] - parentOffset[props.position];
      cssProps.width = dragging.width() + 'px'; // ensure width (block lvl element)
      dragging.addClass('sortable-dragging').css(cssProps);

      // Add placeholder (fills this element's space)
      if (options.forcePlaceholderSize) {
        placeholder.height(dragging.outerHeight());
        placeholder.width(dragging.outerWidth());
      }
      dragging.before(placeholder);
    })
    // Drag continuation (swapping)
    .drag('.sortable', function(e, dd) {
      dragging = $(this);

      // Move this item
      var cssProps = $.extend({}, options.draggingCSS);
      cssProps[props.position] = dd[props.offset] - parentOffset[props.position];
      dragging.addClass('sortable-dragging').css(cssProps);

      // Check for duplicate drag events (speed)
      if (previousEvent[props.offset] == dd[props.offset]) return;
      previousEvent[props.offset] = dd[props.offset];

      // Look through items to find the right place to put the placeholder.
      var thisOffset, thisDimension, draggingDimension = dragging[props.dimension]();
      items.add(placeholder).not(this).each(function(){
        // Cache offset & width.
        thisOffset = $(this).offset()[props.position], thisDimension = $(this)[props.dimension]();

        // Check if we're between the bounds of an item.
        if (thisOffset < dd[props.offset] && thisOffset + thisDimension > dd[props.offset]){
          // If we're over our placeholder, do nothing & exit each.
          if (placeholder.is(this)) return false;

          // Dead zone config - needed when the item we're over is wider than what we're dragging
          if (thisDimension > draggingDimension) {
            // Dead zone?
            var deadZone = thisDimension - draggingDimension;
            if (placeholder.index() < $(this).index() && dd[props.offset] < thisOffset + deadZone) return false;
            else if (placeholder.index() > $(this).index() && dd[props.offset] > thisOffset + thisDimension - deadZone) return false;
          }

          // Swap
          $(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
          return false; // exits jQuery.each
        }
      });
    })
    // End dragging
    .drag('end.sortable', function(e, dd) {
      dragging = $(this);

      // Trigger events
      parent.trigger('sortend', {item: dragging});

      // Insert item into correct position.
      placeholder.before(dragging).detach();
      dragging
        .removeClass('sortable-dragging')
        .css({left: '', 'z-index': '', position: '', top: '', width: ''})
        .attr('style', originalStyle);

      // Trigger sortupdate, if it occurred.
      if (startIndex != dragging.index()) {
        parent.trigger('sortupdate', {item: dragging});
      }
    });
  });
};
})(jQuery);
