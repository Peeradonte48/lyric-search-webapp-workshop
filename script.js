const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const apiUrl = "https://api.lyrics.ovh";

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const songText = search.value.trim();

  if (!songText) {
    alert("Invalid plaese try again");
  } else {
    searchLyrics(songText);
  }
});

async function searchLyrics(songText) {
  const respond = await fetch(`${apiUrl}/suggest/${songText}`);
  const allSongs = await respond.json();
  showData(allSongs);
  console.log(allSongs);
}

function showData(allSongs) {
  result.innerHTML = `
    <ul class="songs">
        ${allSongs.data
          .map(
            (song) =>
              `<li><span>
                <strong>${song.artist.name}</strong> - ${song.title}
            </span>
            <button class= "btn"
            data-artist="${song.artist.name}"
            data-song="${song.title}" >Lyric</button>
            </li>`
          )
          .join("")}
    </ul>`;

  if (allSongs.next || allSongs.prev) {
    more.innerHTML = `
      ${
        allSongs.prev
          ? `<button class="btn" onclick="getMoreSongs('${allSongs.prev}')">Previous</button>`
          : ""
      }
      ${
        allSongs.next
          ? `<button class="btn" onclick="getMoreSongs('${allSongs.next}')">Next</button>`
          : ""
      }
      `;
  } else {
    more.innerHTML = "";
  }
  // console.log(allSongs);
}

async function getMoreSongs(songUrl) {
  console.log(songUrl);
  const respond = await fetch(`https://cors-anywhere.herokuapp.com/${songUrl}`);
  const allSongsUrl = await respond.json();
  showData(allSongsUrl);
}

result.addEventListener("click", (event) => {
  const clickEl = event.target;

  if (clickEl.tagName == "BUTTON") {
    const artist = clickEl.getAttribute("data-artist");
    const songName = clickEl.getAttribute("data-song");
    getLyric(artist, songName);

    console.log(artist, songName);
  }
});

async function getLyric(artist, songName) {
  const respond = await fetch(`${apiUrl}/v1/${artist}/${songName}`);
  const data = await respond.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
  console.log(data);
  if (lyrics) {
    result.innerHTML = `<h2>
                ${artist} - ${songName}
            </h2>
            <span>${lyrics}</span>
            `;
  } else {
    result.innerHTML = `<h2>
    ${artist} - ${songName}
</h2>
<span>No lyric available</span>
`;
  }
  more.innerHTML = "";
}
