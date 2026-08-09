:root{
  --bg:#1b1a27;
  --panel:#232236;
  --panel2:#2b2a40;
  --line:#3a3860;

  --text:#faf8ff;
  --muted:#918cb8;

  --brand:#0356fe;
  --brand2:#00a2ff;

  --cyan:#00d4f9;
  --mint:#64fbd3;

  --bad:#ff2a51;
  --warn:#64fbd3;

  --zerg:#ff2a51;
  --terran:#00a2ff;
  --protoss:#64fbd3;
  --random:#00d4f9;

  --shadow:0 20px 60px rgba(0,0,0,.35);
}

body.light-mode{
  --bg:#f4f7ff;

  --panel:#ffffff;
  --panel2:#eef2ff;

  --line:#dbe4ff;

  --text:#1b1a27;
  --muted:#5b5872;

  --shadow:0 10px 30px rgba(0,0,0,.08);
}




    *{box-sizing:border-box}

   body{
  margin:0;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  background:
    radial-gradient(circle at top left, rgba(3,86,254,.22), transparent 34%),
    radial-gradient(circle at top right, rgba(0,162,255,.12), transparent 30%),
    linear-gradient(
      180deg,
      #183b7a 0%,
      #10182d 55%,
      #0b0f1f 100%
    );

  color:var(--text);

  min-height:100vh;

  transition:
    background .3s ease,
    color .3s ease;
}






    a{color:inherit;text-decoration:none}
    button,input,select,textarea{font-family:inherit}

    .app{
      max-width:1500px;
      margin:0 auto;
      padding:24px;
    }

    .topbar{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:16px;
      position:sticky;
      top:0;
      z-index:10;
      padding:14px 0;
      backdrop-filter: blur(18px);
    }

    .logo{
      display:flex;
      align-items:center;
      gap:12px;
      font-weight:900;
      letter-spacing:-.04em;
      font-size:24px;
    }

    .logo-mark{
  width:42px;
  height:42px;
  border-radius:16px;
  background:linear-gradient(135deg,var(--brand),var(--brand2));
  display:grid;
  place-items:center;
  box-shadow:0 10px 30px rgba(3,86,254,.35);
}

    .nav{
      display:flex;
      gap:8px;
      flex-wrap:wrap;
      justify-content:flex-end;
    }

    .nav button{
      border:1px solid rgba(255,255,255,.08);
      background:rgba(255,255,255,.06);
      color:var(--muted);
      padding:10px 14px;
      border-radius:999px;
      cursor:pointer;
      font-weight:800;
    }

.nav button.active,
.nav button:hover{
  background:linear-gradient(135deg,var(--brand),var(--brand2));
  color:white;
  border-color:transparent;
}

    .hero{
      display:grid;
      grid-template-columns:1.2fr .8fr;
      gap:20px;
      margin-top:18px;
    }

    .home-simple{
      display:flex;
      flex-direction:column;
      gap:18px;
      margin-top:18px;
    }

.home-brand{
  display:flex;
  align-items:center;
  gap:26px;
  min-height:230px;

  background:#ffffff !important;

  border:1px solid rgb(255,255,255);
}
    .home-brand h1{
      font-size:58px;
      margin:14px 0 8px;
      letter-spacing:-.07em;
        color:#1b1a27;
    }

    .home-brand p{
      margin:0;
      color:var(--muted);
      font-size:20px;
      font-weight:900;
        color:#5b5872;
    }

    .live-grid{
      display:grid;
      grid-template-columns:repeat(4,1fr);
      gap:14px;
    }

    .live-grid .live-item{
      min-height:126px;
      flex-direction:column;
      align-items:flex-start;
      justify-content:space-between;
    }

    .vertical-posts .post-item{
      align-items:flex-start;
    }

    .card{
      background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.035));
      border:1px solid rgba(255,255,255,.09);
      border-radius:28px;
      box-shadow:var(--shadow);
      overflow:hidden;
    }

    .hero-main{
      padding:34px;
      min-height:100px;
      position:relative;
    }


#scrollTopBtn{
  position:fixed;
    right:150px !important;
  left:auto !important;
  bottom:28px;
  z-index:9999;

  width:58px;
  height:58px;
  border-radius:18px;

  border:1px solid rgba(255,255,255,.12);
  background:linear-gradient(135deg,var(--brand),var(--brand2));
  color:#fff;

  font-size:10px;
  font-weight:1000;
  cursor:pointer;

  box-shadow:0 12px 32px rgba(3,86,254,.35);
  backdrop-filter:blur(12px);

  display:none;
  transition:.2s;
}

