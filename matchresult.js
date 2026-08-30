let matchRows = [];
let currentTab = "team";
let selectedMatchTypes = new Set();
let selectedResult = "all";
let selectedPlayerName = "";
let opponentSearchKeyword = "";
let opponentRecordMode = "team";


/* =====================================================
   데이터 불러오기
===================================================== */

async function loadMatchResult(){

  const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/1jjguKLQE4dI76DBIbEw4ppxG26Ld8Eq7_cvbqFYU7Yo/gviz/tq?tqx=out:csv&sheet=match_result";

  try{

    const res = await fetch(SHEET_URL);

    if(!res.ok){
      throw new Error(`HTTP ${res.status}`);
    }

    const csvText = await res.text();

    const workbook = XLSX.read(csvText, {
      type: "string"
    });

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    matchRows =
      XLSX.utils.sheet_to_json(
        sheet,
        {
          header: 1,
          defval: ""
        }
      );


    initMatchFilters();

    renderTeamStatsSummary();
    renderTeamResult();
    renderOpponentRecordTable();

  }catch(error){

    console.error(
      "경기 결과 데이터를 불러오지 못했습니다.",
      error
    );

  }

}


loadMatchResult();



/* =====================================================
   날짜 처리
===================================================== */

function formatDate(value){

  if(!value){
    return "";
  }


  if(
    !isNaN(value) &&
    Number(value) > 30000
  ){

    const date =
      new Date(
        (Number(value) - 25569) *
        86400 *
        1000
      );


    const yyyy =
      date.getFullYear();


    const mm =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const dd =
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      );


    return `${yyyy}.${mm}.${dd}`;

  }


  return String(value).trim();

}


function dateToTime(value){

  return new Date(
    formatDate(value)
      .replace(/\./g, "-")
  ).getTime();

}



/* =====================================================
   팀 전적 / 선수별 전적 탭
===================================================== */

function setMatchTab(tab){

  currentTab = tab;


  document
    .querySelectorAll(
      ".match-tabs button"
    )
    .forEach(
      btn =>
        btn.classList.remove(
          "active"
        )
    );


  document
    .querySelectorAll(
      ".match-view"
    )
    .forEach(
      view =>
        view.classList.remove(
          "active"
        )
    );


  if(tab === "team"){

    const teamButton =
      document.querySelector(
        ".match-tabs button:nth-child(1)"
      );

    const teamView =
      document.getElementById(
        "teamResultView"
      );


    if(teamButton){
      teamButton.classList.add(
        "active"
      );
    }


    if(teamView){
      teamView.classList.add(
        "active"
      );
    }


    renderTeamResult();

  }else{

    const playerButton =
      document.querySelector(
        ".match-tabs button:nth-child(2)"
      );

    const playerView =
      document.getElementById(
        "playerResultView"
      );


    if(playerButton){
      playerButton.classList.add(
        "active"
      );
    }


    if(playerView){
      playerView.classList.add(
        "active"
      );
    }


    renderPlayerButtons();

  }

}



/* =====================================================
   팀 전적 요약
===================================================== */

function renderTeamStatsSummary(){

  const box =
    document.getElementById(
      "teamStatsSummary"
    );


  if(!box){
    return;
  }


  const targetTypes = [
    "대학대전",
    "미니대전"
  ];


  const races = [
    "T",
    "Z",
    "P"
  ];


  const matches = [];


  for(
    let i = 1;
    i < matchRows.length;
    i++
  ){

    const row =
      matchRows[i];


    if(!row[0]){
      continue;
    }


    const type =
      String(
        row[2] || ""
      ).trim();


    if(
      !targetTypes.includes(type)
    ){
      continue;
    }


    const match = {

      type,

      result:
        String(
          row[3] || ""
        ).trim(),

      sets: []

    };


    let j = i;


    while(
      j < matchRows.length
    ){

      const r =
        matchRows[j];


      if(
        j !== i &&
        r[0]
      ){
        break;
      }


      if(r[9]){

        match.sets.push({

          race:
            String(
              r[11] || ""
            ).trim(),

          result:
            String(
              r[12] || ""
            ).trim()

        });

      }


      j++;

    }


    matches.push(match);


    i = j - 1;

  }



  function calcMatchStats(list){

    const total =
      list.length;


    const win =
      list.filter(
        item =>
          item.result === "승"
      ).length;


    const lose =
      list.filter(
        item =>
          item.result === "패"
      ).length;


    const rate =
      total
        ? Math.round(
            (win / total) * 100
          )
        : 0;


    return (
      `${total}전 ` +
      `${win}승 ` +
      `${lose}패 ` +
      `(${rate}%)`
    );

  }



  function calcRaceStats(list){

    const allSets =
      list.flatMap(
        match =>
          match.sets
      );


    return races
      .map(
        race => {

          const rows =
            allSets.filter(
              set =>
                set.race === race
            );


          const total =
            rows.length;


          const win =
            rows.filter(
              set =>
                set.result === "승"
            ).length;


          const lose =
            rows.filter(
              set =>
                set.result === "패"
            ).length;


          const rate =
            total
              ? Math.round(
                  (win / total) *
                  100
                )
              : 0;


          const label =
            race === "T"
              ? "테란"
              : race === "Z"
              ? "저그"
              : "프로토스";


          return `
            <div class="team-stat-line">

              <span class="race-${race}">
                ${label}
              </span>

              <b>
                ${total}전
                ${win}승
                ${lose}패
                (${rate}%)
              </b>

            </div>
          `;

        }
      )
      .join("");

  }



  const totalMatches =
    matches;


  const collegeMatches =
    matches.filter(
      match =>
        match.type ===
        "대학대전"
    );


  const miniMatches =
    matches.filter(
      match =>
        match.type ===
        "미니대전"
    );


  box.innerHTML = `

    <div class="team-stat-box">

      <h3>
        총 전적 (대학대전+미니대전)
      </h3>

      <strong>
        ${calcMatchStats(totalMatches)}
      </strong>

      ${calcRaceStats(totalMatches)}

    </div>


    <div class="team-stat-box">

      <h3>
        대학대전 총 전적
      </h3>

      <strong>
        ${calcMatchStats(collegeMatches)}
      </strong>

      ${calcRaceStats(collegeMatches)}

    </div>


    <div class="team-stat-box">

      <h3>
        미니대전 총 전적
      </h3>

      <strong>
        ${calcMatchStats(miniMatches)}
      </strong>

      ${calcRaceStats(miniMatches)}

    </div>

  `;

}



