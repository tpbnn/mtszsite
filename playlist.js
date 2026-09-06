import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  setDoc,
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
let autoSources = [];
let editingAutoSourceId = null;
const publicVideoCache = new Map();

let selectedPlaylistId = null;
let editingPlaylistId = null;
let editingVideoId = null;

let currentPlaylistId = null;
let currentVideoId = null;

let autoImportRunning = false;

const AUTO_IMPORT_STORAGE_KEY =
  "calmMonstarzYoutubePlaylistAutoImport";

/* =========================
   공통 함수
========================= */

function pageName() {
  return document.body.dataset.page || "";
}

function escapeHTML(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function jsString(text) {
  return String(text || "")
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'");
}

function sortByOrderDesc(list, key = "order") {
  return [...list].sort(
    (a, b) => Number(b[key] || 0) - Number(a[key] || 0)
  );
}

/* =========================
   영상 ID 추출
========================= */

function extractYouTubeVideoId(url) {
  const text = String(url || "").trim();

  try {
    const parsedUrl = new URL(text);

    if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname.includes("/shorts/")) {
        return parsedUrl.pathname
          .split("/shorts/")[1]
          .split("/")[0];
      }

      return parsedUrl.searchParams.get("v") || text;
    }

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname
        .replace("/", "")
        .split("?")[0];
    }
  } catch (error) {}

  return text;
}

function extractSoopVodId(url) {
  const text = String(url || "").trim();
  const matched = text.match(/player\/([0-9]+)/);

  if (matched && matched[1]) {
    return matched[1];
  }

  return "";
}

function getSoopEmbedUrl(url) {
  const text = String(url || "").trim();

  if (text.includes("/embed")) {
    return text;
  }

  const vodId = extractSoopVodId(text);

  if (vodId) {
    return (
      `https://vod.sooplive.com/player/${vodId}/embed` +
      `?showChat=false&autoPlay=false&mutePlay=false`
    );
  }

  return text;
}

function extractStreamableId(url) {
  const text = String(url || "").trim();

  try {
    const parsedUrl = new URL(text);

    if (parsedUrl.hostname.includes("streamable.com")) {
      return parsedUrl.pathname
        .replace("/", "")
        .split("/")[0];
    }
  } catch (error) {}

  return text;
}

function getStreamableEmbedUrl(url) {
  const id = extractStreamableId(url);

  return `https://streamable.com/e/${id}?autoplay=0`;
}

function getVideoIdByPlatform(platform, url) {
  if (platform === "youtube") {
    return extractYouTubeVideoId(url);
  }

  if (platform === "soop") {
    const vodId = extractSoopVodId(url);

    return vodId
      ? `soop-${vodId}`
      : `soop-${Date.now()}`;
  }

  if (platform === "streamable") {
    const id = extractStreamableId(url);

    return id
      ? `streamable-${id}`
      : `streamable-${Date.now()}`;
  }

  return `external-${Date.now()}`;
}

function getVideoThumb(video) {
  if (video.thumb) {
    return video.thumb;
  }

  if (video.platform === "youtube") {
    return (
      `https://img.youtube.com/vi/` +
      `${video.videoId}/hqdefault.jpg`
    );
  }

  if (video.platform === "soop") {
    return "./icons/soop-logo.png";
  }

  if (video.platform === "streamable") {
    return "./icons/streamable-logo.png";
  }

  return "./icons/video-logo.png";
}

/* =========================
   YouTube 재생목록 자동 등록
========================= */

function extractYouTubePlaylistId(value){
  const text = String(value || "").trim();

  if(!text) return "";

  try{
    const parsedUrl = new URL(text);
    return parsedUrl.searchParams.get("list") || "";
  }catch(error){
    return /^[A-Za-z0-9_-]+$/.test(text) ? text : "";
  }
}

/* =========================
   채널/재생목록 주소 판별
========================= */

function parseYouTubeSource(value){
  const text = String(value || "").trim();

  if(!text){
    return null;
  }

  try{
    const parsedUrl = new URL(text);

    /*
      주소에 list=가 있다면
      YouTube 재생목록으로 처리합니다.
    */
    const playlistId =
      parsedUrl.searchParams.get("list");

    if(playlistId){
      return {
        type: "playlist",
        playlistId
      };
    }

    const parts = parsedUrl.pathname
      .split("/")
      .filter(Boolean)
      .map(part => decodeURIComponent(part));

    /*
      예:
      https://www.youtube.com/@fresh290
    */
    if(parts[0]?.startsWith("@")){
      return {
        type: "channel",
        filter: "forHandle",
        value: parts[0]
      };
    }

    /*
      예:
      https://www.youtube.com/channel/UCxxxx
    */
    if(
      parts[0] === "channel" &&
      parts[1]
    ){
      return {
        type: "channel",
        filter: "id",
        value: parts[1]
      };
    }

    /*
      예전 형식:
      https://www.youtube.com/user/사용자명
    */
    if(
      parts[0] === "user" &&
      parts[1]
    ){
      return {
        type: "channel",
        filter: "forUsername",
        value: parts[1]
      };
    }

    return null;
  }catch(error){
    /*
      @fresh290처럼 핸들만 입력한 경우
    */
    if(text.startsWith("@")){
      return {
        type: "channel",
        filter: "forHandle",
        value: text
      };
    }

    /*
      UC로 시작하는 채널 ID를 입력한 경우
    */
    if(
      /^UC[A-Za-z0-9_-]{20,}$/.test(text)
    ){
      return {
        type: "channel",
        filter: "id",
        value: text
      };
    }

    /*
      PL 또는 UU 등 YouTube 재생목록 ID를
      직접 입력한 경우
    */
    if(
      /^[A-Za-z0-9_-]+$/.test(text)
    ){
      return {
        type: "playlist",
        playlistId: text
      };
    }

    return null;
  }
}

/* =========================
   채널의 업로드 재생목록 조회
========================= */

