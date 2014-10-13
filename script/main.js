
// Settings

var musicVolume = 0.0;
var effectsVolume = 0.0;

var webAppChangeTime = 60000;

var patchesAndFudgeChangeTime = 20000;
var patchesAndFudgeImage = 1;

/*-------------------------------------------------------
	END Settings
 -------------------------------------------------------*/

var colors = ['blue', 'green', 'orange'];
var songs = ['I Know', 'Way More Smooth', 'You Lied'];
var index = 1;
 
var currentWebApp = 1;
var autoChangeToNext = true;
var autoChangeTimeoutId;

var graphicsProjectOpen = false;

$(function () {
	removeJQueryMobileCrap();

	index = Math.floor(Math.random() * colors.length);
	
	setupTheme();
	setupSounds();
	setupMenu();

	$('div#webApps')
		.on('click', 'div.arrow:nth-child(1)', nextWebApp)
		.on('click', 'div.arrow:nth-child(2)', previousWebApp)
		.on('swipeleft', nextWebApp)
		.on('swiperight', previousWebApp);
	startChangeWebAppTimer();
	
	$('body')
		.on('click', '.graphics > div > div', displayGraphic)
		.on('click', '.graphics > div > div', stopPropagation)
		.on('click', hideGraphic);
	
	setTimeout(flipPatchesAndFudge, patchesAndFudgeChangeTime);
});

function stopPropagation(event)
{
	event.stopPropagation();
}

function removeJQueryMobileCrap()
{
	var body = $('body').attr('class','')[0];
	var $jqmPage = $('div.ui-page');
	var jqmLoader = $('div.ui-loader')[0];
	var $content = $jqmPage.children('*');
	for(var i = 0; i < $content.length; i++)
	{
		body.appendChild($content[i]);
	}
	body.removeChild($jqmPage[0]);
	body.removeChild(jqmLoader);
}

function setupTheme()
{
	var color = colors[index];
	$('body').addClass(color + 'Body');
	$('header').addClass(color + 'Header');
	$('span.volumeControl').addClass(color + 'VolumeControls');
	$('a.playGame').addClass(color + 'PlayGame');
}

function setupSounds()
{
	var song = songs[index];	
	$('#musicDetails').html(song + ' by K Harris');

	var music = $('audio#music')[0];
	changeAudioSource(music, 'sound/' + song + '.mp3', 'audio/mpeg');
	music.volume = musicVolume;
	music.play();
	
	var effects = $('audio#effects')[0]
	effects.volume = effectsVolume;
	
	$('span#musicVolume')
		.css('background-size', (musicVolume * 100) + "%")
		.on('click', {audio: music}, changeVolumeBar);
	$('span#effectsVolume')
		.css('background-size', (effectsVolume * 100) + '%')
		.on('click', {audio: effects}, changeVolumeBar);
}

function changeAudioSource(audio, sourceFile, fileType)
{
	$(audio).children('source').attr('src', sourceFile).attr('type', fileType).detach().appendTo(audio);
}

function playEffect(sourceFile, fileType)
{
	var effects = $('audio#effects')[0];
	changeAudioSource(effects, sourceFile, fileType);
	effects.play();
}

function changeVolumeBar(event)
{
	var x = event.pageX - $(this).offset().left;
	x = x/parseInt($(this).css('width'));
	event.data.audio.volume = x;
	x = Math.floor(x * 100) + "%";
	$(this).css('background-size', x);
}

function setupMenu()
{
	$('body')
		.on('click', 'div#menu > div > img', toggleMenu)
		.on('click', 'div#menu > div', stopPropagation)
		.on('click', hideMenus);
}

function toggleMenu(event)
{
	var $selectedMenu = $(event.target).parent().children('div');
	if($selectedMenu.css('display') == 'none')
	{
		$('div#menu > div > div').hide();
		$selectedMenu.show();
	}
	else
	{
		$('div#menu > div > div').hide();
	}
}

function hideMenus()
{
	$('div#menu > div > div').hide();
}

function startChangeWebAppTimer()
{
	autoChangeTimeoutId = setTimeout(autoChangeWebApps, webAppChangeTime);
}

function autoChangeWebApps()
{
	var numberOfWebApps = $('div.webApp').length;
	if(autoChangeToNext)
	{
		if(currentWebApp == numberOfWebApps)
		{
			autoChangeToNext = false;
			previousWebApp();
		}
		else
		{
			nextWebApp();
		}
	}
	else
	{
		if(currentWebApp == 1)
		{
			autoChangeToNext = true;
			nextWebApp();
		}
		else
		{
			previousWebApp();
		}
	}
	startChangeWebAppTimer();
}

function previousWebApp()
{
	var previous = $("div#webApps > div#appHolder > div.webApp:nth-child(" + (currentWebApp - 1) + ")");
	if(previous.length > 0)
	{
		playEffect('sound/page_turn.wav', 'audio/wav');
		$("div#webApps > div#appHolder > div.webApp:nth-child(" + currentWebApp + ")")
			.css('z-index', '0').animate({
				left: '1200px'
			}, 500);
		previous.css('z-index', '1').animate({
				left: '0'
			}, 500);
		--currentWebApp;
	}
	clearTimeout(autoChangeTimeoutId);
	startChangeWebAppTimer();
}

function nextWebApp()
{
	var next = $("div#webApps > div#appHolder > div.webApp:nth-child(" + (currentWebApp + 1) + ")");
	if(next.length > 0)
	{
		playEffect('sound/page_turn.wav', 'audio/wav');
		$("div#webApps > div#appHolder > div.webApp:nth-child(" + currentWebApp + ")")
			.css('z-index', '0').animate({
				left: '-1200px'
			}, 500, function() {
			
			});
		next.css('z-index', '1').animate({
				left: '0'
			}, 500, function () {
			
			});
		++currentWebApp;
	}
	clearTimeout(autoChangeTimeoutId);
	startChangeWebAppTimer();
}

function displayGraphic(event)
{
	if(!graphicsProjectOpen) playEffect('sound/drawerOpen.mp3', 'audio/mpeg');
	
	$(event.target)
		.attr("data-rotation", "false")
		.children('div').css('width','1').css('height','1')
		.show().css('opacity','1')
		.animate({
			width: '870px',
			height: '642px'
		}, 1000);
		
	graphicsProjectOpen = true;
}

function hideGraphic(event)
{
	if(graphicsProjectOpen)
	{
		playEffect('sound/drawerClose.mp3', 'audio/mpeg');

		$('.graphics > div > div > div').animate({
			width: '1px',
			height: '1px'
		}, 1000, function(){
			$(this).hide();
			$('.graphics > div > div').attr("data-rotation", "true");
		});
		
		graphicsProjectOpen = false;
	}
}

function flipPatchesAndFudge()
{
	console.log('flip');
	$('#patchesAndFudge').fadeToggle(500, function() {
		$('#patchesAndFudge').attr('src', 'image/workScreenshots/PatchesAndFudge' + patchesAndFudgeImage + '.jpg');
		patchesAndFudgeImage = (patchesAndFudgeImage + 1) % 2;
		setTimeout(flipPatchesAndFudge, patchesAndFudgeChangeTime);
		$('#patchesAndFudge').fadeToggle(500);
	});
}