import { videos } from "./modules/videos.js";

const player = document.querySelector(".player");
const video = document.querySelector(".video");
const progressRange = document.querySelector(".progress-range");
const progressBar = document.querySelector(".progress-bar");
const playBtn = document.getElementById("play-btn");
const volumeIcon = document.getElementById("volume-icon");
const volumeRange = document.querySelector(".volume-range");
const volumeBar = document.querySelector(".volume-bar");
const currentTime = document.querySelector(".time-elapsed");
const duration = document.querySelector(".time-duration");
const speed = document.querySelector(".player-speed");
const pipBtn = document.getElementById("pip");
const fullscreenBtn = document.querySelector(".fullscreen");
const videosSelector = document.getElementById('videos');

// Play & Pause ----------------------------------- //

function showPlayIcon() {
    playBtn.classList.replace("fa-pause", "fa-play");
    playBtn.setAttribute("title", "Play");
}

function togglePlay() {
    if (video.paused) {
        video.play();
        playBtn.classList.replace("fa-play", "fa-pause");
        playBtn.setAttribute("title", "Pause");
    } else {
        video.pause();
        showPlayIcon();
    }
}

// On Video End, Show Play Button Icon
video.addEventListener("ended", showPlayIcon);

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
    progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
    currentTime.textContent = `${displayTime(video.currentTime)} /`;
    duration.textContent = `${displayTime(video.duration)}`;
}

// Click to seek within the video
function setProgress(e) {
    const newTime = e.offsetX / progressRange.offsetWidth;
    progressBar.style.width = `${newTime * 100}%`;
    video.currentTime = newTime * video.duration;
}

// Volume Controls --------------------------- //

let lastVolume = 1;
let lastIcon = "fa-volume-up";

// Volume Bar
function changeVolume(e) {
    let volume = e.offsetX / volumeRange.offsetWidth;
    // Rounding volume up or down
    if (volume < 0.1) {
        volume = 0;
    }
    if (volume > 0.9) {
        volume = 1;
    }
    volumeBar.style.width = `${volume * 100}%`;
    video.volume = volume;
    console.log(video.volume);
    // Change icon depending on volume
    volumeIcon.className = "";
    if (volume > 0.7) {
        volumeIcon.classList.add("fas", "fa-volume-up");
        lastIcon = "fa-volume-up";
    } else if (volume < 0.7 && volume > 0) {
        volumeIcon.classList.add("fas", "fa-volume-down");
        lastIcon = "fa-volume-down";
    } else if (volume === 0) {
        volumeIcon.classList.add("fas", "fa-volume-off");
        lastIcon = "fa-volume-off";
    }
    lastVolume = volume;
}

// Mute/Unmute
function toggleMute() {
    volumeIcon.className = "";
    if (video.volume) {
        lastVolume = video.volume;
        video.volume = 0;
        volumeBar.style.width = 0;
        volumeIcon.classList.add("fas", "fa-volume-mute");
        volumeIcon.setAttribute("title", "Unmute");
    } else {
        video.volume = lastVolume;
        volumeBar.style.width = `${lastVolume * 100}%`;
        volumeIcon.classList.add("fas", lastIcon);
        volumeIcon.setAttribute("title", "Mute");
    }
}

// Change Playback Speed -------------------- //

function changeSpeed() {
    // console.log("video playback rate", video.playbackRate);
    // console.log("selected value", speed.value);
    video.playbackRate = speed.value;
}

// Picture in Picture ----------------------- //

function togglePictureInPicture() {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  } else if (document.pictureInPictureEnabled) {
    video.requestPictureInPicture();
  }
}

// Fullscreen ------------------------------- //

/* View in fullscreen */
function openFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
    video.classList.add("video-fullscreen");
}
  
/* Close fullscreen */
function closeFullscreen() {
if (document.exitFullscreen) {
    document.exitFullscreen();
} else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
} else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
}
video.classList.remove("video-fullscreen");
}

let fullscreen = false;

// Toggle Fullscreen
function toggleFullscreen() {
  if (!fullscreen) {
    openFullscreen(player);
    pipBtn.hidden = true;
  } else {
    closeFullscreen();
    pipBtn.hidden = false;
  }
  fullscreen = !fullscreen;
}

// Video Library ---------------------------- //

// Function to populate the select dropdown
function populateVideoSelect() {
    videos.forEach(video => {
      const option = document.createElement('option');
      option.value = video.source; // Setting the value to the video source URL
      option.textContent = video.title; // Setting the text of the option to the video title
      videosSelector.appendChild(option);
    });
}

function loadVideo() {
    if (videosSelector.options.length === 0) { // Check if there are no options
        populateVideoSelect();
    }
    video.src = videosSelector.options[videosSelector.selectedIndex].value;
    video.load();
}

// Event Listeners ---------------------------- //

// On Load
window.addEventListener("load", loadVideo);

playBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);
video.addEventListener("timeupdate", updateProgress);
video.addEventListener("canplay", updateProgress);
progressRange.addEventListener("click", setProgress);
volumeRange.addEventListener("click", changeVolume);
volumeIcon.addEventListener("click", toggleMute);
speed.addEventListener("change", changeSpeed);
pipBtn.addEventListener("click", togglePictureInPicture);
fullscreenBtn.addEventListener("click", toggleFullscreen);
videosSelector.addEventListener("change", loadVideo);