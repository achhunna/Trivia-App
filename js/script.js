//set default degree (360*5)
var degree = 1800;
//number of clicks = 0
var clicks = 0;
var previousTime = 0;
var selectedCategory = "";
var lastCategory = "";

$(document).ready(function(){

	/*WHEEL SPIN FUNCTION*/
	$("#spin").click(function(){

		//add 1 every click
		clicks ++;

		/*multiply the degree by number of clicks
	  generate random number between 1 - 360,
    then add to the new degree*/
		var newDegree = degree * clicks;
		var extraDegree = Math.floor(Math.random() * (360 - 1 + 1)) + 1;
		totalDegree = newDegree + extraDegree;

		/*let's make the spin btn to tilt every
		time the edge of the section hits
		the indicator*/
		$("#inner-wheel .sec").each(function(){
			var t = $(this);
			var noY = 0;

			var c = 0;
			var n = 700;
			var interval = setInterval(function () {
				c++;
				if (c === n) {
					clearInterval(interval);
				}

				var aoY = t.offset().top;
				//$("#txt").html(aoY);
				//console.log(aoY);

				/*23.7 is the minumum offset number that
				each section can get, in a 30 angle degree.
				So, if the offset reaches 23.7, then we know
				that it has a 30 degree angle and therefore,
				exactly aligned with the spin btn*/
				if(aoY < 123.89){
					$("#spin").addClass("spin");
					setTimeout(function () {
						$("#spin").removeClass("spin");
					}, 100);
					//console.log(t);
					selectedCategory = returnCategory(t.attr("id"));
					$("#categorySelected").html(selectedCategory);
					//selectedCategory = returnCategory("Movies");
				}
			}, 10);

			$("#inner-wheel").css({
				"transform" : "rotate(" + totalDegree + "deg)"
			});

			noY = t.offset().top;

		});

		//Executing after css animation ends
		$("#inner-wheel").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
			function(e){
				//Check eventTimeStamp to ensure new click
				if(e.timeStamp != previousTime){
					openScreen(selectedCategory);
					previousTime = e.timeStamp;
				}
		});
	});
	//Close screen when app loads
	closeScreen();
	/*
	$("a").click(function(){
		$(this).parent().addClass("answered");
		return;
	});*/
});

function returnCategory(category){
	var categories = ["Technology", "Geography", "EA", "Movies", "Science", "Music"];
	var index = categories.indexOf(category);

	if(index === 0){
		return categories[categories.length - 1];
	}else{
		return categories[index - 1];
	}
}

function closeScreen(){
	//Stop Timer if started
	var scope = angular.element($("#screen")).scope();
	scope.$apply(function(){
		scope.stop();
	});

	$("#screen").addClass("hideOverlay");
	$("#secondScreen").addClass("hideSecondScreen");
	return;
}

function openScreen(category){

	var scope = angular.element($("#screen")).scope();
	scope.$apply(function(){
		scope.retrieveQ(category);
	});

	//Add remove overlay background
	$("#screen").removeClass(lastCategory);
	$("#screen").addClass(category.toLowerCase());
	lastCategory = category.toLowerCase();

	//Default settings for answers
	$(".choice").removeClass("answered");
	$("#screen").removeClass("hideOverlay");

	return;
}

function openSecondScreen(){
	$("#screen").removeClass("hideOverlay");
	$("#secondScreen").removeClass("hideSecondScreen");
}