/* =====================================================
   경기 필터
===================================================== */

function initMatchFilters(){

  const typeBox =
    document.getElementById(
      "matchTypeFilter"
    );


  const resultFilter =
    document.getElementById(
      "matchResultFilter"
    );


  if(resultFilter){

    resultFilter.addEventListener(
      "change",
      () => {

        selectedResult =
          resultFilter.value;

        renderTeamResult();

      }
    );

  }


  if(!typeBox){
    return;
  }


  const order = [
    "대학대전",
    "미니대전",
    "CK/PL",
    "끝장전"
  ];


  const types = [
    ...new Set(

      matchRows
        .slice(1)
        .filter(
          row =>
            row[0] &&
            row[2]
        )
        .map(
          row =>
            String(
              row[2]
            ).trim()
        )

    )
  ];


  types.sort(
    (a,b) => {

      const ai =
        order.indexOf(a);

      const bi =
        order.indexOf(b);


      if(
        ai === -1 &&
        bi === -1
      ){
        return (
          a.localeCompare(
            b,
            "ko"
          )
        );
      }


      if(ai === -1){
        return 1;
      }


      if(bi === -1){
        return -1;
      }


      return ai - bi;

    }
  );


  selectedMatchTypes =
    new Set();


  typeBox.innerHTML =
    types
      .map(
        type => `

          <button
            class="type-chip"
            data-type="${escapeOpponentHtml(type)}"
            type="button"
          >
            ${escapeOpponentHtml(type)}
          </button>

        `
      )
      .join("");


  typeBox
    .querySelectorAll(
      ".type-chip"
    )
    .forEach(
      btn => {

        btn.addEventListener(
          "click",
          () => {

            const type =
              btn.dataset.type;


            if(
              selectedMatchTypes.has(
                type
              )
            ){

              selectedMatchTypes.delete(
                type
              );

              btn.classList.remove(
                "active"
              );

            }else{

              selectedMatchTypes.add(
                type
              );

              btn.classList.add(
                "active"
              );

            }


            renderTeamResult();

          }
        );

      }
    );

}



/* =====================================================
   팀 경기 결과
===================================================== */

