$(document).ready(function(){
	
	var song;

	//Hide pause button..
	$('#pause').hide();

	// On clicking play button => play the song
	$('#play').click(playSong);
		
	//  the first song in the playlist is the audio player default setting...
	audioPlayerSetting($('#playlist li:first-child'));
	
	// function set audio player initial setting..
	function audioPlayerSetting(element){
		
		var songSource = element.attr('data-src'); // song source
		var title = element.text(); // song name

		//Create a New Audio Object
		song = new Audio('media/' + songSource);
		
		// if the song is not working put duration = 0
		if(!song.currentTime){
			$('#duration').html('00:00 / 00:00');
		}

		$('#audio-player #audio-title').text(title); // insert song title in the 
		$('#playlist li').removeClass('active');
		element.addClass('active'); // add active class to the current song
	}

	

	/*  function to play song
		play the song
		hide play button
		show pause button
		show the song duration
		show the equalizer
		animate song title
	*/
	function playSong(){
		song.play(); // play the song
		$('#play').hide(); // hide play button
		$('#pause').show();// show pause button
		showDuration(); // show the song duration
		$('.active').append('<div id="equalizer"><span></span><span></span><span></span></div>');// show the equalizer
		$('#audio-title').addClass('playing');// animate song title
	}

	/* On clicking Pause button
		pause the song
		hide pause button
		show play button
		remove the equalizer
		stop song title animation
	*/
	$('#pause').click(function(){
		song.pause();// pause the song
		$('#pause').hide();// hide pause button
		$('#play').show();// show play button
		$('#equalizer').remove(); // remove the equalizer
		$('#audio-title').removeClass('playing');// stop song title animation
	});
		
	/* On clicking next button
		pause current song
		remove equalizer
		get the next song information
		if this the last song then play the first song again
		put the next song as an argument to audio player setting 
	*/
	$('#next').click(function(){
		song.pause(); // pause current song
		$('#equalizer').remove(); // remove equalizer

		var next = $('#playlist li.active').next();// get the next song information

		// if this is the last song then play the first song again
		if (next.length == 0) {
			next = $('#playlist li:first-child');
		}

		audioPlayerSetting(next);// put the next song as an argument to audio player setting 
		playSong();
	});

	/* On clicking prev button
		pause current song
		remove equalizer
		get the prev song information
		if this is the first song then play the last song again
		put the prev song as an argument to audio player setting 
	*/
	$('#prev').click(function(){
		song.pause(); // pause current song
		$('#equalizer').remove(); // remove equalizer

		//if this is the first song then play the last song again
		var prev = $('#playlist li.active').prev();// get the prev song information

		if (prev.length == 0) {
			prev = $('#playlist li:last-child');
		}

		audioPlayerSetting(prev);
		playSong();
	});

	/*on clicking at any song
		pause current song
		remove equalizer	
		put the selected song as an argument to audio player setting 
	*/
	$('#playlist li').click(function () {
		song.pause();
		$('#equalizer').remove();
		audioPlayerSetting($(this));
		playSong();
	});
	
	//Time Duration
	function showDuration(){

		$(song).bind('timeupdate', function(){

			// Get total song time in seconds and minutes
			var totalSecondsInSong = parseInt(song.duration % 60); // total song time in seconds
			var totalMinutesInSong= parseInt((song.duration / 60) % 60); // total song time in minutes

			// Add leading 0 if seconds less than 10
			if (totalSecondsInSong < 10) {
				totalSecondsInSong = '0' + totalSecondsInSong ;
			}

			// Add leading 0 if minutes less than 10
			if (totalMinutesInSong < 10) {
				totalMinutesInSong= '0' + totalMinutesInSong ;
			}
			
			if (isNaN(totalSecondsInSong)){ totalSecondsInSong = '00';} 
			if (isNaN(totalMinutesInSong)){ totalMinutesInSong= '00';} 
			
			//Get number seconds and minutes played from the song
			var playedSeconds = parseInt(song.currentTime % 60);
			var playedMinutes = parseInt((song.currentTime / 60) % 60);

			// Add leading 0 if seconds less than 10
			if (playedSeconds < 10) {
				playedSeconds = '0' + playedSeconds ;
			}

			// Add leading 0 if minutes less than 10
			if (playedMinutes < 10) {
				playedMinutes = '0' + playedMinutes ;
			}

			$('#duration').html(playedMinutes + ':' + playedSeconds + ' / ' + totalMinutesInSong+ ':' + totalSecondsInSong);	
			
			// express progress bar value based on current played time
			var progressBarValue = 0;
			if (song.currentTime > 0) {
				progressBarValue = Math.floor((100 / song.duration) * song.currentTime);
			}
			$('#progress').css('width', progressBarValue + '%');

			if( song.currentTime == song.duration){
				$('#next').trigger('click');
			} 
				
		});
	}

	// moving the progress bar updating the song current time to the same place of progress bar
	$("#progress-bar").mouseup(function(e){
		var leftOffset = e.pageX - $(this).offset().left;
		var songPercents = leftOffset / $('#progress-bar').width();
		song.currentTime = songPercents * song.duration;
	});

	//After song ends play next song
	$(song).on("ended", function() {
		song.pause();
		var next = $('#playlist li.active').next();
		if (song.length == 0) {
			next = $('#playlist li:first-child');
		}
		audioPlayerSetting(next);
		song.play();
		showDuration();
	});
	

});

