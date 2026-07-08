document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll(".background-video");
  if (videos.length <= 1) return; // Let HTML autoplay handle single videos smoothly

  let current = 0;

  function playVideo(video) {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn("Autoplay prevented:", error);
      });
    }
  }

  function showNextVideo() {
    videos[current].classList.remove("active");
    videos[current].pause();

    current = (current + 1) % videos.length;

    videos[current].classList.add("active");
    playVideo(videos[current]);
  }

  playVideo(videos[current]);

  setInterval(showNextVideo, 8000);
});