.kicker{
  display:inline-flex;
  gap:8px;
  align-items:center;
  padding:8px 12px;
  border-radius:999px;
  color:#0356fe;
  background:rgba(3,86,254,.10);
  border:1px solid rgba(3,86,254,.28);
  font-size:13px;
  font-weight:900;
}

    .brand-logo-box{
      width:150px;
      height:150px;
      border-radius:34px;
      overflow:hidden;
      background:rgba(255, 255, 255, 0.08);
      border:0px solid rgba(250,248,255,.12);
      display:grid;
      place-items:center;
      margin-bottom:18px;
      
    }

    .brand-logo-video{
      width:100%;
      height:100%;
      object-fit:cover;
      display:block;
    }

    .hero h1{
      font-size:48px;
      line-height:1.06;
      letter-spacing:-.06em;
      margin:20px 0 12px;
    }

    .hero p{
      color:var(--muted);
      font-size:17px;
      line-height:1.7;
      max-width:720px;
      margin:0;
    }

    .hero-actions{
      display:flex;
      gap:10px;
      flex-wrap:wrap;
      margin-top:26px;
    }

    .primary,.ghost{
      border:0;
      border-radius:16px;
      padding:14px 18px;
      font-weight:900;
      cursor:pointer;
      color:white;
    }

    .primary{background:linear-gradient(135deg,var(--brand),var(--brand2));}
    .ghost{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1)}

    .today-card{padding:24px;}
    .section-title{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      margin-bottom:16px;
    }
    .section-title h2{font-size:22px;margin:0;letter-spacing:-.04em}
    .section-title span{color:var(--muted);font-size:13px;font-weight:800}

    .match-card{
      background:rgba(255,255,255,.055);
      border:1px solid rgba(255,255,255,.08);
      border-radius:22px;
      padding:18px;
      margin-top:12px;
    }
    .versus{
      display:grid;
      grid-template-columns:1fr auto 1fr;
      align-items:center;
      gap:12px;
      text-align:center;
      font-weight:900;
      font-size:18px;
    }
    .vs{color:var(--warn);font-size:13px;letter-spacing:.08em}
    .prediction-bar{
      height:12px;
      background:rgba(255,255,255,.08);
      border-radius:99px;
      overflow:hidden;
      margin:18px 0 8px;
    }
    .prediction-fill{height:100%;width:54%;background:linear-gradient(90deg,var(--brand),var(--brand2));}
    .prediction-label{display:flex;justify-content:space-between;color:var(--muted);font-size:13px;font-weight:800}

    .grid{
      display:grid;
      grid-template-columns:repeat(12,1fr);
      gap:18px;
      margin-top:18px;
    }

    .span-8{grid-column:span 8}
    .span-4{grid-column:span 4}
    .span-6{grid-column:span 6}
    .span-12{grid-column:span 12}

    .panel{padding:22px;}

    .live-list,.post-list,.schedule-list{display:flex;flex-direction:column;gap:12px}
    .live-item,.post-item,.schedule-item,.member-row,.record-row{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      background:rgba(255,255,255,.05);
      border:1px solid rgba(255,255,255,.07);
      border-radius:18px;
      padding:14px;
    }
    .profile{display:flex;align-items:center;gap:12px;min-width:0}
    .avatar{
  width:44px;
  height:44px;
  border-radius:16px;
  background:linear-gradient(135deg,var(--brand),var(--brand2));

  color:white;

  display:grid;
  place-items:center;
  font-weight:1000;
  flex:0 0 auto;
}
    .name{font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .meta{font-size:12px;color:var(--muted);margin-top:4px;font-weight:700}
    .badge{
      display:inline-flex;align-items:center;gap:5px;
      padding:6px 9px;border-radius:999px;
      font-size:12px;font-weight:900;
      background:rgba(255,255,255,.08);
      color:#dbeafe;
      white-space:nowrap;
    }
    .live-dot{width:8px;height:8px;border-radius:50%;background:var(--bad);box-shadow:0 0 14px var(--bad)}
    .race-Z{color:var(--zerg)} .race-T{color:var(--terran)} .race-P{color:var(--protoss)} .race-R{color:var(--random)}

    .filters{
      display:grid;
      grid-template-columns:1.5fr repeat(3,1fr);
      gap:10px;
      margin-bottom:14px;
    }
    .filters input,.filters select,.form input,.form select,.form textarea{
      width:100%;
      background:rgba(255,255,255,.07);
      border:1px solid rgba(255,255,255,.1);
      color:var(--text);
      border-radius:14px;
      padding:12px 13px;
      outline:none;
    }
    option{background:#11182f;color:white}

    .tier-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    .member-card{
      background:rgba(255,255,255,.05);
      border:1px solid rgba(255,255,255,.07);
      border-radius:22px;
      padding:16px;
    }
    .member-card .top{display:flex;justify-content:space-between;gap:10px;align-items:center}
    .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px}
    .stat{background:rgba(0,0,0,.15);border-radius:14px;padding:10px;text-align:center}
    .stat b{display:block;font-size:18px}.stat span{font-size:11px;color:var(--muted);font-weight:800}

    table{width:100%;border-collapse:collapse;overflow:hidden;border-radius:18px}
    th,td{padding:13px;border-bottom:1px solid rgba(255,255,255,.08);text-align:left;font-size:14px}
    th{color:#dbeafe;background:rgba(255,255,255,.06);font-size:12px;letter-spacing:.03em}
    td{color:#eef3ff}

    .form{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px}
    .form .wide{grid-column:span 2}.form .full{grid-column:1/-1}

    .comment-box{margin-top:14px;display:flex;flex-direction:column;gap:10px}
    .comment{padding:12px;border-radius:16px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.07)}
    .comment b{font-size:13px}.comment p{margin:5px 0 0;color:var(--muted);font-size:13px;line-height:1.5}

    .hidden{display:none!important}

    @media(max-width:1100px){
      .hero{grid-template-columns:1fr}
      .live-grid{grid-template-columns:repeat(2,1fr)}
      .span-8,.span-4,.span-6{grid-column:span 12}
      .tier-grid{grid-template-columns:repeat(2,1fr)}
    }
    @media(max-width:720px){
      .app{padding:14px}
      .topbar{align-items:flex-start;flex-direction:column}
      .nav{justify-content:flex-start}
      .hero h1{font-size:34px}
      .home-brand{align-items:flex-start;flex-direction:column;gap:14px}
      .home-brand h1{font-size:42px}
      .live-grid{grid-template-columns:1fr}
      .hero-main,.today-card,.panel{padding:18px}
      .filters{grid-template-columns:1fr 1fr}
      .filters input{grid-column:1/-1}
      .tier-grid{grid-template-columns:1fr}
      .form{grid-template-columns:1fr}.form .wide{grid-column:span 1}
      table{font-size:12px} th,td{padding:10px 8px}
    }

    #liveList{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
  gap:20px;
  margin-top:20px;
}

.live-card{
  background:#1b1f34;
  border-radius:24px;
  overflow:hidden;
  text-decoration:none;
  color:white;
  transition:.2s;
  border:1px solid rgba(255,255,255,.06);
}

.live-card:hover{
  transform:translateY(-4px);
  border-color:#2f7cff;
  box-shadow:0 10px 30px rgba(47,124,255,.25);
}

.live-thumb{
  width:100%;
  aspect-ratio:16/9;
  object-fit:cover;
  display:block;
}

.live-body{
  padding:16px;
}

.live-profile{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:14px;
}

.live-profile img{
  width:52px;
  height:52px;
  border-radius:50%;
  border:2px solid #2f7cff;
}

.live-name{
  font-size:22px;
  font-weight:800;
}

.live-viewer{
  opacity:.7;
  font-size:14px;
}

.live-title{
  font-size:17px;
  line-height:1.5;
  font-weight:600;
}

.live-badge{
  display:inline-flex;
  align-items:center;
  gap:6px;
  background:#ff2d55;
  color:white;
  font-size:12px;
  font-weight:700;
  padding:6px 10px;
  border-radius:999px;
  margin-bottom:10px;
}

#postList{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
  gap:16px;
}

#postList .post-item{
  min-height:190px;
  align-items:flex-start;
  justify-content:flex-start;
  flex-direction:column;
  transition:.2s;
}

#postList .post-item:hover{
  transform:translateY(-3px);
  border-color:#2f7cff;
  box-shadow:0 10px 24px rgba(47,124,255,.18);
}

#postList .name{
  font-size:22px;
  line-height:1.35;
  font-weight:1000;
  white-space:normal;
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  overflow:hidden;
}



#postList .meta{
  font-size:18px;
  font-weight:900;
  color:#a9a4d8;
  margin-top:6px;
}

.post-preview{
  margin-top:14px;
  font-size:15px;
  line-height:1.55;
  color:rgba(250,248,255,.78);
  display:-webkit-box;
  -webkit-line-clamp:3;
  -webkit-box-orient:vertical;
  overflow:hidden;
}

.refresh-button{
  height:54px;
  min-width:150px;
  padding:0 22px;
  border:0;
  border-radius:18px;
  background:linear-gradient(135deg,var(--brand),var(--brand2));
  color:#fff;
  font-size:15px;
  font-weight:900;
  cursor:pointer;
  box-shadow:0 10px 24px rgba(3,86,254,.28);
}

.refresh-button:disabled{
  opacity:.65;
  cursor:not-allowed;
}

.section-sub-count{
  display:inline-flex;
  align-items:center;
  height:24px;
  padding:0 10px;
  border-radius:999px;
  background:rgba(255,255,255,.08);
  color:var(--muted);
  font-size:13px;
  font-weight:900;
}
#postList{
  display:grid !important;
  grid-template-columns:repeat(4, minmax(0, 1fr));
  gap:16px;
  margin-top:18px;
}

#postList .post-item{
  width:100%;
  min-height:130px;
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  justify-content:space-between;
  padding:16px;
}

@media(max-width:1200px){
  #postList{
    grid-template-columns:repeat(3, minmax(0, 1fr));
  }
}

@media(max-width:768px){
  #postList{
    grid-template-columns:1fr;
  }
}

.load-more-button{
  display:block;
  width:260px;
  height:48px;
  margin:22px auto 0;
  border:0;
  border-radius:16px;
  background:rgba(255,255,255,.08);
  color:white;
  font-weight:900;
  cursor:pointer;
  border:1px solid rgba(255,255,255,.12);
}

