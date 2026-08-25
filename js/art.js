/* ============================================================
   幻想郷通信 · 美术资产库
   ------------------------------------------------------------
   全站手绘 SVG 同人插画与图标，以 JS 字符串内联：
   - ART.reimu     旧版「浮空的灵梦」（保留作回退，不再由首页调用）
   - ART.avatar    旧版侧栏头像「灵梦半身像」（保留作回退）
   - ART.covers    文章封面场景插画 ×5
   - ART.chibi     友链 Q 版头像 ×4
   - ART.miss      404「被弹」小灵梦
   - ART.watch     幻想时计的怀表
   - ICONS         线性图标 sprite（<use href="#i-*">）
   之所以不用 <img src>：JS 注入的内联 SVG 才能继承 CSS 主题
   变量、参与视差与动画，且 file:// 双击打开依旧完整可用。
   ============================================================ */
(function () {
  "use strict";
  const ART = (window.ART = {});

  /* ---------- 线性图标（24×24 · stroke:currentColor） ---------- */
  const S = '<symbol viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  ART.iconSprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
    ${S} id="i-search"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></symbol>
    ${S} id="i-sun"><circle cx="12" cy="12" r="4.6"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7"/></symbol>
    ${S} id="i-moon"><path d="M20.4 14.2A8.5 8.5 0 0 1 9.8 3.6a8.5 8.5 0 1 0 10.6 10.6Z"/><path d="M17 4.5l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5Z" stroke-width="1.3"/></symbol>
    ${S} id="i-github"><path d="M9 19.5c-4.5 1.4-4.5-2.6-6.5-3m13 5v-3.1c0-.9-.1-1.6-.6-2.2 2.3-.3 4.6-1.2 4.6-5.2 0-1.2-.4-2.1-1.1-2.9.1-.3.5-1.4-.1-2.9 0 0-.9-.3-3 1.1a10.3 10.3 0 0 0-5.4 0C7.7 4.9 6.8 5.2 6.8 5.2c-.6 1.5-.2 2.6-.1 2.9-.7.8-1.1 1.7-1.1 2.9 0 4 2.3 4.9 4.6 5.2-.4.5-.6 1.1-.6 2.1v3.2"/></symbol>
    ${S} id="i-bili"><rect x="3" y="7.5" width="18" height="12" rx="3"/><path d="m7.5 3.5 2.6 3M16.5 3.5l-2.6 3M8.6 12.2v2.4M15.4 12.2v2.4"/></symbol>
    ${S} id="i-mail"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6.2L20 7"/></symbol>
    ${S} id="i-rss"><path d="M4.5 11.5a8 8 0 0 1 8 8M4.5 5a14.5 14.5 0 0 1 14.5 14.5"/><circle cx="5.6" cy="18.4" r="1.4" fill="currentColor" stroke="none"/></symbol>
    ${S} id="i-calendar"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M8 2.8v4M16 2.8v4M3.5 10.5h17"/></symbol>
    ${S} id="i-pen"><path d="m14.5 4.5 5 5L8 21H3v-5L14.5 4.5Z"/><path d="m12.5 6.5 5 5"/></symbol>
    ${S} id="i-clock"><circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.2 2"/></symbol>
    ${S} id="i-pin"><path d="M9 4h6l-.8 6.2 2.8 2.8v1.5H7v-1.5l2.8-2.8L9 4Z"/><path d="M12 14.5V21"/></symbol>
    ${S} id="i-tag"><path d="M3.5 12.5v-9h9L21 12l-8.5 8.5-9-8Z" transform="rotate(0 12 12)"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></symbol>
    ${S} id="i-refresh"><path d="M20 12a8 8 0 1 1-2.4-5.7M20 3.5v4h-4"/></symbol>
    ${S} id="i-up"><path d="M12 20V5M5.5 11.5 12 5l6.5 6.5"/></symbol>
    ${S} id="i-close"><path d="m6 6 12 12M18 6 6 18"/></symbol>
    ${S} id="i-torii"><path d="M3.5 5.5c5.5-1.6 11.5-1.6 17 0M5 9h14M6.5 5.2 7.5 20M17.5 5.2 16.5 20M12 5v4"/></symbol>
    ${S} id="i-book"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/></symbol>
    ${S} id="i-home"><path d="m4 11 8-7 8 7"/><path d="M6 9.5V20h12V9.5"/></symbol>
    ${S} id="i-user"><circle cx="12" cy="8.2" r="4"/><path d="M4.5 20.5c1.6-3.6 4.2-5.3 7.5-5.3s5.9 1.7 7.5 5.3"/></symbol>
    ${S} id="i-star"><path d="m12 3.5 2.4 5 5.4.7-4 3.8 1 5.4-4.8-2.6-4.8 2.6 1-5.4-4-3.8 5.4-.7Z"/></symbol>
    ${S} id="i-sakura"><path d="M12 3.6c1.8 1.8 2.2 3.7 1.4 5.6 1.9-.8 3.8-.4 5.6 1.4-1.8 1.8-3.7 2.2-5.6 1.4.8 1.9.4 3.8-1.4 5.6-1.8-1.8-2.2-3.7-1.4-5.6-1.9.8-3.8.4-5.6-1.4 1.8-1.8 3.7-2.2 5.6-1.4-.8-1.9-.4-3.8 1.4-5.6Z"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/></symbol>
  </svg>`;

  /* ---------- 主视觉：浮空的灵梦（首页与桌宠共用的原创 SVG） ---------- */
  ART.reimu = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 820" class="reimu-svg" role="img" aria-label="博丽灵梦：浮空的巫女">
<defs>
  <radialGradient id="rmAura" cx="50%" cy="46%" r="55%">
    <stop offset="0%" stop-color="#fff3d6" stop-opacity=".6"/>
    <stop offset="55%" stop-color="#ffe9c2" stop-opacity=".22"/>
    <stop offset="100%" stop-color="#ffe9c2" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="rmMoon" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#fff8e2" stop-opacity=".55"/>
    <stop offset="78%" stop-color="#fff3d2" stop-opacity=".3"/>
    <stop offset="98%" stop-color="#ffedbf" stop-opacity=".12"/>
    <stop offset="100%" stop-color="#ffedbf" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="rmHairG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#63463a"/><stop offset="100%" stop-color="#412c25"/>
  </linearGradient>
  <linearGradient id="rmHairBackG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#503830"/><stop offset="100%" stop-color="#2d1e18"/>
  </linearGradient>
  <linearGradient id="rmRedG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#e7574f"/><stop offset="100%" stop-color="#bd3733"/>
  </linearGradient>
  <linearGradient id="rmSkirtG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#de4f48"/><stop offset="68%" stop-color="#bb3733"/><stop offset="100%" stop-color="#a02c29"/>
  </linearGradient>
  <linearGradient id="rmWhiteG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#fffdf8"/><stop offset="100%" stop-color="#ece1d8"/>
  </linearGradient>
  <linearGradient id="rmIrisG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#7c3128"/><stop offset="45%" stop-color="#a34a36"/><stop offset="100%" stop-color="#d08055"/>
  </linearGradient>
  <filter id="rmSoft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4"/></filter>
  <clipPath id="rmEyeClip"><path d="M228,202 C234,190 249,185 261,189 C270,192 276,200 277,208 C276,220 266,228 253,229 C240,229 231,220 228,208 Z"/></clipPath>
  <style>
    .reimu-svg *{transform-box:view-box}
    .rm-float{animation:rmFloat 5.8s ease-in-out infinite}
    @keyframes rmFloat{0%,100%{transform:translateY(0) rotate(.5deg)}50%{transform:translateY(-16px) rotate(-.6deg)}}
    .rm-hairback{animation:rmSway 5.2s ease-in-out infinite;transform-origin:280px 110px}
    @keyframes rmSway{0%,100%{transform:rotate(.8deg)}50%{transform:rotate(-1.1deg)}}
    .rm-lockL{animation:rmLockL 4.6s ease-in-out infinite;transform-origin:220px 230px}
    @keyframes rmLockL{0%,100%{transform:rotate(1.4deg)}50%{transform:rotate(-1.8deg)}}
    .rm-lockR{animation:rmLockL 4.6s ease-in-out -1.4s infinite;transform-origin:340px 230px}
    .rm-skirt{animation:rmSkirtW 5.2s ease-in-out infinite;transform-origin:280px 374px}
    @keyframes rmSkirtW{0%,100%{transform:skewX(0deg)}50%{transform:skewX(-2.2deg)}}
    .rm-sleeveL{animation:rmSlv 4.4s ease-in-out infinite;transform-origin:226px 316px}
    @keyframes rmSlv{0%,100%{transform:rotate(1.4deg)}50%{transform:rotate(-1.6deg)}}
    .rm-sleeveR{animation:rmSlv 4.4s ease-in-out -2s infinite;transform-origin:330px 316px}
    .rm-shideA{animation:rmShide 3.8s ease-in-out infinite;transform-origin:97px 190px}
    .rm-shideB{animation:rmShide 3.8s ease-in-out -1.6s infinite;transform-origin:123px 192px}
    @keyframes rmShide{0%,100%{transform:rotate(2.5deg)}50%{transform:rotate(-3.5deg)}}
    .rm-lid{opacity:0;animation:rmBlink 5.4s infinite}
    @keyframes rmBlink{0%,92.5%{opacity:0}93.8%,95.6%{opacity:1}96.9%,100%{opacity:0}}
    .rm-aura{animation:rmPulse 4.6s ease-in-out infinite}
    @keyframes rmPulse{0%,100%{opacity:.75}50%{opacity:1}}
    .rm-ofuda1{animation:rmOf1 7s ease-in-out infinite}
    @keyframes rmOf1{0%,100%{transform:translate(0,0) rotate(-13deg)}50%{transform:translate(6px,-20px) rotate(-5deg)}}
    .rm-ofuda2{animation:rmOf2 8.2s ease-in-out infinite}
    @keyframes rmOf2{0%,100%{transform:translate(0,0) rotate(10deg)}50%{transform:translate(-8px,-16px) rotate(3deg)}}
    .rm-ofuda3{animation:rmOf3 6.4s ease-in-out infinite}
    @keyframes rmOf3{0%,100%{transform:translate(0,0) rotate(-6deg)}50%{transform:translate(5px,-14px) rotate(1deg)}}
    .rm-orbA{animation:rmOrbA 6.8s ease-in-out infinite}
    @keyframes rmOrbA{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
    .rm-orbB{animation:rmOrbA 7.6s ease-in-out -3s infinite}
    .rm-orbSpin{animation:rmSpin 14s linear infinite}
    @keyframes rmSpin{to{transform:rotate(360deg)}}
    .rm-spark{animation:rmTw 3.2s ease-in-out infinite}
    .rm-spark:nth-child(2n){animation-delay:-1.2s}.rm-spark:nth-child(3n){animation-delay:-2.1s}
    @keyframes rmTw{0%,100%{opacity:.15;transform:scale(.7)}50%{opacity:.95;transform:scale(1.1)}}
    @media (prefers-reduced-motion:reduce){.reimu-svg *{animation:none !important}}
  </style>
</defs>

<!-- ======== 背景月轮与光环 ======== -->
<circle cx="285" cy="330" r="214" fill="url(#rmMoon)"/>
<circle cx="285" cy="330" r="214" fill="none" stroke="#e9c87e" stroke-opacity=".4" stroke-width="1.6"/>
<circle cx="285" cy="330" r="222" fill="none" stroke="#e9c87e" stroke-opacity=".18" stroke-width="1"/>
<ellipse class="rm-aura" cx="282" cy="380" rx="240" ry="300" fill="url(#rmAura)"/>

<g class="rm-float">
  <!-- ======== 后发（向右下飘散） ======== -->
  <g class="rm-hairback">
    <path fill="url(#rmHairBackG)" stroke="#241611" stroke-opacity=".3" stroke-width="2" d="M280,88
      C222,90 188,132 182,190
      C178,238 180,288 174,334
      C170,366 162,394 152,418
      C149,426 154,431 161,427
      C176,416 186,398 192,376
      C196,408 194,442 184,474
      C182,482 188,487 194,482
      C210,468 220,442 224,412
      C230,440 234,470 230,500
      C229,508 235,511 241,505
      C254,486 262,458 264,426
      C272,456 278,486 278,514
      C279,522 285,524 290,517
      C300,496 306,464 304,430
      C316,452 326,474 332,498
      C334,506 340,507 344,499
      C350,476 348,444 336,412
      C352,432 368,454 380,478
      C384,485 390,483 391,475
      C392,446 380,414 360,384
      C376,344 384,290 380,236
      C376,156 342,90 280,88 Z"/>
    <path fill="#241611" opacity=".32" d="M210,172 C204,234 202,296 192,350 C202,340 210,320 214,298 C220,248 220,204 218,174 Z"/>
    <path fill="#241611" opacity=".28" d="M348,182 C352,240 354,300 364,352 C356,340 350,320 348,298 C344,252 346,212 344,186 Z"/>
    <path fill="#241611" opacity=".25" d="M274,310 C274,364 272,418 264,468 C272,458 278,434 280,406 C283,370 282,336 280,310 Z"/>
    <path fill="#7d5b49" opacity=".45" d="M372,244 C374,292 374,338 378,382 C384,350 385,302 380,258 C378,240 372,232 372,244 Z"/>
    <path fill="#7d5b49" opacity=".3" d="M198,220 C194,268 192,314 186,358 C192,344 197,318 199,290 C201,264 200,240 198,220 Z"/>
  </g>

  <!-- ======== 腿（裙后，同向斜伸） ======== -->
  <g>
    <path fill="#efe2d8" stroke="#d9cdc4" stroke-opacity=".8" stroke-width="1.2" d="M230,536 C222,562 212,588 200,610 C196,617 197,623 202,626 C212,606 222,580 230,554 C233,545 233,539 230,536 Z"/>
    <path fill="#c0342f" d="M203,626 C195,635 184,640 174,639 C167,638 165,632 168,627 C173,619 184,615 194,616 C199,617 202,620 204,623 Z"/>
    <path fill="#8e2723" d="M170,637 C178,639 188,637 196,631 L198,634 C190,640 178,641 169,639 Z" opacity=".75"/>
    <ellipse cx="185" cy="623" rx="5" ry="2.6" fill="#e8635c" opacity=".7" transform="rotate(-18 185 623)"/>
    <path fill="#fdfaf3" stroke="#d9cdc4" stroke-opacity=".8" stroke-width="1.2" d="M258,542 C252,570 243,598 232,620 C228,627 229,633 234,636 C245,615 254,588 261,560 C263,550 262,545 258,542 Z"/>
    <path fill="#d9cdc4" opacity=".45" d="M252,552 C247,574 240,596 231,616 C238,606 246,586 251,566 C253,559 253,555 252,552 Z"/>
    <path fill="#c0342f" d="M235,636 C227,645 216,650 206,649 C199,648 197,642 200,637 C205,629 216,625 226,626 C231,627 234,630 236,633 Z"/>
    <path fill="#8e2723" d="M202,647 C210,649 220,647 228,641 L230,644 C222,650 210,651 201,649 Z" opacity=".75"/>
    <ellipse cx="217" cy="633" rx="5" ry="2.6" fill="#e8635c" opacity=".7" transform="rotate(-18 217 633)"/>
  </g>

  <!-- ======== 裙（风向右摆 + 飞扬裙角） ======== -->
  <g class="rm-skirt">
    <path fill="url(#rmSkirtG)" stroke="#8e2723" stroke-opacity=".35" stroke-width="2" d="M250,368
      C240,392 230,420 220,452
      C212,478 208,502 212,520
      C224,530 240,532 254,526
      C266,536 286,539 302,531
      C316,542 338,543 354,533
      C368,540 386,538 398,526
      C406,518 410,506 408,494
      C412,490 420,484 428,476
      C433,471 431,464 424,466
      C416,468 408,472 402,478
      C392,440 372,404 350,376
      C340,364 326,358 312,366 Z"/>
    <path fill="#f28379" opacity=".28" d="M256,376 C248,396 240,422 232,452 C240,442 248,418 254,396 C258,386 260,378 256,376 Z"/>
    <path fill="#a52f2b" opacity=".5" d="M276,382 C270,420 262,462 252,498 C263,487 272,450 277,414 C280,398 281,388 276,382 Z"/>
    <path fill="#a52f2b" opacity=".5" d="M328,390 C332,424 340,460 350,492 C339,483 330,449 325,414 C323,400 324,392 328,390 Z"/>
    <path fill="#8e2723" opacity=".4" d="M214,500 C212,508 211,514 212,520 C219,526 228,529 237,528 C227,524 219,514 214,500 Z"/>
    <path fill="#fdfaf3" stroke="#d9cdc4" stroke-opacity=".6" stroke-width="1" d="M212,520 C222,528 237,530 250,524 C260,533 280,536 298,529 C310,538 332,540 350,532 C363,538 382,536 394,526 C398,522 402,517 405,512 C410,520 409,529 402,536 C390,546 370,548 356,541 C340,550 318,550 304,541 C288,548 268,546 256,537 C242,543 226,539 216,530 C212,526 211,523 212,520 Z"/>
    <path fill="#d9cdc4" opacity=".45" d="M228,530 C236,534 246,534 253,530 L255,535 C247,540 235,539 228,534 Z"/>
    <path fill="#d9cdc4" opacity=".45" d="M316,536 C324,539 334,538 341,534 L343,539 C334,544 321,543 316,540 Z"/>
  </g>

  <!-- ======== 上身 ======== -->
  <g>
    <path fill="#ffe8da" d="M254,284 C242,288 234,296 231,306 L248,318 C259,308 301,308 312,318 L329,306 C326,296 318,288 306,284 C295,294 265,294 254,284 Z"/>
    <path fill="#f2c3ab" opacity=".7" d="M248,302 C258,296 272,293 280,293 C288,293 302,296 312,302 C302,300 288,299 280,299 C272,299 258,300 248,302 Z"/>
    <path fill="url(#rmRedG)" d="M246,310 C240,332 240,352 247,370 C258,377 269,380 280,380 C291,380 302,377 313,370 C320,352 320,332 314,310 C296,324 264,324 246,310 Z"/>
    <path fill="#a72f2c" opacity=".45" d="M250,316 C246,336 246,352 251,366 C255,369 259,371 264,373 C258,354 256,334 258,316 C255,316 252,316 250,316 Z"/>
    <path fill="url(#rmWhiteG)" d="M252,285 C260,298 270,306 280,318 C290,306 300,298 308,285 C304,281 299,279 295,278 C290,287 270,287 265,278 C261,279 256,281 252,285 Z"/>
    <!-- 黄丝带领结 -->
    <path fill="#f6d873" stroke="#c9973c" stroke-opacity=".5" stroke-width="1" d="M280,313 C273,308 264,308 260,313 C257,318 260,324 266,326 C272,328 277,325 280,321 C283,325 288,328 294,326 C300,324 303,318 300,313 C296,308 287,308 280,313 Z"/>
    <path fill="#f6d873" stroke="#c9973c" stroke-opacity=".4" stroke-width="1" d="M275,326 C271,338 269,350 270,362 C273,367 279,367 282,362 C282,350 281,338 280,328 C278,328 276,327 275,326 Z"/>
    <path fill="#e3b752" stroke="#c9973c" stroke-opacity=".4" stroke-width="1" d="M285,326 C289,338 292,352 291,364 C288,369 282,369 280,364 C280,352 280,339 280,328 C282,328 284,327 285,326 Z"/>
    <path fill="#c9973c" opacity=".7" d="M273,344 C272,350 272,356 272,361 C274,357 275,350 276,345 Z"/>
    <circle cx="280" cy="318" r="5" fill="#e8bd55" stroke="#c9973c" stroke-width="1.2"/>
  </g>

  <!-- ======== 右臂（持御札） ======== -->
  <g>
    <path fill="#ffe8da" d="M314,298 C328,304 338,316 344,332 L330,342 C324,328 316,316 306,308 Z"/>
    <g class="rm-sleeveR">
      <path fill="url(#rmWhiteG)" d="M328,312
        C342,320 352,334 356,352
        C359,376 356,404 348,428
        C344,438 336,440 331,433
        C327,427 327,419 330,412
        C336,394 337,372 332,354
        C328,340 326,324 326,316 Z"/>
      <path fill="#d9cdc4" opacity=".55" d="M348,356 C351,380 348,406 341,426 C339,432 336,435 334,434 C341,415 344,388 341,362 C341,357 344,354 348,356 Z"/>
      <path fill="#c23a36" opacity=".85" d="M326,314 C330,312 334,312 337,314 C335,320 332,326 328,331 C324,327 323,320 326,314 Z"/>
    </g>
    <path fill="#ffe8da" d="M314,356 C308,350 300,348 295,351 C290,354 289,360 293,365 C297,371 305,374 312,371 C317,368 318,362 314,356 Z"/>
    <g transform="rotate(22 300 336)">
      <rect x="288" y="296" width="25" height="72" rx="3" fill="#fdfaf3" stroke="#e3d5c5" stroke-width="1"/>
      <rect x="288" y="296" width="25" height="12" rx="3" fill="#c23a36"/>
      <path d="M294,318 h13 M296,328 h9 M294,338 h13 M298,348 h5" stroke="#3a3448" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="300.5" cy="357" r="4.5" fill="none" stroke="#c23a36" stroke-width="1.8"/>
    </g>
    <path fill="#ffe8da" d="M310,352 C306,348 301,347 298,349 C296,351 296,354 298,357 C301,361 306,362 310,360 C313,358 313,355 310,352 Z"/>
  </g>

  <!-- ======== 左臂（伸展持御币） ======== -->
  <g>
    <path fill="#ffe8da" d="M246,298 C232,304 220,314 212,328 L226,338 C233,326 241,316 250,308 Z"/>
    <line x1="150" y1="390" x2="108" y2="186" stroke="#c59a66" stroke-width="7.5" stroke-linecap="round"/>
    <line x1="147" y1="390" x2="105" y2="187" stroke="#8a6238" stroke-width="2" stroke-linecap="round" opacity=".55"/>
    <g class="rm-sleeveL">
      <path fill="url(#rmWhiteG)" stroke="#cfc0b4" stroke-opacity=".7" stroke-width="1.4" d="M238,306
        C216,312 196,326 181,344
        C170,358 162,372 158,384
        C155,394 160,401 169,400
        C178,398 186,392 191,384
        C196,392 198,406 196,422
        C194,440 198,458 208,468
        C217,460 222,443 223,425
        C224,409 226,394 229,380
        C232,360 238,330 240,314 Z"/>
      <path fill="#d9cdc4" opacity=".5" d="M182,350 C172,362 166,374 164,386 C164,392 167,396 171,396 C166,386 170,366 182,352 Z"/>
      <path fill="#d9cdc4" opacity=".5" d="M204,424 C203,442 205,454 210,462 C214,454 216,440 215,426 C212,415 207,414 204,424 Z"/>
      <path fill="#c23a36" opacity=".85" d="M234,310 C238,308 242,308 244,310 C243,316 241,323 238,329 C233,325 232,316 234,310 Z"/>
    </g>
    <path fill="#ffe8da" d="M160,376 C152,372 145,373 141,378 C138,383 140,389 146,393 C153,397 161,396 165,391 C168,386 166,380 160,376 Z"/>
    <!-- 御币纸垂 -->
    <line x1="92" y1="184" x2="126" y2="192" stroke="#c59a66" stroke-width="6" stroke-linecap="round"/>
    <g class="rm-shideA">
      <path fill="#fdfaf3" d="M90,190 L112,198 L94,212 L114,222 L96,236 L112,244 L100,254 L88,248 L102,238 L84,228 L100,216 L82,206 L96,198 Z"/>
      <path fill="#ddd2c2" opacity=".8" d="M94,212 L114,222 L96,236 L92,232 L108,221 L92,214 Z"/>
    </g>
    <g class="rm-shideB">
      <path fill="#fdfaf3" d="M118,194 L140,202 L122,216 L142,226 L124,240 L140,248 L128,258 L116,252 L130,242 L112,232 L128,220 L110,210 L124,202 Z"/>
      <path fill="#ddd2c2" opacity=".8" d="M122,216 L142,226 L124,240 L120,236 L136,225 L120,218 Z"/>
    </g>
  </g>

  <!-- ======== 颈与脸（头部整体微倾） ======== -->
  <g transform="rotate(-2.2 280 240)">
  <g>
    <path fill="#ffe8da" d="M267,254 C269,268 269,280 267,290 L293,290 C291,280 291,268 293,254 Z"/>
    <path fill="#f2c3ab" d="M267,256 C271,264 289,264 293,256 C292,264 291,271 291,277 C284,271 276,271 269,277 C269,271 268,264 267,256 Z"/>
    <path fill="#ffe8da" d="M224,158 C221,190 226,214 240,238 C252,258 266,268 280,268 C294,268 308,258 320,238 C334,214 339,190 336,158 C336,126 224,126 224,158 Z"/>
    <path fill="#f6c9ae" opacity=".5" d="M226,158 C242,149 318,149 334,158 C333,165 331,171 328,175 C314,168 246,168 232,175 C229,171 227,165 226,158 Z"/>
    <ellipse cx="238" cy="232" rx="12" ry="6.5" fill="#ff9d8a" opacity=".45" filter="url(#rmSoft)"/>
    <ellipse cx="322" cy="232" rx="12" ry="6.5" fill="#ff9d8a" opacity=".45" filter="url(#rmSoft)"/>
    <g id="rmEyeL">
      <path d="M228,202 C234,190 249,185 261,189 C270,192 276,200 277,208 C276,220 266,228 253,229 C240,229 231,220 228,208 Z" fill="#fff"/>
      <g clip-path="url(#rmEyeClip)">
        <ellipse cx="253" cy="210" rx="16.5" ry="20" fill="url(#rmIrisG)"/>
        <ellipse cx="253" cy="213" rx="6" ry="8.5" fill="#33100b"/>
        <path d="M236,194 C244,188 262,188 270,196 C270,201 268,204 266,206 C261,198 246,196 239,202 C237,200 236,197 236,194 Z" fill="#5f241b" opacity=".7"/>
        <path d="M243,223 C248,227 260,227 265,221 C263,227 256,230 250,229 C246,228 244,226 243,223 Z" fill="#e79b70" opacity=".85"/>
      </g>
      <path d="M227,202 C232,189 247,182 260,186 C270,189 276,197 277,204 C275,198 270,192 261,190 C250,187 236,192 230,204 Z" fill="#432018"/>
      <path d="M276,197 C280,193 284,192 286,194 C284,197 281,200 278,204 Z" fill="#432018"/>
      <path d="M234,224 C240,229 249,231 257,230" stroke="#a8746a" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/>
    </g>
    <use href="#rmEyeL" transform="matrix(-1,0,0,1,560,0)"/>
    <circle cx="247" cy="200" r="5" fill="#fff" opacity=".95"/>
    <circle cx="260" cy="218" r="2.4" fill="#fff" opacity=".85"/>
    <circle cx="301" cy="200" r="5" fill="#fff" opacity=".95"/>
    <circle cx="314" cy="218" r="2.4" fill="#fff" opacity=".85"/>
    <g class="rm-lid">
      <path d="M228,202 C234,190 249,185 261,189 C270,192 276,200 277,208 C276,220 266,228 253,229 C240,229 231,220 228,208 Z" fill="#ffe8da"/>
      <path d="M228,202 C234,190 249,185 261,189 C270,192 276,200 277,208 C276,220 266,228 253,229 C240,229 231,220 228,208 Z" fill="#ffe8da" transform="matrix(-1,0,0,1,560,0)"/>
      <path d="M232,213 C241,221 262,221 275,208" stroke="#5c2a20" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M285,208 C298,221 319,221 328,213" stroke="#5c2a20" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>
    <path d="M279,227 C281,229 281,232 279,234" stroke="#e0ab90" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M270,243 C275,248 285,248 290,243 C287,254 273,254 270,243 Z" fill="#8e4038"/>
    <path d="M274,249 C277,251 283,251 286,249 C283,253 277,253 274,249 Z" fill="#d96a5f"/>
  </g>

  <!-- ======== 侧发 + 发筒 ======== -->
  <g class="rm-lockL">
    <path fill="url(#rmHairG)" stroke="#2a1a14" stroke-opacity=".25" stroke-width="1.6" d="M232,142
      C216,168 208,204 207,242
      C206,264 205,284 202,302
      C200,312 204,317 210,313
      C220,304 226,284 227,264
      C230,222 234,182 236,148 Z"/>
    <path fill="#33211c" opacity=".35" d="M216,196 C214,228 213,258 209,288 C214,278 218,258 219,236 C220,220 218,206 216,196 Z"/>
    <rect x="206" y="240" width="25" height="33" rx="8" fill="#fdfaf3" stroke="#d9cdc4" stroke-width="1"/>
    <path d="M210,245 C208,253 208,260 210,268" stroke="#d9cdc4" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path fill="url(#rmHairG)" d="M211,273 C210,288 206,302 199,314 C206,310 213,299 216,286 C218,278 218,272 217,268 Z"/>
  </g>
  <g class="rm-lockR">
    <path fill="url(#rmHairG)" stroke="#2a1a14" stroke-opacity=".25" stroke-width="1.6" d="M328,142
      C344,168 352,204 353,242
      C354,264 355,284 358,302
      C360,312 356,317 350,313
      C340,304 334,284 333,264
      C330,222 326,182 324,148 Z"/>
    <path fill="#33211c" opacity=".35" d="M344,196 C346,228 347,258 351,288 C346,278 342,258 341,236 C340,220 342,206 344,196 Z"/>
    <rect x="329" y="240" width="25" height="33" rx="8" fill="#fdfaf3" stroke="#d9cdc4" stroke-width="1"/>
    <path d="M350,245 C352,253 352,260 350,268" stroke="#d9cdc4" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path fill="url(#rmHairG)" d="M349,273 C350,288 354,302 361,314 C354,310 347,299 344,286 C342,278 342,272 343,268 Z"/>
  </g>

  <!-- ======== 姬式直刘海 ======== -->
  <g>
    <path fill="url(#rmHairG)" stroke="#2a1a14" stroke-opacity=".3" stroke-width="2" d="M219,206
      C209,172 212,132 228,108
      C242,90 260,82 280,82
      C300,82 318,90 332,108
      C348,132 351,172 341,206
      C337,190 331,181 323,177
      C311,171 296,168 280,168
      C264,168 249,171 237,177
      C229,181 223,190 219,206 Z"/>
    <path fill="#33211c" opacity=".4" d="M250,171 C248,177 246,183 243,189 C247,186 250,180 252,174 Z"/>
    <path fill="#33211c" opacity=".4" d="M310,174 C311,180 313,186 316,192 C312,189 309,183 308,177 Z"/>
    <path fill="#33211c" opacity=".35" d="M280,169 C280,175 280,181 280,187 C282,181 282,175 282,170 Z"/>
    <path fill="#33211c" opacity=".3" d="M228,187 C227,192 226,197 225,202 C228,198 230,192 230,187 Z"/>
    <path fill="#33211c" opacity=".3" d="M332,187 C333,192 334,197 335,202 C332,198 330,192 330,187 Z"/>
    <path fill="#7b5a4a" opacity=".55" d="M238,124 C252,108 272,100 290,102 C274,98 254,102 244,114 C240,118 238,121 238,124 Z"/>
    <path fill="#7b5a4a" opacity=".4" d="M300,104 C312,108 322,116 328,126 C324,114 314,104 302,101 Z"/>
    <path fill="#7b5a4a" opacity=".4" d="M226,140 C228,130 232,122 238,116 C230,120 224,130 222,142 Z"/>
  </g>

  <!-- ======== 蝴蝶结 ======== -->
  <g>
    <path fill="url(#rmRedG)" d="M270,96
      C258,84 238,72 220,68
      C204,64 194,70 192,82
      C190,96 198,110 212,118
      C228,126 248,124 264,114
      C270,110 272,102 270,96 Z"/>
    <path fill="url(#rmRedG)" d="M290,96
      C302,84 322,72 340,68
      C356,64 366,70 368,82
      C370,96 362,110 348,118
      C332,126 312,124 296,114
      C290,110 288,102 290,96 Z"/>
    <path fill="#9d2b28" opacity=".5" d="M212,80 C204,82 199,88 200,96 C202,104 210,110 220,113 C210,106 205,98 206,90 C207,85 209,81 212,80 Z"/>
    <path fill="#9d2b28" opacity=".5" d="M348,80 C356,82 361,88 360,96 C358,104 350,110 340,113 C350,106 355,98 354,90 C353,85 351,81 348,80 Z"/>
    <path fill="#9d2b28" opacity=".45" d="M264,100 C250,110 232,114 218,110 C232,118 252,118 266,110 C268,107 268,103 264,100 Z"/>
    <path fill="#9d2b28" opacity=".45" d="M296,100 C310,110 328,114 342,110 C328,118 308,118 294,110 C292,107 292,103 296,100 Z"/>
    <path fill="#e7574f" d="M268,88 C264,98 264,108 269,116 C276,122 284,122 291,116 C296,108 296,98 292,88 C286,82 274,82 268,88 Z"/>
    <path fill="#9d2b28" opacity=".5" d="M269,110 C276,115 284,115 291,110 C287,116 273,116 269,110 Z"/>
    <path fill="#f28379" opacity=".5" d="M226,74 C216,72 208,74 202,80 C206,72 216,68 226,70 Z"/>
  </g>
  </g>
</g>

<!-- ======== 环绕物 ======== -->
<g class="rm-ofuda1" style="transform-origin:96px 480px">
  <g transform="translate(80,444)">
    <rect width="32" height="74" rx="3" fill="#fdfaf3" stroke="#e3d5c5"/>
    <rect width="32" height="13" rx="3" fill="#c23a36"/>
    <path d="M8,24 h16 M10,34 h12 M8,44 h16 M12,54 h8" stroke="#3a3448" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="16" cy="63" r="5" fill="none" stroke="#c23a36" stroke-width="2"/>
  </g>
</g>
<g class="rm-ofuda2" style="transform-origin:462px 320px">
  <g transform="translate(447,286)">
    <rect width="30" height="68" rx="3" fill="#fdfaf3" stroke="#e3d5c5"/>
    <rect width="30" height="12" rx="3" fill="#c23a36"/>
    <path d="M7,22 h16 M9,32 h12 M7,42 h16" stroke="#3a3448" stroke-width="2.3" stroke-linecap="round"/>
    <circle cx="15" cy="55" r="4.6" fill="none" stroke="#c23a36" stroke-width="1.8"/>
  </g>
</g>
<g class="rm-ofuda3" style="transform-origin:436px 580px">
  <g transform="translate(422,550)">
    <rect width="28" height="62" rx="3" fill="#fdfaf3" stroke="#e3d5c5"/>
    <rect width="28" height="11" rx="3" fill="#c23a36"/>
    <path d="M6,20 h16 M8,30 h12 M6,40 h16" stroke="#3a3448" stroke-width="2.1" stroke-linecap="round"/>
  </g>
</g>

<g class="rm-orbA" style="transform-origin:452px 208px">
  <circle cx="452" cy="208" r="27" fill="#ffcdb8" opacity=".3" filter="url(#rmSoft)"/>
  <g class="rm-orbSpin" style="transform-origin:452px 208px">
    <circle cx="452" cy="208" r="19" fill="#fdf8ee" stroke="#c23a36" stroke-width="3"/>
    <path d="M452,189 a19,19 0 0 1 0,38 a9.5,9.5 0 0 1 0,-19 a9.5,9.5 0 0 0 0,-19 Z" fill="#c23a36"/>
    <circle cx="452" cy="198.5" r="3.4" fill="#fdf8ee"/>
    <circle cx="452" cy="217.5" r="3.4" fill="#c23a36"/>
  </g>
</g>
<g class="rm-orbB" style="transform-origin:112px 560px">
  <circle cx="112" cy="560" r="34" fill="#ffcdb8" opacity=".3" filter="url(#rmSoft)"/>
  <g class="rm-orbSpin" style="transform-origin:112px 560px;animation-duration:18s">
    <circle cx="112" cy="560" r="25" fill="#fdf8ee" stroke="#c23a36" stroke-width="3.4"/>
    <path d="M112,535 a25,25 0 0 1 0,50 a12.5,12.5 0 0 1 0,-25 a12.5,12.5 0 0 0 0,-25 Z" fill="#c23a36"/>
    <circle cx="112" cy="547.5" r="4.2" fill="#fdf8ee"/>
    <circle cx="112" cy="572.5" r="4.2" fill="#c23a36"/>
  </g>
</g>

<g fill="#ffd98a">
  <path class="rm-spark" d="M88,320 l2.2,5.6 5.6,2.2 -5.6,2.2 -2.2,5.6 -2.2,-5.6 -5.6,-2.2 5.6,-2.2 Z"/>
  <path class="rm-spark" d="M478,150 l2.6,6.4 6.4,2.6 -6.4,2.6 -2.6,6.4 -2.6,-6.4 -6.4,-2.6 6.4,-2.6 Z"/>
  <path class="rm-spark" d="M448,420 l2,5 5,2 -5,2 -2,5 -2,-5 -5,-2 5,-2 Z"/>
  <path class="rm-spark" d="M180,580 l2.4,6 6,2.4 -6,2.4 -2.4,6 -2.4,-6 -6,-2.4 6,-2.4 Z"/>
  <path class="rm-spark" d="M330,96 l2,5 5,2 -5,2 -2,5 -2,-5 -5,-2 5,-2 Z" fill="#fff"/>
  <path class="rm-spark" d="M420,650 l2,5 5,2 -5,2 -2,5 -2,-5 -5,-2 5,-2 Z" opacity=".8"/>
</g>
</svg>`;

  /* ---------- 侧栏头像：首页与关于页共用的原创 SVG ---------- */
  ART.avatar = `<svg viewBox="0 0 140 140" role="img" aria-label="站长头像：博丽灵梦">
  <defs>
    <linearGradient id="avHair" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#63463a"/><stop offset="100%" stop-color="#3c2822"/></linearGradient>
    <linearGradient id="avRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e7574f"/><stop offset="100%" stop-color="#bd3733"/></linearGradient>
    <radialGradient id="avBg" cx="50%" cy="42%" r="62%"><stop offset="0%" stop-color="#ffe9c4"/><stop offset="100%" stop-color="#f6c98f"/></radialGradient>
    <clipPath id="avClip"><circle cx="70" cy="70" r="66"/></clipPath>
  </defs>
  <circle cx="70" cy="70" r="66" fill="url(#avBg)"/>
  <g clip-path="url(#avClip)">
    <g fill="none" stroke="#e9a94e" stroke-opacity=".5" stroke-width="1.4">
      <circle cx="70" cy="70" r="46"/><circle cx="70" cy="70" r="56"/>
    </g>
    <path fill="url(#avHair)" d="M70,26 C44,27 30,44 28,68 C26,92 30,116 28,140 L112,140 C110,116 114,92 112,68 C110,44 96,27 70,26 Z"/>
    <path fill="url(#avRed)" d="M40,132 C42,116 52,106 70,106 C88,106 98,116 100,132 C100,140 100,140 100,140 L40,140 Z"/>
    <path fill="#fffdf8" d="M56,110 C60,104 66,101 70,101 C74,101 80,104 84,110 C80,116 74,119 70,119 C66,119 60,116 56,110 Z"/>
    <path fill="#f6d873" d="M70,116 C66,114 62,114 60,117 C59,120 61,123 65,124 C68,125 71,123 72,120 C73,123 76,125 79,124 C83,123 85,120 84,117 C82,114 78,114 74,116 C73,117 71,117 70,116 Z"/>
    <path fill="#ffe8da" d="M62,88 C64,96 64,102 62,108 C67,112 73,112 78,108 C76,102 76,96 78,88 Z"/>
    <path fill="#f2c3ab" d="M62,90 C67,96 73,96 78,90 C77,96 77,100 77,104 C72,101 68,101 63,104 C63,100 63,96 62,90 Z"/>
    <path fill="#ffe8da" d="M46,60 C45,74 47,84 53,93 C58,101 64,105 70,105 C76,105 82,101 87,93 C93,84 95,74 94,60 C94,46 46,46 46,60 Z"/>
    <path fill="#f6c9ae" opacity=".5" d="M47,62 C54,58 86,58 93,62 C92,66 91,69 89,71 C83,68 57,68 51,71 C49,69 48,66 47,62 Z"/>
    <ellipse cx="53" cy="90" rx="5.5" ry="3" fill="#ff9d8a" opacity=".5"/>
    <ellipse cx="87" cy="90" rx="5.5" ry="3" fill="#ff9d8a" opacity=".5"/>
    <g>
      <path d="M48,79 C51,74 57,72 62,74 C66,75 68,78 69,81 C68,86 64,89 59,89 C54,89 50,85 48,81 Z" fill="#fff"/>
      <ellipse cx="58" cy="81" rx="6.5" ry="7.5" fill="#a34a36"/>
      <ellipse cx="58" cy="82.5" rx="2.6" ry="3.4" fill="#33100b"/>
      <path d="M51,76 C54,73 62,73 66,77 C65,79 64,80 63,81 C61,77 54,76 52,79 Z" fill="#5f241b" opacity=".7"/>
      <circle cx="55.5" cy="77.5" r="2.2" fill="#fff"/>
      <path d="M47,78 C50,72 57,69 63,72 C67,74 69,77 70,80 C68,76 65,73 61,72 C56,70 50,73 48,79 Z" fill="#432018"/>
    </g>
    <g transform="matrix(-1,0,0,1,140,0)">
      <path d="M48,79 C51,74 57,72 62,74 C66,75 68,78 69,81 C68,86 64,89 59,89 C54,89 50,85 48,81 Z" fill="#fff"/>
      <ellipse cx="58" cy="81" rx="6.5" ry="7.5" fill="#a34a36"/>
      <ellipse cx="58" cy="82.5" rx="2.6" ry="3.4" fill="#33100b"/>
      <path d="M51,76 C54,73 62,73 66,77 C65,79 64,80 63,81 C61,77 54,76 52,79 Z" fill="#5f241b" opacity=".7"/>
      <path d="M47,78 C50,72 57,69 63,72 C67,74 69,77 70,80 C68,76 65,73 61,72 C56,70 50,73 48,79 Z" fill="#432018"/>
    </g>
    <circle cx="84.5" cy="77.5" r="2.2" fill="#fff"/>
    <path d="M69,92.5 C70,93.5 70,95 69,96" stroke="#e0ab90" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M65,99 C68,101.5 72,101.5 75,99 C73.5,103.5 66.5,103.5 65,99 Z" fill="#8e4038"/>
    <path fill="url(#avHair)" stroke="#2a1a14" stroke-opacity=".25" stroke-width="1" d="M46,84 C41,70 42,54 50,44 C56,37 63,34 70,34 C77,34 84,37 90,44 C98,54 99,70 94,84 C92,77 89,73 85,71 C80,68 75,67 70,67 C65,67 60,68 55,71 C51,73 48,77 46,84 Z"/>
    <path fill="url(#avHair)" stroke="#2a1a14" stroke-opacity=".2" stroke-width="1" d="M49,58 C43,68 41,82 42,96 C42,106 41,114 38,122 L48,122 C51,112 52,100 51,88 C50,77 50,66 51,60 Z"/>
    <path fill="url(#avHair)" stroke="#2a1a14" stroke-opacity=".2" stroke-width="1" d="M91,58 C97,68 99,82 98,96 C98,106 99,114 102,122 L92,122 C89,112 88,100 89,88 C90,77 90,66 89,60 Z"/>
    <rect x="40" y="96" width="13" height="17" rx="5" fill="#fdfaf3" stroke="#d9cdc4"/>
    <rect x="87" y="96" width="13" height="17" rx="5" fill="#fdfaf3" stroke="#d9cdc4"/>
    <path fill="url(#avRed)" stroke="#8e2222" stroke-opacity=".3" stroke-width="1" d="M68,34 C62,28 52,24 44,25 C38,26 36,31 39,36 C43,42 52,45 61,43 C65,42 68,39 68,34 Z"/>
    <path fill="url(#avRed)" stroke="#8e2222" stroke-opacity=".3" stroke-width="1" d="M72,34 C78,28 88,24 96,25 C102,26 104,31 101,36 C97,42 88,45 79,43 C75,42 72,39 72,34 Z"/>
    <path fill="#e7574f" d="M66,30 C64,35 64,40 67,44 C70,46 74,46 76,44 C79,40 79,35 77,30 C74,27 68,27 66,30 Z"/>
    <path fill="#9d2b28" opacity=".45" d="M67,41 C70,43 73,43 76,41 C74,44 68,44 67,41 Z"/>
  </g>
  <circle cx="70" cy="70" r="66" fill="none" stroke="#c73e3a" stroke-width="3"/>
  <circle cx="70" cy="70" r="62" fill="none" stroke="#e9c87e" stroke-width="1" stroke-opacity=".7"/>
</svg>`;

  /* ---------- 文章封面 ×5 ---------- */
  ART.covers = {
    /* 黄昏鸟居 */
    torii: `<svg viewBox="0 0 480 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="cvT-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f9c891"/><stop offset="55%" stop-color="#f2917c"/><stop offset="100%" stop-color="#b95f7e"/>
    </linearGradient>
    <radialGradient id="cvT-sun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff3cf"/><stop offset="70%" stop-color="#ffd89a"/><stop offset="100%" stop-color="#ffc98a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="480" height="360" fill="url(#cvT-sky)"/>
  <circle class="cov-bob" cx="352" cy="118" r="84" fill="url(#cvT-sun)"/>
  <circle class="cov-bob" cx="352" cy="118" r="46" fill="#ffe9b8"/>
  <g fill="#ffe3c2" opacity=".65">
    <rect x="-30" y="86" width="190" height="14" rx="7"/>
    <rect x="60" y="118" width="150" height="11" rx="6" opacity=".8"/>
    <rect x="300" y="196" width="200" height="13" rx="7"/>
  </g>
  <g stroke="#5c3246" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8">
    <path d="M96,84 q7,-8 14,0 q7,-8 14,0"/>
    <path d="M140,110 q6,-7 12,0 q6,-7 12,0" opacity=".7"/>
  </g>
  <path d="M0,236 Q90,196 190,224 T480,214 V360 H0 Z" fill="#8a5470" opacity=".85"/>
  <path d="M0,268 Q120,232 240,258 T480,252 V360 H0 Z" fill="#5d3550"/>
  <g fill="#43263f">
    <path d="M0,318 Q140,296 260,312 T480,308 V360 H0 Z"/>
  </g>
  <g fill="#8d8590" opacity=".9">
    <rect x="216" y="292" width="66" height="7" rx="2"/>
    <rect x="208" y="304" width="82" height="7" rx="2"/>
    <rect x="200" y="316" width="98" height="7" rx="2"/>
  </g>
  <g stroke="#3a2130" stroke-width="3" stroke-linecap="round" opacity=".85">
    <path d="M120,320 v-26 M116,296 q4,-8 10,-2 M480,0"/>
    <path d="M372,316 v-22 M368,296 q4,-7 9,-2"/>
  </g>
  <g>
    <path d="M156,120 Q249,102 342,120 L342,138 Q249,122 156,138 Z" fill="#7c1f26"/>
    <path d="M150,116 Q249,97 348,116 L348,127 Q249,109 150,127 Z" fill="#a02c33"/>
    <rect x="172" y="146" width="154" height="10" rx="3" fill="#a02c33"/>
    <path d="M190,132 L204,132 L202,300 L192,300 Z" fill="#a02c33"/>
    <path d="M294,132 L308,132 L306,300 L296,300 Z" fill="#a02c33"/>
    <rect x="188" y="298" width="18" height="7" rx="2" fill="#43263f"/>
    <rect x="292" y="298" width="18" height="7" rx="2" fill="#43263f"/>
    <rect x="238" y="146" width="22" height="30" rx="2" fill="#43263f"/>
    <path d="M204,150 Q249,158 294,150" fill="none" stroke="#f4e6c8" stroke-width="3" stroke-linecap="round" opacity=".9"/>
  </g>
  <g fill="#ffc9d6" class="cov-ff">
    <path d="M92,150 q5,-2 6,3 q-1,5 -6,4 q-4,-3 0,-7 Z"/>
    <path d="M130,196 q5,-2 6,3 q-1,5 -6,4 q-4,-3 0,-7 Z" opacity=".85"/>
    <path d="M388,150 q5,-2 6,3 q-1,5 -6,4 q-4,-3 0,-7 Z" opacity=".8"/>
    <path d="M420,240 q5,-2 6,3 q-1,5 -6,4 q-4,-3 0,-7 Z"/>
    <path d="M60,260 q5,-2 6,3 q-1,5 -6,4 q-4,-3 0,-7 Z" opacity=".75"/>
  </g>
</svg>`,

    /* 魔法使之夜 */
    magic: `<svg viewBox="0 0 480 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="cvM-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#171235"/><stop offset="100%" stop-color="#33245c"/>
    </linearGradient>
    <radialGradient id="cvM-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffe9a8" stop-opacity=".9"/><stop offset="100%" stop-color="#ffe9a8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="480" height="360" fill="url(#cvM-sky)"/>
  <g fill="#fff">
    <circle cx="48" cy="52" r="1.6"/><circle cx="120" cy="30" r="1.2" opacity=".8"/><circle cx="200" cy="66" r="1.4"/>
    <circle cx="300" cy="40" r="1.2" opacity=".7"/><circle cx="430" cy="60" r="1.5"/><circle cx="80" cy="130" r="1.2" opacity=".7"/>
    <circle cx="170" cy="150" r="1"/><circle cx="440" cy="150" r="1.2" opacity=".8"/><circle cx="60" cy="230" r="1.3"/>
    <circle cx="410" cy="260" r="1.2" opacity=".7"/><circle cx="240" cy="120" r="1"/><circle cx="330" cy="200" r="1.1" opacity=".8"/>
  </g>
  <circle cx="388" cy="86" r="64" fill="url(#cvM-glow)"/>
  <path d="M388,38 a48,48 0 1 0 0,96 a38,38 0 1 1 0,-96 Z" fill="#f2d67e" class="cov-bob"/>
  <g class="cov-bob2">
    <path d="M70,290 C130,258 210,236 290,222 C260,242 200,264 130,282 Z" fill="#f2d67e" opacity=".14"/>
    <g fill="#f2d67e">
      <path d="M104,272 l3.4,8.6 8.6,3.4 -8.6,3.4 -3.4,8.6 -3.4,-8.6 -8.6,-3.4 8.6,-3.4 Z"/>
      <path d="M170,246 l2.8,7 7,2.8 -7,2.8 -2.8,7 -2.8,-7 -7,-2.8 7,-2.8 Z" opacity=".85"/>
      <path d="M232,226 l2.2,5.6 5.6,2.2 -5.6,2.2 -2.2,5.6 -2.2,-5.6 -5.6,-2.2 5.6,-2.2 Z" opacity=".7"/>
      <path d="M282,210 l1.8,4.6 4.6,1.8 -4.6,1.8 -1.8,4.6 -1.8,-4.6 -4.6,-1.8 4.6,-1.8 Z" opacity=".55"/>
    </g>
  </g>
  <g class="cov-bob">
    <path d="M186,232 L384,164" stroke="#8a6238" stroke-width="6" stroke-linecap="round"/>
    <g stroke="#c59a66" stroke-width="3.4" stroke-linecap="round">
      <path d="M188,231 L152,226"/><path d="M188,233 L154,240"/><path d="M187,232 L150,233"/><path d="M189,235 L158,248"/>
    </g>
    <g fill="#241c38">
      <path d="M262,148 C270,112 288,84 314,74 C310,92 309,110 316,126 C322,138 330,144 338,146 C314,156 284,156 262,148 Z"/>
      <path d="M238,152 C260,138 302,134 330,142 C352,148 360,158 354,164 C344,172 316,176 288,174 C260,172 238,164 232,158 C230,155 233,153 238,152 Z"/>
      <path d="M312,72 q10,-6 18,2 q-4,10 -14,8 Z"/>
      <circle cx="292" cy="172" r="15"/>
      <path d="M276,168 C260,176 244,178 228,174 C236,186 256,190 272,184 Z"/>
      <path d="M270,182 C260,196 254,214 256,232 C262,246 276,252 294,250 C312,248 326,240 332,228 C324,230 318,226 316,218 C322,214 328,206 328,196 C312,188 288,182 270,182 Z"/>
      <path d="M300,250 q2,10 10,14 q6,-8 2,-16 Z"/>
      <path d="M320,240 q6,8 14,10 q4,-8 -2,-14 Z"/>
      <path d="M300,182 C314,184 328,188 338,194 C342,190 344,184 342,180 C332,174 316,172 304,174 Z"/>
    </g>
    <circle cx="345" cy="192" r="3.2" fill="#f2d67e"/>
  </g>
</svg>`,

    /* 红魔馆之夜 */
    scarlet: `<svg viewBox="0 0 480 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="cvS-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2a0f1e"/><stop offset="100%" stop-color="#4d1a2c"/>
    </linearGradient>
    <radialGradient id="cvS-moon" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ff8a80"/><stop offset="75%" stop-color="#e04a45"/><stop offset="100%" stop-color="#c93a3a"/>
    </radialGradient>
  </defs>
  <rect width="480" height="360" fill="url(#cvS-sky)"/>
  <circle cx="360" cy="110" r="88" fill="#e04a45" opacity=".25"/>
  <circle class="cov-bob" cx="360" cy="110" r="62" fill="url(#cvS-moon)"/>
  <g fill="#14060c">
    <rect x="60" y="200" width="220" height="160"/>
    <rect x="96" y="150" width="44" height="210"/><path d="M90,156 L118,108 L146,156 Z"/>
    <rect x="180" y="120" width="56" height="240"/><path d="M172,128 L208,64 L244,128 Z"/>
    <rect x="256" y="170" width="36" height="190"/><path d="M250,176 L274,132 L298,176 Z"/>
    <rect x="52,196" y="196" width="236" height="10"/>
    <rect x="52" y="196" width="236" height="10"/>
  </g>
  <circle cx="208" cy="152" r="17" fill="#f6e3b4"/>
  <g stroke="#3a1020" stroke-width="2.4" stroke-linecap="round">
    <path d="M208,152 v-11"/><path d="M208,152 l8,5"/>
  </g>
  <circle cx="208" cy="152" r="17" fill="none" stroke="#14060c" stroke-width="3"/>
  <g fill="#e8b84b" opacity=".85">
    <rect x="106" y="220" width="9" height="15"/><rect x="126" y="220" width="9" height="15"/>
    <rect x="196" y="240" width="10" height="16"/><rect x="266" y="220" width="8" height="13"/>
    <rect x="86" y="280" width="9" height="15"/><rect x="156" y="280" width="9" height="15"/>
  </g>
  <g fill="#1c0a12" class="cov-bob2">
    <path d="M330,190 q8,-12 16,0 q8,-10 16,2 q-9,2 -16,0 q-7,4 -16,-2 Z"/>
    <path d="M392,230 q6,-9 12,0 q6,-8 12,2 q-7,1 -12,0 q-5,3 -12,-2 Z" opacity=".9"/>
    <path d="M420,150 q6,-9 12,0 q6,-8 12,2 q-7,1 -12,0 q-5,3 -12,-2 Z" opacity=".8"/>
    <path d="M300,250 q5,-8 10,0 q5,-7 10,1 q-6,1 -10,0 q-4,3 -10,-1 Z" opacity=".85"/>
  </g>
  <path d="M0,332 Q120,318 240,326 T480,322 V360 H0 Z" fill="#14060c"/>
  <g fill="#1c0a12">
    <path d="M20,332 v-16 l4,-6 4,6 v14 Z"/><path d="M44,330 v-14 l4,-6 4,6 v13 Z"/>
    <path d="M310,328 v-15 l4,-6 4,6 v14 Z"/><path d="M336,326 v-13 l4,-6 4,6 v12 Z"/>
    <path d="M440,326 v-15 l4,-6 4,6 v14 Z"/>
  </g>
</svg>`,

    /* 竹林月夜 */
    moon: `<svg viewBox="0 0 480 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="cvB-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0e1e1b"/><stop offset="100%" stop-color="#1a352d"/>
    </linearGradient>
    <radialGradient id="cvB-moon" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fdf6da"/><stop offset="100%" stop-color="#efe0b4"/>
    </radialGradient>
  </defs>
  <rect width="480" height="360" fill="url(#cvB-sky)"/>
  <circle cx="240" cy="130" r="86" fill="#fdf6da" opacity=".16"/>
  <circle class="cov-bob" cx="240" cy="130" r="58" fill="url(#cvB-moon)"/>
  <circle cx="222" cy="114" r="9" fill="#ded0a4" opacity=".7"/>
  <circle cx="256" cy="142" r="6" fill="#ded0a4" opacity=".6"/>
  <g stroke-linecap="round">
    <g stroke="#234b3d" stroke-width="14">
      <line x1="60" y1="360" x2="66" y2="-10"/>
      <line x1="410" y1="360" x2="402" y2="-10"/>
    </g>
    <g stroke="#2f6b53" stroke-width="10">
      <line x1="130" y1="360" x2="136" y2="10"/>
      <line x1="352" y1="360" x2="344" y2="20"/>
    </g>
    <g stroke="#183828" stroke-width="3" opacity=".9">
      <line x1="58" y1="80" x2="74" y2="80"/><line x1="60" y1="170" x2="76" y2="168"/><line x1="62" y1="260" x2="78" y2="258"/>
      <line x1="128" y1="110" x2="144" y2="108"/><line x1="130" y1="210" x2="146" y2="208"/>
      <line x1="404" y1="90" x2="420" y2="92"/><line x1="406" y1="190" x2="420" y2="190"/><line x1="346" y1="140" x2="360" y2="138"/><line x1="348" y1="250" x2="362" y2="248"/>
    </g>
  </g>
  <g fill="#3e8763" opacity=".9">
    <path d="M136,64 q26,-14 50,-6 q-22,16 -50,6 Z"/>
    <path d="M120,150 q-26,-12 -48,-2 q24,14 48,2 Z"/>
    <path d="M344,80 q26,-16 52,-8 q-24,18 -52,8 Z"/>
    <path d="M360,206 q24,-10 46,-2 q-22,14 -46,2 Z"/>
    <path d="M64,220 q24,-10 46,-4 q-20,16 -46,4 Z" opacity=".8"/>
  </g>
  <g class="cov-ff">
    <circle cx="180" cy="240" r="3" fill="#ffe9a8"/><circle cx="180" cy="240" r="7" fill="#ffe9a8" opacity=".3"/>
    <circle cx="290" cy="210" r="2.6" fill="#ffe9a8"/><circle cx="290" cy="210" r="6" fill="#ffe9a8" opacity=".3"/>
    <circle cx="230" cy="290" r="2.4" fill="#d8f2a8"/><circle cx="230" cy="290" r="6" fill="#d8f2a8" opacity=".3"/>
    <circle cx="330" cy="300" r="2.8" fill="#ffe9a8"/><circle cx="330" cy="300" r="7" fill="#ffe9a8" opacity=".3"/>
    <circle cx="110" cy="310" r="2.2" fill="#d8f2a8"/>
  </g>
  <path d="M0,330 Q120,316 240,324 T480,320 V360 H0 Z" fill="#122921"/>
  <g stroke="#1d4534" stroke-width="2.4" stroke-linecap="round" fill="none">
    <path d="M40,330 q2,-14 8,-20"/><path d="M52,332 q0,-12 4,-18"/>
    <path d="M300,326 q2,-12 7,-17"/><path d="M312,328 q0,-10 3,-15"/>
    <path d="M450,324 q2,-12 7,-17"/>
  </g>
</svg>`,

    /* 社务所文房 */
    scroll: `<svg viewBox="0 0 480 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="cvR-wood" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#9a6a44"/><stop offset="100%" stop-color="#7c5236"/>
    </linearGradient>
  </defs>
  <rect width="480" height="360" fill="url(#cvR-wood)"/>
  <g stroke="#6d4527" stroke-width="2" opacity=".5">
    <line x1="0" y1="60" x2="480" y2="56"/><line x1="0" y1="150" x2="480" y2="148"/>
    <line x1="0" y1="248" x2="480" y2="250"/><line x1="0" y1="330" x2="480" y2="328"/>
  </g>
  <g transform="rotate(-3 240 180)">
    <rect x="70" y="90" width="320" height="170" rx="4" fill="#faf3e0" stroke="#e0d2b0" stroke-width="2"/>
    <rect x="52" y="82" width="20" height="186" rx="10" fill="#8a5a33"/>
    <rect x="388" y="82" width="20" height="186" rx="10" fill="#8a5a33"/>
    <rect x="56" y="86" width="4" height="178" rx="2" fill="#a97848" opacity=".8"/>
    <circle cx="238" cy="168" r="52" fill="none" stroke="#3b3a4a" stroke-width="7" stroke-dasharray="292 40" stroke-linecap="round" transform="rotate(-60 238 168)" class="cov-spin-slow"/>
    <g stroke="#3b3a4a" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M110,130 q20,-10 38,2"/><path d="M112,160 q16,-6 32,0"/><path d="M114,190 q14,-6 28,2"/>
    </g>
    <g stroke="#b9553f" stroke-width="3" stroke-linecap="round" fill="none" opacity=".85">
      <path d="M312,140 q18,-8 34,0"/><path d="M316,168 q14,-6 28,0"/>
    </g>
    <g transform="rotate(8 348 224)">
      <rect x="332" y="208" width="34" height="34" rx="4" fill="#c73e3a"/>
      <path d="M340,218 h18 M340,226 h18 M340,234 h12" stroke="#faf3e0" stroke-width="3" stroke-linecap="round"/>
    </g>
  </g>
  <g transform="rotate(14 150 300)" class="cov-bob2">
    <rect x="100" y="292" width="104" height="10" rx="5" fill="#4a3220"/>
    <path d="M204,292 L232,286 Q238,290 234,296 L206,302 Z" fill="#2b2b3d"/>
  </g>
  <g class="cov-bob">
    <circle cx="404" cy="308" r="30" fill="#5d7a68"/>
    <circle cx="404" cy="308" r="24" fill="#324b3c"/>
    <ellipse cx="404" cy="306" rx="20" ry="16" fill="#7a5b3a"/>
    <path d="M398,286 q4,-10 -2,-18 M410,286 q4,-9 0,-16" stroke="#efe3cc" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>
  </g>
  <g transform="rotate(-18 96 200)">
    <rect x="80" y="160" width="32" height="80" rx="3" fill="#fdfaf3" stroke="#e3d5c5"/>
    <rect x="80" y="160" width="32" height="14" rx="3" fill="#c23a36"/>
    <path d="M88,186 h16 M90,196 h12 M88,206 h16" stroke="#3a3448" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="96" cy="222" r="5" fill="none" stroke="#c23a36" stroke-width="2"/>
  </g>
  <g fill="#c96a3f" class="cov-bob2">
    <path d="M428,80 q6,-12 2,-22 q10,6 10,18 q8,-4 14,2 q-8,4 -12,10 q4,8 0,16 q-6,-8 -12,-10 q-8,4 -16,0 q8,-6 14,-14 Z"/>
  </g>
  <g fill="#e8927c" opacity=".9">
    <path d="M320,48 q5,-2 6,3 q-1,5 -6,4 q-4,-3 0,-7 Z"/>
  </g>
</svg>`,
  };

  /* ---------- 友链 Q 版头像 ---------- */
  const chibiFace = (blushColor) => `
    <ellipse cx="24.5" cy="36" rx="3.6" ry="2" fill="${blushColor}" opacity=".55"/>
    <ellipse cx="39.5" cy="36" rx="3.6" ry="2" fill="${blushColor}" opacity=".55"/>
    <path d="M29,39.5 q3,2.6 6,0" stroke="#8e4038" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  ART.chibi = {
    reimu: `<svg viewBox="0 0 64 64" role="img" aria-label="灵梦">
  <circle cx="32" cy="32" r="30" fill="#ffe3d1"/>
  <path fill="#4d362d" d="M32,10 C18,11 11,20 10,32 C9,44 12,54 12,58 L52,58 C52,54 55,44 54,32 C53,20 46,11 32,10 Z"/>
  <path fill="#ffe8da" d="M17,32 C17,22 23,16 32,16 C41,16 47,22 47,32 C47,41 41,47 32,47 C23,47 17,41 17,32 Z"/>
  <path fill="#4d362d" d="M16,34 C14,26 16,19 22,15 C26,12 29,11 32,11 C35,11 38,12 42,15 C48,19 50,26 48,34 C46,29 44,26 40,25 C35,23 29,23 24,25 C20,26 18,29 16,34 Z"/>
  <circle cx="25" cy="32" r="2.6" fill="#5c2a20"/><circle cx="39" cy="32" r="2.6" fill="#5c2a20"/>
  <circle cx="25.9" cy="31" r="1" fill="#fff"/><circle cx="39.9" cy="31" r="1" fill="#fff"/>
  ${chibiFace("#ff9d8a")}
  <path fill="#dd4a43" d="M30,10 C26,5 18,2 12,4 C8,6 8,10 11,13 C16,17 24,17 29,14 C31,13 31,11 30,10 Z"/>
  <path fill="#dd4a43" d="M34,10 C38,5 46,2 52,4 C56,6 56,10 53,13 C48,17 40,17 35,14 C33,13 33,11 34,10 Z"/>
  <circle cx="32" cy="11" r="4.6" fill="#e8635c"/>
</svg>`,
    patchouli: `<svg viewBox="0 0 64 64" role="img" aria-label="帕秋莉">
  <circle cx="32" cy="32" r="30" fill="#e8ddf2"/>
  <path fill="#8b6fb8" d="M32,12 C19,13 12,21 11,33 C10,45 13,54 13,58 L51,58 C51,54 54,45 53,33 C52,21 45,13 32,12 Z"/>
  <path fill="#ffeee2" d="M18,33 C18,24 24,18 32,18 C40,18 46,24 46,33 C46,41 40,47 32,47 C24,47 18,41 18,33 Z"/>
  <path fill="#8b6fb8" d="M17,34 C15,26 18,20 24,16 C27,14 30,13 32,13 C34,13 37,14 40,16 C46,20 49,26 47,34 C45,29 43,27 39,26 C34,24 30,24 25,26 C21,27 19,29 17,34 Z"/>
  <path d="M21,31 q4,-2 7,0 M36,31 q4,-2 7,0" stroke="#5a4470" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <circle cx="25" cy="33.5" r="2.4" fill="#5a4470"/><circle cx="39" cy="33.5" r="2.4" fill="#5a4470"/>
  ${chibiFace("#d8a0c0")}
  <path fill="#f4ecf9" stroke="#cbb8dd" stroke-width="1.2" d="M14,14 C18,6 28,2 36,4 C46,6 52,12 50,18 C48,23 40,24 32,22 C24,20 16,20 14,14 Z"/>
  <path fill="#e8b84b" d="M44,10 a6.5,6.5 0 1 0 1,7 a5,5 0 1 1 -1,-7 Z"/>
  <path d="M20,12 q4,3 0,6 M28,10 q4,3 0,6" stroke="#cbb8dd" stroke-width="1.4" fill="none" stroke-linecap="round"/>
</svg>`,
    cirno: `<svg viewBox="0 0 64 64" role="img" aria-label="琪露诺">
  <circle cx="32" cy="32" r="30" fill="#d6ecf7"/>
  <path fill="#4f9dde" d="M32,11 C20,12 13,20 12,32 C11,43 14,53 14,57 L50,57 C50,53 53,43 52,32 C51,20 44,12 32,11 Z"/>
  <path fill="#ffeee2" d="M18,32 C18,23 24,17 32,17 C40,17 46,23 46,32 C46,40 40,46 32,46 C24,46 18,40 18,32 Z"/>
  <path fill="#4f9dde" d="M17,33 C15,25 18,19 24,15 C27,13 30,12 32,12 C34,12 37,13 40,15 C46,19 49,25 47,33 C45,28 43,26 39,25 C34,23 30,23 25,25 C21,26 19,28 17,33 Z"/>
  <circle cx="25" cy="31.5" r="2.7" fill="#2b5f8e"/><circle cx="39" cy="31.5" r="2.7" fill="#2b5f8e"/>
  <circle cx="26" cy="30.4" r="1.1" fill="#fff"/><circle cx="40" cy="30.4" r="1.1" fill="#fff"/>
  <path d="M28.5,39.5 q3.5,3 7,0" stroke="#8e4038" stroke-width="1.7" fill="none" stroke-linecap="round"/>
  <ellipse cx="24" cy="36" rx="3.6" ry="2" fill="#8fc3e8" opacity=".7"/>
  <ellipse cx="40" cy="36" rx="3.6" ry="2" fill="#8fc3e8" opacity=".7"/>
  <path fill="#dbeefb" stroke="#9fcbe8" stroke-width="1.2" d="M9,26 l6,-4 1,7 Z M12,38 l6,-2 -1,7 Z M52,24 l-6,-3 0,7 Z M53,36 l-6,-1 1,6 Z"/>
  <path fill="#3f80bd" d="M24,8 h16 l-2,7 q-6,3 -12,0 Z"/>
  <path fill="#eaf6ff" d="M30,4 h4 v6 h-4 Z" transform="rotate(8 32 7)"/>
</svg>`,
    lunasa: `<svg viewBox="0 0 64 64" role="img" aria-label="露娜萨">
  <circle cx="32" cy="32" r="30" fill="#f4ecd7"/>
  <path fill="#d8b45a" d="M32,13 C21,14 14,21 13,32 C12,43 15,52 15,57 L49,57 C49,52 52,43 51,32 C50,21 43,14 32,13 Z"/>
  <path fill="#ffeee2" d="M19,32 C19,24 24,18 32,18 C40,18 45,24 45,32 C45,40 40,46 32,46 C24,46 19,40 19,32 Z"/>
  <path fill="#d8b45a" d="M18,33 C16,26 19,20 25,16 C28,14 30,14 32,14 C34,14 36,14 39,16 C45,20 48,26 46,33 C44,28 42,26 38,25 C34,24 30,24 26,25 C22,26 20,28 18,33 Z"/>
  <path d="M22,30.5 q3,-1.6 6,0 M36,30.5 q3,-1.6 6,0" stroke="#7a6030" stroke-width="1.7" fill="none" stroke-linecap="round"/>
  <circle cx="25" cy="33" r="2.3" fill="#6d5426"/><circle cx="39" cy="33" r="2.3" fill="#6d5426"/>
  ${chibiFace("#e8b09a")}
  <path fill="#2e2a3d" d="M10,18 C16,6 48,6 54,18 L50,21 C40,15 24,15 14,21 Z"/>
  <path fill="#2e2a3d" d="M20,16 C22,8 28,4 33,4 C40,4 45,9 45,16 Q32,11 20,16 Z"/>
  <path d="M24,52 q8,5 16,0" stroke="#7a5a2e" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`,
  };

  /* ---------- 404 被弹小灵梦 ---------- */
  ART.miss = `<svg viewBox="0 0 220 180" role="img" aria-label="被弹的灵梦">
  <defs><radialGradient id="msGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffd6c2" stop-opacity=".8"/><stop offset="100%" stop-color="#ffd6c2" stop-opacity="0"/></radialGradient></defs>
  <circle cx="110" cy="92" r="80" fill="url(#msGlow)"/>
  <g class="ms-spin-star" fill="#e8b84b">
    <path d="M110,18 l3,7.6 7.6,3 -7.6,3 -3,7.6 -3,-7.6 -7.6,-3 7.6,-3 Z"/>
    <path d="M36,80 l2.4,6 6,2.4 -6,2.4 -2.4,6 -2.4,-6 -6,-2.4 6,-2.4 Z" opacity=".85"/>
    <path d="M182,74 l2.4,6 6,2.4 -6,2.4 -2.4,6 -2.4,-6 -6,-2.4 6,-2.4 Z" opacity=".85"/>
  </g>
  <g class="ms-wobble">
    <path fill="#4d362d" d="M110,52 C88,53 76,66 75,84 C74,100 78,112 78,120 L142,120 C142,112 146,100 145,84 C144,66 132,53 110,52 Z"/>
    <path fill="#ffe8da" d="M86,84 C86,70 96,61 110,61 C124,61 134,70 134,84 C134,97 124,106 110,106 C96,106 86,97 86,84 Z"/>
    <path fill="#4d362d" d="M85,86 C82,74 86,65 95,59 C100,55 105,54 110,54 C115,54 120,55 125,59 C134,65 138,74 135,86 C132,78 129,74 123,72 C115,69 105,69 97,72 C91,74 88,78 85,86 Z"/>
    <g stroke="#5c2a20" stroke-width="2.4" stroke-linecap="round" fill="none">
      <path d="M94,80 l9,9 M103,80 l-9,9"/>
      <path d="M117,80 l9,9 M126,80 l-9,9"/>
    </g>
    <ellipse cx="96" cy="94" rx="5" ry="2.6" fill="#ff9d8a" opacity=".6"/>
    <ellipse cx="124" cy="94" rx="5" ry="2.6" fill="#ff9d8a" opacity=".6"/>
    <path d="M104,98 q6,5 12,0" stroke="#8e4038" stroke-width="2.2" fill="none" stroke-linecap="round" transform="rotate(180 110 100)"/>
    <path fill="#dd4a43" d="M106,52 C100,45 90,41 82,43 C77,45 76,50 80,54 C86,59 97,59 104,56 C106,55 107,53 106,52 Z"/>
    <path fill="#dd4a43" d="M114,52 C120,45 130,41 138,43 C143,45 144,50 140,54 C134,59 123,59 116,56 C114,55 113,53 114,52 Z"/>
    <circle cx="110" cy="53" r="6" fill="#e8635c"/>
    <path fill="#dd4a43" d="M84,120 C86,132 96,140 110,140 C124,140 134,132 136,120 Z"/>
    <path fill="#fffdf8" d="M92,120 a4,4 0 0 0 8,0 Z M104,120 a4,4 0 0 0 8,0 Z M116,120 a4,4 0 0 0 8,0 Z M128,120 a4,4 0 0 0 8,0 Z" transform="translate(-4,14)"/>
  </g>
  <g stroke="#c73e3a" stroke-width="2" fill="none" opacity=".6" class="ms-ring">
    <circle cx="110" cy="96" r="56" stroke-dasharray="10 14"/>
  </g>
</svg>`;

  /* ---------- 幻想时计 · 怀表 ---------- */
  ART.watch = `<svg viewBox="0 0 90 90" aria-hidden="true">
  <defs><linearGradient id="wtCase" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f0cf8a"/><stop offset="100%" stop-color="#cfa050"/></linearGradient></defs>
  <path d="M45,8 q-7,-6 0,-7 q7,1 0,7" fill="none" stroke="#cfa050" stroke-width="2.4"/>
  <rect x="40" y="7" width="10" height="7" rx="2" fill="url(#wtCase)"/>
  <circle cx="45" cy="50" r="36" fill="url(#wtCase)"/>
  <circle cx="45" cy="50" r="30" fill="#fdf9ef"/>
  <g stroke="#8a6a3a" stroke-width="2" stroke-linecap="round">
    <line x1="45" y1="24" x2="45" y2="29"/><line x1="45" y1="71" x2="45" y2="76"/>
    <line x1="19" y1="50" x2="24" y2="50"/><line x1="66" y1="50" x2="71" y2="50"/>
  </g>
  <g stroke="#bfa070" stroke-width="1.2" stroke-linecap="round" opacity=".8">
    <line x1="58" y1="27.5" x2="55.5" y2="31.8"/><line x1="67.5" y1="37" x2="63.2" y2="39.5"/>
    <line x1="67.5" y1="63" x2="63.2" y2="60.5"/><line x1="58" y1="72.5" x2="55.5" y2="68.2"/>
    <line x1="32" y1="72.5" x2="34.5" y2="68.2"/><line x1="22.5" y1="63" x2="26.8" y2="60.5"/>
    <line x1="22.5" y1="37" x2="26.8" y2="39.5"/><line x1="32" y1="27.5" x2="34.5" y2="31.8"/>
  </g>
  <g class="wt-hands">
    <line x1="45" y1="50" x2="45" y2="32" stroke="#3b3a4a" stroke-width="2.6" stroke-linecap="round" class="wt-min"/>
    <line x1="45" y1="50" x2="57" y2="56" stroke="#3b3a4a" stroke-width="3.2" stroke-linecap="round" class="wt-hr"/>
    <line x1="45" y1="52" x2="45" y2="30" stroke="#c73e3a" stroke-width="1.2" stroke-linecap="round" class="wt-sec"/>
  </g>
  <circle cx="45" cy="50" r="2.6" fill="#c73e3a"/>
</svg>`;

  /* ---------- 注入器 ---------- */
  function inject() {
    // 图标 sprite 注入 body 头部
    const holder = document.createElement("div");
    holder.innerHTML = ART.iconSprite;
    document.body.insertBefore(holder.firstElementChild, document.body.firstChild);
    // data-art 占位替换
    document.querySelectorAll("[data-art]").forEach((el) => {
      const key = el.dataset.art;
      const src = key.includes(".") ? key.split(".").reduce((o, k) => (o || {})[k], ART) : ART[key];
      if (typeof src === "string") el.innerHTML = src;
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject);
  else inject();
})();