function renderTeamResult(){

  const wrap =
    document.getElementById(
      "teamResultList"
    );


  if(!wrap){
    return;
  }


  wrap.innerHTML = "";


  const matches = [];


  for(
    let i = 1;
    i < matchRows.length;
    i++
  ){

    const row =
      matchRows[i];


    if(!row[0]){
      continue;
    }


  const match = {

  // 날짜가 같으면 시트에서 더 아래에 입력된 경기를 먼저 표시
  sheetRow:
    j,

  date:
    formatDate(
      row[0]
    ),

  opponent:
    String(
      row[1] || ""
    ).trim(),

  type:
    String(
      row[2] || ""
    ).trim(),

  result:
    String(
      row[3] || ""
    ).trim(),

  win:
    row[4],

  lose:
    row[5],

  note:
    String(
      row[7] || ""
    ).trim(),

  sets: []

};


    let j = i;


    while(
      j < matchRows.length
    ){

      const r =
        matchRows[j];


      if(
        j !== i &&
        r[0]
      ){
        break;
      }


      if(r[10]){

        match.sets.push({

          no:
            Number(
              r[8]
            ) || 9999,

          set:
            r[9],

          player:
            String(
              r[10] || ""
            ).trim(),

          race:
            String(
              r[11] || ""
            ).trim(),

          result:
            String(
              r[12] || ""
            ).trim(),

          enemy:
            String(
              r[13] || ""
            ).trim(),

          url:
            String(
              r[14] || ""
            ).trim()

        });

      }


      j++;

    }


    matches.push(match);

    i = j - 1;

  }



  matches

    .filter(
      match =>
        selectedMatchTypes.size === 0 ||
        selectedMatchTypes.has(
          match.type
        )
    )

    .filter(
      match =>
        selectedResult === "all" ||
        match.result ===
          selectedResult
    )

.sort(
  (a,b) => {

    const dateDiff =
      dateToTime(b.date) -
      dateToTime(a.date);

    // 날짜가 다르면 최신 날짜부터 표시
    if(dateDiff !== 0){
      return dateDiff;
    }

    // 날짜가 같으면 시트에서 더 아래에 있는 경기부터 표시
    return b.sheetRow - a.sheetRow;

  }
)

    .forEach(
      match => {

        const card =
          document.createElement(
            "div"
          );


        card.className =
          "team-match-card";


        const setsHtml =
          match.sets

            .sort(
              (a,b) =>
                a.no - b.no
            )

            .map(
              set => `

                <div class="set-row">

                  <div class="set-no">
                    ${escapeOpponentHtml(set.set)}
                  </div>

                  <div class="set-player">
                    ${escapeOpponentHtml(set.player)}
                  </div>

                  <div
                    class="
                      set-race
                      race-${escapeOpponentHtml(set.race)}
                    "
                  >
                    ${escapeOpponentHtml(set.race)}
                  </div>

                  <div
                    class="
                      set-result
                      ${
                        set.result === "승"
                          ? "win"
                          : "lose"
                      }
                    "
                  >
                    ${escapeOpponentHtml(set.result)}
                  </div>

                  <div class="set-enemy">

                    ${
                      set.enemy
                        ? `vs ${escapeOpponentHtml(set.enemy)}`
                        : ""
                    }

                  </div>


                  <div class="set-video">

                    ${
                      set.url &&
                      set.url.startsWith(
                        "http"
                      )

                        ? `
                          <a
                            href="${escapeOpponentHtml(set.url)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="youtube-link"
                          >
                            <img
                              src="./Youtube_logo.png"
                              alt="YouTube"
                            >
                          </a>
                        `

                        : ""
                    }

                  </div>

                </div>

              `
            )

            .join("");


        card.innerHTML = `

          <div class="team-match-head">

            <div class="match-date">
              ${escapeOpponentHtml(match.date)}
            </div>


            <div class="match-opponent">

              ${
                match.opponent
                  ? `vs ${escapeOpponentHtml(match.opponent)}`
                  : ""
              }

            </div>


            <div class="match-type">
              ${escapeOpponentHtml(match.type)}
            </div>


            <div
              class="
                team-match-result
                ${
                  match.result === "승"
                    ? "win"
                    : "lose"
                }
              "
            >
              ${escapeOpponentHtml(match.result)}
            </div>


            <div class="match-note-inline">
              ${escapeOpponentHtml(match.note)}
            </div>


            <div class="match-score">
              ${escapeOpponentHtml(match.win)}승
              ${escapeOpponentHtml(match.lose)}패
            </div>


            <button
              class="set-toggle"
              type="button"
            >
              세트 보기
            </button>

          </div>


          <div class="set-list collapsed">

            ${setsHtml}

          </div>

        `;


        const toggle =
          card.querySelector(
            ".set-toggle"
          );


        if(toggle){

          toggle.addEventListener(
            "click",
            event => {

              const list =
                card.querySelector(
                  ".set-list"
                );


              if(!list){
                return;
              }


              list.classList.toggle(
                "collapsed"
              );


              event.target.textContent =
                list.classList.contains(
                  "collapsed"
                )
                  ? "세트 보기"
                  : "세트 접기";

            }
          );

        }


        wrap.appendChild(
          card
        );

      }
    );

}

/* =====================================================
   선수 선택 버튼
   - 선수명 : [선수 전적용 이름] 열
   - 종족   : [선수 전적용 종족] 열
   - 종족별 그룹 출력
===================================================== */


/* 헤더 이름으로 열 번호 찾기 */
function getMatchColumnIndex(headerName){

  if(
    !matchRows.length ||
    !matchRows[0]
  ){
    return -1;
  }


  return matchRows[0].findIndex(
    header =>
      String(
        header || ""
      ).trim() === headerName
  );

}


/* 종족값 통일 */
function normalizePlayerRace(value){

  const race =
    String(
      value || ""
    )
      .trim()
      .toUpperCase();


  if(
    race === "T" ||
    race === "테란"
  ){
    return "T";
  }


  if(
    race === "Z" ||
    race === "저그"
  ){
    return "Z";
  }


  if(
    race === "P" ||
    race === "프로토스"
  ){
    return "P";
  }


  if(
    race === "R" ||
    race === "랜덤"
  ){
    return "R";
  }


  return "ETC";

}


/* =====================================================
   선수 선택 버튼
   - 선수명 : [선수 전적용 이름]
   - 종족   : [선수 전적용 종족]
   - 현역   : [선수 전적용 현역]
===================================================== */