.load-more-button:hover{
  background:linear-gradient(135deg,var(--brand),var(--brand2));
}

#page-members .panel{
  max-width:1500px;
  margin:0 auto;
}

#memberList{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
  gap:18px;
}

#memberList{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
  gap:18px;
}

.crew-card{
  position:relative;
  aspect-ratio:1/1.12;
  border-radius:26px;
  padding:18px;
  background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.04));
  border:1px solid rgba(255,255,255,.1);
  display:flex;
  flex-direction:column;
  align-items:center;
  text-align:center;
}

.crew-profile{
  width:96px;
  height:96px;
  border-radius:28px;
  object-fit:cover;
  border:3px solid rgba(0,162,255,.8);
  margin-bottom:12px;
}

.crew-name{
  font-size:24px;
  font-weight:1000;
  color:white;
}

.crew-race{
  margin-top:8px;
  margin-bottom:20px;
  font-size:16px;
  font-weight:900;
}

.crew-live{
  position:absolute;
  top:14px;
  right:14px;
}

.crew-live.is-on{
  background:#ff2a51;
  color:white;
}

.crew-live.is-off{
  background:rgba(255,255,255,.12);
  color:#aaa6c8;
}

.crew-station{
  margin-top:auto;
  width:100%;
  height:46px;
  border-radius:16px;
  display:grid;
  place-items:center;
  background:rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.12);
  font-size:15px;
  font-weight:1000;
}

.crew-station:hover{
  background:linear-gradient(135deg,var(--brand),var(--brand2));
}

.post-head{
  display:flex;
  align-items:flex-start;
  gap:14px;
  width:100%;
}

.post-avatar{
  width:58px;
  height:58px;
  border-radius:18px;
  object-fit:cover;
  border:2px solid var(--brand2);
  flex:0 0 auto;
}

.post-title-area{
  min-width:0;
  flex:1;
}

#postList .name{
  font-size:21px;
}

#postList .meta{
  font-size:15px;
}

#tierCards{
  display:block;
}

.tier-section{
  margin-top:32px;
  padding-top:24px;
  border-top:1px solid rgba(255,255,255,.12);
}

.tier-section:first-child{
  margin-top:0;
  padding-top:0;
  border-top:0;
}

.tier-header{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:14px;
}

.tier-label{
  padding:6px 12px;
  border-radius:10px;
  background:rgba(255,180,40,.14);
  border:1px solid rgba(255,180,40,.65);
  color:#ffd36a;
  font-size:16px;
  font-weight:1000;
}

.tier-count{
  color:#aaa6c8;
  font-size:13px;
  font-weight:900;
}

.tier-card-grid{
  display:grid;
  grid-template-columns:repeat(4, minmax(0,1fr));
  gap:18px;
}

.tier-player-card{
  position:relative;
  min-height:250px;
  padding:14px;
  border-radius:14px;
  background:rgba(255,255,255,.045);
  border:1px solid rgba(255,255,255,.12);
   border-radius:18px;
  text-align:center;
  transition:.18s;
}

.tier-player-card:hover{
  transform:translateY(-3px);
  box-shadow:0 10px 24px rgba(0,162,255,.18);
}

.tier-player-card.is-live{
  box-shadow:0 0 18px rgba(0,162,255,.28);
}

.tier-thumb-wrap{
  width:110px;
  height:110px;
  margin:0 auto 10px;
  border-radius:50%;
  overflow:hidden;
  background:rgba(255,255,255,.08);
}

.tier-thumb-wrap.wide{
  width:100%;
  height:auto;
  aspect-ratio:16/9;
  border-radius:12px;
}

.tier-thumb-wrap img{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
}

.tier-live-badge{
  position:absolute;
  top:8px;
  right:8px;
  padding:4px 8px;
  border-radius:999px;
  background:#ff2a51;
  color:white;
  font-size:11px;
  font-weight:1000;
}

.tier-player-name{
  font-size:16px;
  font-weight:1000;
  color:white;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.tier-player-meta{
  display:flex;
  justify-content:center;
  gap:6px;
  margin-top:4px;
  font-size:12px;
  font-weight:900;
  color:#aaa6c8;
}

.race-card-P{border-color:rgba(255,211,106,.55);}
.race-card-T{border-color:rgba(0,162,255,.55);}
.race-card-Z{border-color:rgba(255,42,81,.55);}

  

/* Split-page navigation */
.nav a{
  border:1px solid rgba(255,255,255,.08);
  background:rgba(255,255,255,.06);
  color:var(--muted);
  padding:10px 14px;
  border-radius:999px;
  cursor:pointer;
  font-weight:800;
  display:inline-flex;
  align-items:center;
  text-decoration:none;
}
.nav a.active,
.nav a:hover{
  background:linear-gradient(135deg,var(--brand),var(--brand2));
  color:white;
  border-color:transparent;
}
.nav button.theme-button{
  border:1px solid rgba(255,255,255,.08);
  background:rgba(255,255,255,.06);
  color:var(--muted);
  padding:10px 14px;
  border-radius:999px;
  cursor:pointer;
  font-weight:800;
}
.page{display:block;}
#tierCards{display:block !important;}
.tier-card-grid{grid-template-columns:repeat(4,minmax(0,1fr));}
@media(max-width:1100px){.tier-card-grid{grid-template-columns:repeat(3,minmax(0,1fr));}}
@media(max-width:720px){.tier-card-grid{grid-template-columns:repeat(1,minmax(0,1fr));}}

/* 라이트모드 게시글 카드 */
body.light-mode .post-item{
  background:#ffffff !important;
  border:1px solid #d7def0 !important;
  box-shadow:0 8px 20px rgba(20,30,60,.08);
}

/* 제목 */
body.light-mode .post-item .name{
  color:#161a2d !important;
}

/* 메타 */
body.light-mode .post-item .meta{
  color:#7a6fe0 !important;
}

/* 본문 */
body.light-mode .post-item .post-preview{
  color:#4b5568 !important;
}

/* 아바타 */
body.light-mode .post-avatar{
  border:2px solid #1e8fff;
}

/* 라이트모드 멤버 카드 보정 */
body.light-mode .crew-card{
  background:#ffffff !important;
  border:1px solid #d7def0 !important;
  box-shadow:0 8px 20px rgba(20,30,60,.08) !important;
}

body.light-mode .crew-name{
  color:#161a2d !important;
}

body.light-mode .crew-station{
  color:#161a2d !important;
  background:#ffffff !important;
  border:1px solid #d7def0 !important;
}

body.light-mode .crew-live{
  color:#7b6fd6 !important;
}

body.light-mode .panel,
body.light-mode .card{
  border:1px solid #d7def0;
}


/* 티어표 패널 통일 */
body:not(.light-mode) #page-tiers .panel{
  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,.07),
      rgba(255,255,255,.035)
    ) !important;

  border:1px solid rgba(255,255,255,.09) !important;
}

/* 티어 카드 통일 */
body:not(.light-mode) #page-tiers .tier-player-card{
  background:rgba(255,255,255,.05) !important;
  border:1px solid rgba(255,255,255,.08) !important;
}

/* 필터 영역 통일 */
body:not(.light-mode) #page-tiers .filters input,
body:not(.light-mode) #page-tiers .filters select{
  background:rgba(255,255,255,.07) !important;
  border:1px solid rgba(255,255,255,.10) !important;
  color:#faf8ff !important;
}



/* ===== 공통 카드 ===== */

.card{
  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,.07),
      rgba(255,255,255,.035)
    );

  border:1px solid rgba(255,255,255,.09);

  border-radius:28px;

  box-shadow:var(--shadow);

  overflow:hidden;
}

