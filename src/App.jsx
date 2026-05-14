import { useEffect, useMemo, useState } from "react";
import "./App.css";

const SITE_URL = "https://oursai.vercel.app";
const KAKAO_JS_KEY = "392f84c5486937d26780349c72b4a1d8";

const mbtiList = [
  "ISTJ","ISFJ","INFJ","INTJ","ISTP","ISFP","INFP","INTP",
  "ESTP","ESFP","ENFP","ENTP","ESTJ","ESFJ","ENFJ","ENTJ",
];

const relations = ["모름", "친구(썸)", "연애 중", "짝사랑"];

const songPool = [
  ["NewJeans - Ditto", "pSUydWEqKwE", "괜히 누군가 생각나는 날, 감정이 말랑해지는 분위기"],
  ["Laufey - From The Start", "lSD_L-xic9o", "설렘은 있는데 과하지 않아서 운세 읽으면서 듣기 좋음"],
  ["IU - Love wins all", "JleoAppaxi0", "마음이 깊어지는 날, 감정선 정리하기 좋음"],
  ["The Weeknd - Out of Time", "2fDzCWNS3ig", "미련과 타이밍이 섞인 날에 잘 맞음"],
  ["AKMU - 어떻게 이별까지 사랑하겠어", "m3DZsBw5bnE", "감정이 무겁게 남는 날에 잘 맞음"],
  ["Taylor Swift - Cruel Summer", "ic8j13piAhQ", "확 끌리는 기운이 강한 날에 잘 맞음"],
  ["YOASOBI - 夜に駆ける", "x8VYWazR5mE", "생각이 많고 마음이 빨리 달리는 날에 잘 맞음"],
  ["Post Malone, Swae Lee - Sunflower", "ApXoWvfEYVU", "가볍게 기분 전환하고 싶은 날에 좋음"],
];