function renderPlayerButtons(){

  const box =
    document.getElementById(
      "playerNameButtons"
    );


  if(!box){
    return;
  }


  /* =============================================
     헤더 위치
  ============================================= */

  const playerNameIndex =
    getMatchColumnIndex(
      "선수 전적용 이름"
    );


  const playerRaceIndex =
    getMatchColumnIndex(
      "선수 전적용 종족"
    );


  const playerActiveIndex =
    getMatchColumnIndex(
      "선수 전적용 현역"
    );


  if(
    playerNameIndex === -1 ||
    playerRaceIndex === -1
  ){

    console.warn(
      "선수 전적용 이름 / 선수 전적용 종족 열을 찾을 수 없습니다."
    );


    box.innerHTML = `

      <div class="player-list-error">
        선수 명단 데이터를 불러올 수 없습니다.
      </div>

    `;


    return;
  }



  /* =============================================
     선수 데이터 생성
  ============================================= */

  const playerMap =
    new Map();


  matchRows
    .slice(1)
    .forEach(
      row => {

        const name =
          String(
            row[playerNameIndex] || ""
          ).trim();


        if(!name){
          return;
        }


        const race =
          normalizePlayerRace(
            row[playerRaceIndex]
          );


        /* 현역 여부 */
        const activeValue =
          playerActiveIndex !== -1
            ? String(
                row[playerActiveIndex] ?? ""
              ).trim()
            : "1";


        /* 값이 0이면 비현역 */
        const isActive =
          activeValue !== "0";


        if(
          !playerMap.has(name)
        ){

          playerMap.set(
            name,
            {
              name,
              race,
              isActive
            }
          );

        }

      }
    );


  const players = [
    ...playerMap.values()
  ];



  /* =============================================
     종족 그룹
  ============================================= */

  const raceGroups = [

    {
      race:"T",
      label:"테란",
      className:"terran"
    },

    {
      race:"Z",
      label:"저그",
      className:"zerg"
    },

    {
      race:"P",
      label:"프로토스",
      className:"protoss"
    },

    {
      race:"R",
      label:"랜덤",
      className:"random"
    },

    {
      race:"ETC",
      label:"기타",
      className:"etc"
    }

  ];



  /* =============================================
     기본 선택 선수
     - 가능하면 현역 먼저 선택
  ============================================= */

  const playerNames =
    players.map(
      player =>
        player.name
    );


  if(
    !selectedPlayerName ||
    !playerNames.includes(
      selectedPlayerName
    )
  ){

    const sortedPlayers =
      raceGroups
        .flatMap(
          group =>
            players.filter(
              player =>
                player.race ===
                group.race
            )
        );


    const firstActivePlayer =
      sortedPlayers.find(
        player =>
          player.isActive
      );


    const firstPlayer =
      firstActivePlayer ||
      sortedPlayers[0];


    selectedPlayerName =
      firstPlayer
        ? firstPlayer.name
        : "";

  }



  /* =============================================
     종족별 HTML
  ============================================= */

  box.innerHTML =
    raceGroups
      .map(
        group => {

          const groupPlayers =
            players.filter(
              player =>
                player.race ===
                group.race
            );


          if(
            !groupPlayers.length
          ){
            return "";
          }


          return `

            <div
              class="
                player-race-group
                player-race-group-${group.className}
              "
            >

              <div class="player-race-title">

                <span
                  class="
                    player-race-code
                    race-${group.race}
                  "
                >
                  ${
                    group.race === "ETC"
                      ? "?"
                      : group.race
                  }
                </span>


                <span class="player-race-name">
                  ${group.label}
                </span>


               <span class="player-race-count">
  ${
    groupPlayers.filter(
      player => player.isActive
    ).length
  }
</span>

              </div>


              <div class="player-race-list">

                ${
                  groupPlayers
                    .map(
                      player => `

                        <button
                          type="button"

                          class="
                            player-name-chip

                            ${
                              player.name ===
                              selectedPlayerName
                                ? "active"
                                : ""
                            }

                            ${
                              !player.isActive
                                ? "inactive"
                                : ""
                            }
                          "

                          data-name="${escapeOpponentHtml(player.name)}"

                          title="${
                            escapeOpponentHtml(
                              player.name
                            )
                          }${
                            !player.isActive
                              ? " (비현역)"
                              : ""
                          }"
                        >

                          ${escapeOpponentHtml(player.name)}

                        </button>

                      `
                    )
                    .join("")
                }

              </div>

            </div>

          `;

        }
      )
      .join("");



  /* =============================================
     선수 선택 이벤트
  ============================================= */

  box
    .querySelectorAll(
      ".player-name-chip"
    )
    .forEach(
      btn => {

        btn.addEventListener(
          "click",
          () => {

            selectedPlayerName =
              btn.dataset.name;


            renderPlayerButtons();

          }
        );

      }
    );


  renderPlayerResult();

}


/* =====================================================
   선수별 경기 결과
===================================================== */

