import { useMemo, useState } from "react";
import "./App.css";

const SITE_URL = "https://oursai.vercel.app";
const KAKAO_JS_KEY = "392f84c5486937d26780349c72b4a1d8";

const songPool = [
  ["NewJeans - Ditto", "pSUydWEqKwE", "출근하면서 들어봐. 괜히 누가 생각나는 노래야."],
  ["Laufey - From The Start", "lSD_L-xic9o", "커피 마시면서 들어봐. 오늘 분위기랑 잘 맞아."],
  ["IU - Love wins all", "JleoAppaxi0", "밤에 혼자 들으면 더 와닿아."],
  ["The Weeknd - Out of Time", "2fDzCWNS3ig", "정리 안 된 마음 있을 때 들어봐."],
  ["Taylor Swift - Cruel Summer", "ic8j13piAhQ", "오늘은 좀 과감하게 움직일 때 들어봐."],
];

const colors = [
  {
    name: "올리브 그린",
    className: "olive",
    text: "오늘은 차분한데 은근히 존재감 있는 색이 잘 맞아.",
  },
  {
    name: "버터 옐로우",
    className: "yellow",
    text: "밝게 먼저 말 걸기 좋은 색이야.",
  },
  {
    name: "크림 화이트",
    className: "cream",
    text: "복잡한 기운을 정리하고 부드럽게 보여주는 색이야.",
  },
  {
    name: "코랄 핑크",
    className: "coral",
    text: "연락운, 호감운이 살아나는 색이야.",
  },
];