/* ===== 공통 패널 ===== */

.panel{
  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,.07),
      rgba(255,255,255,.035)
    ) !important;

  border:1px solid rgba(255,255,255,.09) !important;

  box-shadow:var(--shadow) !important;
}

/* ===== 티어 카드 ===== */

.tier-player-card{
  position:relative;

  min-height:250px;

  padding:14px;

  border-radius:18px;

  background:rgba(255,255,255,.05) !important;

  border:1px solid rgba(255,255,255,.07) !important;

  backdrop-filter:blur(8px);

  text-align:center;

  transition:.18s;
}

.tier-player-card:hover{
  transform:translateY(-3px);

  box-shadow:0 10px 24px rgba(0,162,255,.18);
}

.tier-player-card.is-live{
  box-shadow:0 0 18px rgba(0,162,255,.28);
}

/* ===== 티어 필터 ===== */

.filters input,
.filters select{
  background:rgba(255,255,255,.07);

  border:1px solid rgba(255,255,255,.10);

  color:var(--text);

  border-radius:14px;

  padding:12px 13px;

  outline:none;
}

/* ===== 티어 섹션 ===== */

.tier-section{
  margin-top:32px;

  padding-top:24px;

  border-top:1px solid rgba(255,255,255,.12);
}

.tier-section:first-child{
  margin-top:0;

  padding-top:0;

  border-top:0;
}

/* ===== 티어 라벨 ===== */

.tier-label{
  padding:6px 12px;

  border-radius:10px;

  background:rgba(255,180,40,.14);

  border:1px solid rgba(255,180,40,.65);

  color:#ffd36a;

  font-size:16px;

  font-weight:1000;
}


body.light-mode .card,
body.light-mode .panel{
  background:#ffffff !important;

  border:1px solid #d7def0 !important;

  box-shadow:0 10px 30px rgba(0,0,0,.08);
}

body.light-mode .tier-player-card{
  background:#ffffff !important;

  border:1px solid #d7def0 !important;
}

body.light-mode .filters input,
body.light-mode .filters select{
  background:#ffffff !important;

  border:1px solid #d7def0 !important;

  color:#1b1a27 !important;
}






/* =========================
   라이트모드 티어표 가독성
========================= */

body.light-mode .tier-label{
  background:#fff4d6 !important;
  border:1px solid #f2c96b !important;
  color:#b87400 !important;
}

body.light-mode .tier-count{
  color:#6b7280 !important;
  font-weight:800;
}

body.light-mode .tier-player-name{
  color:#161a2d !important;
  font-size:20px !important;
  font-weight:1000 !important;
}

body.light-mode .tier-player-meta{
  color:#6b7280 !important;
  font-size:14px !important;
  font-weight:900 !important;
}

body.light-mode .race-card-T .tier-player-meta{
  color:#008cff !important;
}

body.light-mode .race-card-Z .tier-player-meta{
  color:#ff2a51 !important;
}

body.light-mode .race-card-P .tier-player-meta{
  color:#00b894 !important;
}

/* =========================
   라이브 카드 강조
========================= */

.tier-player-card.is-live{
  border-width:30px !important;
}

/* 테란 */
.tier-player-card.is-live.race-card-T{
  border-color:#00a2ff !important;

  box-shadow:
    0 0 0 1px rgba(0,162,255,.7),
    0 0 24px rgba(0,162,255,.45),
    0 0 60px rgba(0,162,255,.18) !important;
}

/* 저그 */
.tier-player-card.is-live.race-card-Z{
  border-color:#ff2a51 !important;

  box-shadow:
    0 0 0 1px rgba(255,42,81,.7),
    0 0 24px rgba(255,42,81,.42),
    0 0 60px rgba(255,42,81,.18) !important;
}

/* 프로토스 */
.tier-player-card.is-live.race-card-P{
  border-color:#ffd36a !important;

  box-shadow:
    0 0 0 1px rgba(255,211,106,.75),
    0 0 24px rgba(255,211,106,.42),
    0 0 60px rgba(255,211,106,.18) !important;
}



#scrollTopBtn:hover{
  transform:translateY(-4px);
  box-shadow:0 18px 42px rgba(3,86,254,.48);
}

body.light-mode #scrollTopBtn{
  border:1px solid rgba(3,86,254,.18);
  box-shadow:0 12px 30px rgba(3,86,254,.22);
}

/* 왼쪽 플로팅 배너 */
.floating-banner{
  position:fixed;
  left:40px;
  top:40px;
  z-index:9998;

  display:flex;
  flex-direction:column;
  gap:12px;
}

.floating-banner a{
  display:block;
  width:128px;
  height:64px;
  border-radius:8px;
  overflow:hidden;

  background:rgba(255,255,255,.07);
  border:1px solid rgba(255,255,255,.12);
  box-shadow:0 12px 32px rgba(0,0,0,.25);
}

.floating-banner img{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
}

.floating-banner a:hover{
  transform:translateY(-3px);
  box-shadow:0 16px 38px rgba(3,86,254,.35);
}

html{
  overflow-y:scroll;
}

body{
  overflow-x:hidden;
}

/* =========================
   개인전적 페이지 라이트모드
========================= */

body.light-mode .record-search input{
  background:#eef3ff;
  color:#182033;
  border:1px solid #d7e2ff;
}

body.light-mode .record-search input::placeholder{
  color:#7d88a8;
}

body.light-mode .record-search button{
  background:linear-gradient(135deg,#178bff,#45b8ff);
  color:white;
  box-shadow:0 8px 20px rgba(23,139,255,.18);
}

body.light-mode .map-filter button{
  background:#eef3ff;
  color:#23304f;
  border:1px solid #d7e2ff;
}

body.light-mode .map-filter button:hover{
  background:#178bff;
  color:white;
  border-color:#178bff;
}

body.light-mode .map-filter button.active{
  background:linear-gradient(135deg,#178bff,#45b8ff);
  color:white;
  border-color:transparent;
}

body.light-mode .search-suggestions{
  background:white;
  border:1px solid #dfe7ff;
  box-shadow:0 12px 28px rgba(0,0,0,.08);
}

body.light-mode .suggestion-item{
  color:#1a2238;
}

body.light-mode .suggestion-item:hover{
  background:#178bff;
  color:white;
}

.match-result-wrap{
  display:flex;
  flex-direction:column;
  gap:24px;
}

.match-tabs{
  display:flex;
  gap:12px;
  flex-wrap:wrap;
}

.match-tabs button{
  padding:12px 22px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.1);
  background:rgba(255,255,255,.07);
  color:var(--text);
  font-size:16px;
  font-weight:900;
  cursor:pointer;
}

.match-tabs button.active{
  background:linear-gradient(135deg,var(--brand),var(--brand2));
  color:white;
}

.match-view{
  display:none;
}

.match-view.active{
  display:block;
}

.team-match-card{
  padding:22px;
  border-radius:22px;
  background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.08);
  margin-bottom:18px;
}

.team-match-head{
  display:grid;
  grid-template-columns:120px 1fr 120px 120px 120px;
  gap:12px;
  align-items:center;
  font-weight:900;
}