function renderPlayerResult(){

  const area =
    document.getElementById(
      "playerResultArea"
    );


  const statsBox =
    document.getElementById(
      "playerStatsSummary"
    );


  if(
    !area ||
    !selectedPlayerName
  ){
    return;
  }


  const games = [];


  for(
    let i = 1;
    i < matchRows.length;
    i++
  ){

    const row =
      matchRows[i];


    if(!row[0]){
      continue;
    }


    const matchType =
      String(
        row[2] || ""
      ).trim();


    if(
      ![
        "대학대전",
        "미니대전"
      ].includes(matchType)
    ){
      continue;
    }


    const date =
      formatDate(
        row[0]
      );


    const opponent =
      String(
        row[1] || ""
      ).trim();


    const type =
      matchType;


    let j = i;


    while(
      j < matchRows.length
    ){

      const r =
        matchRows[j];


      if(
        j !== i &&
        r[0]
      ){
        break;
      }


      if(
        String(
          r[10] || ""
        ).trim() ===
        selectedPlayerName
      ){

        games.push({

  // 해당 경기가 시작되는 시트 행 순서
  sheetRow:
    j,

  date,

  opponent,

  type,

  player:
    String(
      r[10] || ""
    ).trim(),

  race:
    String(
      r[11] || ""
    ).trim(),

  result:
    String(
      r[12] || ""
    ).trim(),

  enemy:
    String(
      r[13] || ""
    ).trim(),

  url:
    String(
      r[14] || ""
    ).trim()

});

      }


      j++;

    }


    i = j - 1;

  }



  function calc(list){

    const total =
      list.length;


    const win =
      list.filter(
        game =>
          game.result === "승"
      ).length;


    const lose =
      list.filter(
        game =>
          game.result === "패"
      ).length;


    const rate =
      total
        ? Math.round(
            (win / total) *
            100
          )
        : 0;


    return {
      total,
      win,
      lose,
      rate
    };

  }


  games.sort(
  (a,b) => {

    const dateDiff =
      dateToTime(b.date) -
      dateToTime(a.date);

    // 날짜가 다르면 최신 날짜부터 표시
    if(dateDiff !== 0){
      return dateDiff;
    }

    // 날짜가 같으면 시트에서 더 아래에 있는 경기부터 표시
    return b.sheetRow - a.sheetRow;

  }
);


  const total =
    calc(
      games
    );


  const college =
    calc(
      games.filter(
        game =>
          game.type ===
          "대학대전"
      )
    );


  const mini =
    calc(
      games.filter(
        game =>
          game.type ===
          "미니대전"
      )
    );



  if(statsBox){

    statsBox.innerHTML = `

      <div class="team-stat-box">

        <h3>
          ${escapeOpponentHtml(selectedPlayerName)}
          총 전적
        </h3>

        <strong>
          ${total.total}전
          ${total.win}승
          ${total.lose}패
          (${total.rate}%)
        </strong>

      </div>


      <div class="team-stat-box">

        <h3>
          대학대전 전적
        </h3>

        <strong>
          ${college.total}전
          ${college.win}승
          ${college.lose}패
          (${college.rate}%)
        </strong>

      </div>


      <div class="team-stat-box">

        <h3>
          미니대전 전적
        </h3>

        <strong>
          ${mini.total}전
          ${mini.win}승
          ${mini.lose}패
          (${mini.rate}%)
        </strong>

      </div>

    `;

  }


  area.innerHTML = `

    <div class="player-result-card">

      <div class="player-game-list">

        ${
          games
            .map(
              game => `

                <div class="player-game-row">

                  <div>
                    ${escapeOpponentHtml(game.date)}
                  </div>


                  <div>

                    ${
                      game.opponent
                        ? `vs ${escapeOpponentHtml(game.opponent)}`
                        : ""
                    }

                  </div>


                  <div>
                    ${escapeOpponentHtml(game.type)}
                  </div>


                  <div
                    class="race-${escapeOpponentHtml(game.race)}"
                  >
                    ${escapeOpponentHtml(game.race)}
                  </div>


                  <div
                    class="
                      ${
                        game.result === "승"
                          ? "win"
                          : "lose"
                      }
                    "
                  >
                    ${escapeOpponentHtml(game.result)}
                  </div>


                  <div>

                    ${
                      game.enemy
                        ? `vs ${escapeOpponentHtml(game.enemy)}`
                        : ""
                    }

                  </div>


                  <div>

                    ${
                      game.url &&
                      game.url.startsWith(
                        "http"
                      )

                        ? `
                          <a
                            href="${escapeOpponentHtml(game.url)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="youtube-link"
                          >
                            <img
                              src="./Youtube_logo.png"
                              alt="YouTube"
                            >
                          </a>
                        `

                        : ""
                    }

                  </div>

                </div>

              `
            )
            .join("")
        }

      </div>

    </div>

  `;

}



/* =====================================================
   팀 기준 대학별 전적

   A열 = 날짜
   B열 = 상대팀
   C열 = 경기 종류
   D열 = 팀 경기 결과
   S열 = 대회명

   총 전적
   = 대학대전 전체 + 미니대전

   일반 대학대전
   = 대학대전 + S열 빈칸

   미니대전
   = 미니대전

   대회전적
   = 대학대전 + S열 대회명 있음
===================================================== */

function getOpponentRecords(){

  const records =
    new Map();


  for(
    let i = 1;
    i < matchRows.length;
    i++
  ){

    const row =
      matchRows[i];


    if(!row[0]){
      continue;
    }


    const opponent =
      String(
        row[1] || ""
      ).trim();


    const type =
      String(
        row[2] || ""
      ).trim();


    const result =
      String(
        row[3] || ""
      ).trim();


    const tournament =
      String(
        row[18] || ""
      ).trim();


    if(!opponent){
      continue;
    }


    if(
      ![
        "대학대전",
        "미니대전"
      ].includes(type)
    ){
      continue;
    }


    if(
      !records.has(opponent)
    ){

      records.set(
        opponent,
        {

          opponent,

          total:{
            win:0,
            lose:0
          },

          college:{
            win:0,
            lose:0
          },

          mini:{
            win:0,
            lose:0
          },

          tournamentTotal:{
            win:0,
            lose:0
          },

          tournaments:{}

        }
      );

    }


    const item =
      records.get(opponent);



    /* 총 전적 */

    if(result === "승"){

      item.total.win++;

    }else if(result === "패"){

      item.total.lose++;

    }



    /* 일반 대학대전 */

    if(
      type === "대학대전" &&
      !tournament
    ){

      if(result === "승"){

        item.college.win++;

      }else if(result === "패"){

        item.college.lose++;

      }

    }



    /* 미니대전 */

    if(type === "미니대전"){

      if(result === "승"){

        item.mini.win++;

      }else if(result === "패"){

        item.mini.lose++;

      }

    }



    /* 대회전적 */

    if(
      type === "대학대전" &&
      tournament
    ){

      if(
        !item.tournaments[
          tournament
        ]
      ){

        item.tournaments[
          tournament
        ] = {

          win:0,
          lose:0

        };

      }


      if(result === "승"){

        item.tournamentTotal.win++;

        item
          .tournaments[
            tournament
          ]
          .win++;

      }else if(result === "패"){

        item.tournamentTotal.lose++;

        item
          .tournaments[
            tournament
          ]
          .lose++;

      }

    }

  }



  return [
    ...records.values()
  ].sort(
    (a,b) => {

      const aGames =
        a.total.win +
        a.total.lose;


      const bGames =
        b.total.win +
        b.total.lose;


      if(
        bGames !==
        aGames
      ){

        return (
          bGames -
          aGames
        );

      }


      if(
        b.total.win !==
        a.total.win
      ){

        return (
          b.total.win -
          a.total.win
        );

      }


      return (
        a.opponent.localeCompare(
          b.opponent,
          "ko"
        )
      );

    }
  );

}