async function resolveYouTubeSource(
  apiKey,
  sourceValue
){
  const source =
    parseYouTubeSource(sourceValue);

  if(!source){
    throw new Error(
      "YouTube 채널 주소 또는 " +
      "재생목록 주소를 확인해주세요."
    );
  }

  /*
    일반 재생목록이면 그대로 반환합니다.
  */
  if(source.type === "playlist"){
    return {
      sourceType: "playlist",
      playlistId: source.playlistId,
      sourceName: "YouTube 재생목록",
      channelId: ""
    };
  }

  /*
    채널 주소라면 채널의 업로드 재생목록 ID를
    YouTube API로 가져옵니다.
  */
  const params = new URLSearchParams({
    part: "contentDetails,snippet",
    key: apiKey
  });

  params.set(
    source.filter,
    source.value
  );

  const response = await fetch(
    "https://www.googleapis.com/youtube/v3/" +
    `channels?${params}`
  );

  const data = await response.json();

  if(!response.ok){
    const message =
      data?.error?.message ||
      "YouTube 채널 정보를 불러오지 못했습니다.";

    throw new Error(message);
  }

  const channel =
    data.items?.[0];

  const uploadsPlaylistId =
    channel
      ?.contentDetails
      ?.relatedPlaylists
      ?.uploads;

  if(
    !channel ||
    !uploadsPlaylistId
  ){
    throw new Error(
      "채널을 찾지 못했습니다. " +
      "@핸들 주소 또는 /channel/ 채널 주소를 " +
      "입력해주세요."
    );
  }

  return {
    sourceType: "channel",
    playlistId: uploadsPlaylistId,
    sourceName:
      channel.snippet?.title ||
      source.value,
    channelId:
      channel.id || ""
  };
}

/* =========================
   자동 등록 설정 저장/불러오기
========================= */

function readAutoImportConfig(){
  try{
    const saved = localStorage.getItem(
      AUTO_IMPORT_STORAGE_KEY
    );

    return JSON.parse(saved || "{}") || {};
  }catch(error){
    console.error(
      "자동 등록 설정을 읽지 못했습니다.",
      error
    );

    return {};
  }
}

function writeAutoImportConfig(config){
  localStorage.setItem(
    AUTO_IMPORT_STORAGE_KEY,
    JSON.stringify(config)
  );
}

function getAutoImportFormConfig(){
  return {
    enabled:
      document
        .getElementById("autoImportEnabled")
        ?.checked === true,

    apiKey:
      document
        .getElementById("youtubeApiKey")
        ?.value.trim() || "",

    sourcePlaylist:
      document
        .getElementById("youtubeSourcePlaylist")
        ?.value.trim() || "",

    targetPlaylistId:
      document
        .getElementById("autoTargetPlaylist")
        ?.value || "",

    priority: Number(
      document
        .getElementById("autoVideoPriority")
        ?.value || 1
    ),

    isPublic:
      (
        document
          .getElementById("autoVideoPublic")
          ?.value || "public"
      ) === "public",

    maxResults: Math.min(
      50,
      Math.max(
        1,
        Number(
          document
            .getElementById("autoImportCount")
            ?.value || 5
        )
      )
    )
  };
}

function fillAutoImportForm(){
  const config =
    readAutoImportConfig();

  const enabled =
    document.getElementById(
      "autoImportEnabled"
    );

  const apiKey =
    document.getElementById(
      "youtubeApiKey"
    );

  const source =
    document.getElementById(
      "youtubeSourcePlaylist"
    );

  const target =
    document.getElementById(
      "autoTargetPlaylist"
    );

  const priority =
    document.getElementById(
      "autoVideoPriority"
    );

  const isPublic =
    document.getElementById(
      "autoVideoPublic"
    );

  const count =
    document.getElementById(
      "autoImportCount"
    );

  if(enabled){
    enabled.checked =
      config.enabled === true;
  }

  if(apiKey){
    apiKey.value =
      config.apiKey || "";
  }

  if(source){
    source.value =
      config.sourcePlaylist || "";
  }

  if(priority){
    priority.value =
      Number(config.priority ?? 1);
  }

  if(isPublic){
    isPublic.value =
      config.isPublic === false
        ? "private"
        : "public";
  }

  if(count){
    count.value = Math.min(
      50,
      Math.max(
        1,
        Number(config.maxResults || 5)
      )
    );
  }

  if(target){
    target.innerHTML =
      sortByOrderDesc(playlists)
        .map(playlist => `
          <option value="${escapeHTML(playlist.id)}">
            ${escapeHTML(playlist.name)}
          </option>
        `)
        .join("");

    const savedTarget =
      config.targetPlaylistId || "";

    target.value = playlists.some(
      playlist =>
        playlist.id === savedTarget
    )
      ? savedTarget
      : (
          sortByOrderDesc(playlists)[0]?.id ||
          ""
        );
  }
}

function setAutoImportStatus(
  message,
  type = "info"
){
  const area =
    document.getElementById(
      "autoImportStatus"
    );

  if(!area){
    return;
  }

  area.textContent = message;
  area.dataset.type = type;
}

/* =========================
   YouTube 영상 목록 조회
========================= */

async function fetchYouTubePlaylistItems(
  apiKey,
  playlistId,
  maxResults
){
  const params = new URLSearchParams({
    part: "snippet,contentDetails",
    playlistId,
    maxResults: String(maxResults),
    key: apiKey
  });

  const response = await fetch(
    "https://www.googleapis.com/youtube/v3/" +
    `playlistItems?${params}`
  );

  const data = await response.json();

  if(!response.ok){
    const message =
      data?.error?.message ||
      "YouTube 영상 목록을 불러오지 못했습니다.";

    throw new Error(message);
  }

  return (data.items || []).filter(item => {
    const title =
      item?.snippet?.title || "";

    const videoId =
      item?.contentDetails?.videoId ||
      item?.snippet?.resourceId?.videoId;

    return (
      videoId &&
      title !== "Deleted video" &&
      title !== "Private video"
    );
  });
}

/* =========================
   채널/재생목록 자동 등록 실행
========================= */

