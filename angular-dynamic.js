var DynamicControllers = {

};

angular.module("angular-dynamic", []).directive("dynamic", function ($compile) {
	return {
		restrict: "E",
		scope: {
			structure: "=",
			content: "="
		},
		template: '<div class="dynamic-component"></div>',
		replace: true,
		link: function(scope, element) {
			var getController = function() { return new Function("return " + scope.structure.controller)(); };
			// note this is built to use Scoped styles, which are not enabled by default yet on most browsers. Turn on experimental webkit features in chrome://flags to use this.
			var getStyleBlock = function() { return "<style scoped>" + scope.structure.style + "</style"; };

			scope.$watch("structure", function() {
				if (scope.structure) {
					scope.$watch("structure.style", publishStyle);
					scope.$watch("structure.template", publishTemplate);
					scope.$watch("structure.controller", publishEverything);
				}
			});

			var controllerReady = false;
			function publishEverything() {
				if (!scope.structure) {
					return;
				}

				DynamicControllers[scope.structure.name] = getController();

				controllerReady = true;
				publishTemplate();
			}

			var templateReady = false;
			function publishTemplate() {
				if (!controllerReady) {
					publishEverything();
					return;
				}

				element.children().remove();
				var elementString = "<div ng-controller='DynamicControllers." + scope.structure.name + "'>" + scope.structure.template + "</div>";
				element.append($compile(elementString)(scope));
				templateReady = true;
				publishStyle();
			}

			function publishStyle() {
				if (!templateReady) {
					publishTemplate();
					return;
				}

				element.find("style").remove();
				element.append(getStyleBlock());
			}
		}
	};
});