export default function App() {
  const [mode, setMode] = useState("home");
  const [paid, setPaid] = useState(false);

  const [savedPeople, setSavedPeople] = useState(() => {
    const saved = localStorage.getItem("woorisai_people_v3");
    return saved ? JSON.parse(saved) : [];
  });

  const [fortuneForm, setFortuneForm] = useState({
    name: "",
    year: "",
    month: "",
    day: "",
    mbti: "",
    topic: "",
  });

  const [form, setForm] = useState({
    myName: "",
    myYear: "",
    myMonth: "",
    myDay: "",
    myMbti: "",
    partnerName: "",
    partnerYear: "",
    partnerMonth: "",
    partnerDay: "",
    partnerMbti: "",
    metYear: "",
    metMonth: "",
    relation: "모름",
  });

  useEffect(() => {
    localStorage.setItem("woorisai_people_v3", JSON.stringify(savedPeople));
  }, [savedPeople]);

  const fortune = useMemo(() => makeDailyFortune(fortuneForm), [fortuneForm]);
  const score = useMemo(() => makeScore(form), [form]);
  const saju = useMemo(() => makeSajuData(form), [form]);
  const mbti = useMemo(() => makeMbtiData(form, score), [form, score]);

  const savePerson = (person) => {
    if (!person.name) return;
    const clean = {
      name: person.name,
      year: person.year,
      month: person.month,
      day: person.day,
      mbti: person.mbti,
    };

    setSavedPeople((prev) => {
      const filtered = prev.filter((p) => p.name !== clean.name);
      return [clean, ...filtered].slice(0, 12);
    });
  };

  const loadFortunePerson = (name) => {
    const p = savedPeople.find((x) => x.name === name);
    if (p) setFortuneForm({ ...fortuneForm, ...p });
  };

  const loadPerson = (target, name) => {
    const p = savedPeople.find((x) => x.name === name);
    if (!p) return;

    if (target === "me") {
      setForm({
        ...form,
        myName: p.name,
        myYear: p.year,
        myMonth: p.month,
        myDay: p.day,
        myMbti: p.mbti,
      });
    } else {
      setForm({
        ...form,
        partnerName: p.name,
        partnerYear: p.year,
        partnerMonth: p.month,
        partnerDay: p.day,
        partnerMbti: p.mbti,
      });
    }
  };

  const updateFortune = (key, value, max) => {
    const numeric = ["year", "month", "day"].includes(key);
    setFortuneForm({
      ...fortuneForm,
      [key]: numeric ? value.replace(/\D/g, "").slice(0, max) : value,
    });
  };

  const updateForm = (key, value, max) => {
    const numeric = [
      "myYear","myMonth","myDay",
      "partnerYear","partnerMonth","partnerDay",
      "metYear","metMonth",
    ].includes(key);

    setForm({
      ...form,
      [key]: numeric ? value.replace(/\D/g, "").slice(0, max) : value,
    });
  };

  const shareResult = async () => {
    try {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_JS_KEY);
        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: "우리 사이 🐢💛",
            description: "오늘의 운세랑 궁합을 거북이가 몰래 봐줌",
            imageUrl: `${SITE_URL}/turtle-wow.png`,
            link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL },
          },
          buttons: [{ title: "보러가기", link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL } }],
        });
        return;
      }
    } catch {}

    if (navigator.share) {
      await navigator.share({ title: "우리 사이", text: "우리 사이에서 봐봐 🐢💛", url: SITE_URL });
    } else {
      await navigator.clipboard.writeText(SITE_URL);
      alert("링크 복사 완료!");
    }
  };

  if (mode === "home") {
    return (
      <Phone>
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
          <Menu icon="✨" title="오늘의 운세" desc="오늘의 운세와 행운 가득한 하루" onClick={() => setMode("fortune")} />
          <Menu icon="💗" title="사주 궁합" desc="우리가 만나게 된 운명적인 이유" onClick={() => setMode("saju")} />
          <Menu icon="👥" title="MBTI 궁합" desc="성격 궁합으로 알아보는 우리 사이" onClick={() => setMode("mbti")} />
        </div>
      </Phone>
    );
  }

  if (mode === "fortune") {
    return (
      <Phone>
        <TopBar title="오늘의 운세" onBack={() => setMode("home")} />

        <Card>
          <div className="input-guide-mini">
            <img src="/turtle-heart.png" alt="" />
            <b>정확한 운세를 위해<br />정보를 입력해주세요!</b>
          </div>

          <SavedPicker people={savedPeople} label="최근 입력한 정보" onSelect={loadFortunePerson} />

          <label>이름</label>
          <input value={fortuneForm.name} placeholder="이름을 입력해주세요" onChange={(e) => updateFortune("name", e.target.value)} />

          <BirthRow
            year={fortuneForm.year}
            month={fortuneForm.month}
            day={fortuneForm.day}
            onYear={(v) => updateFortune("year", v, 4)}
            onMonth={(v) => updateFortune("month", v, 2)}
            onDay={(v) => updateFortune("day", v, 2)}
          />

          <label>MBTI</label>
          <select value={fortuneForm.mbti} onChange={(e) => updateFortune("mbti", e.target.value)}>
            <option value="">모름</option>
            {mbtiList.map((m) => <option key={m}>{m}</option>)}
          </select>

          <label>오늘 특별히 알고 싶은 것 <span className="optional">선택</span></label>
          <textarea
            value={fortuneForm.topic}
            placeholder="예: 연락운, 돈, 면접, 그 사람 마음, 이직, 오늘 조심할 것"
            onChange={(e) => updateFortune("topic", e.target.value)}
          />

          <button
            className="main-btn"
            onClick={() => {
              if (!fortuneForm.name) {
                alert("이름은 입력해줘.");
                return;
              }
              savePerson(fortuneForm);
              setMode("fortuneResult");
            }}
          >
            운세 보러가기
          </button>
        </Card>
      </Phone>
    );
  }

  if (mode === "fortuneResult") {
    return (
      <Phone>
        <TopBar title="오늘의 운세" onBack={() => setMode("home")} onShare={shareResult} />

        <section className="fortune-head">
          <p>{fortune.today}</p>
          <h1>{fortune.title}</h1>
          <img src="/turtle-heart.png" alt="" />
        </section>

        <VerticalCard icon="🎵" title="오늘의 노래">
          <b>{fortune.song}</b>
          <p>{fortune.songReason}</p>
          <div className="youtube">
            <iframe src={`https://www.youtube.com/embed/${fortune.youtubeId}`} title={fortune.song} allowFullScreen />
          </div>
        </VerticalCard>

        <VerticalCard icon="👗" title="오늘의 럭키 컬러">
          <div className="dress-box">
            <div className={`dress ${fortune.colorClass}`} />
            <div>
              <b>{fortune.color}</b>
              <p>{fortune.colorReason}</p>
            </div>
          </div>
        </VerticalCard>

        <VerticalCard icon="🎁" title="오늘 올 기회">
          <p>{fortune.chance}</p>
        </VerticalCard>

        <VerticalCard icon="📜" title="오늘의 격언">
          <p>“{fortune.quote}”</p>
        </VerticalCard>

        <Card>
          <h3>🔥 오늘의 흐름</h3>
          <Paragraphs lines={fortune.lines} />
        </Card>

        {fortune.topic && (
          <Card>
            <h3>🔍 네가 물어본 것</h3>
            <p className="question-line">“{fortune.topic}”</p>
            <Paragraphs lines={fortune.topicLines} />
          </Card>
        )}

        <button className="main-btn" onClick={() => setMode("saju")}>궁합 보러 가기</button>
      </Phone>
    );
  }

  if (mode === "saju" || mode === "mbti") {
    const isSaju = mode === "saju";

    return (
      <Phone>
        <TopBar title={isSaju ? "사주 궁합" : "MBTI 궁합"} onBack={() => setMode("home")} />
        <StepRow />

        <div className="input-guide">
          <img src="/turtle-heart.png" alt="" />
          <b>정확한 분석을 위해<br />정보를 입력해주세요!</b>
        </div>

        <Card>
          <h3>🟡 내 정보</h3>
          <SavedPicker people={savedPeople} label="최근 입력한 내 정보" onSelect={(name) => loadPerson("me", name)} />

          <label>이름</label>
          <input value={form.myName} placeholder="이름을 입력해주세요" onChange={(e) => updateForm("myName", e.target.value)} />

          <BirthRow
            year={form.myYear}
            month={form.myMonth}
            day={form.myDay}
            onYear={(v) => updateForm("myYear", v, 4)}
            onMonth={(v) => updateForm("myMonth", v, 2)}
            onDay={(v) => updateForm("myDay", v, 2)}
          />

          <label>MBTI</label>
          <select value={form.myMbti} onChange={(e) => updateForm("myMbti", e.target.value)}>
            <option value="">모름</option>
            {mbtiList.map((m) => <option key={m}>{m}</option>)}
          </select>
        </Card>

        <Card>
          <h3>🟢 상대 정보</h3>
          <SavedPicker people={savedPeople} label="최근 입력한 상대 정보" onSelect={(name) => loadPerson("partner", name)} />

          <label>이름</label>
          <input value={form.partnerName} placeholder="상대 이름을 입력해주세요" onChange={(e) => updateForm("partnerName", e.target.value)} />

          <BirthRow
            year={form.partnerYear}
            month={form.partnerMonth}
            day={form.partnerDay}
            onYear={(v) => updateForm("partnerYear", v, 4)}
            onMonth={(v) => updateForm("partnerMonth", v, 2)}
            onDay={(v) => updateForm("partnerDay", v, 2)}
          />

          <label>MBTI</label>
          <select value={form.partnerMbti} onChange={(e) => updateForm("partnerMbti", e.target.value)}>
            <option value="">모름</option>
            {mbtiList.map((m) => <option key={m}>{m}</option>)}
          </select>
        </Card>

        <Card>
          <h3>💗 우리 관계</h3>

          <label>처음 만난 달</label>
          <div className="date-row two">
            <select value={form.metYear} onChange={(e) => updateForm("metYear", e.target.value)}>
              <option value="">모름</option>
              {yearOptions().map((y) => <option key={y} value={y}>{y}년</option>)}
            </select>
            <select value={form.metMonth} onChange={(e) => updateForm("metMonth", e.target.value)}>
              <option value="">모름</option>
              {monthOptions().map((m) => <option key={m} value={m}>{m}월</option>)}
            </select>
          </div>

          <label>관계</label>
          <select value={form.relation} onChange={(e) => updateForm("relation", e.target.value)}>
            {relations.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Card>

        <button
          className="main-btn"
          onClick={() => {
            savePerson({ name: form.myName, year: form.myYear, month: form.myMonth, day: form.myDay, mbti: form.myMbti });
            savePerson({ name: form.partnerName, year: form.partnerYear, month: form.partnerMonth, day: form.partnerDay, mbti: form.partnerMbti });
            setPaid(false);
            setMode(isSaju ? "sajuResult" : "mbtiResult");
          }}
        >
          분석하기
        </button>
      </Phone>
    );
  }

  if (mode === "sajuResult") {
    return (
      <ResultShell title="사주 궁합 결과" score={score} back={() => setMode("home")} share={shareResult}>
        <Card>
          <h3>이 둘 사이에 있을 법한 사건</h3>
          <p className="event-text">{saju.event}</p>
        </Card>

        <Card>
          <h3>사주 구성표</h3>
          <SajuTable data={saju.table} />
        </Card>

        <PaidArea paid={paid}>
          <Card>
            <h3>🔮 사주 전문 풀이</h3>
            <Paragraphs lines={saju.lines} />
          </Card>
        </PaidArea>

        {!paid && <PayButton onClick={() => setPaid(true)} />}
        <button className="sub-btn" onClick={shareResult}>공유하기</button>
      </ResultShell>
    );
  }

  if (mode === "mbtiResult") {
    return (
      <ResultShell title="MBTI 궁합 결과" score={score} back={() => setMode("home")} share={shareResult}>
        <Card>
          <h3>{form.myMbti || "나"} 💛 {form.partnerMbti || "상대"}</h3>
          <p className="event-text">{mbti.event}</p>
        </Card>

        <Card>
          <h3>MBTI 궁합표</h3>
          <MbtiStrip my={form.myMbti} partner={form.partnerMbti} />
          <MbtiTable rows={mbti.rows} />
        </Card>

        <PaidArea paid={paid}>
          <Card>
            <h3>💬 MBTI 상세 풀이</h3>
            <Paragraphs lines={mbti.lines} />
          </Card>
        </PaidArea>

        {!paid && <PayButton onClick={() => setPaid(true)} />}
        <button className="sub-btn" onClick={shareResult}>공유하기</button>
      </ResultShell>
    );
  }

  return null;
}