async function runYoutubePlaylistAutoImport(
  {manual = false} = {}
){
  if(autoImportRunning){
    return;
  }

  const config = manual
    ? getAutoImportFormConfig()
    : readAutoImportConfig();

  if(
    !manual &&
    config.enabled !== true
  ){
    return;
  }

  if(
    !config.apiKey ||
    !config.sourcePlaylist ||
    !config.targetPlaylistId
  ){
    if(manual){
      alert(
        "YouTube API 키, " +
        "YouTube 채널/재생목록, " +
        "등록할 재생목록을 모두 입력해주세요."
      );
    }

    return;
  }

  autoImportRunning = true;

  setAutoImportStatus(
    "YouTube 채널/재생목록을 확인하고 있습니다…"
  );

  try{
    /*
      입력값이 채널인지 재생목록인지 판별하고
      실제 조회할 재생목록 ID를 가져옵니다.
    */
    const sourceInfo =
      await resolveYouTubeSource(
        config.apiKey,
        config.sourcePlaylist
      );

    const sourcePlaylistId =
      sourceInfo.playlistId;

    const items =
      await fetchYouTubePlaylistItems(
        config.apiKey,
        sourcePlaylistId,
        Math.min(
          50,
          Math.max(
            1,
            Number(config.maxResults || 5)
          )
        )
      );

    /*
      같은 내부 재생목록에 등록된 영상 ID를
      확인하여 중복 등록을 막습니다.
    */
    const existingIds = new Set(
      videos
        .filter(
          video =>
            video.playlistId ===
            config.targetPlaylistId
        )
        .map(
          video =>
            String(video.videoId || "")
        )
    );

    const newItems = items.filter(item => {
      const videoId =
        item.contentDetails?.videoId ||
        item.snippet?.resourceId?.videoId;

      return !existingIds.has(
        String(videoId)
      );
    });

    /*
      새 영상만 Firebase에 저장합니다.
    */
    for(
      const item
      of [...newItems].reverse()
    ){
      const videoId =
        item.contentDetails?.videoId ||
        item.snippet?.resourceId?.videoId;

      const thumbnails =
        item.snippet?.thumbnails || {};

      const thumb =
        thumbnails.maxres?.url ||
        thumbnails.standard?.url ||
        thumbnails.high?.url ||
        thumbnails.medium?.url ||
        thumbnails.default?.url ||
        "";

      await addDoc(
        collection(
          db,
          "playlistVideos"
        ),
        {
          title:
            item.snippet?.title ||
            "제목 없는 영상",

          platform: "youtube",

          url:
            "https://www.youtube.com/watch?v=" +
            videoId,

          thumb,

          playlistId:
            config.targetPlaylistId,

          priority:
            Number(config.priority || 1),

          public:
            config.isPublic !== false,

          videoId,

          /*
            실제 조회한 재생목록 ID입니다.
            채널인 경우 업로드 재생목록 ID가 저장됩니다.
          */
          sourcePlaylistId,

          /*
            channel 또는 playlist가 저장됩니다.
          */
          sourceType:
            sourceInfo.sourceType,

          sourceName:
            sourceInfo.sourceName,

          sourceChannelId:
            sourceInfo.channelId,

          autoImported: true,

          youtubePlaylistAddedAt:
            item.snippet?.publishedAt || "",

          createdAt:
            new Date().toISOString()
        }
      );

      existingIds.add(
        String(videoId)
      );
    }

    if(newItems.length){
      await loadVideos();
      renderManager();
    }

    const checkedAt =
      new Date().toLocaleString("ko-KR");

    if(newItems.length){
      setAutoImportStatus(
        `${checkedAt} · ` +
        `${sourceInfo.sourceName}에서 ` +
        `새 영상 ${newItems.length}개를 등록했습니다.`,
        "success"
      );
    }else{
      setAutoImportStatus(
        `${checkedAt} · ` +
        `${sourceInfo.sourceName}에 새 영상이 없습니다.`,
        "success"
      );
    }

    if(manual){
      if(newItems.length){
        alert(
          `새 영상 ${newItems.length}개가 ` +
          "등록되었습니다."
        );
      }else{
        alert(
          "새로 등록할 영상이 없습니다."
        );
      }
    }
  }catch(error){
    console.error(
      "YouTube 채널/재생목록 자동 등록 실패",
      error
    );

    setAutoImportStatus(
      `확인 실패: ${error.message}`,
      "error"
    );

    if(manual){
      alert(
        "YouTube 채널/재생목록 확인에 " +
        `실패했습니다.\n${error.message}`
      );
    }
  }finally{
    autoImportRunning = false;
  }
}

/* =========================
   설정 저장 버튼
========================= */

window.saveAutoImportSettings = function(){
  const config =
    getAutoImportFormConfig();

  if(
    config.enabled &&
    (
      !config.apiKey ||
      !config.sourcePlaylist ||
      !config.targetPlaylistId
    )
  ){
    alert(
      "자동 확인을 사용하려면 " +
      "모든 필수 항목을 입력해주세요."
    );

    return;
  }

  writeAutoImportConfig(config);

  setAutoImportStatus(
    "자동 등록 설정을 이 브라우저에 저장했습니다.",
    "success"
  );

  alert(
    "자동 등록 설정이 저장되었습니다."
  );
};

/* =========================
   지금 새 영상 확인 버튼
========================= */

window.checkYoutubePlaylistNow =
  async function(){
    const config =
      getAutoImportFormConfig();

    writeAutoImportConfig(config);

    await runYoutubePlaylistAutoImport({
      manual: true
    });
  };


/* =========================
   Firebase 데이터 불러오기
========================= */

async function loadAutoSources() {
  const snapshot = await getDocs(collection(db, "youtubeAutoSources"));
  autoSources = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
}

function getAutoSourceFormData() {
  return {
    name: document.getElementById("autoSourceName")?.value.trim() || "",
    sourceUrl: document.getElementById("youtubeSourceUrl")?.value.trim() || "",
    targetPlaylistId: document.getElementById("autoTargetPlaylist")?.value || "",
    priority: Number(document.getElementById("autoVideoPriority")?.value || 1),
    maxResults: Math.min(50, Math.max(1, Number(document.getElementById("autoImportCount")?.value || 5))),
    public: (document.getElementById("autoVideoPublic")?.value || "public") === "public",
    enabled: document.getElementById("autoImportEnabled")?.checked === true,
    excludeKeywords: document.getElementById("autoExcludeKeywords")?.value.trim() || ""
  };
}