export default function App() {
  const [mode, setMode] = useState("home");
  const [fortuneForm, setFortuneForm] = useState({
    name: "",
    year: "",
    month: "",
    day: "",
    mbti: "",
    topic: "",
  });

  const fortune = useMemo(() => makeFortune(fortuneForm), [fortuneForm]);

  const share = async () => {
    try {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_JS_KEY);
        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: "우리 사이 🐢💛",
            description: "오늘의 운세랑 궁합을 거북이가 봐줌",
            imageUrl: `${SITE_URL}/turtle-wow.png`,
            link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL },
          },
          buttons: [{ title: "보러가기", link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL } }],
        });
        return;
      }
    } catch {}

    if (navigator.share) {
      await navigator.share({ title: "우리 사이", text: "우리 사이에서 봐봐 🐢", url: SITE_URL });
    }
  };

  if (mode === "home") {
    return (
      <main className="phone">
        <div className="home-top">
          <span>☰</span>
          <b>우리 사이 🤍</b>
        </div>

        <section className="home-hero">
          <h1>너희 사이,<br />얼마나 특별할까?</h1>
          <p>생년월일, MBTI로<br />둘만의 흐름을 분석해줄게!</p>
          <img src="/turtle-heart.png" alt="" />
        </section>

        <div className="menu-list">
          <button className="menu-card" onClick={() => setMode("fortune")}>
            <span>✨</span>
            <div>
              <b>오늘의 운세</b>
              <p>오늘의 흐름, 노래, 럭키 힌트</p>
            </div>
            <em>›</em>
          </button>

          <button className="menu-card">
            <span>💗</span>
            <div>
              <b>사주 궁합</b>
              <p>업데이트 중</p>
            </div>
            <em>›</em>
          </button>

          <button className="menu-card">
            <span>👥</span>
            <div>
              <b>MBTI 궁합</b>
              <p>업데이트 중</p>
            </div>
            <em>›</em>
          </button>
        </div>
      </main>
    );
  }

  if (mode === "fortune") {
    return (
      <main className="phone">
        <Top title="오늘의 운세" onBack={() => setMode("home")} />

        <section className="card">
          <div className="input-guide">
            <img src="/turtle-heart.png" alt="" />
            <b>오늘 흐름을 보려면<br />정보를 입력해줘!</b>
          </div>

          <label>이름</label>
          <input
            placeholder="이름"
            value={fortuneForm.name}
            onChange={(e) => setFortuneForm({ ...fortuneForm, name: e.target.value })}
          />

          <label>생년월일</label>
          <div className="date-row">
            <input
              placeholder="1998"
              value={fortuneForm.year}
              onChange={(e) => setFortuneForm({ ...fortuneForm, year: e.target.value.replace(/\D/g, "").slice(0, 4) })}
            />
            <input
              placeholder="05"
              value={fortuneForm.month}
              onChange={(e) => setFortuneForm({ ...fortuneForm, month: e.target.value.replace(/\D/g, "").slice(0, 2) })}
            />
            <input
              placeholder="14"
              value={fortuneForm.day}
              onChange={(e) => setFortuneForm({ ...fortuneForm, day: e.target.value.replace(/\D/g, "").slice(0, 2) })}
            />
          </div>

          <label>MBTI</label>
          <input
            placeholder="ENFP"
            value={fortuneForm.mbti}
            onChange={(e) => setFortuneForm({ ...fortuneForm, mbti: e.target.value.toUpperCase().slice(0, 4) })}
          />

          <label>오늘 특별히 알고 싶은 것 <small>선택</small></label>
          <textarea
            placeholder="예: 연락운, 돈, 면접, 그 사람 마음, 이직"
            value={fortuneForm.topic}
            onChange={(e) => setFortuneForm({ ...fortuneForm, topic: e.target.value })}
          />

          <button className="main-btn" onClick={() => setMode("fortuneResult")}>
            운세 보러가기
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="phone">
      <Top title="오늘의 운세" onBack={() => setMode("home")} onShare={share} />

      <section className="fortune-head">
        <p>{fortune.date}</p>
        <h1>{fortune.title}</h1>
        <img src="/turtle-wow.png" alt="" />
      </section>

      <section className="card song-card">
        <h3>🎵 오늘의 노래</h3>
        <b>{fortune.song}</b>
        <p className="song-line">{fortune.songLine}</p>
        <div className="youtube">
          <iframe src={`https://www.youtube.com/embed/${fortune.youtubeId}`} title={fortune.song} allowFullScreen />
        </div>
      </section>

      <LuckyReveal title="오늘의 럭키 컬러" icon="👗">
        <div className="outfit-card">
          <div className={`real-outfit ${fortune.color.className}`}>
            <div className="shirt" />
            <div className="jacket" />
            <div className="pants" />
            <div className="bag" />
            <div className="shoes" />
          </div>
          <div>
            <b>{fortune.color.name}</b>
            <p>{fortune.color.text}</p>
          </div>
        </div>
      </LuckyReveal>

      <LuckyReveal title="오늘 올 기회" icon="🎁">
        <p>{fortune.chance}</p>
      </LuckyReveal>

      <LuckyReveal title="오늘의 격언" icon="📜">
        <p>“{fortune.quote}”</p>
      </LuckyReveal>

      <section className="card">
        <h3>🔥 거북이가 솔직히 말해줄게</h3>
        <div className="fortune-text">
          {fortune.lines.map((line, i) => (
            <p key={i}>
              <Bold text={line} />
            </p>
          ))}
        </div>
      </section>

      {fortuneForm.topic.trim() && (
        <section className="card">
          <h3>🔍 네가 물어본 것</h3>
          <p className="question">“{fortuneForm.topic}”</p>
          <div className="fortune-text">
            {fortune.topicLines.map((line, i) => (
              <p key={i}>
                <Bold text={line} />
              </p>
            ))}
          </div>
        </section>
      )}

      <button className="main-btn">궁합 보러 가기</button>
    </main>
  );
}

function Top({ title, onBack, onShare }) {
  return (
    <div className="top-bar">
      <button onClick={onBack}>‹</button>
      <b>{title}</b>
      <button onClick={onShare || (() => {})}>{onShare ? "⌯" : ""}</button>
    </div>
  );
}

