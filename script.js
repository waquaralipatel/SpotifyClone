console.log('Hello!! Im js file for this site');
let currentSong = new Audio();
let songs;

function formatTime(seconds) {
    const totalSeconds = Math.floor(seconds);

    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
}


async function songsReturn() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs;
}

const playMusic = (songName, pause = false) => {
    currentSong.src = "/songs/" + songName;
    if (!pause) {
        currentSong.play()
        playBtn.src = "Images&Svg/pause.svg"
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(songName);

}
async function main() {

    songs = await songsReturn()
    playMusic(songs[0], true)

    /// inserting the songs to the html document
    let songUL = document.querySelector(".songs")
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<div class="songCard">
                            <img src="Images&Svg/music.svg" alt="music-svg" class="invert" >
                            <div class="info">
                                <span>${song.replaceAll("%20", " ")}</span>
                                <h6>Artist Name</h6>
                            </div>
                            <div class="playNowbtn">
                                <img src="Images&Svg/play.svg" alt="" class="invert">
                            </div>
                        </div>`;
    }

    // add eventlistener to all songs which are come in songs div
    let cards = document.querySelectorAll(".songCard");
    Array.from(cards).forEach((e) => {
        let playbtn = e.querySelector(".playNowbtn")
        playbtn.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    });

    // add eventlistener to play previous and next buttons
    playBtn.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            playBtn.src = "Images&Svg/pause.svg"
        } else {
            currentSong.pause()
            playBtn.src = "Images&Svg/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTiming").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;

        //seekbar song track circle code
        document.querySelector(".songtrack").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    })

    ///add event listerner to the seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".songtrack").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })
    //In phone or less then 1200px width screen handling the left pass by hamburger
    let humburger = document.querySelector("#humburger");
    let x = document.querySelector(".left-section");

    // Hamburger click toggle (for small screens)
    humburger.addEventListener("click", () => {
        if (window.innerWidth <= 1200) {
            const computedLeft = window.getComputedStyle(x).left;

            if (computedLeft !== "auto") {
                if (x.style.left === "0px") {
                    x.style.left = "-100%";
                } else {
                    x.style.left = "0";
                }
            }
        }
    });

    // Reset style when window is resized above 1200px
    window.addEventListener("resize", () => {
        if (window.innerWidth > 1200) {
            x.style.left = ""; // remove inline style so CSS handles it
        }
    });


    //adding eventlistener to previosBtn 
    previousBtn.addEventListener("click",() => {
        console.log("previous clicked");
        let index=songs.indexOf(currentSong.src.split("/songs/")[1])
        if((index-1) >= 0){
            playMusic(songs[index-1]);
        }   
    })
    //adding eventlistener to  next 
    nextBtn.addEventListener("click",() => {
        console.log("next clicked");
        let index=songs.indexOf(currentSong.src.split("/songs/")[1])
        if((index+1) < songs.length-1){
            playMusic(songs[index+1]);
        }  
    })
    // adding event listener to the range for volume handling
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change",(e) => {
        console.log("Setting voluem "+e.target.value+" out of 100");
        currentSong.volume=parseInt(e.target.value)/100;
    })
}
main()