window.saveAutoSourceToFirebase = async function () {
  const data = getAutoSourceFormData();
  if (!data.name || !data.sourceUrl || !data.targetPlaylistId) {
    alert("설정 이름, YouTube 주소, 등록할 재생목록을 입력해주세요.");
    return;
  }

  const payload = { ...data, updatedAt: new Date().toISOString() };
  if (editingAutoSourceId) {
    await updateDoc(doc(db, "youtubeAutoSources", editingAutoSourceId), payload);
  } else {
    await addDoc(collection(db, "youtubeAutoSources"), {
      ...payload,
      initialized: false,
      knownVideoIds: "",
      createdAt: new Date().toISOString()
    });
  }
  await loadAutoSources();
  clearAutoSourceForm();
  renderAutoSourceList();
};

window.editAutoSource = function (id) {
  const item = autoSources.find(source => source.id === id);
  if (!item) return;
  editingAutoSourceId = id;
  document.getElementById("autoSourceName").value = item.name || "";
  document.getElementById("youtubeSourceUrl").value = item.sourceUrl || "";
  document.getElementById("autoTargetPlaylist").value = item.targetPlaylistId || "";
  document.getElementById("autoVideoPriority").value = Number(item.priority ?? 1);
  document.getElementById("autoImportCount").value = Number(item.maxResults ?? 5);
  document.getElementById("autoVideoPublic").value = item.public === false ? "private" : "public";
  document.getElementById("autoImportEnabled").checked = item.enabled === true;
  const keywords = document.getElementById("autoExcludeKeywords");
  if (keywords) keywords.value = item.excludeKeywords || "";
  const button = document.getElementById("autoSourceSaveButton");
  if (button) button.textContent = "자동등록 설정 수정";
};

function clearAutoSourceForm() {
  editingAutoSourceId = null;
  ["autoSourceName", "youtubeSourceUrl", "autoExcludeKeywords"].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.value = "";
  });
  const priority = document.getElementById("autoVideoPriority");
  const count = document.getElementById("autoImportCount");
  const enabled = document.getElementById("autoImportEnabled");
  if (priority) priority.value = "1";
  if (count) count.value = "5";
  if (enabled) enabled.checked = true;
  const button = document.getElementById("autoSourceSaveButton");
  if (button) button.textContent = "자동등록 설정 추가";
}
window.clearAutoSourceForm = clearAutoSourceForm;

window.deleteAutoSource = async function (id) {
  if (!confirm("이 자동등록 설정을 삭제할까요?")) return;
  await deleteDoc(doc(db, "youtubeAutoSources", id));
  await loadAutoSources();
  renderAutoSourceList();
};

window.toggleAutoSource = async function (id) {
  const item = autoSources.find(source => source.id === id);
  if (!item) return;
  await updateDoc(doc(db, "youtubeAutoSources", id), {
    enabled: item.enabled !== true,
    updatedAt: new Date().toISOString()
  });
  await loadAutoSources();
  renderAutoSourceList();
};

function renderAutoSourceList() {
  const area = document.getElementById("autoSourceList");
  if (!area) return;
  if (!autoSources.length) {
    area.innerHTML = '<div class="empty">등록된 자동등록 설정이 없습니다.</div>';
    return;
  }
  area.innerHTML = autoSources.map(source => {
    const target = playlists.find(item => item.id === source.targetPlaylistId);
    const status = source.enabled === true ? "사용 중" : "중지";
    const last = source.lastCheckedAt ? ` / 최근 확인: ${escapeHTML(source.lastCheckedAt)}` : "";
    const message = source.lastMessage ? `<div class="small-info">${escapeHTML(source.lastMessage)}</div>` : "";
    const excluded = source.excludeKeywords
      ? `<div class="small-info">제외 키워드: ${escapeHTML(source.excludeKeywords)}</div>`
      : "";
    return `<div class="auto-source-item">
      <div class="playlist-name">${escapeHTML(source.name)}</div>
      <div class="video-url">${escapeHTML(source.sourceUrl)}</div>
      <div class="small-info">${status} / 등록 위치: ${escapeHTML(target?.name || "삭제된 재생목록")} / 최근 ${Number(source.maxResults || 5)}개 확인${last}</div>
      ${excluded}${message}
      <div class="item-actions">
        <button onclick="editAutoSource('${jsString(source.id)}')">수정</button>
        <button onclick="toggleAutoSource('${jsString(source.id)}')">${source.enabled === true ? "중지" : "사용"}</button>
        <button onclick="deleteAutoSource('${jsString(source.id)}')">삭제</button>
      </div>
    </div>`;
  }).join("");
}

window.toggleAutoImportMenu = function () {
  const content = document.getElementById("autoImportContent");
  const button = document.getElementById("autoCollapseButton");
  if (!content || !button) return;
  const collapsed = !content.hidden;
  content.hidden = collapsed;
  button.textContent = collapsed ? "펼치기 ▼" : "접기 ▲";
  localStorage.setItem("calmAutoImportCollapsed", collapsed ? "1" : "0");
};

function restoreAutoImportMenuState() {
  const content = document.getElementById("autoImportContent");
  const button = document.getElementById("autoCollapseButton");
  if (!content || !button) return;
  const collapsed = localStorage.getItem("calmAutoImportCollapsed") === "1";
  content.hidden = collapsed;
  button.textContent = collapsed ? "펼치기 ▼" : "접기 ▲";
}

