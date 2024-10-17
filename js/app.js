import { videos } from "./modules/videos.js";

const ui = {
    player: document.querySelector(".player"),
    video: document.querySelector(".video"),
    progressRange: document.querySelector(".progress-range"),
    progressBar: document.querySelector(".progress-bar"),
    playBtn: document.getElementById("play-btn"),
    volumeIcon: document.getElementById("volume-icon"),
    volumeRange: document.querySelector(".volume-range"),
    volumeBar: document.querySelector(".volume-bar"),
    currentTime: document.querySelector(".time-elapsed"),
    duration: document.querySelector(".time-duration"),
    speed: document.querySelector(".player-speed"),
    pipBtn: document.getElementById("pip"),
    fullscreenBtn: document.querySelector(".fullscreen"),
    videosSelector: document.getElementById("videos")
  };

// Play & Pause ----------------------------------- //

function showPlayIcon() {
  ui.playBtn.classList.replace("fa-pause", "fa-play");
  ui.playBtn.setAttribute("title", "Play");
}

function togglePlay() {
  if (ui.video.paused) {
    ui.video.play();
    ui.playBtn.classList.replace("fa-play", "fa-pause");
    ui.playBtn.setAttribute("title", "Pause");
  } else {
    ui.video.pause();
    showPlayIcon();
  }
}

// On Video End, Show Play Button Icon
ui.video.addEventListener("ended", showPlayIcon);

// Progress Bar ---------------------------------- //

// Calculate display time format
function displayTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${displaySeconds}`;
}

// Update progress bar as the video plays
function updateProgress() {
  ui.progressBar.style.width = `${(ui.video.currentTime / ui.video.duration) * 100}%`;
  ui.currentTime.textContent = `${displayTime(ui.video.currentTime)} /`;
  ui.duration.textContent = `${displayTime(ui.video.duration)}`;
}

// Click to seek within the video
function setProgress(e) {
  const newTime = e.offsetX / ui.progressRange.offsetWidth;
  ui.progressBar.style.width = `${newTime * 100}%`;
  ui.video.currentTime = newTime * ui.video.duration;
}

// Volume Controls --------------------------- //

let lastVolume = 1;
let lastIcon = "fa-volume-up";

// Volume Bar
function changeVolume(e) {
  let volume = e.offsetX / ui.volumeRange.offsetWidth;
  // Rounding volume up or down
  if (volume < 0.1) {
    volume = 0;
  }
  if (volume > 0.9) {
    volume = 1;
  }
  ui.volumeBar.style.width = `${volume * 100}%`;
  ui.video.volume = volume;
  // Change icon depending on volume
  ui.volumeIcon.className = "";
  if (volume > 0.7) {
    ui.volumeIcon.classList.add("fas", "fa-volume-up");
    lastIcon = "fa-volume-up";
  } else if (volume < 0.7 && volume > 0) {
    ui.volumeIcon.classList.add("fas", "fa-volume-down");
    lastIcon = "fa-volume-down";
  } else if (volume === 0) {
    ui.volumeIcon.classList.add("fas", "fa-volume-off");
    lastIcon = "fa-volume-off";
  }
  lastVolume = volume;
}

// Mute/Unmute
function toggleMute() {
  ui.volumeIcon.className = "";
  if (ui.video.volume) {
    lastVolume = ui.video.volume;
    ui.video.volume = 0;
    ui.volumeBar.style.width = 0;
    ui.volumeIcon.classList.add("fas", "fa-volume-mute");
    ui.volumeIcon.setAttribute("title", "Unmute");
  } else {
    ui.video.volume = lastVolume;
    ui.volumeBar.style.width = `${lastVolume * 100}%`;
    ui.volumeIcon.classList.add("fas", lastIcon);
    ui.volumeIcon.setAttribute("title", "Mute");
  }
}

// Change Playback Speed -------------------- //

function changeSpeed() {
  ui.video.playbackRate = ui.speed.value;
}

// Picture in Picture ----------------------- //

function togglePictureInPicture() {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  } else if (document.pictureInPictureEnabled) {
    ui.video.requestPictureInPicture();
  }
}

// Fullscreen ------------------------------- //

/* View in fullscreen */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE / Edge */
    elem.msRequestFullscreen();
  }
  ui.video.classList.add("video-fullscreen");
  ui.pipBtn.hidden = true;
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE / Edge */
    document.msExitFullscreen();
  }
  ui.video.classList.remove("video-fullscreen");
  ui.pipBtn.hidden = false;
}

let fullscreen = false;

// Toggle Fullscreen
function toggleFullscreen() {
  !fullscreen ? openFullscreen(ui.player) : closeFullscreen();
  fullscreen = !fullscreen;
}

// Video Library ---------------------------- //

// Function to populate the select dropdown
function populateVideoSelect() {
  videos.forEach((video) => {
    const option = document.createElement("option");
    option.value = video.source; // Setting the value to the video source URL
    option.textContent = video.title; // Setting the text of the option to the video title
    ui.videosSelector.appendChild(option);
  });
}

function loadVideo() {
  if (ui.videosSelector.options.length === 0) {
    // Check if there are no options
    populateVideoSelect();
  }
  ui.video.src = ui.videosSelector.options[ui.videosSelector.selectedIndex].value;
  ui.video.load();
}

// Event Listeners ---------------------------- //

// On Load
window.onload = loadVideo;
// On Actions
ui.playBtn.onclick = togglePlay;
ui.video.onclick = togglePlay;
ui.video.ontimeupdate = updateProgress;
ui.video.oncanplay = updateProgress;
ui.progressRange.onclick = setProgress;
ui.volumeRange.onclick = changeVolume;
ui.volumeIcon.onclick = toggleMute;
ui.speed.onchange = changeSpeed;
ui.pipBtn.onclick = togglePictureInPicture;
ui.fullscreenBtn.onclick = toggleFullscreen;
ui.videosSelector.onchange = loadVideo;