import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCpMgZ4DkpqfNvCisH-IJjlxP_r6S5LKU",
  authDomain: "fancalmmstz.firebaseapp.com",
  projectId: "fancalmmstz",
  storageBucket: "fancalmmstz.firebasestorage.app",
  messagingSenderId: "671096603122",
  appId: "1:671096603122:web:f1d7de0cda877d7330eb6b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let playlists = [];
let videos = [];
let selectedPlaylistId = null;
let editingPlaylistId = null;
let editingVideoId = null;
let currentPlaylistId = null;
let currentVideoId = null;

function pageName(){
  return document.body.dataset.page || "";
}

function escapeHTML(text){
  return String(text || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;");
}

function jsString(text){
  return String(text || "")
    .replaceAll("\\","\\\\")
    .replaceAll("'","\\'");
}

function sortByOrderDesc(list, key = "order"){
  return [...list].sort((a,b) => Number(b[key] || 0) - Number(a[key] || 0));
}

function extractYouTubeVideoId(url){
  const text = String(url || "").trim();

  try{
    const parsedUrl = new URL(text);

    if(parsedUrl.hostname.includes("youtube.com")){
      if(parsedUrl.pathname.includes("/shorts/")){
        return parsedUrl.pathname.split("/shorts/")[1].split("/")[0];
      }

      return parsedUrl.searchParams.get("v") || text;
    }

    if(parsedUrl.hostname.includes("youtu.be")){
      return parsedUrl.pathname.replace("/", "").split("?")[0];
    }
  }catch(e){}

  return text;
}

function extractSoopVodId(url){
  const text = String(url || "").trim();
  const matched = text.match(/player\/([0-9]+)/);

  if(matched && matched[1]){
    return matched[1];
  }

  return "";
}

function getSoopEmbedUrl(url){
  const text = String(url || "").trim();

  if(text.includes("/embed")){
    return text;
  }

  const vodId = extractSoopVodId(text);

  if(vodId){
    return `https://vod.sooplive.com/player/${vodId}/embed?showChat=false&autoPlay=false&mutePlay=false`;
  }

  return text;
}

function extractStreamableId(url){
  const text = String(url || "").trim();

  try{
    const parsedUrl = new URL(text);

    if(parsedUrl.hostname.includes("streamable.com")){
      return parsedUrl.pathname.replace("/", "").split("/")[0];
    }
  }catch(e){}

  return text;
}

function getStreamableEmbedUrl(url){
  const id = extractStreamableId(url);
  return `https://streamable.com/e/${id}?autoplay=0`;
}

function getVideoIdByPlatform(platform, url){
  if(platform === "youtube"){
    return extractYouTubeVideoId(url);
  }

  if(platform === "soop"){
    const vodId = extractSoopVodId(url);
    return vodId ? `soop-${vodId}` : `soop-${Date.now()}`;
  }

  if(platform === "streamable"){
    const id = extractStreamableId(url);
    return id ? `streamable-${id}` : `streamable-${Date.now()}`;
  }

  return `external-${Date.now()}`;
}

function getVideoThumb(video){
  if(video.thumb){
    return video.thumb;
  }

  if(video.platform === "youtube"){
    return `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
  }

  if(video.platform === "soop"){
    return "./icons/soop-logo.png";
  }

  if(video.platform === "streamable"){
    return "./icons/streamable-logo.png";
  }

  return "./icons/video-logo.png";
}

async function loadPlaylists(){
  const q = query(collection(db, "playlists"), orderBy("order", "desc"));
  const snapshot = await getDocs(q);

  playlists = [];

  snapshot.forEach(docSnap => {
    playlists.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });
}

async function loadVideos(){
  const q = query(collection(db, "playlistVideos"), orderBy("priority", "desc"));
  const snapshot = await getDocs(q);

  videos = [];

  snapshot.forEach(docSnap => {
    videos.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });
}

async function reloadAll(){
  await loadPlaylists();
  await loadVideos();

  if(pageName() === "playlist-manager"){
    renderManager();
  }

  if(pageName() === "playlist"){
    renderPlaylistPage();
  }
}

/* =========================
   관리자 페이지
========================= */

window.savePlaylistToFirebase = async function(){
  const name = document.getElementById("playlistName").value.trim();
  const order = Number(document.getElementById("playlistOrder").value || 0);
  const isPublic = document.getElementById("playlistPublic").value === "public";

  if(!name){
    alert("재생목록 이름을 입력해주세요.");
    return;
  }

  if(editingPlaylistId){
    await updateDoc(doc(db, "playlists", editingPlaylistId), {
      name,
      order,
      public: isPublic
    });

    alert("재생목록이 수정되었습니다.");
  }else{
    await addDoc(collection(db, "playlists"), {
      name,
      order,
      public: isPublic,
      createdAt: new Date().toISOString()
    });

    alert("재생목록이 생성되었습니다.");
  }

  clearPlaylistForm();
  await reloadAll();
};

window.editPlaylistFromFirebase = function(id){
  const playlist = playlists.find(p => p.id === id);

  if(!playlist){
    alert("재생목록을 찾을 수 없습니다.");
    return;
  }

  editingPlaylistId = id;
  selectedPlaylistId = id;

  document.getElementById("playlistName").value = playlist.name || "";
  document.getElementById("playlistOrder").value = playlist.order || 0;
  document.getElementById("playlistPublic").value = playlist.public === false ? "private" : "public";

  const button = document.getElementById("playlistSaveButton");

  if(button){
    button.textContent = "재생목록 수정 저장";
  }

  renderManager();
};

window.deletePlaylistFromFirebase = async function(id){
  const playlist = playlists.find(p => p.id === id);

  if(!playlist){
    alert("재생목록을 찾을 수 없습니다.");
    return;
  }

  if(!confirm(`"${playlist.name}" 재생목록을 삭제할까요?\n해당 재생목록의 영상도 함께 삭제됩니다.`)){
    return;
  }

  const targetVideos = videos.filter(v => v.playlistId === id);

  for(const video of targetVideos){
    await deleteDoc(doc(db, "playlistVideos", video.id));
  }

  await deleteDoc(doc(db, "playlists", id));

  if(selectedPlaylistId === id){
    selectedPlaylistId = null;
  }

  alert("재생목록이 삭제되었습니다.");
  await reloadAll();
};

function clearPlaylistForm(){
  editingPlaylistId = null;

  const name = document.getElementById("playlistName");
  const order = document.getElementById("playlistOrder");
  const isPublic = document.getElementById("playlistPublic");
  const button = document.getElementById("playlistSaveButton");

  if(name) name.value = "";
  if(order) order.value = "1";
  if(isPublic) isPublic.value = "public";
  if(button) button.textContent = "재생목록 저장";
}

window.clearPlaylistForm = clearPlaylistForm;

window.selectPlaylistForManager = function(id){
  selectedPlaylistId = id;

  const select = document.getElementById("videoPlaylist");

  if(select){
    select.value = id;
  }

  renderManager();
};

window.savePlaylistVideoToFirebase = async function(){
  const title = document.getElementById("videoTitle").value.trim();
  const platform = document.getElementById("videoPlatform").value;
  const url = document.getElementById("videoUrl").value.trim();
  const thumb = document.getElementById("videoThumb").value.trim();
  const playlistId = document.getElementById("videoPlaylist").value;
  const priority = Number(document.getElementById("videoPriority").value || 0);
  const isPublic = document.getElementById("videoPublic").value === "public";

  if(!title){
    alert("영상 제목을 입력해주세요.");
    return;
  }

  if(!url){
    alert("영상 URL을 입력해주세요.");
    return;
  }

  if(!playlistId){
    alert("재생목록을 선택해주세요.");
    return;
  }

  const videoId = getVideoIdByPlatform(platform, url);

  if(editingVideoId){
    await updateDoc(doc(db, "playlistVideos", editingVideoId), {
      title,
      platform,
      url,
      thumb,
      playlistId,
      priority,
      public: isPublic,
      videoId
    });

    alert("영상 정보가 수정되었습니다.");
  }else{
    await addDoc(collection(db, "playlistVideos"), {
      title,
      platform,
      url,
      thumb,
      playlistId,
      priority,
      public: isPublic,
      videoId,
      createdAt: new Date().toISOString()
    });

    alert("영상이 추가되었습니다.");
  }

  selectedPlaylistId = playlistId;

  clearVideoForm();
  await reloadAll();
};

window.editVideoFromFirebase = function(id){
  const video = videos.find(v => v.id === id);

  if(!video){
    alert("영상을 찾을 수 없습니다.");
    return;
  }

  editingVideoId = id;
  selectedPlaylistId = video.playlistId;

  document.getElementById("videoTitle").value = video.title || "";
  document.getElementById("videoPlatform").value = video.platform || "youtube";
  document.getElementById("videoUrl").value = video.url || "";
  document.getElementById("videoThumb").value = video.thumb || "";
  document.getElementById("videoPlaylist").value = video.playlistId || "";
  document.getElementById("videoPriority").value = video.priority || 0;
  document.getElementById("videoPublic").value = video.public === false ? "private" : "public";

  const button = document.getElementById("videoSaveButton");

  if(button){
    button.textContent = "영상 수정 저장";
  }

  renderManager();

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });
};

window.deleteVideoFromFirebase = async function(id){
  if(!confirm("영상을 삭제할까요?")){
    return;
  }

  await deleteDoc(doc(db, "playlistVideos", id));

  alert("영상이 삭제되었습니다.");
  await reloadAll();
};

function clearVideoForm(){
  editingVideoId = null;

  const title = document.getElementById("videoTitle");
  const platform = document.getElementById("videoPlatform");
  const url = document.getElementById("videoUrl");
  const thumb = document.getElementById("videoThumb");
  const playlist = document.getElementById("videoPlaylist");
  const priority = document.getElementById("videoPriority");
  const isPublic = document.getElementById("videoPublic");
  const button = document.getElementById("videoSaveButton");

  if(title) title.value = "";
  if(platform) platform.value = "youtube";
  if(url) url.value = "";
  if(thumb) thumb.value = "";
  if(playlist && selectedPlaylistId) playlist.value = selectedPlaylistId;
  if(priority) priority.value = "1";
  if(isPublic) isPublic.value = "public";
  if(button) button.textContent = "영상 추가";
}

window.clearVideoForm = clearVideoForm;

function renderManager(){
  renderPlaylistSelect();
  renderPlaylistList();
  renderVideoListForManager();
}

function renderPlaylistSelect(){
  const select = document.getElementById("videoPlaylist");

  if(!select) return;

  select.innerHTML = sortByOrderDesc(playlists).map(playlist => `
    <option value="${escapeHTML(playlist.id)}">
      ${escapeHTML(playlist.name)}
    </option>
  `).join("");

  if(!selectedPlaylistId && playlists.length){
    selectedPlaylistId = sortByOrderDesc(playlists)[0].id;
  }

  if(selectedPlaylistId){
    select.value = selectedPlaylistId;
  }
}

function renderPlaylistList(){
  const area = document.getElementById("playlistList");

  if(!area) return;

  if(!playlists.length){
    area.innerHTML = `
      <div class="empty">
        생성된 재생목록이 없습니다.
      </div>
    `;
    return;
  }

  area.innerHTML = sortByOrderDesc(playlists).map(playlist => {
    const active = playlist.id === selectedPlaylistId ? "active" : "";
    const count = videos.filter(v => v.playlistId === playlist.id).length;

    return `
      <div class="playlist-item ${active}" onclick="selectPlaylistForManager('${jsString(playlist.id)}')">
        <div class="playlist-name">
          ${escapeHTML(playlist.name)}
        </div>

        <div class="small-info">
          우선순위: ${Number(playlist.order || 0)}
          / ${playlist.public === false ? "비공개" : "공개"}
          / 영상 ${count}개
        </div>

        <div class="item-actions">
          <button onclick="event.stopPropagation(); editPlaylistFromFirebase('${jsString(playlist.id)}')">
            수정
          </button>

          <button onclick="event.stopPropagation(); deletePlaylistFromFirebase('${jsString(playlist.id)}')">
            삭제
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function renderVideoListForManager(){
  const area = document.getElementById("videoList");

  if(!area) return;

  if(!selectedPlaylistId && playlists.length){
    selectedPlaylistId = sortByOrderDesc(playlists)[0].id;
  }

  const list = sortByOrderDesc(
    videos.filter(v => v.playlistId === selectedPlaylistId),
    "priority"
  );

  if(!list.length){
    area.innerHTML = `
      <div class="empty">
        등록된 영상이 없습니다.
      </div>
    `;
    return;
  }

  area.innerHTML = list.map(video => `
    <div class="video-item">
      <div class="video-title">
        ${escapeHTML(video.title)}
      </div>

      <div class="video-url">
        ${escapeHTML(video.url)}
      </div>

      <div class="small-info">
        플랫폼: ${escapeHTML(video.platform || "youtube")}
        / 우선순위: ${Number(video.priority || 0)}
        / ${video.public === false ? "비공개" : "공개"}
      </div>

      <div class="item-actions">
        <button onclick="editVideoFromFirebase('${jsString(video.id)}')">
          수정
        </button>

        <button onclick="window.open('${jsString(video.url)}','_blank')">
          보기
        </button>

        <button onclick="deleteVideoFromFirebase('${jsString(video.id)}')">
          삭제
        </button>
      </div>
    </div>
  `).join("");
}

/* =========================
   사용자 재생 페이지
========================= */

function renderPlaylistPage(){
  const publicPlaylists = sortByOrderDesc(
    playlists.filter(p => p.public !== false)
  );

  if(!publicPlaylists.length){
    const tabArea = document.getElementById("playlistTabArea");
    const listArea = document.getElementById("youtubeList");
    const playerBox = document.getElementById("playerBox");

    if(tabArea){
      tabArea.innerHTML = `
        <div class="empty-playlist">
          공개된 재생목록이 없습니다.
        </div>
      `;
    }

    if(listArea){
      listArea.innerHTML = `
        <div class="empty-playlist">
          등록된 영상이 없습니다.
        </div>
      `;
    }

    if(playerBox){
      playerBox.innerHTML = "";
    }

    return;
  }

  if(!currentPlaylistId || !publicPlaylists.some(p => p.id === currentPlaylistId)){
    currentPlaylistId = publicPlaylists[0].id;
  }

  renderPlaylistTabs(publicPlaylists);
  renderVideoListForPlaylist();
}

function isNewVideo(video){
  if(!video.createdAt) return false;

  const created = new Date(video.createdAt);

  if(Number.isNaN(created.getTime())){
    return false;
  }

  const now = new Date();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const diff = now.getTime() - created.getTime();

  return diff >= 0 && diff < sevenDays;
}

function playlistHasNewVideo(playlistId){
  return videos.some(video =>
    video.playlistId === playlistId &&
    video.public !== false &&
    isNewVideo(video)
  );
}


function renderPlaylistTabs(publicPlaylists){
  const area = document.getElementById("playlistTabArea");

  if(!area) return;

  area.innerHTML = publicPlaylists.map(playlist => {
    const active = playlist.id === currentPlaylistId ? "active" : "";
    const isNew = playlistHasNewVideo(playlist.id);

    return `
      <button
        type="button"
        class="playlist-tab ${active}"
        onclick="selectPlaylistForPlayer('${jsString(playlist.id)}')"
      >
        ${escapeHTML(playlist.name)}
        ${isNew ? `<span class="playlist-new-badge">NEW</span>` : ""}
      </button>
    `;
  }).join("");
}

window.selectPlaylistForPlayer = function(id){
  currentPlaylistId = id;
  currentVideoId = null;

  renderPlaylistPage();
};

function renderVideoListForPlaylist(){
  const playlist = playlists.find(p => p.id === currentPlaylistId);
  const title = document.getElementById("youtubeListTitle");
  const listArea = document.getElementById("youtubeList");
  const playerBox = document.getElementById("playerBox");

  if(!playlist || !listArea || !playerBox){
    return;
  }

  if(title){
    title.textContent = playlist.name || "재생목록";
  }

  const list = sortByOrderDesc(
    videos.filter(v =>
      v.playlistId === currentPlaylistId &&
      v.public !== false
    ),
    "priority"
  );

  if(!list.length){
    listArea.innerHTML = `
      <div class="empty-playlist">
        공개된 영상이 없습니다.
      </div>
    `;

    playerBox.innerHTML = "";
    return;
  }

  if(!currentVideoId || !list.some(v => v.id === currentVideoId)){
    currentVideoId = list[0].id;
    setPlayer(list[0], false);
  }

  listArea.innerHTML = list.map(video => {
    const active = video.id === currentVideoId ? "active" : "";

    return `
      <button
        type="button"
        class="youtube-item ${active}"
        onclick="playPlaylistVideo('${jsString(video.id)}')"
      >
        <img
          class="${video.platform === 'soop' ? 'soop-thumb' : ''}"
          src="${getVideoThumb(video)}"
          alt="${escapeHTML(video.title)}"
        >

        <div>
          <div class="youtube-item-title">
            ${escapeHTML(video.title)}
          </div>
        </div>
      </button>
    `;
  }).join("");
}

window.playPlaylistVideo = function(id){
  const video = videos.find(v => v.id === id);

  if(!video){
    return;
  }

  currentVideoId = id;
  setPlayer(video, false);
  renderVideoListForPlaylist();
};

function setPlayer(video, autoplay){
  const playerBox = document.getElementById("playerBox");

  if(!playerBox) return;

  if(video.platform === "youtube" || !video.platform){
    playerBox.innerHTML = `
      <iframe
        id="youtubePlayer"
        src="https://www.youtube.com/embed/${escapeHTML(video.videoId)}?rel=0${autoplay ? "&autoplay=1" : ""}"
        title="YouTube video player"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen>
      </iframe>
    `;
    return;
  }

  if(video.platform === "soop"){
    playerBox.innerHTML = `
      <iframe
        id="soop_player_video"
        src="${getSoopEmbedUrl(video.url)}"
        width="100%"
        height="100%"
        frameborder="0"
        allowfullscreen="true"
        allow="clipboard-write; web-share;"
        style="width:100%;height:100%;border:0;display:block;">
      </iframe>
    `;
    return;
  }

  if(video.platform === "streamable"){
    playerBox.innerHTML = `
      <iframe
        src="${getStreamableEmbedUrl(video.url)}"
        width="100%"
        height="100%"
        frameborder="0"
        allowfullscreen
        style="width:100%;height:100%;border:0;display:block;">
      </iframe>
    `;
    return;
  }

  playerBox.innerHTML = `
    <div class="vod-placeholder">
      <div class="vod-placeholder-title">외부 VOD</div>

      <button
        type="button"
        class="vod-open-button"
        onclick="window.open('${jsString(video.url)}', '_blank')"
      >
        새 창으로 보기
      </button>
    </div>
  `;
}

/* =========================
   초기 실행
========================= */

async function initPlaylist(){
  try{
    await reloadAll();
  }catch(error){
    console.error("플레이리스트 초기화 실패", error);
  }
}

window.addEventListener("load", initPlaylist);

window.importJsonTextToFirebase = async function(){
  const textarea = document.getElementById("importJsonText");

  if(!textarea){
    alert("JSON 입력칸을 찾을 수 없습니다.");
    return;
  }

  let text = textarea.value.trim();

  if(!text){
    alert("JSON 텍스트를 붙여넣어 주세요.");
    return;
  }

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if(start === -1 || end === -1 || end <= start){
    alert("JSON 본문을 찾을 수 없습니다.");
    return;
  }

  text = text.slice(start, end + 1);

  let localData;

  try{
    localData = JSON.parse(text);
  }catch(error){
    alert("JSON 형식이 올바르지 않습니다.");
    console.error(error);
    return;
  }

  if(!localData.playlists || !Array.isArray(localData.playlists)){
    alert("playlists 배열이 없습니다.");
    return;
  }

  if(!confirm("붙여넣은 JSON 데이터를 Firebase로 옮길까요? 중복 저장될 수 있습니다.")){
    return;
  }

  for(const [playlistIndex, playlist] of localData.playlists.entries()){
    const playlistRef = await addDoc(collection(db, "playlists"), {
      name: playlist.name || "이름 없는 재생목록",
      order: Number(playlist.order || localData.playlists.length - playlistIndex),
      public: playlist.public !== false,
      createdAt: new Date().toISOString()
    });

    for(const video of playlist.videos || []){
      await addDoc(collection(db, "playlistVideos"), {
        title: video.title || "제목 없는 영상",
        platform: video.platform || "youtube",
        url: video.url || "",
        thumb: video.thumb || "",
        playlistId: playlistRef.id,
        priority: Number(video.priority || 1),
        public: video.public !== false,
        videoId: video.videoId || getVideoIdByPlatform(video.platform || "youtube", video.url || ""),
        createdAt: new Date().toISOString()
      });
    }
  }

  alert("Firebase 이전이 완료되었습니다.");

  textarea.value = "";

  await reloadAll();
};

function setActiveNav(){
  const page = document.body.dataset.page || "";

  document.querySelectorAll(".nav a").forEach(a => {
    a.classList.toggle("active", a.dataset.page === page);
  });
}

window.addEventListener("load", setActiveNav);
