var trivia = angular.module("trivia", []);

trivia.controller("screenController", function($scope, $http, $timeout, $interval){

	var url = "js/qna.json";
	var counter = 0;
	var stopWatch;
	$scope.triviaData = [];
	$scope.response = {};

	$http.get(url)
		.success(function(data){
			$scope.data = data;
			//$scope.triviaData = data[Math.floor(Math.random()*data.length)];
		})
		.error(function(err){
			console.log(err);
		});

	//Start Timer
	$scope.reset = function(){
		counter = 20;
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