function Phone({ children }) {
  return <main className="phone">{children}</main>;
}

function TopBar({ title, onBack, onShare }) {
  return (
    <div className="top-bar">
      <button onClick={onBack}>‹</button>
      <b>{title}</b>
      <button onClick={onShare || (() => {})}>{onShare ? "⌯" : ""}</button>
    </div>
  );
}

function Card({ children }) {
  return <section className="card">{children}</section>;
}

function Menu({ icon, title, desc, onClick }) {
  return (
    <button className="menu-card" onClick={onClick}>
      <span>{icon}</span>
      <div>
        <b>{title}</b>
        <p>{desc}</p>
      </div>
      <em>›</em>
    </button>
  );
}

function StepRow() {
  return (
    <div className="step-row">
      <span className="active">1<br />정보 입력</span>
      <span>2<br />분석 중</span>
      <span>3<br />결과 보기</span>
    </div>
  );
}

function BirthRow({ year, month, day, onYear, onMonth, onDay }) {
  return (
    <>
      <label>생년월일</label>
      <div className="date-row">
        <select value={year} onChange={(e) => onYear(e.target.value)}>
          <option value="">모름</option>
          {yearOptions().map((y) => <option key={y} value={y}>{y}년</option>)}
        </select>
        <select value={month} onChange={(e) => onMonth(e.target.value)}>
          <option value="">모름</option>
          {monthOptions().map((m) => <option key={m} value={m}>{m}월</option>)}
        </select>
        <select value={day} onChange={(e) => onDay(e.target.value)}>
          <option value="">모름</option>
          {dayOptions().map((d) => <option key={d} value={d}>{d}일</option>)}
        </select>
      </div>
    </>
  );
}

