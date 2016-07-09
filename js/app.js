var trivia = angular.module("trivia", []);

//Create factory for common app functions
trivia.factory("$myService", function(){
	return{
		scramble: function(array){
			var length = array.length;
			var scrambledArray = [];
			var randomIndex = 0;
			for(i=0; i<length; i++){
				randomIndex = Math.floor(Math.random()*array.length);
				//console.log(randomIndex);
				scrambledArray[i] = array[randomIndex];
				array.splice(randomIndex,1);
			}
			return scrambledArray;
		},

	};
});

trivia.controller("screenController", function($scope, $http, $timeout, $interval, $myService){

	var url = "js/qna.json";
	var counter = 0;
	var stopWatch;
	$scope.triviaData = [];
	$scope.response = {};

	$http.get(url)
		.success(function(data){
			$scope.data = $myService.scramble(data);
			//console.log($scope.data.length);
			//$scope.data = data;
			//$scope.triviaData = data[Math.floor(Math.random()*data.length)];
		})
		.error(function(err){
			console.log(err);
		});

	//Start Timer
	$scope.reset = function(){
		counter = 10;
	}
	$scope.start = function(){

		$scope.response = {};

		stopWatch = $interval(function(){
			$scope.response = {
				message: counter,
				symbol: "",
				class: "",
			};
			if(counter === 0){
				$scope.stop();
				//Show for 2 secs, before closing screen
				$timeout(function(){
					closeScreen();
				}, 2000)
				$scope.response = {
					message: "Time",
					symbol: "!",
					class: "wrong",
				};
			}
			counter -= 1;
		},1000);
	};

	//Stop Timer
	$scope.stop = function(){
		if(angular.isDefined(stopWatch)){
			$interval.cancel(stopWatch);
			stopWatch = undefined;
		}
	};

	$scope.retrieveQ = function(category){
		//console.log(category);
		var loopBreak = false;
		$scope.reset();
		$scope.start();

		angular.forEach($scope.data, function(v, k){
			if(!loopBreak){
				if(v["category"] === category){
					$scope.triviaData = v;
					$scope.data.splice(k, 1);
					//prevId = $scope.triviaData["id"];
					loopBreak = true;
				}
			}
		});

	};

	$scope.checkAnswer = function(answer, option){
		$scope.stop();
		if(answer === option){
			//Show for 2 secs, before closing screen
			$timeout(function(){
				closeScreen();
			}, 2000)
			$timeout(function(){
				$scope.response = {
						message: "Right",
						symbol: "!",
						class: "right",
				};
			}, 500)
			$scope.response = {};
		}else{
			$timeout(function(){
				$scope.response = {
						message: "Wrong",
						symbol: "",
						class: "wrong",
				};
			}, 500)
			$scope.response = {};
		}
	};


});
