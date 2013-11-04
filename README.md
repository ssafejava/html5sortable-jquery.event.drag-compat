HTML5Sortable-jquery.event.drag-compat
======================================

Simple fork of [html5sortable](https://github.com/farhadi/html5sortable) that adds compatibility
with jquery.event.drag, which unfortunately completely hijacks drag events and breaks the original plugin.

This is a limited port and does not contain some of the same features (`connectWith`, etc.). It was enough for my needs.

See [html5sortable](https://github.com/farhadi/html5sortable) or the source for more information.


Usage
-----

```javascript
$('.sortableParentWithChildren').sortable({
  forcePlaceholderSize: false,
  items: '',
  mode: 'horizontal'
})
```

Options
-------

```
mode: String (options: 'horizontal', 'vertical'; default: 'horizontal')
items: String (selector to filter children, e.g. ':not(.disabled)')
forcePlaceholderSize: Boolean (forces placeholder width & height to be identical to item being dragged, default: false)
```

Events
------

`sortstart`, `sortend`, `sortupdate` (only fired on a sort change)


License
-------

MIT