function SavedPicker({ people, label, onSelect }) {
  if (!people.length) return null;
  return (
    <>
      <label>{label}</label>
      <select onChange={(e) => e.target.value && onSelect(e.target.value)}>
        <option value="">불러오기</option>
        {people.map((p) => <option key={p.name} value={p.name}>{p.name} · {p.year || "모름"}.{p.month || "모름"}.{p.day || "모름"} · {p.mbti || "모름"}</option>)}
      </select>
    </>
  );
}

function VerticalCard({ icon, title, children }) {
  return (
    <section className="vertical-card">
      <div className="vertical-icon">{icon}</div>
      <div className="vertical-body">
        <h3>{title}</h3>
        {children}
      </div>
    </section>
  );
}

function ResultShell({ title, score, back, share, children }) {
  return (
    <Phone>
      <TopBar title={title} onBack={back} onShare={share} />

      <div className="result-hero">
        <img src="/turtle-wow.png" alt="" />
        <div className="speech">{score >= 85 ? "와아!" : "오호!"}</div>
      </div>

      <Card>
        <p className="score-label">궁합 점수</p>
        <h1 className="score">{score}<span>%</span></h1>
        <p className="score-desc">{score >= 80 ? "생각보다 엄청 잘 맞는 조합이야!" : "끌림은 있는데 조율이 필요한 조합이야!"}</p>
        <div className="bar"><div style={{ width: `${score}%` }} /></div>
      </Card>

      <div className="score-list">
        <Score icon="💘" title="사랑 궁합" desc="감정 표현과 애정 방식" value={clamp(score + 8)} color="#ff5b63" />
        <Score icon="💬" title="대화 궁합" desc="대화가 잘 통하는 정도" value={clamp(score - 10)} color="#f08a00" />
        <Score icon="✨" title="성향 궁합" desc="가치관과 생활 방식" value={clamp(score + 2)} color="#78a800" />
      </div>

      {children}
    </Phone>
  );
}