.team-match-result.win{color:#3ecfff;}
.team-match-result.lose{color:#ff5b7c;}

.set-list{
  margin-top:18px;
  display:flex;
  flex-direction:column;
  gap:8px;
}

.set-row{
  display:grid;
  grid-template-columns:60px 1fr 80px 1fr 1fr;
  gap:12px;
  padding:12px 14px;
  border-radius:14px;
  background:rgba(255,255,255,.045);
  align-items:center;
}

.player-result-card{
  padding:22px;
  border-radius:22px;
  background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.08);
}

body.light-mode .team-match-card,
body.light-mode .player-result-card{
  background:#ffffff;
  border:1px solid #d7def0;
}

body.light-mode .set-row{
  background:#eef3ff;
}

body.light-mode .match-tabs button{
  background:#eef3ff;
  color:#23304f;
  border:1px solid #d7e2ff;
}

body.light-mode .match-tabs button.active{
  background:linear-gradient(135deg,#178bff,#45b8ff);
  color:white;
}

.team-match-head{
  display:grid;
  grid-template-columns:140px 1.2fr 120px 80px 120px 120px;
  align-items:center;
  gap:16px;
}

.match-opponent,
.match-type,
.match-score{
  font-size:18px;
  font-weight:900;
  color:#ffffff;
}

.set-toggle{
  height:40px;
  border:none;
  border-radius:999px;
  background:rgba(255,255,255,.08);
  color:#b9c6ff;
  font-weight:900;
  cursor:pointer;
}

.set-toggle:hover{
  background:linear-gradient(135deg,var(--brand),var(--brand2));
  color:white;
}

.set-list.collapsed{
  display:none;
}

.set-row{
  display:grid;
  grid-template-columns:80px 1fr 80px 1fr 1fr;
  gap:16px;
  align-items:center;
}

body.light-mode .match-opponent,
body.light-mode .match-type,
body.light-mode .match-score{
  color:#1b1a27;
}

.match-filters{
  display:flex;
  justify-content:flex-end;
  gap:12px;
  margin-top:-8px;
}

.match-filters select{
  width:180px;
  height:44px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.07);
  color:var(--text);
  padding:0 16px;
  font-weight:800;
}

.team-match-head{
  display:grid;
  grid-template-columns:140px 1.1fr 130px 70px 1fr 130px 120px;
  align-items:center;
  gap:18px;
}

.match-date,
.match-opponent,
.match-type,
.match-score,
.match-note-inline{
  font-size:17px;
  font-weight:900;
  color:#fff;
}

.match-note-inline{
  color:#b9c6ff;
  font-size:15px;
  text-align:center;
}

.set-row{
  display:grid;
  grid-template-columns:90px 1fr 80px 1fr;
  gap:18px;
  align-items:center;
  padding:13px 16px;
  border-radius:14px;
  background:rgba(255,255,255,.045);
  font-size:16px;
  font-weight:800;
}

.set-list.collapsed{
  display:none;
}

.set-toggle{
  height:40px;
  border:none;
  border-radius:999px;
  background:rgba(255,255,255,.08);
  color:#b9c6ff;
  font-weight:900;
  cursor:pointer;
}

.set-toggle:hover{
  background:linear-gradient(135deg,var(--brand),var(--brand2));
  color:white;
}

body.light-mode .match-date,
body.light-mode .match-opponent,
body.light-mode .match-type,
body.light-mode .match-score{
  color:#1b1a27;
}

body.light-mode .match-note-inline{
  color:#5b5872;
}

body.light-mode .set-row{
  background:#eef3ff;
}

body.light-mode .match-filters select{
  background:#eef3ff;
  border:1px solid #d7e2ff;
  color:#23304f;
}

.match-filters{
  display:flex;
  justify-content:flex-end;
  align-items:center;
  gap:12px;
  margin-top:-8px;
}

.type-filter{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
}

.type-chip,
.match-filters select{
  height:44px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.07);
  color:var(--text);
  padding:0 18px;
  font-weight:900;
  cursor:pointer;
}

.type-chip.active{
  background:linear-gradient(135deg,var(--brand),var(--brand2));
  color:white;
}

.team-match-head{
  display:grid;
  grid-template-columns:140px 260px 130px 60px 160px 120px 120px;
  align-items:center;
  gap:12px;
}

.match-opponent{
  text-align:left;
}

.match-type{
  text-align:left;
}

.team-match-result{
  text-align:left;
}

.match-note-inline{
  text-align:left;
  color:#b9c6ff;
  font-size:15px;
  font-weight:900;
}

.match-score{
  text-align:left;
}

body.light-mode .type-chip,
body.light-mode .match-filters select{
  background:#eef3ff;
  border:1px solid #d7e2ff;
  color:#23304f;
}

body.light-mode .type-chip.active{
  background:linear-gradient(135deg,#178bff,#45b8ff);
  color:white;
}

.match-filters{
  display:flex;
  justify-content:flex-start !important;
  align-items:center;
  gap:10px;
  margin-top:0;
}

.type-filter,
.result-filter{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
}

.type-chip,
.result-chip{
  height:44px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.07);
  color:var(--text);
  padding:0 20px;
  font-weight:1000;
  cursor:pointer;
}

.type-chip.active,
.result-chip.active{
  background:linear-gradient(135deg,var(--brand),var(--brand2));
  color:white;
  border-color:transparent;
}
/* 팀전적 메인 정보 세트보기 전 */
.team-match-head{
  display:grid !important;
  grid-template-columns:150px 260px 150px 70px 200px 120px 1fr !important;
  align-items:center;
  gap:12px;
}

.set-toggle{
  justify-self:end;
  width:120px;
}

.set-row{
  display:grid !important;
  grid-template-columns:120px 1fr 90px 1fr 70px !important;
  gap:14px;
  align-items:center;
}

.youtube-link img{
  width:28px;
  height:auto;
  display:block;
}

body.light-mode .type-chip,
body.light-mode .result-chip{
  background:#eef3ff;
  border:1px solid #d7e2ff;
  color:#23304f;
}

body.light-mode .type-chip.active,
body.light-mode .result-chip.active{
  background:linear-gradient(135deg,#178bff,#45b8ff);
  color:white;
}

.match-filters{
  justify-content:flex-start !important;
}

.match-filters select{
  width:180px;
  height:48px;
  border-radius:999px;
  background:rgba(255,255,255,.07);
  border:1px solid rgba(255,255,255,.12);
  color:var(--text);
  padding:0 18px;
  font-weight:900;
}

/* 경기결과 세트 행 최종 정렬 */
.set-row{
  display:grid !important;
  grid-template-columns:80px 1fr 80px 1fr 70px !important;
  align-items:center !important;
  gap:20px !important;
  padding:14px 18px !important;
}

.set-no,
.set-player,
.set-result,
.set-enemy,
.set-video{
  text-align:left !important;
  font-size:17px;
  font-weight:900;
}

.set-no{
  justify-self:start;
}

.set-player{
  justify-self:start;
}

.set-result{
  justify-self:center;
}

.set-enemy{
  justify-self:start;
}

.set-video{
  justify-self:end;
}

.set-video{
  display:flex;
  justify-content:flex-end;
}

.youtube-link{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:44px;
  height:32px;
  border-radius:10px;
  background:rgba(255,255,255,.08);
}

.youtube-link img{
  width:28px;
  height:auto;
  display:block;
}

body.light-mode .match-filters select{
  background:#eef3ff;
  border:1px solid #d7e2ff;
  color:#23304f;
}


/* 주석 : 경기결과 세트 행 최종 정렬 */
.set-row{
  display:grid !important;
  grid-template-columns:130px 280px 132px 284px 380px 40px !important;
  align-items:center !important;
  gap:12px !important;
  padding:14px 18px !important;
}

.set-no,
.set-player,
.set-race,
.set-result,
.set-enemy,
.set-video{
  text-align:left !important;
  font-size:17px;
  font-weight:900;
}

.set-race.race-T{color:var(--terran);}
.set-race.race-Z{color:var(--zerg);}
.set-race.race-P{color:var(--protoss);}
.set-race.race-R{color:var(--random);}

.set-no{justify-self:start;}
.set-player{justify-self:start;}
.set-race{justify-self:start;}
.set-result{justify-self:start;}
.set-enemy{justify-self:start;}
.set-video{justify-self:end;}

.team-stats-summary{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:14px;
  margin-top:-6px;
}

.team-stat-box{
  padding:18px;
  border-radius:20px;
  background:rgba(255,255,255,.055);
  border:1px solid rgba(255,255,255,.09);
}

.team-stat-box h3{
  margin:0 0 8px;
  font-size:18px;
  font-weight:1000;
}

.team-stat-box strong{
  display:block;
  margin-bottom:12px;
  font-size:17px;
  color:#fff;
}

.team-stat-line{
  display:flex;
  justify-content:space-between;
  gap:12px;
  margin-top:6px;
  font-size:14px;
  font-weight:900;
  color:#b9c6ff;
}

.team-stat-line b{
  color:#fff;
}

body.light-mode .team-stat-box{
  background:#ffffff;
  border:1px solid #d7def0;
}

body.light-mode .team-stat-box strong,
body.light-mode .team-stat-line b{
  color:#1b1a27;
}

body.light-mode .team-stat-line{
  color:#5b5872;
}

.player-name-buttons{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}

.player-name-chip{
  height:44px;
  padding:0 18px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.07);
  color:var(--text);
  font-weight:1000;
  cursor:pointer;
}