/* =====================================================
   선수별 - 대학별 전적

   B열 = 상대 대학
   C열 = 경기 종류
   S열 = 대회명

   K열 = 선수명
   M열 = 선수 개인 승패

   중요:
   팀 결과 D열을 사용하지 않고
   선수 개인 세트 승패 M열을 기준으로 계산
===================================================== */

function getPlayerOpponentRecords(playerName){

  const records =
    new Map();


  if(!playerName){
    return [];
  }


  for(
    let i = 1;
    i < matchRows.length;
    i++
  ){

    const row =
      matchRows[i];


    if(!row[0]){
      continue;
    }


    const opponent =
      String(
        row[1] || ""
      ).trim();


    const type =
      String(
        row[2] || ""
      ).trim();


    const tournament =
      String(
        row[18] || ""
      ).trim();


    if(!opponent){
      continue;
    }


    if(
      ![
        "대학대전",
        "미니대전"
      ].includes(type)
    ){
      continue;
    }


    let j = i;


    while(
      j < matchRows.length
    ){

      const r =
        matchRows[j];


      if(
        j !== i &&
        r[0]
      ){
        break;
      }


      const currentPlayer =
        String(
          r[10] || ""
        ).trim();


      if(
        currentPlayer ===
        playerName
      ){

        const result =
          String(
            r[12] || ""
          ).trim();


        if(
          result === "승" ||
          result === "패"
        ){

          if(
            !records.has(opponent)
          ){

            records.set(
              opponent,
              {

                opponent,

                total:{
                  win:0,
                  lose:0
                },

                college:{
                  win:0,
                  lose:0
                },

                mini:{
                  win:0,
                  lose:0
                },

                tournamentTotal:{
                  win:0,
                  lose:0
                },

                tournaments:{}

              }
            );

          }


          const item =
            records.get(opponent);



          /* 총 전적 */

          if(result === "승"){

            item.total.win++;

          }else{

            item.total.lose++;

          }



          /* 일반 대학대전 */

          if(
            type === "대학대전" &&
            !tournament
          ){

            if(result === "승"){

              item.college.win++;

            }else{

              item.college.lose++;

            }

          }



          /* 미니대전 */

          if(type === "미니대전"){

            if(result === "승"){

              item.mini.win++;

            }else{

              item.mini.lose++;

            }

          }



          /* 대회전적 */

          if(
            type === "대학대전" &&
            tournament
          ){

            if(
              !item.tournaments[
                tournament
              ]
            ){

              item.tournaments[
                tournament
              ] = {
                win:0,
                lose:0
              };

            }


            if(result === "승"){

              item.tournamentTotal.win++;

              item
                .tournaments[
                  tournament
                ]
                .win++;

            }else{

              item.tournamentTotal.lose++;

              item
                .tournaments[
                  tournament
                ]
                .lose++;

            }

          }

        }

      }


      j++;

    }


    i = j - 1;

  }



  return [
    ...records.values()
  ].sort(
    (a,b) => {

      const aGames =
        a.total.win +
        a.total.lose;


      const bGames =
        b.total.win +
        b.total.lose;


      if(
        bGames !==
        aGames
      ){

        return bGames - aGames;

      }


      if(
        b.total.win !==
        a.total.win
      ){

        return b.total.win - a.total.win;

      }


      return a.opponent.localeCompare(
        b.opponent,
        "ko"
      );

    }
  );

}


/* =====================================================
   대학별 전적 - 합계 계산
===================================================== */

function calcOpponentRecordSummary(records){

  const summary = {

    total:{
      win:0,
      lose:0
    },

    college:{
      win:0,
      lose:0
    },

    mini:{
      win:0,
      lose:0
    },

    tournament:{
      win:0,
      lose:0
    }

  };


  records.forEach(
    record => {

      summary.total.win +=
        Number(
          record.total?.win || 0
        );

      summary.total.lose +=
        Number(
          record.total?.lose || 0
        );


      summary.college.win +=
        Number(
          record.college?.win || 0
        );

      summary.college.lose +=
        Number(
          record.college?.lose || 0
        );


      summary.mini.win +=
        Number(
          record.mini?.win || 0
        );

      summary.mini.lose +=
        Number(
          record.mini?.lose || 0
        );


      summary.tournament.win +=
        Number(
          record.tournamentTotal?.win || 0
        );

      summary.tournament.lose +=
        Number(
          record.tournamentTotal?.lose || 0
        );

    }
  );


  return summary;

}