function Score({ icon, title, desc, value, color }) {
  return (
    <div className="score-row">
      <span>{icon}</span>
      <div>
        <b>{title}</b>
        <p>{desc}</p>
      </div>
      <strong style={{ color }}>{value}%</strong>
    </div>
  );
}

function SajuTable({ data }) {
  return (
    <div className="saju-card">
      <div className="saju-head">
        <span>시주</span><span>일주</span><span>월주</span><span>년주</span>
      </div>
      <div className="saju-row gods">{data.topGods.map((x, i) => <span key={i}>{x}</span>)}</div>
      <div className="saju-row boxes">{data.top.map((x, i) => <SajuBox item={x} key={i} />)}</div>
      <div className="saju-row boxes">{data.bottom.map((x, i) => <SajuBox item={x} key={i} />)}</div>
      <div className="saju-row gods">{data.bottomGods.map((x, i) => <span key={i}>{x}</span>)}</div>
      <div className="saju-note">간이 사주표입니다. 실제 만세력 정밀 계산은 추후 API로 보강 가능.</div>
    </div>
  );
}

function SajuBox({ item }) {
  return (
    <div className={`saju-box ${item.tone}`}>
      <b>{item.char}</b>
      <small>{item.kr}</small>
    </div>
  );
}

function MbtiStrip({ my, partner }) {
  return (
    <div className="mbti-strip">
      <div className="mbti-char">
        <div className="avatar a">{my || "ME"}</div>
        <b>{my || "나"}</b>
      </div>
      <div className="heart-line">💛</div>
      <div className="mbti-char">
        <div className="avatar b">{partner || "YOU"}</div>
        <b>{partner || "상대"}</b>
      </div>
    </div>
  );
}