function LuckyReveal({ title, icon, children }) {
  const [open, setOpen] = useState(false);

  return (
    <section className={`card reveal ${open ? "open" : ""}`} onClick={() => setOpen(true)}>
      {!open ? (
        <div className="scratch">
          <span>{icon}</span>
          <b>{title}</b>
          <p>여기를 눌러봐!</p>
        </div>
      ) : (
        <>
          <h3>{icon} {title}</h3>
          <div className="reveal-content">{children}</div>
        </>
      )}
    </section>
  );
}

function Bold({ text }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

function makeFortune(form) {
  const seed = makeSeed(form);
  const song = songPool[seed % songPool.length];
  const color = colors[seed % colors.length];

  return {
    date: new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }),
    title: `${form.name || "너"}에게 오늘 들어오는 흐름`,
    song: song[0],
    youtubeId: song[1],
    songLine: song[2],
    color,
    chance:
      seed % 2 === 0
        ? "오늘은 오후에 짧은 연락이나 제안이 생각보다 크게 이어질 수 있어."
        : "평소 별생각 없던 사람이나 일이 오늘은 의외의 힌트를 줄 수 있어.",
    quote:
      seed % 2 === 0
        ? "흐르는 건 억지로 붙잡지 말고, 남는 건 괜히 의심하지 마라."
        : "기회는 큰 소리로 오지 않는다. 스치듯 지나가는 말 속에 숨어 온다.",
    lines: [
      `오늘은 **가만히 있으면 손해 보는 날**이야. 괜히 눈치만 보다가 타이밍을 놓치면 나중에 아쉬움이 남을 수 있어.`,
      `특히 ${form.mbti || "너"} 성향상 오늘은 생각이 많아지기 쉬운데, 너무 오래 고민하면 흐름이 닫혀. 🐢`,
      `오늘의 핵심은 **짧고 분명하게 말하기**야. 길게 설명하면 진심보다 불안처럼 보일 수 있어.`,
      `누군가에게 연락하고 싶다면 무겁게 시작하지 마. 가볍게 던지는 말이 오히려 오래 이어질 가능성이 커.`,
      `오늘은 사람을 통해 기회가 들어오는 날이야. 평소에 깊게 친하지 않았던 사람이 의외의 연결점이 될 수 있어.`,
      `돈이나 일 쪽에서는 작은 제안, 짧은 알림, 갑작스러운 일정 변경을 그냥 넘기지 마. 거기에 힌트가 있어. 🎁`,
      `연애운은 직접적으로 세게 오는 게 아니라, 살짝 건드렸을 때 상대가 반응하는 식으로 와.`,
      `오늘 조심할 건 **혼자 상상해서 결론 내리기**야. 아직 일어나지도 않은 일을 머릿속에서 끝까지 굴리면 하루가 무너져.`,
      `오늘은 먼저 움직이되 매달리지는 않는 태도가 중요해. 이 균형만 잡으면 운이 훨씬 부드럽게 풀려.`,
      `결론은 이거야. 오늘은 **망설이면 지나가고, 가볍게 잡으면 열리는 날**이야. ✨`,
    ],
    topicLines: [
      `네가 물어본 주제는 오늘 바로 결론이 나는 흐름은 아니야.`,
      `대신 작은 신호가 먼저 와. 말투, 제안, 연락, 표정 같은 사소한 것에서 방향이 보일 가능성이 커.`,
      `대처법은 단순해. **확인하려고 몰아붙이지 말고**, 상황이 열릴 틈을 만들어야 해.`,
      `마음가짐은 “당장 답을 받겠다”가 아니라 **흐름을 내가 유리하게 만들겠다** 쪽이 좋아.`,
    ],
  };
}

function makeSeed(input) {
  const now = new Date();
  const key = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const text = JSON.stringify(input) + key;
  let seed = 0;
  for (let i = 0; i < text.length; i++) seed = (seed * 31 + text.charCodeAt(i)) % 1000003;
  return seed;
}