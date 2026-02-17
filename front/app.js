const API_URL = 'http://localhost:8989';
const Feed = document.getElementById('videos');
let muted = false;

async function fetchVideos() {
    try {
        const response = await fetch(`${API_URL}/video`);
        if (!response.status === 200) throw new Error('Videos are unavailable');
        const data = await response.json();

        return data.files || [];
    } catch (error) {
        console.error('Error fetching videos:', error);
        return [];
    }
}

function createVideoElement(filename) {
    const Clip = document.createElement('div');
    Clip.className = 'clip';

    const video = document.createElement('video');
    video.src = `${API_URL}/video/${filename}`;
    video.loop = true;
    video.playsInline = true;
    video.muted = true;

    const buttonSound = document.createElement('div');
    buttonSound.className = 'clip__button clip__button_sound';
    buttonSound.textContent = 'Sound';
    muted ? buttonSound.textContent = 'Sound On' : buttonSound.textContent = 'Sound Off';

    const buttonPause = document.createElement('div');
    buttonPause.className = 'clip__button clip__button_pause';
    video.paused ? buttonPause.textContent = 'Play' : buttonPause.textContent = 'Pause';

    Clip.appendChild(video);
    Clip.appendChild(buttonPause);
    Clip.appendChild(buttonSound);

    buttonPause.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.paused) {
            video.play();
            buttonPause.textContent = 'Pause';
        } else {
            video.pause();
            buttonPause.textContent = 'Play';
        }
    });

    buttonSound.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        muted = video.muted;
        muted ? buttonSound.textContent = 'Sound On' : buttonSound.textContent = 'Sound Off';
    });

    return Clip;
}

function Intersection() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            if (!video) return;

            const buttonSound = video.closest('.clip').querySelector('.clip__button_sound');
            const buttonPause = video.closest('.clip').querySelector('.clip__button_pause');

            if (entry.isIntersecting) {

                const playPromise = video.play();
                video.muted = muted;
                video.paused ? buttonPause.textContent = 'Play' : buttonPause.textContent = 'Pause';
                muted ? buttonSound.textContent = 'Sound On' : buttonSound.textContent = 'Sound Off';
                if (playPromise !== undefined) {
                    playPromise.catch(error => {

                    });
                }
            } else {

                video.pause();
                video.muted = muted;
                buttonPause.textContent = 'Play';
                muted ? buttonSound.textContent = 'Sound On' : buttonSound.textContent = 'Sound Off';
                video.currentTime = 0;
            }
        });
    }, options);

    return observer;
}

async function init() {
    const clips = await fetchVideos();

    if (clips.length === 0) {
        Feed.innerHTML = '<div>No clips found</div>';
        return;
    }

    const observer = Intersection();

    clips.forEach(filename => {
        const videoEl = createVideoElement(filename);
        Feed.appendChild(videoEl);
        observer.observe(videoEl);
    });
}

document.addEventListener('DOMContentLoaded', init);