async function rebuildPublicPlaylistCache(silent = false) {
  const publicPlaylists = sortByOrderDesc(playlists.filter(item => item.public !== false));
  const now = new Date().toISOString();
  const indexItems = [];

  for (const playlist of publicPlaylists) {
    const publicVideos = sortByOrderDesc(
      videos.filter(video => video.playlistId === playlist.id && video.public !== false),
      "priority"
    );
    await setDoc(doc(db, "playlistPublicCache", playlist.id), {
      playlistId: playlist.id,
      videos: publicVideos,
      updatedAt: now
    });
    indexItems.push({
      id: playlist.id,
      name: playlist.name || "재생목록",
      order: Number(playlist.order || 0),
      videoCount: publicVideos.length,
      hasNew: publicVideos.some(isNewVideo)
    });
  }

  await setDoc(doc(db, "playlistPublicCache", "index"), {
    playlists: indexItems,
    updatedAt: now
  });
  const status = document.getElementById("publicCacheStatus");
  if (status) {
    status.textContent = `공개용 캐시를 갱신했습니다. 재생목록 ${indexItems.length}개`;
    status.dataset.type = "success";
  }
  if (!silent) alert("공개용 재생목록 캐시를 갱신했습니다.");
}
window.rebuildPublicPlaylistCache = rebuildPublicPlaylistCache;

async function loadPublicIndex() {
  const snapshot = await getDoc(doc(db, "playlistPublicCache", "index"));
  if (!snapshot.exists()) {
    throw new Error("공개용 캐시가 없습니다. 관리자 페이지에서 ‘공개 캐시 다시 만들기’를 한 번 눌러주세요.");
  }
  playlists = snapshot.data().playlists || [];
}

async function loadPublicPlaylistVideos(playlistId) {
  if (publicVideoCache.has(playlistId)) {
    videos = publicVideoCache.get(playlistId);
    return;
  }
  const snapshot = await getDoc(doc(db, "playlistPublicCache", playlistId));
  const list = snapshot.exists() ? (snapshot.data().videos || []) : [];
  publicVideoCache.set(playlistId, list);
  videos = list;
}

async function loadPlaylists() {
  const q = query(
    collection(db, "playlists"),
    orderBy("order", "desc")
  );

  const snapshot = await getDocs(q);

  playlists = [];

  snapshot.forEach(docSnap => {
    playlists.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });
}

async function loadVideos() {
  const q = query(
    collection(db, "playlistVideos"),
    orderBy("priority", "desc")
  );

  const snapshot = await getDocs(q);

  videos = [];

  snapshot.forEach(docSnap => {
    videos.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });
}

async function reloadAll() {
  if (pageName() === "playlist-manager") {
    await loadPlaylists();
    await loadVideos();
    await loadAutoSources();
    renderManager();
  }

  if (pageName() === "playlist") {
    await loadPublicIndex();
    const first = sortByOrderDesc(playlists)[0];
    if (first) {
      currentPlaylistId = currentPlaylistId || first.id;
      await loadPublicPlaylistVideos(currentPlaylistId);
    }
    renderPlaylistPage();
  }
}

/* =========================
   관리자 페이지:
   재생목록 관리
========================= */

window.savePlaylistToFirebase =
  async function () {
    const name =
      document
        .getElementById("playlistName")
        .value.trim();

    const order = Number(
      document
        .getElementById("playlistOrder")
        .value || 0
    );

    const isPublic =
      document
        .getElementById("playlistPublic")
        .value === "public";

    if (!name) {
      alert(
        "재생목록 이름을 입력해주세요."
      );

      return;
    }

    if (editingPlaylistId) {
      await updateDoc(
        doc(
          db,
          "playlists",
          editingPlaylistId
        ),
        {
          name,
          order,
          public: isPublic
        }
      );

      alert(
        "재생목록이 수정되었습니다."
      );
    } else {
      await addDoc(
        collection(db, "playlists"),
        {
          name,
          order,
          public: isPublic,
          createdAt:
            new Date().toISOString()
        }
      );

      alert(
        "재생목록이 생성되었습니다."
      );
    }

    clearPlaylistForm();
    await reloadAll();
    await rebuildPublicPlaylistCache(true);
  };

window.editPlaylistFromFirebase =
  function (id) {
    const playlist = playlists.find(
      item => item.id === id
    );

    if (!playlist) {
      alert(
        "재생목록을 찾을 수 없습니다."
      );

      return;
    }

    editingPlaylistId = id;
    selectedPlaylistId = id;

    document.getElementById(
      "playlistName"
    ).value = playlist.name || "";

    document.getElementById(
      "playlistOrder"
    ).value = playlist.order || 0;

    document.getElementById(
      "playlistPublic"
    ).value =
      playlist.public === false
        ? "private"
        : "public";

    const button =
      document.getElementById(
        "playlistSaveButton"
      );

    if (button) {
      button.textContent =
        "재생목록 수정 저장";
    }

    renderManager();
  };

window.deletePlaylistFromFirebase =
  async function (id) {
    const playlist = playlists.find(
      item => item.id === id
    );

    if (!playlist) {
      alert(
        "재생목록을 찾을 수 없습니다."
      );

      return;
    }

    const confirmed = confirm(
      `"${playlist.name}" 재생목록을 삭제할까요?\n` +
      "해당 재생목록의 영상도 함께 삭제됩니다."
    );

    if (!confirmed) {
      return;
    }

    const targetVideos = videos.filter(
      video => video.playlistId === id
    );

    for (const video of targetVideos) {
      await deleteDoc(
        doc(
          db,
          "playlistVideos",
          video.id
        )
      );
    }

    await deleteDoc(
      doc(db, "playlists", id)
    );

    if (selectedPlaylistId === id) {
      selectedPlaylistId = null;
    }

    alert(
      "재생목록이 삭제되었습니다."
    );

    await reloadAll();
    await rebuildPublicPlaylistCache(true);
  };

function clearPlaylistForm() {
  editingPlaylistId = null;

  const name =
    document.getElementById(
      "playlistName"
    );

  const order =
    document.getElementById(
      "playlistOrder"
    );

  const isPublic =
    document.getElementById(
      "playlistPublic"
    );

  const button =
    document.getElementById(
      "playlistSaveButton"
    );

  if (name) {
    name.value = "";
  }

  if (order) {
    order.value = "1";
  }

  if (isPublic) {
    isPublic.value = "public";
  }

  if (button) {
    button.textContent =
      "재생목록 저장";
  }
}

window.clearPlaylistForm =
  clearPlaylistForm;