.player-name-chip.active{
  background:linear-gradient(135deg,var(--brand),var(--brand2));
  color:white;
  border-color:transparent;
}

.player-result-head{
  display:grid;
  grid-template-columns:1fr repeat(3,auto);
  gap:18px;
  align-items:center;
  margin-bottom:18px;
}

.player-result-head h3{
  margin:0;
  font-size:24px;
}

.player-game-list{
  display:flex;
  flex-direction:column;
  gap:8px;
}

.player-game-row{
  display:grid;
  grid-template-columns:130px 220px 130px 70px 80px 220px 70px;
  align-items:center;
  gap:18px;

  padding:18px 24px;
  border-radius:18px;

  background:rgba(255,255,255,0.04);
  margin-bottom:10px;
}

body.light-mode .player-name-chip{
  background:#eef3ff;
  border:1px solid #d7e2ff;
  color:#23304f;
}

body.light-mode .player-name-chip.active{
  background:linear-gradient(135deg,#178bff,#45b8ff);
  color:white;
}

body.light-mode .player-game-row{
  background:#eef3ff;
}

.player-name-buttons{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-top:18px;
  margin-bottom:22px;
}

#playerStatsSummary{
  margin-top:0;
  margin-bottom:26px;
}

#playerStatsSummary.team-stats-summary{
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:18px;
}

/* 1) 팀전적 필터 버튼 위아래 여백 */
#teamResultView .match-filters{
  margin-top:28px !important;
  margin-bottom:28px !important;
}

/* 2) 선수전적 리스트 폰트 통일 */
.player-game-row{
  font-size:18px !important;
  font-weight:900 !important;
  color:#fff !important;
  letter-spacing:-0.02em;
}

.player-game-row > div{
  font-size:18px !important;
  font-weight:900 !important;
}

/* 3) 승패 표시를 원형 배지로 */
.player-game-row .win,
.player-game-row .lose,
.set-row .win,
.set-row .lose,
.team-match-result.win,
.team-match-result.lose{
  display:inline-flex !important;
  align-items:center;
  justify-content:center;
  width:34px;
  height:34px;
  border-radius:50%;
  font-size:16px !important;
  font-weight:1000 !important;
  color:#fff !important;
}

.player-game-row .win,
.set-row .win,
.team-match-result.win{
  background:#00a2ff;
  box-shadow:0 0 16px rgba(0,162,255,.35);
}

.player-game-row .lose,
.set-row .lose,
.team-match-result.lose{
  background:#ff2a51;
  box-shadow:0 0 16px rgba(255,42,81,.35);
}

/* =========================================
   공통 다크/라이트 모드 최종 통합
   - 배경 선언은 여기 한 곳에서만 관리
========================================= */

html,
body{
  min-height:100vh;
}

body{
  overflow-x:hidden;
}

html{
  overflow-y:scroll;
}

/* ===== 다크모드 ===== */
body:not(.light-mode){
  background:
    radial-gradient(
      circle at top left,
      rgba(3,86,254,.18),
      transparent 34%
    ),
    radial-gradient(
      circle at center,
      rgba(0,162,255,.05),
      transparent 46%
    ),
    linear-gradient(
      180deg,
      #183b7a 0%,
      #10182d 55%,
      #0b0f1f 100%
    ) !important;

  background-attachment:fixed !important;
  background-repeat:no-repeat !important;
  color:var(--text);
}

/* ===== 라이트모드 ===== */
body.light-mode{
  background:#f4f7ff !important;
  background-attachment:fixed !important;
  background-repeat:no-repeat !important;
  color:#1b1a27;
}

/* ===== 다크모드 카드/패널 ===== */
body:not(.light-mode) .card,
body:not(.light-mode) .panel{
  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,.07),
      rgba(255,255,255,.035)
    ) !important;
  border:1px solid rgba(255,255,255,.09) !important;
  box-shadow:var(--shadow) !important;
}

/* ===== 라이트모드 카드/패널 ===== */
body.light-mode .card,
body.light-mode .panel{
  background:#ffffff !important;
  border:1px solid #d7def0 !important;
  box-shadow:0 10px 30px rgba(0,0,0,.08) !important;
}


/* 홈 상단 브랜드 박스 흰색 고정 */
.home-brand{
  background:#ffffff !important;
  border:1px solid #dfe5f4 !important;
}

/* 내부 텍스트 */
.home-brand h1{
  color:#171827 !important;
}

.home-brand p{
  color:#5f6278 !important;
}

.home-brand .kicker{
  color:#1d5cff !important;
}

/* STARCRAFT CREW 배지 */
.home-brand .kicker{
  background:#eef4ff !important;
  border:1px solid #b8ccff !important;
}

/* 다크모드에서도 유지 */
body:not(.light-mode) .home-brand{
  background:#ffffff !important;
}

.footer{
  margin-top:2px;
  padding:28px 20px 40px;
  text-align:center;
  color:#94a3b8;
}

.footer-copy{
  font-size:13px;
  margin-bottom:2px;
}

.footer-links{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:18px;
}

.footer-icon{
  text-decoration:none;
}

.footer-icon img{
  height:32px;
  width:auto;
  object-fit:contain;
  display:block;
}


.home-brand{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:40px;
}

.brand-left{
  display:flex;
  align-items:center;
  gap:32px;
}

.brand-award{
  display:flex;
  align-items:center;
  gap:10px;
  margin-left:auto;
}

.award-text{
  text-align:right;
  font-size:10px;
  line-height:1.35;
  font-weight:700;
  color:#171827;
}

.brand-award img{
  width:140px;
  height:auto;
  object-fit:contain;
}

/* 모바일에서는 플로팅 배너 숨김 */
@media (max-width: 768px){
  .floating-banner{
    display:none !important;
  }
}

@media (max-width: 768px){

  .brand-logo-box{
    width:60px;
    height:60px;
    flex-shrink:0;
    
  }

  .brand-logo-video{
    width:100%;
    height:100%;
    object-fit:contain;
  }

}

