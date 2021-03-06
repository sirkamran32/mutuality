
(function($) {
   /* Begin Meet People Carousel Code */
   var _center = { scale: 1, left:0, marginTop: 0, left: -20, opacity: 1 	};
   var _left   = { scale: .85, marginTop: 10, left: 152, opacity: 0.3 };
   var _right  = { scale: .85, left: -206, marginTop: 10, opacity: 0.3 };
   var _blur   = { filter : 'blur(3px)', webkitFilter: 'blur(3px)', mozFilter : 'blur(3px)', filter: 'url({{ MEDIA_URL }}/stylesheets/blur.svg#blur)' };	
   var _noblur = { filter: 'none', webkitFilter: 'none', mozFilter: 'none' }

   var MAX_CAROUSEL_NUM = 100;

	var initCarousel = function () {

		// Add some dummy elements if the carousel has < 3 elements
	 	var len = $('#meet-profiles li').length;
		var tmpl = '<li class="meet-profile">\
					<a href="#" class="loaded">\
					<img src="" />\
					<span class="match-profile-details">\
					</span>\
					</a>\
					</li>';
	
		if(len == 3) {
			$('#meet-profiles').prepend($(tmpl));
		}
		else if((len < 3 && len !== 1))
		{
		  $('#meet-profiles').prepend($(tmpl)).append($(tmpl));
	  	}	

	  	// Do the initializtion of the carousel 	
		$('#meet-profiles').carouFredSel({
			auto : false,
			width: 695,
			height: 400,
			/*circular: false,
   			infinite: false,*/
			width   : "100%",
			align: 'center',
			prev: { button: "#page-prev" },
			next: { button: "#page-next" },
			items: {
				visible: 3,
				width: 350
			},
			scroll: {
				items: 1,
				duration: 400,
				onBefore: function( data ) {						
								
					if (data.items.visible.prevObject.length > 3) {
		            	// hide the text for blurred results
			            $('.match-profile-details', data.items.visible.eq( 0 )).hide();
			            $('.match-profile-details', data.items.visible.eq( 2 )).hide();            

		            	// move visible items into position
						data.items.visible.eq( 0 ).animate(_left, function(){
						   $('img', data.items.visible.eq( 0 )).css(_blur);
						});
						data.items.visible.eq( 1 ).animate(_center, 300);
						data.items.visible.eq( 2 ).animate(_right, function(){
						   $('img', data.items.visible.eq( 2 )).css(_blur);
						});

		            	// reset z-indexes for smooth scrolling
						setTimeout(function() {
							data.items.visible.eq( 0 ).css({ zIndex: 2 });
							data.items.visible.eq( 0 ).removeAttr('focused');
							data.items.visible.eq( 1 ).css({ zIndex: 3 });
							data.items.visible.eq( 1 ).attr('focused', 'true');
							data.items.visible.eq( 2 ).css({ zIndex: 2 });
							data.items.visible.eq( 2 ).removeAttr('focused');
						}, 10);
					}

					// If you are at the front of the list, do not show previous button
					/*var pos = $("#meet-profiles").triggerHandler("currentPosition");
					console.log(pos);
					if (pos === 1){
						$("#page-prev").hide();
						setTimeout(function(){
							var items = $("#meet-profiles").triggerHandler("currentVisible");
							items.prevObject.eq(0).css({ opacity: 0 });
							console.log(items.prevObject.eq(0).css('opacity'));
						}, 200);
						
					} else {
						$("#page-prev").show();
					}

					if (pos === (data.items.visible.prevObject.length - 3)){
						$("#page-next").hide();
						setTimeout(function(){
							var items = $("#meet-profiles").triggerHandler("currentVisible");
							console.log(items);
							items.prevObject.eq(3).css({ opacity: 0 });
							console.log(items.prevObject.eq(3).css('opacity'));
						}, 10);
						
					} else {
						$("#page-next").show();
					}*/

				},
				onAfter:function( data ) {
				   $('img', data.items.visible.eq( 1 )).css(_noblur);		
				   $('.match-profile-details', data.items.visible.eq( 1 )).fadeIn();
   					// Everytime we scroll the carousel- load data into cache	
			        for(i=0; i<5&&i<data.items.visible.prevObject.length; i++){
			        	var fbID = $(data.items.visible.prevObject[i]).attr("facebookid");
			        	if(fbID){
				        	if(!Mutuality.mpcache.profileCacheData[fbID]){
								fbID = $(data.items.visible.prevObject[i]).attr("facebookid");
								//console.log("Calls made for " + fbID);
								asyncCacheCalls(fbID);
							}
						}
			        }	   
			   }
			}
		});
	}

	var asyncCacheCalls = function(fbID){
		Mutuality.getMeetPeopleProfile(fbID, function(extendedProfile){
			Mutuality.getMutualFriendList(fbID, function(mutualFriends){
				loadMeetPeopleProfileInfoToCache(fbID, mutualFriends, extendedProfile);
				hideModal();
			});
		});
	}

	var initAskAboutCarousel = function () {
		$('#ask-about').carouFredSel({
			auto : false,
			width: 213,
			height: 80,
			prev: "#ask-prev",
			next: "#ask-next",
			items: {
				visible: 1
			},
			scroll: {
				fx: 'fade',
				items: 1
			}
		});
	};

	var initAskAboutCarouselModal = function () {
		$('.ask-about-modal').carouFredSel({
			auto : false,
			width: 213,
			height: 120,
			prev: "#ask-prev-modal",
			next: "#ask-next-modal",
			items: {
				visible: 1
			},
			scroll: {
				fx: 'fade',
				items: 1
			}
		});
	};
	// Make sure that when you are scrolling with the keyboard, it's like you're clicking next/prev
	$("body").keydown(function (e){ 
	    if(e.keyCode == 37 || e.which == 37) // left arrow
	    {
	    	if($('#page-prev').is(":visible")){
	        	$('#page-prev').click();
	    	}
	    }
	    else if(e.keyCode == 39 || e.which == 39)    // right arrow
	    { 
	        if($('#page-next').is(":visible")){
	        	$('#page-next').click();
	    	}
	    }
	});

	// re-adjust width - think it is a border-box issue
	var wid = $('#meet-profiles').outerWidth() + ($('#meet-profiles li').length * 30);
	$('#meet-profiles').css({visibility:'visible',width: wid});
	$('#meet-profiles li').css({position:'relative'});
	
   $('.match-profile-details', $('#meet-profiles').children().eq( 0 )).hide();
   $('.match-profile-details', $('#meet-profiles').children().eq( 2 )).hide();	
	
   $('img', $('#meet-profiles').children().eq( 0 )).css(_blur);
   $('img', $('#meet-profiles').children().eq( 2 )).css(_blur);
   
	$('#meet-profiles').children().scale(.85);
	$('#meet-profiles').children().eq( 0 ).css(_left).scale(0.85).css({ zIndex: 2 });
	$('#meet-profiles').children().eq( 1 ).css(_center).scale(1.0).css({ zIndex: 3 });
	$('#meet-profiles').children().eq( 2 ).css(_right).scale(0.85).css({ zIndex: 2 });
/* End Meet People Carousel Code */
/* Begin Event Code */

	// $("#introduce").click(function(){
	//     	$('#page-next').hide();
	//     	$('#page-prev').hide();
	// 		setTimeout(function(){initAskAboutCarouselModal();}, 100);
	// });

	// When you click next, set the current person
	$('#page-next').click(function(){
		// Hide the profile stats and mutual friends divs while new data being fetched
		$('#ask-about').html("");
		$('.ask-about-modal').html("");
		setCurrentPerson();
		var friendCount = $('.friend-count').html();
		if (friendCount === "0") {
			$('#refresh-reminder').slideDown();
		}
		mixpanel.track("Next-Prev",{"Button":"Next"});
	});

	// When you click previous, set the current person as well
	$('#page-prev').click(function(){
		// Hide the profile stats and mutual friends divs while new data being fetched
		$('#ask-about').html("");
		$('.ask-about-modal').html("");
		setCurrentPerson();
		mixpanel.track("Next-Prev",{"Button":"Prev"});
	});

	// When the fav filter is selected, load the favorites into the UI
	$('#fav-filter').bind('change', function(e){
		Mutuality.mpcache.viewedCacheData = {};

		mixpanel.track("Change filter",{'Filter':$('#fav-filter').val()});

		//Reset the modal if it has changed
		$("#modalClose").trigger("click");

		if ($('#fav-filter').val() == "Favorites"){
			$(".friend-count").hide();
			triggerModal("myModalLoading");    		
			Mutuality.getMeetPeople("FAVORITES", function(favorites){
				if(favorites.potentialMatches.length > 0) {
    				Mutuality.mpcache.fofList = favorites.potentialMatches;
    				createMutualityUserLookUp(favorites.potentialMatches);
    				meetPeopleSuccess(favorites.potentialMatches);
    			}
    			else {
    				setModalWhenError("Sorry, but you have no favorites!");
    				setModalBack();
    			}
    		});
    	} else if ($('#fav-filter').val() == "Viewed") {
			$(".friend-count").hide();
		    triggerModal("myModalLoading");
    		Mutuality.getMeetPeople("VIEWED", function(viewedUsers){
				if(viewedUsers.potentialMatches.length > 0) {
    				Mutuality.mpcache.fofList = viewedUsers.potentialMatches;
    				createMutualityUserLookUp(viewedUsers.potentialMatches);
    				meetPeopleSuccess(viewedUsers.potentialMatches);
    			}
    			else {
    				setModalWhenError("Sorry, but it seems like you haven't viewed anyone yet!");
    				setModalBack();
    			}    		
    		});
    	}
    	else if ($('#fav-filter').val() == "Dating") {
    		triggerModal("myModal");
    		Mutuality.getMeetPeople("DATING", function(datingFriends){
				if(datingFriends.potentialMatches.length > 0) {
    				Mutuality.mpcache.fofList = datingFriends.potentialMatches;
    				createMutualityUserLookUp(datingFriends.potentialMatches);
    				meetPeopleSuccess(datingFriends.potentialMatches);
    			}
    			else {
    				setModalWhenError("Sorry, but we didn't find anyone!");
    				setModalBack();
    			}
    		});
    	}
        else if ($('#fav-filter').val() == "Beacon") {
    		triggerModal("myModal");
    		Mutuality.getMeetPeople("BEACON_USERS", function(mutualityFriends){
				if(mutualityFriends.potentialMatches.length > 0) {
    				Mutuality.mpcache.fofList = mutualityFriends.potentialMatches;
    				createMutualityUserLookUp(mutualityFriends.potentialMatches);
    				meetPeopleSuccess(mutualityFriends.potentialMatches);
    			}
    			else {
    				setModalWhenError("Sorry, but we didn't find anyone!");
    				setModalBack();
    			}
    		});
    	}
    	else{
    		triggerModal("myModal");
    		Mutuality.getMeetPeople("FRIENDSHIP", function(meetPeopleList) {
    			if(meetPeopleList.potentialMatches.length > 0) {
    				Mutuality.mpcache.fofList = meetPeopleList.potentialMatches;
                    createMutualityUserLookUp(meetPeopleList.potentialMatches);
                    meetPeopleSuccess(meetPeopleList.potentialMatches);
    			}
    			else {
    				setModalWhenError("Sorry, but we didn't find anyone!");
    				setModalBack();
    			}
    		});
    	}
	});

/* End Event Code */
/* Begin Helper functions */

function countDown(end, cur){
        container = $("#timer");
        endDate = new Date(end);
        curDate = new Date(cur);

        context = this;

        var twoDigitConversion = function(n) {
        	return ("0" + n).slice(-2);
        }

		var formatResults = function(day, hour, minute, second){
		    
		    var displayString = twoDigitConversion(hour) + ":" + twoDigitConversion(minute) +":" + twoDigitConversion(second);
		    return displayString;
		}

		var update = function(){
		    context.curDate.setSeconds(context.curDate.getSeconds()+1);
		    var timediff = (context.endDate-context.curDate)/1000; 

		    // Check if timer expired:
		     if (timediff<0){ 
		        var timerValueZero = formatResults(0,0,0,0);
		        $('#timer').html(timerValueZero);
		    }

		    var oneMinute=60; //minute unit in seconds
		    var oneHour=60*60; //hour unit in seconds
		    var oneDay=60*60*24; //day unit in seconds

		    var dayfield=Math.floor(timediff/oneDay);
		    var hourfield=Math.floor((timediff-dayfield*oneDay)/oneHour);
		    var minutefield=Math.floor((timediff-dayfield*oneDay-hourfield*oneHour)/oneMinute);
		    var secondfield=Math.floor((timediff-dayfield*oneDay-hourfield*oneHour-minutefield*oneMinute));

		   var timerValue = formatResults(dayfield, hourfield, minutefield, secondfield);
		   $('#timer').html(timerValue);

		    // Call recursively
		    setTimeout(update, 1000);
		};

	// Call the recursive loop
	update();

}

function beginBeaconImageHoverToggle() {

    var autoToggle = true;
    var $togglers = $('.adjustBeaconImage');

    var tid_1,
        tid_2 = setTimeout(function() {
        clearInterval(tid_1);
        $togglers.removeClass('hovered');
        autoToggle = false;
    }, 30000); // stop toggling after 30 seconds

    $togglers.hover(function() {
        clearInterval(tid_1);
        $togglers.removeClass('hovered');
        $(this).addClass('hovered');
    }, function() {
        if(autoToggle) {
            $('.adjustBeaconImage').removeClass('hovered');
            $('.adjustBeaconImage').addClass('hovered');
            tid_1 = setInterval(function() {
                $togglers.toggleClass('hovered');
            }, 2000);
        }
        else {
            $togglers.removeClass('hovered');
        }
    }).triggerHandler('mouseout');
}

	function addFriendPicturesForLoadingAnimations(friends) {
        friends.sort(function() { return 0.5 - Math.random();}) // shuffle the array
        $('#analyzeModal img').each(function(i) {
            $(this).attr('src', Mutuality.getProfilePictureURL(friends[i].facebookID, 200, 200));
        });
    }

	var setFriendCountStyle = function () {
		var currentVal = $('.friend-count').html();
		if (currentVal <= 10) {
			$('.friend-count').removeAttr('id');
			$('.friend-count').attr('id','single-digit');
		} else {
			$('.friend-count').removeAttr('id');
			$('.friend-count').attr('id','double-digit');
		}
	}

	var triggerModal = function(id){
	   $("#page-next").hide();
	   $("#page-prev").hide();
   	   $("#trigger" + id).trigger('click');
	}

	var hideModal = function(){
	   $("#page-next").show();
	   $("#page-prev").show();
   	   $(".close-reveal-modal").trigger('click');
	}

	var hasLikedBeacon = function (likesArray, success) {
		var response = false;
		for (i = 0; i < likesArray.length; i++) {
			//console.log(likesArray[i].facebookID);
			//console.log(Mutuality.token);
			if (likesArray[i].facebookID === Mutuality.token) {
				response = true;
				break;
			}
		}	
		success(response);
	}
	var likeTextLoad = function(fbID, likeNumber) {
			// $('#hasLiked').html("").hide();
			// $('#beacon-like-number').html("").hide();
			// $('#plural-agreement').html("").hide();
			hasLikedBeacon(likeNumber, function(beaconLiked){
				//console.log(likeNumber);
				var numberOfLikes = likeNumber.length;
				//console.log(beaconLiked);
				//console.log(numberOfLikes);
				if (beaconLiked === true) {
					$('#animate-out').hide();
					if (numberOfLikes === 1) {
						//console.log("I liked and one like")
						$('#hasLiked').html("You liked this").show();
						$('#beacon-like-number').html("").hide();
						$('#plural-agreement').html("").hide();
					} else if (numberOfLikes === 2) {
						//console.log("I liked and two likes")
						var numberOfOtherLikes = numberOfLikes - 1;
						$("#like-number").show();
						$('#hasLiked').html("You and").show();
						$('#beacon-like-number').html(numberOfOtherLikes).show();
						$('#plural-agreement').html("person like this").show();
					} else {
						//console.log("I liked and more than two likes")
						numberOfOtherLikes = numberOfLikes - 1;
						$("#like-number").show();
						$('#hasLiked').html("You and").show();
						$('#beacon-like-number').html(numberOfOtherLikes).show();
						$('#plural-agreement').html("people like this").show();
					}	
				} else {
					$('#animate-out').show();
					$('#hasLiked').hide();
					if (numberOfLikes === 0) {
						$('#like-number').hide();
					} else if (numberOfLikes === 1) {
						$('#beacon-like-number').html(numberOfLikes).show();
						$('#plural-agreement').html("person likes this").show();
					} else {
						$('#beacon-like-number').html(numberOfLikes).show();
						$('#plural-agreement').html("people like this").show();	
					}
				}
			});
					
	}

	var loadBeacon = function(fbID){
		Mutuality.getBeacon(fbID, function(success){
			var beaconObject = success.beacon;
			var likesArray = success.beaconLikes;
            if (beaconObject == '[]' || beaconObject.length === 0){
                $("#beaconWrapper").hide();
                beaconExists = "False";
            }
            else {
                var activity = beaconObject.activity;
                var place = beaconObject.place;
                beaconExists = "True";
                $('#activity').html(activity);
                $('#place').html(place);
                $('#adjustBeaconTitle').show();
                $("#beaconWrapper").show();
                likeTextLoad(fbID, likesArray);

                // hasLikedBeacon(likesArray, function(success) {
                //     if(success===true) {
                //     	$('#animate-out').hide();
                //     }
                // });
                //     var likeNumber = likesArray.length;
                //     if (likeNumber === 0) {
                //         $('#like-number').hide();
                //     } else {
                //     $('#beacon-like-number').html(likeNumber);
                //         if (likeNumber===1) {
                //             $('#plural-agreement').html("person likes this");
                //         } else {
                //         	$('#plural-agreement').html("people like this");
                //         }
                //     }
                // $('#adjustBeaconTitle').show();
                // $("#beaconWrapper").show();
                // likeTextLoad(fbID);
            }
        mixpanel.track ("Person loaded", {
	                    "User": Mutuality.cache.mutualityUserLookup[Mutuality.mpcache.current],
	                    "Beacon": beaconExists
	                });    
        });
	}	

	// Find out which person is currently focused and get their details
	var setCurrentPerson = function (){
		setTimeout(function (){

			var curVisible = $("#meet-profiles").triggerHandler('currentVisible');
			var currentlyFocusedElem = null;

			if (curVisible.length < 3){
				currentlyFocusedElem = $(curVisible.prevObject[0]);
			}
			else{
		    	$('#meet-profiles li').each(function(){
		    		if($(this).attr("focused") == "true"){
		    			currentlyFocusedElem = $(this);
		    		}
		    	});
	    	}

	    	Mutuality.mpcache.current = currentlyFocusedElem.attr("facebookID");
	    	//console.log("Current Person: "+currentlyFocusedElem.attr("facebookID"));

			$('.adjustBeaconImage').attr('src', Mutuality.getProfilePictureURL(Mutuality.mpcache.current, 100, 100));

	    	// Check to make sure that we have an id that's defined
			if(Mutuality.mpcache.current){
				$('.loaded').append('<img id="mutuality-badge" src="http://www.mymutuality.com/images/Mutuality-Badge.png"/>');		
		    	if(Mutuality.cache.mutualityUserLookup[Mutuality.mpcache.current] === false){
		    		//$("#introduce").html('<a href="#" class="get-intro-adjust button" data-reveal-id="myModalIntroduce"><i></i>View on Facebook</a>');
		    		var firstName = Mutuality.getFriendOfFriendProfile(Mutuality.mpcache.current).name.split(" ")[0]
		    		var fbButtonMessage = firstName + "'s Profile";
		    		$("#introduce").html('<a href="#" class="facebook-adjust button"><i></i>' + fbButtonMessage + '</a>').show();
		    		$("#introduce a").attr('onclick', Mutuality.getFacebookPageURL(Mutuality.mpcache.current));
		    		$('img#mutuality-badge').hide();
		    		//$('div#beacon').hide();
                    $("#beaconWrapper").hide();
                    $('#introduce').show();
                    mixpanel.track ("Person loaded", {
                    "User": Mutuality.cache.mutualityUserLookup[Mutuality.mpcache.current],
                    "Beacon": "False"
                	});

		    	}
		    	else {
		    		var url = "/messages?fbid=" + Mutuality.mpcache.current + "&name=" + currentlyFocusedElem.text();
		    		$("#introduce").html('<a href="'+url+'" id="intro-yourself" class="button"><i class="intro-yourself"></i>Send Message</a>').show();   		
		    		$('.meet-profile').eq(1).find('#mutuality-badge').show();
		    		$('.meet-profile').eq(2).find('#mutuality-badge').hide();
		    		loadBeacon(Mutuality.mpcache.current);
		    		//$('div#beacon').show();
                    //$("#beaconWrapper").show();

		    //		$('.match-profile-details').attr('id', 'mutuality-profile-span');
		    //		$('#left-profile-name').attr('id', 'mutuality-profile-text');
		    	}

		    	if($('#fav-filter').val() == "Dating"){
		    		//console.log(Mutuality.mpcache.profileCacheData);	    	
		    		Mutuality.setUserViewed(Mutuality.mpcache.current, function(success){
		    			//console.log("set viewed = " + success );
		    			var curProf = Mutuality.getFriendOfFriendProfile(Mutuality.mpcache.current);
	    				var currentCount = parseInt($(".friend-count").html());
	    				if(currentCount !== 0){$(".friend-count").show();}

		    			if(!Mutuality.mpcache.viewedCacheData[Mutuality.mpcache.current] && curProf.hasBeenViewed == false){
		    				if(currentCount == 1){
			    					$('#refresh-reminder').slideDown();
			    					//triggerModal("myModalViewed");
			    					$(".friend-count").hide();
		    				}
		    				setFriendCountStyle();
		    				if(currentCount > 0){
		    					newCount = currentCount-1;
		    					$(".friend-count").html(newCount);
		    					if(newCount == 0){
		    						$(".friend-count").hide();
		    					}		    				
		    				}
		    			}
		    			Mutuality.mpcache.viewedCacheData[Mutuality.mpcache.current] = true;
		    			/*if(Object.keys(Mutuality.mpcache.viewedCacheData).length == Mutuality.mpcache.datingList.length){
		    				//alert("viewed everyone");
		    				triggerModal("myModalViewed");
							Mutuality.mpcache.viewedCacheData = {};
		    			}*/
		    		});
	    		}

	    		if($('#fav-filter').val() == "All"){
		    		//console.log(Mutuality.mpcache.profileCacheData);	    	
		    		Mutuality.setUserViewed(Mutuality.mpcache.current, function(success){
		    			//console.log("set viewed = " + success );
		    			var curProf = Mutuality.getFriendOfFriendProfile(Mutuality.mpcache.current);
	    				var currentCount = parseInt($(".friend-count").html());
	    				if(currentCount !== 0){$(".friend-count").show();}

		    			if(!Mutuality.mpcache.viewedCacheData[Mutuality.mpcache.current] && curProf.hasBeenViewed == false){
		    				//console.log(currentCount);
		    				if(currentCount == 1){
		    					$('#refresh-reminder').slideDown();
		    					//triggerModal("myModalViewed");
		    				}
		    				setFriendCountStyle();
		    				if(currentCount > 0){
		    					newCount = currentCount-1;
		    					$(".friend-count").html(newCount);
		    					if(newCount == 0){
		    						$(".friend-count").hide();
		    					}
		    				}
		    			}

		    			Mutuality.mpcache.viewedCacheData[Mutuality.mpcache.current] = true;
		    			/*if(Object.keys(Mutuality.mpcache.viewedCacheData).length == Mutuality.mpcache.fofList.length){
		    				//alert("viewed everyone");
		    				triggerModal("myModalViewed");
							Mutuality.mpcache.viewedCacheData = {};
		    			}*/
		    		});
	    		}

		    	if(Mutuality.mpcache.profileCacheData[Mutuality.mpcache.current]) {
		    		// Cache hit, so load directly from cache!
		    		// console.log("cache hit!")
		    		loadMutualFriendsIntoUI(Mutuality.mpcache.current, Mutuality.mpcache.profileCacheData[Mutuality.mpcache.current].mutualFriends);
					loadProfileInfoIntoUI(Mutuality.mpcache.current, Mutuality.mpcache.profileCacheData[Mutuality.mpcache.current].extendedProfile);
		    	}
		    	else {
		    		// Cache miss
		    		// Go fetch the data, and store it in the cache, then load into UI from cache
		    		// console.log("cache miss.")
		    		$('#page-next').hide();
		    		$('#page-prev').hide();
					setTimeout(function (){
						fetchMeetPeopleProfileInfo(Mutuality.mpcache.current);
					}, 130);

		    	}
			} else {
				$('#page-prev').trigger('click');
			}      
        }, 130);
	
	}

	// Store meet people profile and mutual friends into cache object
    var loadMeetPeopleProfileInfoToCache = function (facebookID, mutualFriends, extendedProfile){
    	Mutuality.mpcache.profileCacheData[facebookID] = {
    		'mutualFriends' : mutualFriends,
    		'extendedProfile' : extendedProfile
    	}
    	//console.log("Added " + facebookID);
    }

	// Fetch the extended profile and mutual friends, store in cache, and then display in UI
	var fetchMeetPeopleProfileInfo = function (facebookID){
		Mutuality.getMeetPeopleProfile(facebookID, function(extendedProfile){
			Mutuality.getMutualFriendList(facebookID, function(mutualFriends){
					loadMeetPeopleProfileInfoToCache(facebookID, mutualFriends, extendedProfile);
					loadMutualFriendsIntoUI(facebookID, Mutuality.mpcache.profileCacheData[facebookID].mutualFriends);
					loadProfileInfoIntoUI(facebookID, Mutuality.mpcache.profileCacheData[facebookID].extendedProfile);
			});
		});
	}

	// Fetch the list of friends returned from getMeetPeople, put into carousel, store in cache
	var fetchMeetPeopleProfileInfoAndShowUI = function (facebookID, friends){
		Mutuality.getMeetPeopleProfile(facebookID, function(extendedProfile){
			Mutuality.getMutualFriendList(facebookID, function(mutualFriends){
					loadMeetPeopleProfileInfoToCache(facebookID, mutualFriends, extendedProfile);
					meetProfilesElem = $("#meet-profiles");
					//console.log("Length of Friends = " + friends.length);
			    	for (i=0; i<MAX_CAROUSEL_NUM&&i<friends.length; i++){
	    				var setFavoriteFunctionString = 
							"var currentPerson = $($($('.match-profile-details')[1]).children()[0]);" +
							"if(currentPerson.css('background-position') == '0px -16px') {" +
							"	Mutuality.removeFavorite(" +friends[i].facebookID+"," +
							"		function(success){ " +
							"			if(currentPerson.attr('facebookid') =='"+friends[i].facebookID+"'){" +
							"				currentPerson.css('background-position',  '0 0px');}" +
							"		}); " +
							" } " +
							"else {" +
							"	Mutuality.setFavorite(" +friends[i].facebookID+", "+
							"		function(success){ " +
							"			if(currentPerson.attr('facebookid') =='"+friends[i].facebookID+"'){"+
							"				currentPerson.css('background-position',  '0 -16px');} " +
							"	});}";    		

	
			    		var liElem = $('<li>', {class:'meet-profile', facebookID:friends[i].facebookID}).appendTo(meetProfilesElem);
			    		var aElem = $('<a>', {class:"loaded"}).appendTo(liElem);
			    		var imgElem = $('<img>', {src:Mutuality.getProfilePictureURL(friends[i].facebookID, 350, 350)}).appendTo(aElem);
			    		var spanElem = $('<span>', {class:"match-profile-details"}).appendTo(aElem);
			    		var inFavorites = friends[i].isFavorite;

			    		if (!inFavorites) {
			    			var spanElem2 = $('<span>', {id:"add-to-fav", class:"tooltip", title: "Toggle Favorite", facebookID: friends[i].facebookID ,  style:"background-position: 0 0px", onclick:setFavoriteFunctionString}).appendTo(spanElem);
			    		}
			    		else{
			    			var spanElem2 = $('<span>', {id:"add-to-fav", class:"tooltip", title:"Toggle Favorite", facebookID: friends[i].facebookID, style:"background-position: 0 -16px", onclick:setFavoriteFunctionString}).appendTo(spanElem);
			    			//console.log("yes a favorite");
			    		}
                        var facebookProfileLink = Mutuality.getFacebookPageURL(friends[i].facebookID);
			    		var hElem = $('<h3>', {id:"left-profile-name", onclick:facebookProfileLink, html:friends[i].name}).appendTo(spanElem);
			    	}

					//Show the main content, dismiss the modal, init tooltips
			    	//$("#main").show();
		    		$('.tooltip').tooltipster();
			    	initCarousel();
		    		$('#page-next').trigger('click');
			    	hideModal();

				});
		});
	}

	// Just load the current person's mutual friends into the UI
	var loadMutualFriendsIntoUI = function (facebookID, mutualFriends){
		var newUlElem;
		var currentPersonName = Mutuality.getFriendOfFriendProfile(Mutuality.mpcache.current);
		var messageStringIntro = "Hey can you introduce me to " + currentPersonName.name + "?";
		var messageStringAsk = "Can you tell me more about " + currentPersonName.name + "?";
		var description = "Everyone on Mutuality is a friend-of-a-friend. Mutuality (finally) makes meeting cool people safe and simple."

		for (i=0; i<mutualFriends.length; i++){
			askaboutElem = $('#ask-about');
			askaboutElemModal = $('.ask-about-modal');
			if (i % 3 == 0){
				newUlElem = $('<ul>', {style: "margin-right: 0px; z-index: 0;"}).appendTo(askaboutElem);
				newUlElemModal = $('<ul>', {style: "margin-right: 0px; list-style-type: none;"}).appendTo(askaboutElemModal);
			}

			var liElem = $('<li>', {style:'z-index:0;'}).appendTo(newUlElem);
			var liElemModal = $('<li>', {style:'z-index:1;'}).appendTo(newUlElemModal);
    		var aElem = $('<a>', {id:'meet-people-friends', onclick: Mutuality.getSendNudgeURL(Mutuality.cache.facebookID, mutualFriends[i].facebookID, messageStringAsk, "www.mymutuality.com?src=meetPeople_askAbout", "http://i.imgur.com/Hcy3Clo.jpg", description)
}).appendTo(liElem);
    		var aElemModal = $('<a>', {class: 'askModalLink', onclick: Mutuality.getSendNudgeURL(Mutuality.cache.facebookID, mutualFriends[i].facebookID, messageStringAsk, "www.mymutuality.com?src=meetPeople_getIntro", "http://i.imgur.com/Hcy3Clo.jpg", description)
}).appendTo(liElemModal);
    		var spanElem = $('<span>', {class: 'profile-thumb tooltip', id: 'meetpeople-thumb', title: "Ask " + mutualFriends[i].name, style:'background-image: url(' + Mutuality.getProfilePictureURL(mutualFriends[i].facebookID, 100, 100)+ ');'}).appendTo(aElem);
    		var spanElemModal = $('<span>', {class: 'profile-thumb tooltip', id: 'meetpeople-thumb', title: "Ask " + mutualFriends[i].name, style:'background-image: url(' + Mutuality.getProfilePictureURL(mutualFriends[i].facebookID, 100, 100)+ ');'}).appendTo(aElemModal);
    		
    		// Append to onclick to make the modal disappear
    		var currentClick =  aElemModal.attr('onclick');
			var newClick =  currentClick + " $('.close-reveal-modal').trigger('click');"
			aElemModal.attr('onclick',  newClick);
						$('.askModalLink').eq(i).attr({			
						'data-facebookid':mutualFriends[i].facebookID,
						'data-name':mutualFriends[i].name,
						'data-id':i,	
						});
			aElem.attr('onclick',  newClick);
						$('#ask-about').find('a').eq(i).attr({			
						'data-facebookid':mutualFriends[i].facebookID,
						'data-name':mutualFriends[i].name,
						'data-id':i,	
						});
		}

		$("#profile-fb-meetpeople a").attr('onclick', Mutuality.getFacebookPageURL(facebookID));

		$('.tooltip').tooltipster();
		$('.tooltipster-icon').tooltipster({
			theme: '.tooltipster-question',
			position: 'top-right',
			arrow:true,
			arrowColor:'#FFF',
			maxWidth:150
		}); 
		$('.meet-people-question').tooltipster({
			theme: '.tooltipster-question',
			position: 'top-left',
			arrow:true,
			arrowColor:'#FFF',
			maxWidth:150
		}); 
		$('.filter-question').tooltipster({
			theme: '.tooltipster-question',
			position: 'top-right',
			arrow:true,
			arrowColor:'#FFF',
			maxWidth:150
		}); 
		$('.beacon-question').tooltipster({
			theme: '.tooltipster-question',
			position: 'top-right',
			arrow:true,
			arrowColor:'#FFF',
			maxWidth:140
		}); 

		initAskAboutCarousel();
		initAskAboutCarouselModal();
	}

	// Load the current person's profile info into the UI
	var loadProfileInfoIntoUI = function(facebookID, extendedProfile){
		var basicProfile = Mutuality.getFriendOfFriendProfile(facebookID);
			if(basicProfile.location) {
				$("#profile-location").html('<i class="location"></i>' + basicProfile.location);
				$("#profile-location").attr('class', '');
			}
			else {
				$("#profile-location").html('<i class="location"></i>Location');
				$("#profile-location").attr('class', 'inactive');
			}
			if(extendedProfile.gender) {
				$("#profile-sex").html('<i class="male"></i>' + extendedProfile.gender.charAt(0).toUpperCase() + extendedProfile.gender.slice(1));
				$("#profile-sex").attr('class', '');
			}
			else {
				$("#profile-sex").html('<i class="male"></i>Gender');
				$("#profile-sex").attr('class', 'inactive');			
			}
			if(extendedProfile.relationshipStatus) {
				$("#profile-status").html('<i class="single"></i>' + extendedProfile.relationshipStatus);
				$("#profile-status").attr('class', '');
			}
			else {
				$("#profile-status").html('<i class="single"></i>Relationship');
				$("#profile-status").attr('class', 'inactive');
			}
			if(extendedProfile.age) {
				$("#profile-dob").html('<i class="birthday"></i>' + extendedProfile.age);
				$("#profile-dob").attr('class', '');
			}
			else {
				$("#profile-dob").html('<i class="birthday"></i>Age');
				$("#profile-dob").attr('class', 'inactive');			
			}			
			if(extendedProfile.college) {
				$("#profile-education").html('<i class="edu"></i>' + extendedProfile.college);
				$("#profile-education").attr('class', '');
			}
			else {
				$("#profile-education").html('<i class="edu"></i>Education');
				$("#profile-education").attr('class', 'inactive');
			}
			if(extendedProfile.employer) {
				$("#profile-job").html('<i class="company"></i>' + extendedProfile.employer);
				$("#profile-job").attr('class', '');
			}
			else {
				$("#profile-job").html('<i class="company"></i>Job');
				$("#profile-job").attr('class', 'inactive');
			}

			$("#profile-stats ul").show();
			$("#profile-stats ul li").show();

			$(".profile-name").html(basicProfile.name.split(" ")[0]);
			$("#profile-fb a").attr('onclick', Mutuality.getFacebookPageURL(basicProfile.facebookID));
	}

    // After AJAX call for getMeetPeople, load that into meet people page cache
    var meetPeopleSuccess = function(friends){
        //console.log(friends)
    	if (friends.length == 0){
    		setModalWhenError("Sorry, but we didn't find anyone!  Check back soon.");
    	}
    	else if (friends.length > 2){
    		//console.log("Meet People Success = " + friends[2].facebookID)
    		$("#meet-profiles").html("");
    		fetchMeetPeopleProfileInfoAndShowUI(friends[2].facebookID, friends);
    	}
    	else{
    		$("#meet-profiles").html("");
    		fetchMeetPeopleProfileInfoAndShowUI(friends[0].facebookID, friends);
    	}
    }

    // Set a favorite
    var setFavorite = function (fbID){
    	Mutuality.setFavorite(fbID, function(success){
    		//console.log(success);
    	});
    }

    var createMutualityUserLookUp = function(friends){
    	for (i=0;i<friends.length;i++){
    		Mutuality.cache.mutualityUserLookup[friends[i].facebookID] = friends[i].isMutualityUser;
    	}
    }

    var setModalWhenError = function (text){
		$(".reveal-modal h4").text(text);
		$(".loading-2").css("display", "none");
		$(".loading-1").css("display", "none");
		$(".match-name").hide();
		$("#inviteFriends").show();
		$(".close-reveal-modal").show();
    }

var setModalBack = function(modalID){
	$("#modalClose").click(function (){
			//if(modalID == "myModal"){$(".reveal-modal h4").text("Loading...");}
			$(".reveal-modal h4").text("Loading...");
			$(".loading-2").css("display", "block");
			$(".loading-1").css("display", "block");
			$(".match-name").show();
			$("#inviteFriends").show();
			$(".close-reveal-modal").hide();
	});
}

var setNewBadge = function(friends) {
	var newCount = 0;
	//console.log(friends);
	for (i=0;i<friends.length;i++){
		if(friends[i].hasBeenViewed !== true){
			newCount++;
		}
	}
	$(".friend-count").html(newCount);

	if(newCount !== 0){
		$(".friend-count").show();
		setFriendCountStyle();
	}
	else{
		setFriendCountStyle();
	}
}
 /* End Helper Functions */

/* Begin Main Code */
   // Show the loading modal, and hide the page contents while async calls fire
   //$("#main").hide();

   Mutuality.loadFriendsList(4, function (friends) {
   	addFriendPicturesForLoadingAnimations(friends);
   	triggerModal("myModal");
   });
   mixpanel.track("Login success");
   var cookieName = "UpdateFriendListCalled" + Mutuality.cache.profile.facebookID;
   if($.cookie(cookieName) !== "true") {
	    Mutuality.updateFriendList(0, function(){
	    	$.cookie(cookieName, "true");
			Mutuality.getMeetPeople("FRIENDSHIP", function(friends){
                if (friends.potentialMatches.length > 0){
                    countDown(friends.batchExpirationTimestamp, new Date().getTime());
                    Mutuality.mpcache.fofList = friends.potentialMatches;
                    setNewBadge(friends.potentialMatches);
                    createMutualityUserLookUp(friends.potentialMatches);
                    meetPeopleSuccess(friends.potentialMatches, true);
                    // if ($('#noTour').length === 0) {
                    // 	$('#joyRideTipContent').joyride();
                    // }
                }
                else{
                    setModalWhenError("Sorry, but we didn't find anyone!");
                    setModalBack();
                }
			});
		});
	}
	else {
		beginBeaconImageHoverToggle();
		Mutuality.getMeetPeople("FRIENDSHIP", function(friends){
			if (friends.potentialMatches.length > 0){
                countDown(friends.batchExpirationTimestamp, new Date().getTime());
                Mutuality.mpcache.fofList = friends.potentialMatches;
	    		setNewBadge(friends.potentialMatches);
	    		createMutualityUserLookUp(friends.potentialMatches);
				meetPeopleSuccess(friends.potentialMatches, true);
				// if ($('#noTour').length === 0) {
				// 	$('#joyRideTipContent').joyride();
				// }
			}
            else{
                setModalWhenError("Sorry, but we didn't find anyone!");
                setModalBack();
            }
		});
	}

	 $('.ask-about-modal').on('click', 'a', function() {
	 		var position = $(this).data('id');
	 		var name = $(this).data('name');
	 		var facebookID = $(this).data('facebookid');
			mixpanel.track("Asked friend", {"Source":"Meet-people", "Element":"Get introduced", "Position":position, "Name":name, "FacebookID":facebookID}); 		
	 })

	 $('#ask-about').on('click', 'a', function() {
	 		var position = $(this).data('id');
	 		var name = $(this).data('name');
	 		var facebookID = $(this).data('facebookid');
	 		mixpanel.track("Asked friend", {"Source":"Meet-people", "Element":"Ask about","Position":position, "Name":name, "FacebookID":facebookID});
	 })

	 $('#like-text').on('click', function(){
	 	Mutuality.likeBeacon(Mutuality.mpcache.current, function(success) {
	 		$('#animate-out').hide()
	 		//$("#like-number").animate({ opcaity: 0.9 },1000, function(){
	 			//Mutuality.getBeaconLikeCount(Mutuality.token, function(success) {
	 			$('#hasLiked').html("");
				$('#beacon-like-number').html("");
				$('#plural-agreement').html("");

	 			Mutuality.getBeaconLikeCount(Mutuality.mpcache.current, function(success){
		 			var totalLikes = success;
		 			mixpanel.track("Beacon liked", {
		 				"Beacon liker":Mutuality.cache.profile.name,
		 				"Beacon likee":Mutuality.getFriendOfFriendProfile(Mutuality.mpcache.current).name,
		 				"Activity liked":$('#activity').html(),
		 				"Place liked":$('#place').html(),
		 				"Total likes":totalLikes
		 	   		});
	 			if (totalLikes === 1) {
	 				$('#hasLiked').html("You like this").show();
	 				$("#like-number").show();
	 			}
	 			else if (totalLikes === 2) {
	 				$('#hasLiked').html("You and").show();
	 				$('#beacon-like-number').html("1");
	 				$('#plural-agreement').html("person likes this");
	 				$("#like-number").show();
	 			}
	 			else {
	 				$('#hasLiked').html("You and").show();
	 				$('#beacon-like-number').html(success).show();
	 				$('#plural-agreement').html("people like this").show();
	 				$("#like-number").show();
	 			} 
	 		});	
	 			//picture should change to a thumbs up?
	 		//});
	 		var mutualFriendNumber = Mutuality.mpcache.profileCacheData[Mutuality.mpcache.current].mutualFriends.length;
	 		var firstName = Mutuality.cache.profile.name.split(" ")[0];
	 		var beaconMessage = Mutuality.cache.profile.name + " likes your beacon. Ask one of your " + mutualFriendNumber + " mutual friends on the right to learn more about "+ firstName + ". You can respond below.";
	 		//console.log(beaconMessage)
	 		Mutuality.sendMessage(Mutuality.mpcache.current, beaconMessage, function(response){
	 			//console.log(response);
	 		});

	 		//mixpanel track beacon (properties: whose is liked, what is liked, what place is liked, how many people like it)

	 	});

	 });

	// $('#introduce').on('click', 'a', function() {
	// 	Mutuality.getFacebookPageURL(Mutuality.mpcache.current);
	// })
	
	$('.facebook-adjust').on('click', function() {
		mixpanel.track("View facebook", {'Source':'Meet People'})
	})

	$('#like-text').hover(function() {
	 		$('#like-button').css("background-image","url(../images/likebuttonhover.png)");
	 	}, function(){
	 		$('#like-button').css("background-image","url(../images/likebutton.png)");
	 	});	

	//Style adjustments
	$('#ask-about').css({ zIndex: 0 });
 	$('.ask-about-modal').css({ zIndex: 0 });
 	$(".friend-count").hide();

/* End Main Code */

})(jQuery);