/* =====================================================
   일반 전적 표시
===================================================== */

function opponentRecordText(record){

  const games =
    record.win +
    record.lose;


  if(!games){

    return `
      <span class="opponent-record-empty">
        -
      </span>
    `;

  }


  return `

    <span class="opponent-record-win">
      ${record.win}승
    </span>

    <span class="opponent-record-loss">
      ${record.lose}패
    </span>

  `;

}



/* =====================================================
   대회전적 표시
===================================================== */

function opponentTournamentText(
  tournamentTotal,
  tournaments
){

  const entries =
    Object.entries(
      tournaments || {}
    );


  if(!entries.length){

    return `
      <span class="opponent-record-empty">
        -
      </span>
    `;

  }


  return `

    <div class="opponent-tournament-wrap">


      <div class="opponent-tournament-total">

        <span class="opponent-record-win">
          ${tournamentTotal.win}승
        </span>

        <span class="opponent-record-loss">
          ${tournamentTotal.lose}패
        </span>

      </div>


      <div class="opponent-tournament-detail">

        ${
          entries
            .map(
              ([name, record]) => `

                <div class="opponent-tournament-item">

                  <span class="opponent-tournament-name">
                    ${escapeOpponentHtml(name)}
                  </span>

                  <span class="opponent-tournament-result">
                    ${record.win}승 ${record.lose}패
                  </span>

                </div>

              `
            )
            .join("")
        }

      </div>

    </div>

  `;

}



/* =====================================================
   HTML 문자 처리
===================================================== */

function escapeOpponentHtml(value){

  return String(
    value ?? ""
  )

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


/* =====================================================
   팀 기준 대학별 전적 테이블
===================================================== */

function renderOpponentRecordTable(){

  const tbody =
    document.getElementById(
      "opponentRecordTableBody"
    );


  if(!tbody){
    return;
  }


  const allRecords =
    getOpponentRecords();


  const keyword =
    opponentSearchKeyword
      .trim()
      .toLowerCase();


  const records =
    !keyword
      ? allRecords
      : allRecords.filter(
          record =>
            String(
              record.opponent || ""
            )
              .toLowerCase()
              .includes(keyword)
        );


  if(!records.length){

    tbody.innerHTML = `

      <tr>

        <td
          colspan="5"
          class="opponent-record-no-data"
        >
          표시할 상대 전적이 없습니다.
        </td>

      </tr>

    `;

    return;

  }


  /* ==============================
     현재 표시 중인 대학들의 합계
  ============================== */

  const summary =
    calcOpponentRecordSummary(
      records
    );


  const summaryHtml = `

    <tr class="opponent-record-summary-row">

      <td>
        <span class="opponent-record-summary-label">
          합계
        </span>
      </td>


      <td>
        ${opponentRecordText(summary.total)}
      </td>


      <td>
        ${opponentRecordText(summary.college)}
      </td>


      <td>
        ${opponentRecordText(summary.mini)}
      </td>


      <td>
        ${opponentRecordText(summary.tournament)}
      </td>

    </tr>

  `;


  const recordsHtml =
    records
      .map(
        record => `

          <tr>

            <td>

              <span class="opponent-record-name">
                ${escapeOpponentHtml(record.opponent)}
              </span>

            </td>


            <td>
              ${opponentRecordText(record.total)}
            </td>


            <td>
              ${opponentRecordText(record.college)}
            </td>


            <td>
              ${opponentRecordText(record.mini)}
            </td>


            <td>

              ${
                opponentTournamentText(
                  record.tournamentTotal,
                  record.tournaments
                )
              }

            </td>

          </tr>

        `
      )
      .join("");


  tbody.innerHTML =
    summaryHtml +
    recordsHtml;

}

/* =====================================================
   선수 기준 대학별 전적 테이블
===================================================== */

function renderPlayerOpponentRecordTable(){

  const tbody =
    document.getElementById(
      "opponentRecordTableBody"
    );


  if(!tbody){
    return;
  }


  const allRecords =
    getPlayerOpponentRecords(
      selectedPlayerName
    );


  const keyword =
    opponentSearchKeyword
      .trim()
      .toLowerCase();


  const records =
    !keyword
      ? allRecords
      : allRecords.filter(
          record =>
            String(
              record.opponent || ""
            )
              .toLowerCase()
              .includes(keyword)
        );


  if(!records.length){

    tbody.innerHTML = `

      <tr>

        <td
          colspan="5"
          class="opponent-record-no-data"
        >

          ${
            selectedPlayerName
              ? `${escapeOpponentHtml(selectedPlayerName)} 선수의 대학별 전적이 없습니다.`
              : "표시할 선수 전적이 없습니다."
          }

        </td>

      </tr>

    `;

    return;

  }


  /* ==============================
     현재 선택 선수의 합계
  ============================== */

  const summary =
    calcOpponentRecordSummary(
      records
    );


  const summaryHtml = `

    <tr class="opponent-record-summary-row">

      <td>
        <span class="opponent-record-summary-label">
          합계
        </span>
      </td>


      <td>
        ${opponentRecordText(summary.total)}
      </td>


      <td>
        ${opponentRecordText(summary.college)}
      </td>


      <td>
        ${opponentRecordText(summary.mini)}
      </td>


      <td>
        ${opponentRecordText(summary.tournament)}
      </td>

    </tr>

  `;


  const recordsHtml =
    records
      .map(
        record => `

          <tr>

            <td>

              <span class="opponent-record-name">
                ${escapeOpponentHtml(record.opponent)}
              </span>

            </td>


            <td>
              ${opponentRecordText(record.total)}
            </td>


            <td>
              ${opponentRecordText(record.college)}
            </td>


            <td>
              ${opponentRecordText(record.mini)}
            </td>


            <td>

              ${
                opponentTournamentText(
                  record.tournamentTotal,
                  record.tournaments
                )
              }

            </td>

          </tr>

        `
      )
      .join("");


  tbody.innerHTML =
    summaryHtml +
    recordsHtml;

}

/* =====================================================
   현재 팝업 모드에 맞게 다시 렌더링
===================================================== */

function renderCurrentOpponentRecordTable(){

  if(
    opponentRecordMode === "player"
  ){

    renderPlayerOpponentRecordTable();

  }else{

    renderOpponentRecordTable();

  }

}



/* =====================================================
   팝업 공통 검색 초기화
===================================================== */

function resetOpponentSearch(){

  const searchInput =
    document.getElementById(
      "opponentRecordSearch"
    );


  const clearButton =
    document.getElementById(
      "opponentRecordSearchClear"
    );


  opponentSearchKeyword = "";


  if(searchInput){

    searchInput.value = "";

  }


  if(clearButton){

    clearButton.classList.remove(
      "show"
    );

  }


  return {
    searchInput,
    clearButton
  };

}



/* =====================================================
   팝업 공통 열기
===================================================== */

function showOpponentRecordModal(
  searchInput
){

  const modal =
    document.getElementById(
      "opponentRecordModal"
    );


  if(!modal){
    return;
  }


  modal.classList.add(
    "active"
  );


  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "opponent-record-modal-open"
  );


  setTimeout(
    () => {

      if(searchInput){

        searchInput.focus();

      }

    },
    50
  );

}