window.selectPlaylistForManager =
  function (id) {
    selectedPlaylistId = id;

    const select =
      document.getElementById(
        "videoPlaylist"
      );

    if (select) {
      select.value = id;
    }

    renderManager();
  };

/* =========================
   관리자 페이지:
   영상 관리
========================= */

window.savePlaylistVideoToFirebase =
  async function () {
    const title =
      document
        .getElementById("videoTitle")
        .value.trim();

    const platform =
      document
        .getElementById("videoPlatform")
        .value;

    const url =
      document
        .getElementById("videoUrl")
        .value.trim();

    const thumb =
      document
        .getElementById("videoThumb")
        .value.trim();

    const playlistId =
      document
        .getElementById("videoPlaylist")
        .value;

    const priority = Number(
      document
        .getElementById("videoPriority")
        .value || 0
    );

    const isPublic =
      document
        .getElementById("videoPublic")
        .value === "public";

    if (!title) {
      alert(
        "영상 제목을 입력해주세요."
      );

      return;
    }

    if (!url) {
      alert(
        "영상 URL을 입력해주세요."
      );

      return;
    }

    if (!playlistId) {
      alert(
        "재생목록을 선택해주세요."
      );

      return;
    }

    const videoId =
      getVideoIdByPlatform(
        platform,
        url
      );

    if (editingVideoId) {
      await updateDoc(
        doc(
          db,
          "playlistVideos",
          editingVideoId
        ),
        {
          title,
          platform,
          url,
          thumb,
          playlistId,
          priority,
          public: isPublic,
          videoId
        }
      );

      alert(
        "영상 정보가 수정되었습니다."
      );
    } else {
      await addDoc(
        collection(
          db,
          "playlistVideos"
        ),
        {
          title,
          platform,
          url,
          thumb,
          playlistId,
          priority,
          public: isPublic,
          videoId,
          createdAt:
            new Date().toISOString()
        }
      );

      alert(
        "영상이 추가되었습니다."
      );
    }

    selectedPlaylistId = playlistId;

    clearVideoForm();
    await reloadAll();
    await rebuildPublicPlaylistCache(true);
  };

