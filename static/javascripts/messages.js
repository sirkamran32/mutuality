(function($) {
/* Begin Helper functions */
// After AJAX call for finding friends of friends, load random four images into meet people call to action

function beaconMessageCheck() {

}

function newConversationCheck() {
	var facebookID = getParameterByName("fbid");
	if (facebookID ===""){
		return false;
	} else {
		return true;
	}
}

function loadPage(convoBoolean) {
	Mutuality.getThreadPreviews(function(messages) {
		if (convoBoolean===false) {
			loadPageFirstCase(messages);
		} else {
			var facebookID = getParameterByName("fbid");
			var name = getParameterByName("name");
			existingPerson(facebookID, messages, function(index){
				if (index !== -1) {
					loadPageSecondCase(facebookID, name, messages, index);
				} else {
					loadPageThirdCase(facebookID, name, messages);	
				}
			});
		}
	});
}	

 function checkToLoadMessageBox () {
 	$('.message-load').empty();
 	var messagePos = $('.single-message').eq(0).data('messageposition') 
	if(messagePos > 0) {
 		$('.message-load').append('<div class="load-messages row"><a href="#">Load previous messages</a></div>');
 	}
 }

function existingPerson (facebookid, messages, success) {
		var index = -1;
		for (i = 0; i < messages.length; i++) {
			var messageSender = messages[i].sender.facebookID;
			var messageRecipient = messages[i].recipient.facebookID;
			if (messageSender===facebookid || messageRecipient === facebookid) {
				index = i;
			}
		}	
		success(index);
}

//Load messages and mutual friends for selected person
function loadThread (facebookID, index) {
	convoBoolean = $('.message-list li').eq(index).data("convoboolean");
	if (convoBoolean === true) {
		var thumbImage ='background-image: url(' + Mutuality.getProfilePictureURL(facebookID, 100, 100) + ')';
		$('.message-thread').append(
			$('<div>').addClass('single-message row').append(
				$('<div>').addClass('two columns').append(
					$('<span>').attr({
						class: "profile-thumb",
						style:  thumbImage
					}), 
					($('<small>').html("Now"))
					)).append(
					($('<div>').addClass('ten columns').html(
						"<p></p>"	
						)
						)));
	} else {
	Mutuality.getMessagesWithOther(facebookID, loadMessageThreadIntoUI);
	}
}

function loadFriends (facebookID, name) {
	Mutuality.getMutualFriendList(facebookID, function(mutualFriends) {
		loadMutualFriendsIntoUI(facebookID, name, mutualFriends);
	});
}
function parseMessageForId (messages, index) {
	if (messages[index].sender.facebookID !== Mutuality.token) {
			return messages[index].sender.facebookID; 
		} else {
			return messages[index].recipient.facebookID;
		}	
} 

function parseMessageForName (messages, index) {
	if (messages[index].sender.facebookID !== Mutuality.token) {
			return messages[index].sender.name;
		} else {
			return messages[index].recipient.name;
		}	

}

//Load thread previews into the UI
function loadPageFirstCase (messages) {	
		//Figure out the fbid and name of first person in preview
		var firstPersonID = parseMessageForId(messages, 0);
		var firstPersonName = parseMessageForName(messages, 0);

		//Load the first person's message thread and mutual friends
		loadThread(firstPersonID, 0);
		loadFriends(firstPersonID, firstPersonName);

	for (var i = 0; i < messages.length; i++) {
		if (messages[i].sender.facebookID !== Mutuality.token) {
			var otherPerson = messages[i].sender 
		}
		else {
			var otherPerson = messages[i].recipient;
		}
		var facebookID = otherPerson.facebookID;
		var name = otherPerson.name;
		var date = new Date(messages[i].sent_at);
		var formattedMessage = formatMessageForPreview(messages[i].body);
		if (i !== 0) {
			var state ='cf inactive';
		} else {
			var state = 'cf active';
		}	
			//Add preview HTML element into DOM	
			addProfilePreview(facebookID, name, formattedMessage, state);
	}
}

function formatMessageForPreview (messageBody) {
		if (messageBody.length < 30) {
			return messageBody;
		}
		else {
			return (messageBody.substr(0,20) + "...");
		}	
}

function loadPageSecondCase (facebookID, name, messages, index) {
	var firstName = name.split(" ")[0];
	var formattedMessage = formatMessageForPreview(messages[index].body);
	loadThread(facebookID, index);
	loadFriends(facebookID, firstName);
	addProfilePreview(facebookID, name, formattedMessage, "cf active");
	messages.splice(index,1);
	for (var i = 0; i < messages.length; i++) {
		var newFbId = parseMessageForId(messages, i);
		var name = parseMessageForName(messages, i);
		var formattedMessage = formatMessageForPreview(messages[i].body);
		addProfilePreview (newFbId, name, formattedMessage, "cf inactive");
	}
}

function loadPageThirdCase (facebookID, name, messages) {
	var firstName = name.split(" ")[0];
	var formattedMessage = "...";
	var thumbImage = 'background-image: url(' + Mutuality.getProfilePictureURL(facebookID, 90, 90) + ')';
	loadFriends(facebookID,firstName);
	addProfilePreview(facebookID, name, formattedMessage, "cf active", true)
	loadThread(facebookID,0);

	for (var i = 0; i < messages.length; i++) {
		var newFbId = parseMessageForId(messages, i);
		var newName = parseMessageForName(messages, i);
		var newFormattedMessage = formatMessageForPreview(messages[i].body);
		addProfilePreview (newFbId, newName, newFormattedMessage, "cf inactive", false);
	}	
}

function addProfilePreview (facebookID, name, formattedMessage, state, convoBoolean) {
	var profileImage = 'background-image: url(' + Mutuality.getProfilePictureURL(facebookID, 90, 90) + ')';
	$('.message-list ul').append($('<li>').attr({
		'data-facebookid':facebookID,
		'data-name':name,
		'data-convoBoolean':convoBoolean
	}).addClass(state).append($('<a>').attr('href','#').append(
						$('<span>').attr({
							class: "profile-thumb",
							style: profileImage
							}),
						($('<strong>').html(name)),
						($('<small>').html(formattedMessage))
						)));
}

function formatTime (unixTimeStamp) {
	var a_p = "";
	var d = new Date(unixTimeStamp);
	var curr_hour = d.getHours();

	if (curr_hour < 12) {
			a_p = "AM";
   		} else {
   			a_p = "PM";
   		}
	if (curr_hour === 0) {
   		curr_hour = 12;
   		}
	if (curr_hour > 12) {
   		curr_hour = curr_hour - 12;
   	}

var curr_min = d.getMinutes();
	if (curr_min < 10) {
		curr_min = "0" + curr_min;
	}

return curr_hour + ":" + curr_min + " " + a_p;
}

var initAskAboutCarousel = function () {
		$('#ask-about').carouFredSel({
			auto : false,
			width: 213,
			height: 150,
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

//Load full message exchange into the UI
var loadMessageThreadIntoUI = function(messageThread) {
	console.log(messageThread);
	var totalHeight = 0;
	var messageHeight = 0;
	var messagePos;
		if ($('.single-message').length === 0) {
			messagePos = messageThread.length - 1;
		} else {
			messagePos = $('.single-message').eq(0).data('messageposition');
		}
	for (messagePos; messagePos >= 0; messagePos--) {
		var messageOwner = messageThread[messagePos].sender.facebookID;
		var thumbImage = 'background-image: url(' + Mutuality.getProfilePictureURL(messageOwner, 100, 100) + ')';
		var time = formatTime(messageThread[messagePos].sent_timestamp);
		var message = messageThread[messagePos].body;

			if ($('.single-message').length !== 0) { 
				messageHeight = $('.single-message').eq(0).height();
				totalHeight = totalHeight + messageHeight;
			}
		console.log(message.indexOf(" likes your beacon. Ask one of your "));
		if (totalHeight < 400) {	
			if (message.indexOf(" likes your beacon. Ask one of your ") === -1) {
				$('.message-thread').prepend(
					$('<div>').addClass('single-message row').append(
						$('<div>').addClass('two columns').append(
							$('<span>').attr({
								class: "profile-thumb",
								style:  thumbImage
							}), 
							($('<small>').html(time))
							)).append(
							($('<div>').addClass('ten columns').html(
								'<p id="adjust-messages">' + message + '</p>'	
								)
								)));
				$('.single-message').eq(0).attr({
								'data-messageposition': messagePos
				});
			} else {
				$('.message-thread').prepend(
					$('<div>').addClass('single-message row beacon-message').append(
						$('<div>').addClass('two columns').append(
							$('<span>').attr({
								class: "profile-thumb",
								style:  thumbImage
							}), 
							($('<small>').html(time))
							)).append(
							($('<div>').addClass('ten columns').html(
								'<p id="adjust-beacon-messages">' + message + '</p>'	
								)
								)));
				$('.single-message').eq(0).attr({
								'data-messageposition': messagePos
				});
			}	
		}

	}
	checkToLoadMessageBox();
}

var loadSentMessage = function(messageThread) {
	var sentMessage = messageThread[messageThread.length-1];
	var messageOwner = sentMessage.sender.facebookID;
	var thumbImage = 'background-image: url(' + Mutuality.getProfilePictureURL(messageOwner, 90, 90) + ')';
	var time = formatTime(sentMessage.sent_timestamp);
	var newMessagePos = $('.single-message').eq(0).data('messageposition') + 1;
	var messageAdded = false;
	if ($('.message-thread').height() > 450) {
		$('.single-message').eq(0).remove();
		messsageAdded = true;
	}

	$('.message-thread').append(
		$('<div>').addClass('single-message row').append(
			$('<div>').addClass('two columns').append(
					$('<span>').attr({
						class: "profile-thumb",
						style:  thumbImage
					}),
					($('<small>').html(time))
					)).append(
					($('<div>').addClass('ten columns').html(
						"<p>" + sentMessage.body + "</p>"						)
						)));
	if (messageAdded === true) {
		$('.single-message').eq(0).attr('data-messageposition',newMessagePos);
	}
}

var loadMutualFriendsIntoUI = function (facebookID, otherName, mutualFriends){
	var name = otherName.split(" ");
	var newUlElem;
	$('#ask-about').empty();
	$('#askAboutTitle').html("Ask About " + name[0]);
	for (var i = 0; i < mutualFriends.length; i++) {
		var friendID = mutualFriends[i].facebookID;
		var friendName = mutualFriends[i].name; //.split(" ")[0];
		var messageString = "Can you tell me more about " + otherName + "?";
		var mutualFriendImage = 'background-image: url(' + Mutuality.getProfilePictureURL(friendID, 100, 100) + ')';
		var description = "Everyone on Mutuality is a friend-of-a-friend. Mutuality (finally) makes meeting cool people safe and simple."

		if (i % 6 === 0){
			newUlElem = $('<ul>', {style: "margin-right: 0px;"}).appendTo($('#ask-about'));
			}
		
			var liElem = $(newUlElem).append
				($('<li>').append(
					$('<a>').attr({
						'href': '#',
						'data-facebookid':friendID,
						'data-name':otherName,
						'data-id':i,
						'onclick': Mutuality.getSendNudgeURL(Mutuality.cache.facebookID, friendID, messageString, "www.mymutuality.com?src=messages_ask_about", "http://i.imgur.com/Hcy3Clo.jpg", description)
					}).append(
						$('<span>').attr({
								class: "profile-thumb tooltip",
								title: "Ask " + friendName,
								style: mutualFriendImage
								}))));
		}
		$('.tooltip').tooltipster();
		initAskAboutCarousel();
        $("#profile-fb a").attr('onclick', Mutuality.getFacebookPageURL(facebookID));


}

var friendsOfFriendsSuccess = function(friends){
	if (friends.length > 0){
	    friends.sort(function() { return 0.5 - Math.random();}) // shuffle the array
	    $('#four-images img').each(function(i) {
	        $(this).attr('src', Mutuality.getProfilePictureURL(friends[i].facebookID, 84, 84));
	    });
	}
	else{
	    $("#meet-people-cta").css('display','none');
	}
};

/* End Helper functions */

/* Begin Messages Main Code */
	// Get and show full message thread when relevant preview li element is clicked
	$(document).ready(function() {	
		//Load correct message previews, message thread, and mutual friends
		// var newConversationBoolean = newConversationCheck();
		// console.log(newConversationBoolean);
		

		var convoBoolean = newConversationCheck();
		loadPage(convoBoolean);
		//console.log(loadCase);
		//Mutuality.loadFriendsList(0, function(){});
		Mutuality.getMeetPeople(0, 0, 0, friendsOfFriendsSuccess);
		//introduceYourself("1451700007", "Taylor Woods");
		//introduceYourself("613170158", "Angela Cough");
		//introduceYourself("10701292", "Elly Egli");

		

		//Load overflow messages
		$(document).on('click', '.load-messages', function (event) {
			event.stopPropagation();
			$(".message-thread").addClass("scroll");
			var otherFbId = $('.message-list').find('li.active').data('facebookid');
			Mutuality.getMessagesWithOther(otherFbId, loadMessageThreadIntoUI);
			checkToLoadMessageBox();
			//$('.message-thread').animate({
			//	scrollTop: $('.single-message').eq(0).offset().top}, 2000);
		});

		//Activate preview, load messages, and mutual friends once clicked
		$('.message-list ul').on('click', 'li', function (event) {
			event.stopPropagation();
			$('.message-thread').empty();
			$('.ask-about').empty();
			$(this).siblings('li').removeClass("cf active").addClass("cf inactive");
			$(this).removeClass("cf inactive").addClass("cf active");
			var otherFbId = $('.message-list').find('li.active').data('facebookid');
			var otherName = $('.message-list').find('li.active').data('name');
			var index = $(this).index();
			loadThread(otherFbId, index);
			loadFriends(otherFbId, otherName);
		});

		//Send button sends message in message field
		$('input.messages.button').on('click', function (event){
			event.stopPropagation();
			var sendTo = $('.message-list').find('li.active').data('facebookid');
			var messageToSend = $('.message-reply').find('textarea').val();
			Mutuality.sendMessage(sendTo, messageToSend, function(response){
				if (response === true) {
					var otherFbId = $('.message-list').find('li.active').data('facebookid');
					$('.message-reply').find('textarea').val("");
					Mutuality.getMessagesWithOther(otherFbId, loadSentMessage);
					mixpanel.track("Message sent");
				
				} else {
				   alert("Message send failure. Please email us at info@mymutuality.com");	
				}
			});
		});

		$('.message-reply').find('textarea').keypress(function(event) {
			event.stopPropagation();
			if (event.which === 13) {
				$('input.messages.button').click();
			}
		});

		$('#ask-about').on('click', 'a', function() {
			var position = $(this).data('id');
			var name = $(this).data('name');
			var facebookID = $(this).data('facebookid');
			mixpanel.track("Asked friend", {"Source":"Messages", "Element":"Ask about","Position":position, "Name":name, "FacebookID":facebookID});
		});

		$('#profile-fb').on('click', function() {
			mixpanel.track("View facebook", {'Source':'Messages'});
		});
	
	});	  
/* End Main Code */

})(jQuery);