/* =====================================================
   팀 전적 > 대학별 전적 팝업
===================================================== */

function openOpponentRecordModal(){

  opponentRecordMode =
    "team";


  const title =
    document.getElementById(
      "opponentRecordTitle"
    );


  const description =
    document.querySelector(
      ".opponent-record-title-area p"
    );


  if(title){

    title.textContent =
      "대학별 전적";

  }


  if(description){

    description.textContent =
      "각 대학과의 총 전적 / 대학대전 / 미니대전 / 대회전적입니다.";

  }


  const {
    searchInput
  } =
    resetOpponentSearch();


  renderOpponentRecordTable();


  showOpponentRecordModal(
    searchInput
  );

}



/* =====================================================
   선수별 전적 > 대학별 전적 팝업

   현재 선택된 selectedPlayerName 기준
===================================================== */

function openPlayerOpponentRecordModal(){

  if(!selectedPlayerName){
    return;
  }


  opponentRecordMode =
    "player";


  const title =
    document.getElementById(
      "opponentRecordTitle"
    );


  const description =
    document.querySelector(
      ".opponent-record-title-area p"
    );


  if(title){

    title.textContent =
      `${selectedPlayerName} 대학별 전적`;

  }


  if(description){

    description.textContent =
      `${selectedPlayerName} 선수의 상대 대학별 개인 승패 전적입니다.`;

  }


  const {
    searchInput
  } =
    resetOpponentSearch();


  renderPlayerOpponentRecordTable();


  showOpponentRecordModal(
    searchInput
  );

}



/* =====================================================
   팝업 닫기
===================================================== */

function closeOpponentRecordModal(){

  const modal =
    document.getElementById(
      "opponentRecordModal"
    );


  if(!modal){
    return;
  }


  modal.classList.remove(
    "active"
  );


  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "opponent-record-modal-open"
  );

}



/* =====================================================
   ESC 팝업 닫기
===================================================== */

document.addEventListener(
  "keydown",
  event => {

    if(
      event.key ===
      "Escape"
    ){

      closeOpponentRecordModal();

    }

  }
);



/* =====================================================
   대학 이름 검색
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const searchInput =
      document.getElementById(
        "opponentRecordSearch"
      );


    const clearButton =
      document.getElementById(
        "opponentRecordSearchClear"
      );


    if(searchInput){

      searchInput.addEventListener(
        "input",
        () => {

          opponentSearchKeyword =
            searchInput.value;


          renderCurrentOpponentRecordTable();


          if(clearButton){

            clearButton.classList.toggle(
              "show",
              Boolean(
                searchInput.value
              )
            );

          }

        }
      );

    }


    if(clearButton){

      clearButton.addEventListener(
        "click",
        () => {

          opponentSearchKeyword = "";


          if(searchInput){

            searchInput.value = "";

            searchInput.focus();

          }


          clearButton.classList.remove(
            "show"
          );


          renderCurrentOpponentRecordTable();

        }
      );

    }

  }
);



/* =====================================================
   HTML onclick에서 사용할 함수 공개
===================================================== */

window.openOpponentRecordModal =
  openOpponentRecordModal;


window.openPlayerOpponentRecordModal =
  openPlayerOpponentRecordModal;


window.closeOpponentRecordModal =
  closeOpponentRecordModal;


window.setMatchTab =
  setMatchTab;


window.renderTeamResult =
  renderTeamResult;


window.renderPlayerResult =
  renderPlayerResult;