window.editVideoFromFirebase =
  function (id) {
    const video = videos.find(
      item => item.id === id
    );

    if (!video) {
      alert(
        "영상을 찾을 수 없습니다."
      );

      return;
    }

    editingVideoId = id;
    selectedPlaylistId =
      video.playlistId;

    document.getElementById(
      "videoTitle"
    ).value = video.title || "";

    document.getElementById(
      "videoPlatform"
    ).value =
      video.platform || "youtube";

    document.getElementById(
      "videoUrl"
    ).value = video.url || "";

    document.getElementById(
      "videoThumb"
    ).value = video.thumb || "";

    document.getElementById(
      "videoPlaylist"
    ).value =
      video.playlistId || "";

    document.getElementById(
      "videoPriority"
    ).value =
      video.priority || 0;

    document.getElementById(
      "videoPublic"
    ).value =
      video.public === false
        ? "private"
        : "public";

    const button =
      document.getElementById(
        "videoSaveButton"
      );

    if (button) {
      button.textContent =
        "영상 수정 저장";
    }

    renderManager();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

window.deleteVideoFromFirebase =
  async function (id) {
    if (!confirm("영상을 삭제할까요?")) {
      return;
    }

    await deleteDoc(
      doc(
        db,
        "playlistVideos",
        id
      )
    );

    alert(
      "영상이 삭제되었습니다."
    );

    await reloadAll();
    await rebuildPublicPlaylistCache(true);
  };

function clearVideoForm() {
  editingVideoId = null;

  const title =
    document.getElementById(
      "videoTitle"
    );

  const platform =
    document.getElementById(
      "videoPlatform"
    );

  const url =
    document.getElementById(
      "videoUrl"
    );

  const thumb =
    document.getElementById(
      "videoThumb"
    );

  const playlist =
    document.getElementById(
      "videoPlaylist"
    );

  const priority =
    document.getElementById(
      "videoPriority"
    );

  const isPublic =
    document.getElementById(
      "videoPublic"
    );

  const button =
    document.getElementById(
      "videoSaveButton"
    );

  if (title) {
    title.value = "";
  }

  if (platform) {
    platform.value = "youtube";
  }

  if (url) {
    url.value = "";
  }

  if (thumb) {
    thumb.value = "";
  }

  if (
    playlist &&
    selectedPlaylistId
  ) {
    playlist.value =
      selectedPlaylistId;
  }

  if (priority) {
    priority.value = "1";
  }

  if (isPublic) {
    isPublic.value = "public";
  }

  if (button) {
    button.textContent =
      "영상 추가";
  }
}

window.clearVideoForm =
  clearVideoForm;

/* =========================
   관리자 화면 렌더링
========================= */

function renderManager() {
  restoreAutoImportMenuState();
  renderPlaylistSelect();
  renderPlaylistList();
  renderVideoListForManager();
  fillAutoImportForm();
  renderAutoSourceList();
}

function renderPlaylistSelect() {
  const select =
    document.getElementById(
      "videoPlaylist"
    );

  if (!select) {
    return;
  }

  select.innerHTML =
    sortByOrderDesc(playlists)
      .map(
        playlist => `
          <option value="${escapeHTML(playlist.id)}">
            ${escapeHTML(playlist.name)}
          </option>
        `
      )
      .join("");

  if (
    !selectedPlaylistId &&
    playlists.length
  ) {
    selectedPlaylistId =
      sortByOrderDesc(playlists)[0].id;
  }

  if (selectedPlaylistId) {
    select.value =
      selectedPlaylistId;
  }
}

function renderPlaylistList() {
  const area =
    document.getElementById(
      "playlistList"
    );

  if (!area) {
    return;
  }

  if (!playlists.length) {
    area.innerHTML = `
      <div class="empty">
        생성된 재생목록이 없습니다.
      </div>
    `;

    return;
  }

  area.innerHTML =
    sortByOrderDesc(playlists)
      .map(playlist => {
        const active =
          playlist.id === selectedPlaylistId
            ? "active"
            : "";

        const count = videos.filter(
          video =>
            video.playlistId ===
            playlist.id
        ).length;

        return `
          <div
            class="playlist-item ${active}"
            onclick="selectPlaylistForManager('${jsString(playlist.id)}')"
          >
            <div class="playlist-name">
              ${escapeHTML(playlist.name)}
            </div>

            <div class="small-info">
              우선순위:
              ${Number(playlist.order || 0)}
              /
              ${playlist.public === false
                ? "비공개"
                : "공개"}
              /
              영상 ${count}개
            </div>

            <div class="item-actions">
              <button
                onclick="event.stopPropagation(); editPlaylistFromFirebase('${jsString(playlist.id)}')"
              >
                수정
              </button>

              <button
                onclick="event.stopPropagation(); deletePlaylistFromFirebase('${jsString(playlist.id)}')"
              >
                삭제
              </button>
            </div>
          </div>
        `;
      })
      .join("");
}

function renderVideoListForManager() {
  const area =
    document.getElementById(
      "videoList"
    );

  if (!area) {
    return;
  }

  if (
    !selectedPlaylistId &&
    playlists.length
  ) {
    selectedPlaylistId =
      sortByOrderDesc(playlists)[0].id;
  }

  const list = sortByOrderDesc(
    videos.filter(
      video =>
        video.playlistId ===
        selectedPlaylistId
    ),
    "priority"
  );

  if (!list.length) {
    area.innerHTML = `
      <div class="empty">
        등록된 영상이 없습니다.
      </div>
    `;

    return;
  }

  area.innerHTML = list
    .map(
      video => `
        <div class="video-item">
          <div class="video-title">
            ${escapeHTML(video.title)}
          </div>

          <div class="video-url">
            ${escapeHTML(video.url)}
          </div>

          <div class="small-info">
            플랫폼:
            ${escapeHTML(
              video.platform || "youtube"
            )}
            /
            우선순위:
            ${Number(video.priority || 0)}
            /
            ${video.public === false
              ? "비공개"
              : "공개"}
          </div>

          <div class="item-actions">
            <button
              onclick="editVideoFromFirebase('${jsString(video.id)}')"
            >
              수정
            </button>

            <button
              onclick="window.open('${jsString(video.url)}','_blank')"
            >
              보기
            </button>

            <button
              onclick="deleteVideoFromFirebase('${jsString(video.id)}')"
            >
              삭제
            </button>
          </div>
        </div>
      `
    )
    .join("");
}

/* =========================
   사용자 재생 페이지
========================= */

function renderPlaylistPage() {
  const publicPlaylists =
    sortByOrderDesc(
      playlists.filter(
        playlist =>
          playlist.public !== false
      )
    );

  if (!publicPlaylists.length) {
    const tabArea =
      document.getElementById(
        "playlistTabArea"
      );

    const listArea =
      document.getElementById(
        "youtubeList"
      );

    const playerBox =
      document.getElementById(
        "playerBox"
      );

    if (tabArea) {
      tabArea.innerHTML = `
        <div class="empty-playlist">
          공개된 재생목록이 없습니다.
        </div>
      `;
    }

    if (listArea) {
      listArea.innerHTML = `
        <div class="empty-playlist">
          등록된 영상이 없습니다.
        </div>
      `;
    }

    if (playerBox) {
      playerBox.innerHTML = "";
    }

    return;
  }

  const currentExists =
    publicPlaylists.some(
      playlist =>
        playlist.id ===
        currentPlaylistId
    );

  if (
    !currentPlaylistId ||
    !currentExists
  ) {
    currentPlaylistId =
      publicPlaylists[0].id;
  }

  renderPlaylistTabs(
    publicPlaylists
  );

  renderVideoListForPlaylist();
}

function isNewVideo(video) {
  if (!video.createdAt) {
    return false;
  }

  const created =
    new Date(video.createdAt);

  if (
    Number.isNaN(
      created.getTime()
    )
  ) {
    return false;
  }

  const now = new Date();

  const sevenDays =
    7 * 24 * 60 * 60 * 1000;

  const diff =
    now.getTime() -
    created.getTime();

  return (
    diff >= 0 &&
    diff < sevenDays
  );
}

function playlistHasNewVideo(
  playlistId
) {
  const cachedPlaylist = playlists.find(item => item.id === playlistId);
  if (typeof cachedPlaylist?.hasNew === "boolean") {
    return cachedPlaylist.hasNew;
  }
  return videos.some(
    video =>
      video.playlistId ===
        playlistId &&
      video.public !== false &&
      isNewVideo(video)
  );
}

function renderPlaylistTabs(
  publicPlaylists
) {
  const area =
    document.getElementById(
      "playlistTabArea"
    );

  if (!area) {
    return;
  }

  area.innerHTML =
    publicPlaylists
      .map(playlist => {
        const active =
          playlist.id ===
          currentPlaylistId
            ? "active"
            : "";

        const isNew =
          playlistHasNewVideo(
            playlist.id
          );

        return `
          <button
            type="button"
            class="playlist-tab ${active}"
            onclick="selectPlaylistForPlayer('${jsString(playlist.id)}')"
          >
            ${escapeHTML(playlist.name)}

            ${
              isNew
                ? `<span class="playlist-new-badge">NEW</span>`
                : ""
            }
          </button>
        `;
      })
      .join("");
}

window.selectPlaylistForPlayer =
  async function (id) {
    currentPlaylistId = id;
    currentVideoId = null;
    await loadPublicPlaylistVideos(id);
    renderPlaylistPage();
  };

function renderVideoListForPlaylist() {
  const playlist = playlists.find(
    item =>
      item.id === currentPlaylistId
  );

  const title =
    document.getElementById(
      "youtubeListTitle"
    );

  const listArea =
    document.getElementById(
      "youtubeList"
    );

  const playerBox =
    document.getElementById(
      "playerBox"
    );

  if (
    !playlist ||
    !listArea ||
    !playerBox
  ) {
    return;
  }

  if (title) {
    title.textContent =
      playlist.name || "재생목록";
  }

  const list = sortByOrderDesc(
    videos.filter(
      video =>
        video.playlistId ===
          currentPlaylistId &&
        video.public !== false
    ),
    "priority"
  );

  if (!list.length) {
    listArea.innerHTML = `
      <div class="empty-playlist">
        공개된 영상이 없습니다.
      </div>
    `;

    playerBox.innerHTML = "";

    return;
  }

  const currentVideoExists =
    list.some(
      video =>
        video.id ===
        currentVideoId
    );

  if (
    !currentVideoId ||
    !currentVideoExists
  ) {
    currentVideoId =
      list[0].id;

    setPlayer(
      list[0],
      false
    );
  }

  listArea.innerHTML = list
    .map(video => {
      const active =
        video.id === currentVideoId
          ? "active"
          : "";

      const imageClass =
        video.platform === "soop"
          ? "soop-thumb"
          : "";

      return `
        <button
          type="button"
          class="youtube-item ${active}"
          onclick="playPlaylistVideo('${jsString(video.id)}')"
        >
          <img
            class="${imageClass}"
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
    })
    .join("");
}

window.playPlaylistVideo =
  function (id) {
    const video = videos.find(
      item => item.id === id
    );

    if (!video) {
      return;
    }

    currentVideoId = id;

    setPlayer(video, false);
    renderVideoListForPlaylist();
  };

function setPlayer(video, autoplay) {
  const playerBox =
    document.getElementById(
      "playerBox"
    );

  if (!playerBox) {
    return;
  }

  if (
    video.platform === "youtube" ||
    !video.platform
  ) {
    playerBox.innerHTML = `
      <iframe
        id="youtubePlayer"
        src="https://www.youtube.com/embed/${escapeHTML(video.videoId)}?rel=0${autoplay ? "&autoplay=1" : ""}"
        title="YouTube video player"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
      >
      </iframe>
    `;

    return;
  }

  if (video.platform === "soop") {
    playerBox.innerHTML = `
      <iframe
        id="soop_player_video"
        src="${getSoopEmbedUrl(video.url)}"
        width="100%"
        height="100%"
        frameborder="0"
        allowfullscreen="true"
        allow="clipboard-write; web-share;"
        style="width:100%;height:100%;border:0;display:block;"
      >
      </iframe>
    `;

    return;
  }

  if (
    video.platform === "streamable"
  ) {
    playerBox.innerHTML = `
      <iframe
        src="${getStreamableEmbedUrl(video.url)}"
        width="100%"
        height="100%"
        frameborder="0"
        allowfullscreen
        style="width:100%;height:100%;border:0;display:block;"
      >
      </iframe>
    `;

    return;
  }

  playerBox.innerHTML = `
    <div class="vod-placeholder">
      <div class="vod-placeholder-title">
        외부 VOD
      </div>

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
   JSON Firebase 이전
========================= */

window.importJsonTextToFirebase =
  async function () {
    const textarea =
      document.getElementById(
        "importJsonText"
      );

    if (!textarea) {
      alert(
        "JSON 입력칸을 찾을 수 없습니다."
      );

      return;
    }

    let text =
      textarea.value.trim();

    if (!text) {
      alert(
        "JSON 텍스트를 붙여넣어 주세요."
      );

      return;
    }

    const start =
      text.indexOf("{");

    const end =
      text.lastIndexOf("}");

    if (
      start === -1 ||
      end === -1 ||
      end <= start
    ) {
      alert(
        "JSON 본문을 찾을 수 없습니다."
      );

      return;
    }

    text = text.slice(
      start,
      end + 1
    );

    let localData;

    try {
      localData =
        JSON.parse(text);
    } catch (error) {
      alert(
        "JSON 형식이 올바르지 않습니다."
      );

      console.error(error);

      return;
    }

    if (
      !localData.playlists ||
      !Array.isArray(
        localData.playlists
      )
    ) {
      alert(
        "playlists 배열이 없습니다."
      );

      return;
    }

    const confirmed = confirm(
      "붙여넣은 JSON 데이터를 Firebase로 옮길까요? " +
      "중복 저장될 수 있습니다."
    );

    if (!confirmed) {
      return;
    }

    for (
      const [playlistIndex, playlist]
      of localData.playlists.entries()
    ) {
      const playlistRef =
        await addDoc(
          collection(db, "playlists"),
          {
            name:
              playlist.name ||
              "이름 없는 재생목록",

            order: Number(
              playlist.order ||
              localData.playlists.length -
                playlistIndex
            ),

            public:
              playlist.public !== false,

            createdAt:
              new Date().toISOString()
          }
        );

      for (
        const video
        of playlist.videos || []
      ) {
        await addDoc(
          collection(
            db,
            "playlistVideos"
          ),
          {
            title:
              video.title ||
              "제목 없는 영상",

            platform:
              video.platform ||
              "youtube",

            url:
              video.url || "",

            thumb:
              video.thumb || "",

            playlistId:
              playlistRef.id,

            priority: Number(
              video.priority || 1
            ),

            public:
              video.public !== false,

            videoId:
              video.videoId ||
              getVideoIdByPlatform(
                video.platform ||
                  "youtube",
                video.url || ""
              ),

            createdAt:
              new Date().toISOString()
          }
        );
      }
    }

    alert(
      "Firebase 이전이 완료되었습니다."
    );

    textarea.value = "";

    await reloadAll();
    await rebuildPublicPlaylistCache(true);
  };

/* =========================
   내비게이션
========================= */

function setActiveNav() {
  const page =
    document.body.dataset.page || "";

  document
    .querySelectorAll(".nav a")
    .forEach(anchor => {
      anchor.classList.toggle(
        "active",
        anchor.dataset.page === page
      );
    });
}

/* =========================
   초기 실행
========================= */

async function initPlaylist() {
  try {
    await reloadAll();
  } catch (error) {
    console.error(
      "플레이리스트 초기화 실패",
      error
    );
    const area = document.getElementById("youtubeList") || document.getElementById("autoSourceList");
    if (area) area.innerHTML = `<div class="empty">${escapeHTML(error.message)}</div>`;
  }
}

window.addEventListener(
  "load",
  initPlaylist
);

window.addEventListener(
  "load",
  setActiveNav
);