function MbtiTable({ rows }) {
  return (
    <div className="mbti-table">
      {rows.map((r) => (
        <div key={r.label}>
          <b>{r.label}</b>
          <span>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function PaidArea({ paid, children }) {
  return (
    <div className="paid-area">
      <div className={paid ? "" : "locked"}>{children}</div>
      {!paid && (
        <div className="lock-cover">
          <img src="/turtle-heart.png" alt="" />
          <h3>전체 해석은 결제 후 열려요</h3>
          <p>전문 용어, 이유, 실제 사건 예시까지 전부 풀어줄게.</p>
        </div>
      )}
    </div>
  );
}

function PayButton({ onClick }) {
  return <button className="pay-btn" onClick={onClick}>990원으로 전체 보기 kakaopay</button>;
}

function Paragraphs({ lines }) {
  return (
    <div className="paragraphs">
      {lines.map((line, i) => <p key={i}><BoldText text={line} /></p>)}
    </div>
  );
}

function BoldText({ text }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return <>{parts.map((p, i) => p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>)}</>;
}

function yearOptions() {
  return Array.from({ length: 90 }, (_, i) => String(2026 - i));
}

function monthOptions() {
  return Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
}

function dayOptions() {
  return Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
}

function makeSeed(input) {
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const text = JSON.stringify(input) + dateKey;
  let seed = 0;
  for (let i = 0; i < text.length; i++) seed = (seed * 31 + text.charCodeAt(i)) % 1000003;
  return seed;
}

function makeScore(input) {
  let seed = 0;
  const text = JSON.stringify(input);
  for (let i = 0; i < text.length; i++) seed = (seed * 29 + text.charCodeAt(i)) % 1000003;
  return 58 + (seed % 39);
}

function clamp(n) {
  return Math.max(0, Math.min(100, n));
}

function makeDailyFortune(input) {
  const seed = makeSeed(input);
  const song = songPool[seed % songPool.length];

  const colors = [
    ["옐로우", "yellow", "말을 먼저 꺼내는 운을 올려줘."],
    ["올리브 그린", "olive", "마음을 차분하게 정리하고 안정감을 줘."],
    ["크림 화이트", "cream", "복잡한 생각을 줄이고 흐름을 맑게 해줘."],
    ["코랄 핑크", "coral", "연락운과 호감 표현을 부드럽게 올려줘."],
  ];

  const color = colors[seed % colors.length];

  const topic = input.topic?.trim();

  return {
    today: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }),
    title: `${input.name || "너"}에게 오늘 들어오는 흐름`,
    song: song[0],
    youtubeId: song[1],
    songReason: song[2],
    color: color[0],
    colorClass: color[1],
    colorReason: color[2],
    chance: seed % 2 === 0 ? "오후에 짧은 연락, 제안, 우연한 대화가 크게 이어질 수 있어." : "평소 별생각 없던 사람이나 일이 오늘은 의외의 힌트를 줄 수 있어.",
    quote: seed % 2 === 0 ? "흐르는 건 억지로 붙잡지 말고, 남는 건 괜히 의심하지 마라." : "기회는 큰 소리로 오지 않는다. 가볍게 스치는 말 속에 숨어 온다.",
    lines: [
      `오늘은 **가만히 있으면 손해 보는 날**이야. 괜히 눈치만 보다가 타이밍을 놓치면 나중에 아쉬움이 남을 수 있어. 🐢`,
      `특히 ${input.mbti || "너"} 성향상 오늘은 생각이 많아지기 쉬운데, 너무 오래 고민하면 흐름이 닫혀.`,
      `오늘의 핵심은 **짧고 분명하게 말하기**야. 설명을 길게 하면 진심보다 불안처럼 보일 수 있어.`,
      `누군가에게 연락하고 싶다면 무겁게 시작하지 마. 가볍게 던지는 말이 오히려 오래 이어질 가능성이 커. 💬`,
      `오늘은 사람을 통해 기회가 들어오는 날이야. 평소에 깊게 친하지 않았던 사람이 의외의 연결점이 될 수 있어.`,
      `돈이나 일 쪽에서는 작은 제안, 짧은 알림, 갑작스러운 일정 변경을 그냥 넘기지 마. 거기에 힌트가 있어. 🎁`,
      `연애운은 직접적으로 세게 오는 게 아니라, 살짝 건드렸을 때 상대가 반응하는 식으로 와.`,
      `오늘 조심할 건 **혼자 상상해서 결론 내리기**야. 아직 일어나지도 않은 일을 머릿속에서 끝까지 굴리면 하루가 무너져.`,
      `럭키 컬러는 **${color[0]}**. 오늘은 강하게 밀어붙이는 색보다 사람을 편하게 만드는 색이 잘 맞아. 👗`,
      `오늘은 먼저 움직이되 매달리지는 않는 태도가 중요해. 이 균형만 잡으면 운이 훨씬 부드럽게 풀려.`,
      `누군가의 반응이 애매해도 바로 실망하지 마. 오늘은 반응이 늦게 따라오는 운이야.`,
      `결론은 이거야. 오늘은 **망설이면 지나가고, 가볍게 잡으면 열리는 날**이야. ✨`,
    ],
    topicLines: topic ? [
      `네가 물어본 **${topic}** 쪽은 오늘 바로 결론이 나는 흐름은 아니야.`,
      `대신 작은 신호가 먼저 와. 말투, 제안, 연락, 표정 같은 사소한 것에서 방향이 보일 가능성이 커.`,
      `대처법은 단순해. **확인하려고 몰아붙이지 말고**, 상황이 열릴 틈을 만들어야 해.`,
      `마음가짐은 “당장 답을 받겠다”가 아니라 **흐름을 내가 유리하게 만들겠다** 쪽이 좋아.`,
      `오늘 이 주제는 세게 밀면 막히고, 부드럽게 건드리면 풀리는 쪽이야.`,
    ] : [],
  };
}

function makeSajuData(form) {
  const seed = makeScore(form);
  const tenGods = ["비견","겁재","식신","상관","편재","정재","편관","정관","편인","정인"];
  const stems = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
  const stemKr = ["갑","을","병","정","무","기","경","신","임","계"];
  const branches = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
  const branchKr = ["자","축","인","묘","진","사","오","미","신","유","술","해"];

  const top = [0,1,2,3].map((i) => ({
    char: stems[(seed + i) % 10],
    kr: stemKr[(seed + i) % 10],
    tone: ["yellow","dark","red","white"][(seed + i) % 4],
  }));

  const bottom = [0,1,2,3].map((i) => ({
    char: branches[(seed + i) % 12],
    kr: branchKr[(seed + i) % 12],
    tone: ["white","yellow","dark","red"][(seed + i) % 4],
  }));

  return {
    event: seed % 2 === 0
      ? "둘은 장난처럼 시작했는데 어느 순간 한쪽이 먼저 더 깊게 신경 쓰게 되는 사건이 생기기 쉬워."
      : "둘은 약속이나 연락 타이밍 하나 때문에 서운함이 생기지만, 그 일 때문에 오히려 마음을 확인하게 될 수 있어.",
    table: {
      topGods: [0,1,2,3].map((i) => tenGods[(seed + i) % 10]),
      bottomGods: [4,5,6,7].map((i) => tenGods[(seed + i) % 10]),
      top,
      bottom,
    },
    lines: makeLongSajuLines(seed, form),
  };
}

function makeMbtiData(form, score) {
  const my = form.myMbti || "모름";
  const partner = form.partnerMbti || "모름";

  return {
    event: `${my}와 ${partner}는 대화가 잘 풀릴 때 확 가까워지지만, 답장 텀이나 말투 하나로 분위기가 확 바뀔 수 있어.`,
    rows: [
      { label: "내 성향", value: `${my}: 감정 표현 방식과 관계 속도` },
      { label: "상대 성향", value: `${partner}: 안정감을 느끼는 방식` },
      { label: "끌림 포인트", value: "서로 다른 점이 초반 호기심과 설렘으로 작동함" },
      { label: "충돌 포인트", value: "연락 텀, 말투, 서운함을 푸는 속도 차이" },
      { label: "예시", value: "한쪽은 바로 풀고 싶고, 다른 한쪽은 혼자 정리해야 편해짐" },
    ],
    lines: [
      `${my}와 ${partner}의 궁합은 단순히 좋다, 나쁘다로 끝낼 수 없어.`,
      `핵심은 **감정 표현 속도**와 **갈등 처리 방식**이야.`,
      `한쪽은 바로 확인받고 싶고, 다른 한쪽은 생각을 정리한 뒤에야 말이 나올 수 있어.`,
      `이 차이가 처음에는 신선한 매력으로 보일 수 있어.`,
      `하지만 시간이 지나면 같은 차이가 서운함으로 바뀔 수도 있어.`,
      `특히 답장 길이, 약속 잡는 방식, 감정 표현 빈도에서 차이가 잘 드러나.`,
      `이 관계는 대화가 터질 때는 진짜 빠르게 가까워져.`,
      `반대로 싸울 때는 말투 하나로 분위기가 크게 바뀔 수 있어.`,
      `중요한 건 상대의 반응 속도를 사랑의 크기로 착각하지 않는 거야.`,
      score >= 80 ? `결론은 **다름이 매력으로 작동할 가능성이 높은 조합**이야.` : `결론은 **다름이 피로로 변하지 않게 관리해야 하는 조합**이야.`,
    ],
  };
}

function makeLongSajuLines(seed, form) {
  return [
    `이 궁합은 사주 흐름상 **처음 만난 시점의 기운**이 꽤 중요하게 작동하는 구조야.`,
    `처음 만난 ${form.metMonth || "그"}월의 흐름이 두 사람 사이에 묘한 인상을 남겼고, 그냥 지나칠 관계인데도 한 번 더 생각나게 만드는 쪽이야.`,
    `사주에서 **편관**은 긴장감, 자극, 압박을 뜻하고, **정인**은 보호, 안정, 이해를 뜻해.`,
    `이 둘의 조합이 같이 보이면 처음엔 강하게 끌리지만 동시에 조심스러워지는 관계가 만들어져.`,
    `한쪽은 감정을 빨리 확인하고 싶어 하고, 다른 한쪽은 충분히 관찰한 뒤 움직이려는 흐름이 있어.`,
    `그래서 좋을 때는 확 가까워지지만, 애매할 때는 말 한마디가 크게 남을 수 있어.`,
    `특히 **일간의 충돌**이 있는 흐름에서는 자존심 싸움이 쉽게 생겨.`,
    `겉으로는 아무렇지 않은 척하지만 속으로는 이미 여러 번 계산하고 있을 가능성이 커.`,
    `이 관계가 오래 가려면 감정을 증명하려고 몰아붙이면 안 돼.`,
    `대신 행동이 반복적으로 같은 방향인지 봐야 해.`,
    `사주적으로는 말보다 **반복되는 태도**가 훨씬 중요하게 작동하는 궁합이야.`,
    `상대가 한 번 다정했다고 바로 깊은 마음이라고 보기 어렵고, 한 번 차가웠다고 끝났다고 보기에도 이른 조합이야.`,
    `이 둘은 감정의 파도가 한 번에 오는 편이라, 시작이 빠르면 불안도 빠르게 따라와.`,
    `그래서 연락 빈도나 답장 속도에 집착하면 관계가 급격히 피곤해질 수 있어.`,
    `좋은 점은 서로에게 없는 기운을 줄 수 있다는 거야.`,
    `한쪽은 상대에게 현실감을 주고, 다른 한쪽은 상대에게 감정의 온기를 줄 수 있어.`,
    `이 균형이 맞으면 둘은 꽤 오래 갈 수 있어.`,
    `하지만 균형이 무너지면 한쪽은 지치고, 다른 한쪽은 답답해져.`,
    `결론적으로 이 사주는 ${seed % 2 === 0 ? "**이어질 힘은 강하지만 솔직한 조율이 필요한 궁합**" : "**끌림은 있지만 감정 관리가 필요한 궁합**"}이야.`,
    `거북이 결론은 이거야. **좋아하면 천천히 확인하고, 불안하면 바로 단정하지 마.**`,
  ];
}