# angular-dynamic
This is an experimental module that allows you to create an element whose structure is as dynamic as its content. It requires that you pass it an object with the following structure:

```javascript
var myStructure = {
	name: 'myUniqueStructureName',
	template: '<h1>Header!</h1><p>Model: {{model}}',
	style: 'h1 { color: #f00; }',
	controller: 'function($scope) { $scope.model = "This was my content: " + $scope.content.payload; }'
}

var myContent = {
	payload: "foobar";
}
```

Once you've done that, this:

```html
<dynamic structure="myStructure" content="myContent"></dynamic>
```

will automatically get compiled into this:

```html
<div ng:Controller="DynamicControllers.myUniqueStructureName">
	<style scoped>
		h1 { color: #f00; }
	</style>
	<h1>Header!</h1>
	<p>Model: foobar</p>
</div>
```

Due to the magic of databinding, if you change the 'style' property of myStructure then a new style will be applied reactively without changing anything else in your dynamic element. If you change the 'template' or 'controller' properties then you still get a reactive update but it will be forced to re-draw the state of the element. Depending on the complexity of your element this may or may not be desireable - if you're building a full-fledged mini app that maintains its own state just be aware that you'll lose the inner state if you update the template or controller.

Please note that for this to work a few things have to be true:
1.'myStructure' and 'myContent' are bound to objects on a parent controller's scope - this way, updates to these objects are captured and a rerender is forced.
2.I'm using the experimental scoped style. This is an HTML5 standard but is not implemented almost anywhere yet. It restricts the style provided to the element in which the style block is found, which is way useful. To enable styles, turn on the Experimental Webkit Features flag in chrome://flags
3.I am adding one object, DynamicControllers, to the global scope. I don't want to be doing this but I don't see any other way right now to bind a controller to a compiled element. It would be great if angular let us do something like $compile(myTemplate)(scope, controller) where if you pass a controller it'll automatically assign it as the controller for the top-level object in the provided template. That would be much cleaner.
4.Finally, right now I am using `new Function(myStructure.controller)` which is really just a wrapper for eval. This may raise some security concerns. I'd love to get some feedback on a safer way to do this.