/* 모바일 멤버 카드 세로 간격 줄이기 */
@media (max-width: 768px){

  .crew-card{
    aspect-ratio:auto !important;
    min-height:auto !important;
    padding:20px 16px !important;
    justify-content:flex-start !important;
    gap:8px !important;
  }

  .crew-profile{
    width:82px !important;
    height:82px !important;
    margin-bottom:8px !important;
  }

  .crew-name{
    font-size:28px !important;
    line-height:1.15 !important;
  }

  .crew-race{
    margin-top:2px !important;
    margin-bottom:16px !important;
  }

  .crew-station{
    margin-top:18px !important;
    height:44px !important;
  }

}


/* =========================
   경기결과 모바일 최적화
========================= */
@media (max-width:768px){

  /* 상단 통계 3칸 → 가로 스크롤 */
  .team-stats-summary{
    display:flex !important;
    gap:12px;
    overflow-x:auto;
    padding-bottom:6px;
  }

  .team-stat-box{
    min-width:160px;
    flex:0 0 auto;

    padding:14px !important;
    border-radius:18px;
  }

  .team-stat-box h3{
    font-size:15px !important;
    line-height:1.35 !important;
    word-break:keep-all;
  }

  .team-stat-box strong{
    font-size:14px !important;
    line-height:1.5 !important;
  }

  .team-stat-line{
    font-size:12px !important;
    line-height:1.45 !important;
  }

  /* 경기 리스트 줄바꿈 */
  .team-match-head{
    grid-template-columns:1fr !important;
    gap:10px !important;

    align-items:flex-start !important;
    text-align:left !important;
  }

  .team-match-head > div,
  .team-match-head > button{
    width:100%;
    white-space:normal !important;
    word-break:keep-all;
  }

  .match-date,
  .match-opponent,
  .match-type,
  .match-score,
  .match-note-inline{
    font-size:16px !important;
    line-height:1.5 !important;
  }

  /* 세트보기 버튼 */
  .set-toggle{
    width:100% !important;
    height:44px !important;
  }

}

/* 모바일 경기결과 카드 정렬 */
@media (max-width:768px){

  .team-match-head{
    display:grid !important;
    grid-template-columns:1fr auto !important;
    gap:10px 18px !important;
    align-items:start !important;
  }

  .match-date{
    grid-column:1;
    grid-row:1;
  }

  .match-opponent{
    grid-column:1;
    grid-row:2;
  }

  .match-type{
    grid-column:1;
    grid-row:3;
  }

  .team-match-result{
    grid-column:2;
    grid-row:1;
    justify-self:end;
  }

  .match-note-inline{
    grid-column:2;
    grid-row:2;
    justify-self:end;
    text-align:right !important;
    white-space:normal !important;
  }

  .match-score{
    grid-column:2;
    grid-row:3;
    justify-self:end;
    text-align:right !important;
  }

  .set-toggle{
    grid-column:1 / -1;
    grid-row:4;
    width:100% !important;
    margin-top:12px;
  }

}

/* =========================
   선수별 전적 모바일 최적화
========================= */
@media (max-width:768px){

  .player-game-row{
    display:grid !important;
    grid-template-columns:1fr auto !important;
    gap:10px 16px !important;

    padding:22px 20px !important;
    border-radius:22px !important;

    background:#ffffff !important;
    border:1px solid #d7e2ff !important;
    color:#111827 !important;
  }

  body:not(.light-mode) .player-game-row{
    background:rgba(255,255,255,.05) !important;
    border:1px solid rgba(255,255,255,.09) !important;
    color:#ffffff !important;
  }

  .player-game-row > div{
    font-size:17px !important;
    line-height:1.45 !important;
    font-weight:900 !important;
    color:inherit !important;
    white-space:normal !important;
    word-break:keep-all !important;
  }

  /* 날짜 */
  .player-game-row > div:nth-child(1){
    grid-column:1;
    grid-row:1;
  }

  /* 상대팀 */
  .player-game-row > div:nth-child(2){
    grid-column:1;
    grid-row:2;
  }

  /* 경기유형 */
  .player-game-row > div:nth-child(3){
    grid-column:1;
    grid-row:3;
  }

  /* 종족 */
  .player-game-row > div:nth-child(4){
    grid-column:1;
    grid-row:4;
  }

  /* 승패 */
  .player-game-row > div:nth-child(5){
    grid-column:2;
    grid-row:1;
    justify-self:end;
  }

  /* 상대선수 */
  .player-game-row > div:nth-child(6){
    grid-column:2;
    grid-row:2;
    justify-self:end;
    text-align:right !important;
  }

  /* 유튜브 버튼 */
  .player-game-row > div:nth-child(7){
    grid-column:2;
    grid-row:3;
    justify-self:end;
  }

  .player-game-row .win,
  .player-game-row .lose{
    width:38px !important;
    height:38px !important;
    font-size:16px !important;
    color:#fff !important;
  }

}

/* =========================
   개인전적 라이트모드 가독성 보정
   PC + 모바일 공통
========================= */

body.light-mode #page-records .player-card,
body.light-mode #page-records .enhanced-player-card,
body.light-mode #page-records .stats-card,
body.light-mode #page-records .match-item{
  background:#ffffff !important;
  border:1px solid #d7e2ff !important;
  color:#111827 !important;
}

body.light-mode #page-records .player-name,
body.light-mode #page-records .stats-title,
body.light-mode #page-records .match-date,
body.light-mode #page-records .match-name strong,
body.light-mode #page-records .match-map,
body.light-mode #page-records .player-summary{
  color:#111827 !important;
}

body.light-mode #page-records .player-meta,
body.light-mode #page-records .stats-row,
body.light-mode #page-records .post-preview{
  color:#4b5563 !important;
}

body.light-mode #page-records .stats-row{
  border-bottom:1px solid #e1e8f8 !important;
}

body.light-mode #page-records .match-badges span,
body.light-mode #page-records .player-badges span{
  background:#eef3ff !important;
  color:#334155 !important;
  border:1px solid #d7e2ff !important;
}

body.light-mode #page-records .win{
  color:#008cff !important;
}

body.light-mode #page-records .lose{
  color:#ff2a51 !important;
}

/* 최근 경기 리스트 */
body.light-mode #page-records .match-list{
  background:transparent !important;
}

body.light-mode #page-records .match-item{
  box-shadow:0 6px 16px rgba(30,64,175,.06) !important;
}

/* 모바일에서도 동일 적용 */
@media (max-width:768px){

  body.light-mode #page-records .match-item{
    background:#ffffff !important;
    border:1px solid #d7e2ff !important;
    color:#111827 !important;
  }

  body.light-mode #page-records .match-item *{
    color:inherit;
  }

  body.light-mode #page-records .match-badges span{
    background:#eef3ff !important;
    color:#334155 !important;
  }

  body.light-mode #page-records .win{
    color:#008cff !important;
  }

  body.light-mode #page-records .lose{
    color:#ff2a51 !important;
  }

}

/* =====================================================
   경기 결과 - 상대별 전적 버튼 / 팝업
===================================================== */

#page-matchresult .match-result-title{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:20px;
}

#page-matchresult .opponent-record-btn{
  flex:0 0 auto;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-width:124px;
  height:42px;
  padding:0 18px;
  border:1px solid rgba(255,255,255,.12);
  border-radius:999px;
  background:rgba(255,255,255,.07);
  color:var(--text);
  font-size:14px;
  font-weight:900;
  cursor:pointer;
  transition:background .2s ease,border-color .2s ease,transform .2s ease;
}

#page-matchresult .opponent-record-btn:hover{
  background:linear-gradient(135deg,var(--brand),var(--brand2));
  border-color:transparent;
  color:#fff;
  transform:translateY(-1px);
}

.opponent-record-modal{
  position:fixed;
  inset:0;
  z-index:100000;
  display:none;
  align-items:center;
  justify-content:center;
  padding:24px;
}

.opponent-record-modal.active{
  display:flex;
}

.opponent-record-backdrop{
  position:absolute;
  inset:0;
  background:rgba(4,9,22,.72);
  backdrop-filter:blur(6px);
}

.opponent-record-dialog{
  position:relative;
  z-index:1;
  width:min(1050px,100%);
  max-height:82vh;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  background:#16233c;
  border:1px solid rgba(255,255,255,.11);
  border-radius:24px;
  box-shadow:0 28px 80px rgba(0,0,0,.5);
}

.opponent-record-header{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:18px;
  padding:22px 26px;
  border-bottom:1px solid rgba(255,255,255,.08);
}

.opponent-record-header h3{
  margin:0 0 6px;
  color:#fff;
  font-size:21px;
  font-weight:1000;
  letter-spacing:-.04em;
}

.opponent-record-header p{
  margin:0;
  color:#8fa2c4;
  font-size:13px;
  font-weight:800;
}

.opponent-record-close{
  flex:0 0 auto;
  width:38px;
  height:38px;
  border:1px solid rgba(255,255,255,.08);
  border-radius:50%;
  background:rgba(255,255,255,.07);
  color:#fff;
  font-size:25px;
  line-height:1;
  cursor:pointer;
}

.opponent-record-close:hover{
  background:rgba(255,255,255,.14);
}

.opponent-record-body{
  padding:18px 24px 24px;
  overflow:auto;
}

.opponent-record-table-wrap{
  width:100%;
  overflow-x:auto;
}

.opponent-record-table{
  width:100%;
  border-collapse:separate;
  border-spacing:0 8px;
  border-radius:0;
  overflow:visible;
}

.opponent-record-table th{
  padding:0 16px 8px;
  border:0;
  background:transparent;
  color:#8fa2c4;
  font-size:12px;
  font-weight:900;
  text-align:center;
}

.opponent-record-table th:first-child{
  text-align:left;
}

.opponent-record-table td{
  padding:16px;
  border:0;
  background:rgba(255,255,255,.055);
  color:#fff;
  font-size:14px;
  font-weight:900;
  text-align:center;
}

.opponent-record-table td:first-child{
  text-align:left;
  border-radius:14px 0 0 14px;
}

.opponent-record-table td:last-child{
  border-radius:0 14px 14px 0;
}

.opponent-record-name{
  color:#fff;
  font-size:15px;
  font-weight:1000;
}

.opponent-record-win{
  color:var(--terran);
}

.opponent-record-loss{
  color:var(--bad);
  margin-left:5px;
}

.opponent-record-empty{
  color:#7183a2;
}

.opponent-record-no-data{
  padding:30px !important;
  border-radius:14px !important;
  color:#8fa2c4 !important;
  text-align:center !important;
}

body.opponent-record-modal-open{
  overflow:hidden;
}

/* 라이트모드 */
body.light-mode #page-matchresult .opponent-record-btn{
  background:#eef3ff;
  border-color:#d7e2ff;
  color:#23304f;
}

body.light-mode #page-matchresult .opponent-record-btn:hover{
  background:linear-gradient(135deg,#178bff,#45b8ff);
  border-color:transparent;
  color:#fff;
}

body.light-mode .opponent-record-backdrop{
  background:rgba(17,24,39,.48);
}

body.light-mode .opponent-record-dialog{
  background:#fff;
  border-color:#d7def0;
  box-shadow:0 28px 80px rgba(28,39,65,.22);
}

body.light-mode .opponent-record-header{
  border-bottom-color:#e2e8f5;
}

body.light-mode .opponent-record-header h3,
body.light-mode .opponent-record-name{
  color:#1b1a27;
}

body.light-mode .opponent-record-header p,
body.light-mode .opponent-record-table th{
  color:#66738f;
}

body.light-mode .opponent-record-close{
  background:#eef3ff;
  border-color:#d7e2ff;
  color:#23304f;
}

body.light-mode .opponent-record-table td{
  background:#f3f6fd;
  color:#1b1a27;
}

@media(max-width:768px){
  #page-matchresult .match-result-title{
    align-items:center;
  }

  #page-matchresult .opponent-record-btn{
    min-width:auto;
    height:36px;
    padding:0 13px;
    font-size:12px;
  }

  .opponent-record-modal{
    padding:12px;
  }

  .opponent-record-dialog{
    max-height:86vh;
    border-radius:18px;
  }

  .opponent-record-header{
    padding:17px 18px;
  }

  .opponent-record-header h3{
    font-size:18px;
  }

  .opponent-record-body{
    padding:10px 12px 16px;
  }

  .opponent-record-table{
    min-width:780px;
  }

  .opponent-record-table td{
    padding:14px 12px;
    font-size:13px;
  }
}

/* =====================================================
   상대별 전적 - 대회전적
===================================================== */

/* 대회전적 전체 영역 */
.opponent-tournament-wrap{
  display:flex;
  flex-direction:column;
  align-items:stretch;
  gap:8px;
  width:100%;
}


/* 해당 대학과의 전체 대회전적
   승 = 파랑 / 패 = 빨강 유지 */
.opponent-tournament-total{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:5px;

  width:100%;
  padding-bottom:7px;

  border-bottom:1px solid rgba(255,255,255,.10);

  font-size:14px;
  font-weight:1000;
}


/* 각 대회별 세부 전적 */
.opponent-tournament-detail{
  display:flex;
  flex-direction:column;
  align-items:stretch;
  gap:5px;

  width:100%;
}


.opponent-tournament-item{
  display:grid;
  grid-template-columns:minmax(70px,1fr) auto;
  align-items:center;
  gap:10px;

  width:100%;
  white-space:nowrap;
}


/* 대회명 배지 */
.opponent-tournament-name{
  display:inline-flex;
  align-items:center;

  width:max-content;
  max-width:100%;

  padding:4px 8px;
  border-radius:7px;

  background:rgba(255,255,255,.08);
  color:#fff;

  font-size:11px;
  font-weight:900;

  overflow:hidden;
  text-overflow:ellipsis;
}


/* 각 대회별 1승 0패 등의 승패는 모두 흰색 */
.opponent-tournament-result{
  display:inline-flex;
  align-items:center;
  justify-content:flex-end;

  color:#fff !important;

  font-size:12px;
  font-weight:900;
  white-space:nowrap;
}


/* 라이트모드 */
body.light-mode .opponent-tournament-total{
  border-bottom-color:#e1e7f2;
}

body.light-mode .opponent-tournament-name{
  background:#e8eef9;
  color:#25314d;
}

/* 요청사항: 라이트모드에서도 대회별 세부 승패는 흰색 유지 */
body.light-mode .opponent-tournament-result{
  color:#fff !important;
}


/* 모바일 */
@media(max-width:768px){

  .opponent-tournament-item{
    grid-template-columns:minmax(64px,1fr) auto;
    gap:7px;
  }

  .opponent-tournament-name{
    font-size:10px;
    padding:4px 7px;
  }

  .opponent-tournament-result{
    font-size:11px;
  }

}
