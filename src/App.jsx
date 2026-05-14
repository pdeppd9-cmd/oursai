import { useEffect, useMemo, useState } from "react";

const KAKAO_JS_KEY = "392f84c5486937d26780349c72b4a1d8";
const SITE_URL = "https://oursai.vercel.app";

const mbtiList = [
  "ISTJ","ISFJ","INFJ","INTJ","ISTP","ISFP","INFP","INTP",
  "ESTP","ESFP","ENFP","ENTP","ESTJ","ESFJ","ENFJ","ENTJ",
];

const relationshipList = ["친구(썸)", "연애 중", "짝사랑"];

export default function App() {
  const [mode, setMode] = useState("home");
  const [paid, setPaid] = useState(false);

  const [savedPeople, setSavedPeople] = useState(() => {
    const saved = localStorage.getItem("woorisai_people");
    return saved ? JSON.parse(saved) : [];
  });

  const [fortune, setFortune] = useState({
    name: "",
    year: "",
    month: "",
    day: "",
    mbti: "",
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
    relationship: "친구(썸)",
  });

  useEffect(() => {
    localStorage.setItem("woorisai_people", JSON.stringify(savedPeople));
  }, [savedPeople]);

  const result = useMemo(() => {
    const score = makeScore(form);
    return {
      score,
      love: clamp(score + 10),
      talk: clamp(score - 8),
      mood: clamp(score + 2),
      future: clamp(score + 5),
      turtle: getTurtle(score),
      saju: makeSajuTable(form),
      mbti: makeMbtiTable(form),
      long: makeLongPaidText(score, form),
    };
  }, [form]);

  const fortuneResult = useMemo(() => {
    const seed =
      Number(fortune.year || 0) +
      Number(fortune.month || 0) * 3 +
      Number(fortune.day || 1) * 7 +
      new Date().getDate();

    const colors = ["버터 옐로우", "올리브 그린", "크림 화이트", "코랄 핑크", "딥 브라운"];
    const color = colors[seed % colors.length];

    return {
      color,
      topic: ["은근히 마음 가는 사람", "말투가 편한 사람", "요즘 자꾸 보이는 사람", "가볍게 웃기는 사람"][seed % 4],
      quote: "흐르는 건 억지로 붙잡지 말고, 남는 건 괜히 의심하지 마라.",
      text:
        `오늘은 ${fortune.name || "너"}한테 **관계의 온도**가 유난히 잘 느껴지는 날이야. 누가 너를 편하게 만드는지, 누가 괜히 피곤하게 만드는지 평소보다 훨씬 빨리 감이 올 수 있어. 그래서 오늘은 사람을 많이 만나는 것보다 **내가 어떤 사람 옆에서 편해지는지** 보는 게 더 중요해.\n\n` +
        `특히 오늘은 연락운이 조금 살아 있어. 오랫동안 애매했던 사람한테 갑자기 연락이 오거나, 별생각 없이 던진 말이 대화로 길게 이어질 수 있음. 근데 여기서 핵심은 너무 진지하게 시작하지 않는 거야. 오늘은 무겁게 들어가면 분위기가 딱딱해지고, **가볍게 웃기듯이 들어가야** 흐름이 열린다.\n\n` +
        `오늘 추천 행동은 **짧고 선명하게 말하기**야. 설명을 길게 늘어놓으면 네 마음이 커 보이기보다 불안해 보일 수 있어. 그래서 오늘은 하고 싶은 말이 있어도 한 번 줄여서 말하는 게 좋음. 예를 들면 “뭐해?”보다 “오늘 좀 생각났음” 같은 식. 가볍지만 방향은 있는 말이 오늘은 잘 먹혀.\n\n` +
        `오늘 기회는 **대화 중간에 갑자기 생기는 작은 틈**에서 올 가능성이 커. 누가 별거 아닌 질문을 던졌는데 그게 생각보다 깊어지거나, 네가 가볍게 보낸 말에 상대가 예상보다 길게 답할 수 있어. 그 순간을 너무 분석하지 말고 그냥 이어가. 오늘은 분석보다 흐름이 먼저야.\n\n` +
        `주의할 점은 **혼자 결론 내리기**야. 답장이 늦다고 마음이 식었다고 단정하거나, 말투가 짧다고 너를 싫어한다고 판단하면 오늘은 거의 빗나갈 수 있어. 오늘 감정은 확대경처럼 작동해서 작은 신호도 크게 보이거든. 그러니까 오늘은 상대를 판단하는 날이 아니라 **내 반응을 관찰하는 날**로 봐야 해.\n\n` +
        `럭키 컬러는 **${color}**. 너무 튀는 색보다 부드럽고 따뜻한 느낌이 좋아. 오늘은 강하게 밀어붙이는 색보다, 사람을 편하게 만드는 색이 운을 더 잘 끌어와.\n\n` +
        `정리하면 오늘은 **느리게 움직이는 사람이 이기는 날**이야. 빨리 확인받으려 하지 말고, 빨리 정리하려 하지도 마. 오히려 한 박자 늦게 반응할수록 네가 덜 흔들리고, 상대도 너를 더 편하게 느낄 가능성이 높아.`,
    };
  }, [fortune]);

  const savePerson = (p) => {
    if (!p.name) return;
    if (savedPeople.find((x) => x.name === p.name)) return;
    setSavedPeople([...savedPeople, p]);
  };

  const loadFortune = (name) => {
    const p = savedPeople.find((x) => x.name === name);
    if (p) setFortune(p);
  };

  const loadPerson = (target, name) => {
    const p = savedPeople.find((x) => x.name === name);
    if (!p) return;

    if (target === "me") {
      setForm({ ...form, myName: p.name, myYear: p.year, myMonth: p.month, myDay: p.day, myMbti: p.mbti });
    } else {
      setForm({ ...form, partnerName: p.name, partnerYear: p.year, partnerMonth: p.month, partnerDay: p.day, partnerMbti: p.mbti });
    }
  };

  const updateFortuneNum = (key, value, max) => {
    setFortune({ ...fortune, [key]: value.replace(/\D/g, "").slice(0, max) });
  };

  const updateFormNum = (key, value, max) => {
    setForm({ ...form, [key]: value.replace(/\D/g, "").slice(0, max) });
  };

  const showFortune = () => {
    if (!fortune.name || !fortune.year || !fortune.month || !fortune.day || !fortune.mbti) {
      alert("정보를 다 입력해줘.");
      return;
    }
    savePerson(fortune);
    setMode("fortuneResult");
  };

  const showResult = () => {
    const keys = ["myName","myYear","myMonth","myDay","myMbti","partnerName","partnerYear","partnerMonth","partnerDay","partnerMbti","metYear","metMonth"];
    if (keys.some((k) => !form[k])) {
      alert("빈칸을 다 입력해줘.");
      return;
    }

    savePerson({ name: form.myName, year: form.myYear, month: form.myMonth, day: form.myDay, mbti: form.myMbti });
    savePerson({ name: form.partnerName, year: form.partnerYear, month: form.partnerMonth, day: form.partnerDay, mbti: form.partnerMbti });
    setPaid(false);
    setMode("result");
  };

  const shareResult = async () => {
    try {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_JS_KEY);
        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: "우리 사이 🐢💛",
            description: "귀여운 거북이가 봐주는 궁합. 근데 말은 생각보다 맵다.",
            imageUrl: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?q=80&w=1200&auto=format&fit=crop",
            link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL },
          },
          buttons: [{ title: "궁합 보러가기", link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL } }],
        });
        return;
      }
    } catch {}

    if (navigator.share) {
      await navigator.share({ title: "우리 사이", text: "우리 사이에서 궁합 봤는데 거북이가 말 너무 세게 함 🐢💛", url: SITE_URL });
    } else {
      await navigator.clipboard.writeText(SITE_URL);
      alert("링크 복사했어!");
    }
  };

  if (mode === "fortune") {
    return (
      <PhonePage>
        <TopBar onBack={() => setMode("home")} title="오늘의 운세" />
        <Hero title={"오늘의 운세,\n거북이가 봐줄게"} subtitle="오늘 어떤 식으로 행동하면 좋을지 알려줄게!" />

        <Card>
          <MiniTitle emoji="☀️" text="내 정보" />
          <SavedPicker people={savedPeople} label="저장된 정보 불러오기" onSelect={loadFortune} />

          <TextInput label="이름" placeholder="이름을 입력해줘" value={fortune.name} onChange={(v) => setFortune({ ...fortune, name: v })} />

          <BirthInput
            year={fortune.year}
            month={fortune.month}
            day={fortune.day}
            onYear={(v) => updateFortuneNum("year", v, 4)}
            onMonth={(v) => updateFortuneNum("month", v, 2)}
            onDay={(v) => updateFortuneNum("day", v, 2)}
          />

          <SelectInput label="MBTI" value={fortune.mbti} onChange={(v) => setFortune({ ...fortune, mbti: v })} />

          <button style={styles.mainButton} onClick={showFortune}>오늘의 운세 보기 🐢</button>
        </Card>
      </PhonePage>
    );
  }

  if (mode === "fortuneResult") {
    return (
      <PhonePage>
        <TopBar onBack={() => setMode("home")} title="오늘의 운세" share={shareResult} />

        <ResultCard>
          <Turtle face="🐢✨" speech="오늘은 이래!" />
          <Badge>오늘의 운세</Badge>
          <h1 style={styles.resultTitle}>{fortune.name}의 오늘 흐름</h1>

          <InfoCard title="🎨 오늘의 럭키 컬러" text={`**${fortuneResult.color}**`} />
          <InfoCard title="💬 오늘의 대화 주제" text={`**${fortuneResult.topic}**`} />
          <InfoCard title="📌 오늘의 격언" text={`**${fortuneResult.quote}**`} />

          <Section title="🔥 자세히 보면" text={fortuneResult.text} />

          <button style={styles.subButton} onClick={shareResult}>공유하기</button>
        </ResultCard>
      </PhonePage>
    );
  }

  if (mode === "saju" || mode === "mbti") {
    return (
      <PhonePage>
        <TopBar onBack={() => setMode("home")} title={mode === "saju" ? "사주 궁합" : "MBTI 궁합"} />
        <Hero title={mode === "saju" ? "사주로 궁합 보기" : "MBTI로 궁합 보기"} subtitle="정직하게 입력해야 거북이가 제대로 봐준다구." />

        <Card>
          <MiniTitle emoji="👤" text="내 정보" />
          <SavedPicker people={savedPeople} label="저장된 내 정보 불러오기" onSelect={(name) => loadPerson("me", name)} />
          <TextInput label="내 이름" placeholder="이름을 입력해줘" value={form.myName} onChange={(v) => setForm({ ...form, myName: v })} />
          <BirthInput year={form.myYear} month={form.myMonth} day={form.myDay} onYear={(v) => updateFormNum("myYear", v, 4)} onMonth={(v) => updateFormNum("myMonth", v, 2)} onDay={(v) => updateFormNum("myDay", v, 2)} />
          <SelectInput label="내 MBTI" value={form.myMbti} onChange={(v) => setForm({ ...form, myMbti: v })} />

          <Divider />

          <MiniTitle emoji="🐢" text="상대 정보" />
          <SavedPicker people={savedPeople} label="저장된 상대 정보 불러오기" onSelect={(name) => loadPerson("partner", name)} />
          <TextInput label="상대 이름" placeholder="상대 이름을 입력해줘" value={form.partnerName} onChange={(v) => setForm({ ...form, partnerName: v })} />
          <BirthInput year={form.partnerYear} month={form.partnerMonth} day={form.partnerDay} onYear={(v) => updateFormNum("partnerYear", v, 4)} onMonth={(v) => updateFormNum("partnerMonth", v, 2)} onDay={(v) => updateFormNum("partnerDay", v, 2)} />
          <SelectInput label="상대 MBTI" value={form.partnerMbti} onChange={(v) => setForm({ ...form, partnerMbti: v })} />

          <Divider />

          <MiniTitle emoji="💗" text="우리 관계" />
          <label style={styles.label}>처음 만난 달</label>
          <div style={styles.metRow}>
            <input style={styles.smallInput} placeholder="2024" value={form.metYear} inputMode="numeric" maxLength={4} onChange={(e) => updateFormNum("metYear", e.target.value, 4)} />
            <span>년</span>
            <input style={styles.smallInput} placeholder="11" value={form.metMonth} inputMode="numeric" maxLength={2} onChange={(e) => updateFormNum("metMonth", e.target.value, 2)} />
            <span>월</span>
          </div>

          <label style={styles.label}>현재 관계</label>
          <select style={styles.input} value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })}>
            {relationshipList.map((x) => <option key={x}>{x}</option>)}
          </select>

          <button style={styles.mainButton} onClick={showResult}>우리 사이 분석하기 🐢</button>
        </Card>
      </PhonePage>
    );
  }

  if (mode === "result") {
    return (
      <PhonePage>
        <TopBar onBack={() => setMode("home")} title="우리 사이 분석 결과" share={shareResult} />

        <ResultCard>
          <Turtle face={result.turtle.face} speech={result.turtle.speech} />

          <ScoreBox score={result.score} text={result.turtle.text} />

          <ScoreList love={result.love} talk={result.talk} mood={result.mood} future={result.future} />

          <LockedPreview paid={paid}>
            <SajuTable data={result.saju} />
            <Section title="🔮 사주 기반 상세 궁합" text={result.long.saju} />
            <MbtiTable data={result.mbti} />
            <Section title="💬 MBTI 기반 상세 궁합" text={result.long.mbti} />
            <Section title="💘 관계 예시" text={result.long.example} />
            <Section title="✅ 결론" text={result.long.final} />
          </LockedPreview>

          {!paid && (
            <button
              style={styles.payButton}
              onClick={() => {
                alert("카카오페이 단건결제 API 연결 전 임시 버튼이야. 다음 단계에서 실제 990원 결제로 연결 가능.");
                setPaid(true);
              }}
            >
              🔒 전체 상세 분석 보기 990원
            </button>
          )}

          <button style={styles.subButton} onClick={shareResult}>공유하기</button>
        </ResultCard>
      </PhonePage>
    );
  }

  return (
    <PhonePage>
      <div style={styles.topHome}>
        <span style={styles.hamburger}>☰</span>
        <Badge>우리 사이 ❤</Badge>
      </div>

      <Hero title={"너희 사이,\n얼마나 특별할까?"} subtitle="생년월일, MBTI, 처음 만난 날로 둘 사이의 흐름을 분석해줄게!" />

      <div style={styles.turtleHero}>
        <div style={styles.cloudLeft}></div>
        <div style={styles.cloudRight}></div>
        <div style={styles.heroTurtle}>🐢💗</div>
      </div>

      <Card>
        <MenuButton emoji="☀️" title="오늘의 운세" desc="오늘의 흐름, 럭키 컬러, 조언" onClick={() => setMode("fortune")} />
        <MenuButton emoji="🔮" title="사주로 궁합 보기" desc="생년월일과 처음 만난 달 중심" onClick={() => setMode("saju")} />
        <MenuButton emoji="💬" title="MBTI로 궁합 보기" desc="성향, 대화 방식, 감정 표현 중심" onClick={() => setMode("mbti")} />
      </Card>

      <div style={styles.bottomTurtle}>정확한 분석을 위해<br />정직하게 입력해줘! 😊</div>
    </PhonePage>
  );
}

function PhonePage({ children }) {
  return <main style={styles.page}><div style={styles.phone}>{children}</div></main>;
}

function TopBar({ onBack, title, share }) {
  return (
    <div style={styles.topBar}>
      <button style={styles.iconButton} onClick={onBack}>‹</button>
      <b>{title}</b>
      <button style={styles.iconButton} onClick={share || (() => {})}>{share ? "↗" : ""}</button>
    </div>
  );
}

function Hero({ title, subtitle }) {
  return (
    <section style={styles.hero}>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.subtitle}>{subtitle}</p>
    </section>
  );
}

function Badge({ children }) {
  return <span style={styles.badge}>{children}</span>;
}

function Card({ children }) {
  return <section style={styles.card}>{children}</section>;
}

function ResultCard({ children }) {
  return <section style={styles.resultCard}>{children}</section>;
}

function MenuButton({ emoji, title, desc, onClick }) {
  return (
    <button style={styles.menuButton} onClick={onClick}>
      <span style={styles.menuEmoji}>{emoji}</span>
      <div><b>{title}</b><p>{desc}</p></div>
      <span style={styles.arrow}>›</span>
    </button>
  );
}

function MiniTitle({ emoji, text }) {
  return <h2 style={styles.cardTitle}>{emoji} {text}</h2>;
}

function TextInput({ label, placeholder, value, onChange }) {
  return (
    <>
      <label style={styles.label}>{label}</label>
      <input style={styles.input} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </>
  );
}

function BirthInput({ year, month, day, onYear, onMonth, onDay }) {
  return (
    <>
      <label style={styles.label}>생년월일</label>
      <div style={styles.birthRow}>
        <input style={styles.smallInput} placeholder="1998" value={year} inputMode="numeric" maxLength={4} onChange={(e) => onYear(e.target.value)} />
        <span>년</span>
        <input style={styles.smallInput} placeholder="05" value={month} inputMode="numeric" maxLength={2} onChange={(e) => onMonth(e.target.value)} />
        <span>월</span>
        <input style={styles.smallInput} placeholder="14" value={day} inputMode="numeric" maxLength={2} onChange={(e) => onDay(e.target.value)} />
        <span>일</span>
      </div>
    </>
  );
}

function SelectInput({ label, value, onChange }) {
  return (
    <>
      <label style={styles.label}>{label}</label>
      <select style={styles.input} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">MBTI를 선택해줘</option>
        {mbtiList.map((x) => <option key={x}>{x}</option>)}
      </select>
    </>
  );
}

function SavedPicker({ people, label, onSelect }) {
  if (!people.length) return null;
  return (
    <>
      <label style={styles.label}>{label}</label>
      <select style={styles.input} onChange={(e) => e.target.value && onSelect(e.target.value)}>
        <option value="">저장된 사람 선택</option>
        {people.map((p) => <option key={p.name} value={p.name}>{p.name} · {p.mbti}</option>)}
      </select>
    </>
  );
}

function Divider() {
  return <div style={styles.divider}></div>;
}

function Turtle({ face, speech }) {
  return (
    <div style={styles.turtleWrap}>
      <div style={styles.turtle}>{face}</div>
      <div style={styles.speech}>{speech}</div>
    </div>
  );
}

function ScoreBox({ score, text }) {
  return (
    <div style={styles.scoreBox}>
      <p style={styles.scoreLabel}>궁합 점수</p>
      <h2 style={styles.score}>{score}%</h2>
      <p style={styles.scoreText}>{text}</p>
      <div style={styles.barBg}><div style={{ ...styles.bar, width: `${score}%` }}></div></div>
      <div style={styles.barGuide}><span>0%</span><span>20%</span><span>40%</span><span>60%</span><span>80%</span><span>100%</span></div>
    </div>
  );
}

function ScoreList({ love, talk, mood, future }) {
  const rows = [
    ["💘", "사랑 궁합", "서로에게 끌리는 강도", love, "#ff5c5c"],
    ["💬", "대화 궁합", "대화가 잘 통하는 정도", talk, "#3b82f6"],
    ["✨", "성향 궁합", "성격과 가치관의 조화", mood, "#78b82a"],
    ["🐢", "미래 궁합", "함께할 미래의 가능성", future, "#3b82f6"],
  ];

  return <div style={styles.scoreList}>{rows.map(([i,l,d,v,c]) => (
    <div style={styles.scoreRow} key={l}><span style={styles.scoreIcon}>{i}</span><div><b>{l}</b><p>{d}</p></div><strong style={{ color:c }}>{v}%</strong></div>
  ))}</div>;
}

function LockedPreview({ paid, children }) {
  return (
    <div style={styles.lockWrap}>
      <div style={paid ? styles.unlocked : styles.blurred}>{children}</div>
      {!paid && (
        <div style={styles.blurOverlay}>
          <b>상세 해석은 유료로 열람 가능</b>
          <p>사주표, MBTI표, 이유, 예시까지 전부 풀어줄게.</p>
        </div>
      )}
    </div>
  );
}

function SajuTable({ data }) {
  return (
    <div style={styles.tableBox}>
      <h3>🔮 사주표</h3>
      <div style={styles.sajuGrid}>{data.map((x) => <div style={styles.sajuCell} key={x.label}><small>{x.label}</small><b>{x.value}</b></div>)}</div>
    </div>
  );
}

function MbtiTable({ data }) {
  return (
    <div style={styles.tableBox}>
      <h3>💬 MBTI 궁합표</h3>
      {data.map((x) => <div style={styles.mbtiRow} key={x.label}><b>{x.label}</b><span>{x.value}</span></div>)}
    </div>
  );
}

function Section({ title, text }) {
  return (
    <section style={styles.section}>
      <h3>{title}</h3>
      <p style={styles.sectionText}><BoldText text={text} /></p>
    </section>
  );
}

function InfoCard({ title, text }) {
  return <div style={styles.infoCard}><h3>{title}</h3><p><BoldText text={text} /></p></div>;
}

function BoldText({ text }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return <>{parts.map((p, i) => p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>)}</>;
}

function makeScore(form) {
  const text = Object.values(form).join("");
  let sum = 0;
  for (let i = 0; i < text.length; i++) sum += text.charCodeAt(i);
  return 50 + (sum % 51);
}

function clamp(n) { return Math.max(0, Math.min(100, n)); }

function getTurtle(score) {
  if (score >= 90) return { face: "🐢😍", speech: "와아!", text: "생각보다 엄청 잘 맞는 조합이야!" };
  if (score >= 80) return { face: "🐢😲", speech: "와아!", text: "생각보다 엄청 잘 맞는 조합이야!" };
  if (score >= 70) return { face: "🐢😊", speech: "괜찮은데?", text: "좋은데 조율 못 하면 삐끗함!" };
  return { face: "🐢😵", speech: "조심해!", text: "초반 끌림만 믿으면 다칠 수 있음!" };
}

function makeSajuTable(form) {
  const stems = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
  const branches = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
  const seed = makeScore(form);
  return ["년주", "월주", "일주", "시주", "상대 년주", "상대 월주", "상대 일주", "관계 흐름"].map((label, i) => ({
    label,
    value: `${stems[(seed + i) % 10]}${branches[(seed + i * 2) % 12]}`,
  }));
}

function makeMbtiTable(form) {
  return [
    { label: "내 성향", value: `${form.myMbti} · 감정 처리와 표현 방식` },
    { label: "상대 성향", value: `${form.partnerMbti} · 관계에서 안정감을 느끼는 방식` },
    { label: "끌림 포인트", value: "다른 점이 처음엔 신선하게 느껴지는 조합" },
    { label: "충돌 포인트", value: "연락, 말투, 서운함을 푸는 속도 차이" },
    { label: "예시", value: "한쪽은 바로 풀고 싶고, 한쪽은 혼자 정리해야 편해질 수 있음" },
  ];
}

function makeLongPaidText(score, form) {
  const strong = score >= 80;

  return {
    saju:
      `사주 흐름으로 보면 이 조합은 단순히 좋다, 나쁘다로 끊기 어려워. 두 사람의 흐름이 만나는 방식이 꽤 뚜렷해. 특히 **처음 만난 달의 기운**이 중요하게 작용하는데, 이 시점이 둘 사이의 인상과 감정 속도를 빠르게 만들 가능성이 있어.\n\n` +
      `사주표에서 중요한 건 글자 자체보다 **서로의 기운이 어떻게 반응하느냐**야. 한쪽은 관계를 밀어붙이는 기운이 강하고, 다른 한쪽은 상황을 보면서 천천히 움직이는 기운이 있어. 그래서 초반에는 끌림이 생기기 쉽지만, 시간이 지나면 속도 차이가 보일 수 있음.\n\n` +
      `좋은 점은 서로에게 부족한 부분을 자극할 수 있다는 거야. 한쪽이 감정을 열게 만들고, 다른 한쪽이 현실감을 잡아주는 구조가 될 수 있어. 이게 잘 맞으면 서로가 서로를 성장시키는 관계가 돼.\n\n` +
      `다만 위험한 건 **감정의 온도 차이**야. 한쪽이 이미 마음이 깊어졌는데 다른 한쪽이 아직 상황을 보는 중이면 서운함이 커질 수 있어. 그래서 이 조합은 감정 확인을 너무 자주 하면 피곤해지고, 반대로 너무 숨기면 오해가 커져.\n\n` +
      `결론적으로 사주 흐름상 이 관계는 ${strong ? "**끌림과 지속 가능성이 모두 있는 편**" : "**끌림은 있지만 관리가 필요한 편**"}이야. 핵심은 감정을 빨리 증명하려 하지 말고, 행동이 꾸준한지 보는 거야.`,

    mbti:
      `MBTI 궁합으로 보면 둘 사이의 핵심은 **표현 방식의 차이**야. 같은 감정을 느껴도 드러내는 방식이 다를 수 있어. 누군가는 바로 말하고 확인받아야 편하고, 누군가는 혼자 정리한 뒤에야 말할 수 있어.\n\n` +
      `이 차이가 처음에는 매력으로 느껴질 수 있어. “나랑 달라서 신기하다”, “저 사람은 왜 저렇게 생각하지?” 같은 호기심이 생기거든. 그런데 시간이 지나면 같은 차이가 스트레스가 될 수도 있어. 특히 연락 텀, 대답 길이, 약속 잡는 방식에서 차이가 크게 느껴질 수 있음.\n\n` +
      `예를 들면 한쪽은 “왜 답장이 짧지?”라고 느끼는데, 다른 한쪽은 그냥 바빠서 짧게 보낸 걸 수 있어. 또는 한쪽은 서운함을 바로 풀고 싶은데, 다른 한쪽은 감정이 가라앉은 뒤에 얘기해야 제대로 말할 수 있어. 이걸 모르면 서로를 무관심하거나 예민한 사람으로 오해하게 돼.\n\n` +
      `그래서 이 관계는 대화가 잘 맞을 때는 진짜 빠르게 가까워질 수 있지만, 싸울 때는 말투 하나로 크게 틀어질 수 있어. 핵심은 **상대의 반응 속도를 사랑의 크기로 착각하지 않는 것**이야.\n\n` +
      `MBTI 기준으로 이 조합은 ${strong ? "**다른 점이 매력으로 작동할 가능성이 높은 조합**" : "**다른 점이 피로로 바뀌지 않게 관리해야 하는 조합**"}이야.`,

    example:
      `예시로 보면 이런 식이야. 한쪽이 “오늘 뭐해?”라고 물었는데 상대가 “그냥”이라고 답했다고 해보자. 여기서 한쪽은 바로 ‘나랑 말하기 싫은가?’라고 생각할 수 있어. 그런데 상대 입장에서는 진짜 별생각 없이 짧게 답했을 가능성이 있어.\n\n` +
      `또 다른 예시는 싸움 이후야. 한쪽은 바로 통화해서 풀고 싶고, 다른 한쪽은 하루 정도 혼자 있어야 말이 정리돼. 이때 바로 풀고 싶은 쪽은 상대가 도망간다고 느끼고, 혼자 있고 싶은 쪽은 압박받는다고 느낄 수 있어.\n\n` +
      `이 관계가 오래 가려면 “왜 바로 말 안 해?”보다 “지금 이야기할 수 있어, 아니면 조금 있다가 말할까?”가 훨씬 좋아. 이 한 문장만 바꿔도 관계 피로도가 확 줄어들 수 있어.`,

    final:
      `최종적으로 이 관계는 감정이 없는 조합은 아니야. 오히려 신경 쓰이는 힘은 분명히 있어. 다만 **끌림이 곧 안정감은 아니다**라는 걸 알아야 해.\n\n` +
      `좋아하는 마음이 있어도 표현 방식이 다르면 서로를 오해할 수 있어. 그래서 이 관계는 감정보다 태도, 말보다 반복되는 행동을 봐야 해. 꾸준히 같은 방향으로 행동하는 사람이면 가능성이 있고, 말은 좋은데 행동이 들쑥날쑥하면 감정 소모가 커질 수 있어.\n\n` +
      `거북이 결론은 이거야. ${strong ? "**갈 수 있다. 대신 솔직해야 오래 간다.**" : "**끌림만 믿고 가면 힘들 수 있다. 천천히 확인해라.**"}`,
  };
}

const styles = {
  page: {
    minHeight: "100dvh",
    width: "100%",
    background: "#fff3a8",
    display: "flex",
    justifyContent: "center",
    color: "#241100",
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    overflowX: "hidden",
  },
  phone: {
    width: "100%",
    maxWidth: 430,
    minHeight: "100dvh",
    background: "linear-gradient(180deg,#fff5a8 0%,#fff0a0 48%,#fff8dc 100%)",
    padding: "14px",
    boxSizing: "border-box",
    position: "relative",
    overflowX: "hidden",
  },
  topHome: { display: "flex", justifyContent: "space-between", alignItems: "center", height: 34 },
  hamburger: { fontSize: 22 },
  topBar: { display: "grid", gridTemplateColumns: "42px 1fr 42px", alignItems: "center", textAlign: "center", marginBottom: 6 },
  iconButton: { border: 0, background: "transparent", fontSize: 28, color: "#241100", cursor: "pointer" },
  badge: { background: "white", padding: "7px 15px", borderRadius: 999, fontWeight: 900, boxShadow: "0 8px 22px rgba(120,80,0,.12)" },
  hero: { textAlign: "center", padding: "8px 6px 0" },
  title: { whiteSpace: "pre-line", fontSize: 32, lineHeight: 1.15, margin: "14px 0 10px", fontWeight: 950, letterSpacing: "-1px" },
  subtitle: { margin: 0, lineHeight: 1.55, fontWeight: 800 },
  turtleHero: { height: 162, position: "relative", textAlign: "center" },
  heroTurtle: { fontSize: 92, paddingTop: 24, position: "relative", zIndex: 2 },
  cloudLeft: { position: "absolute", width: 170, height: 74, borderRadius: 999, background: "rgba(255,255,255,.78)", left: -88, bottom: 0 },
  cloudRight: { position: "absolute", width: 170, height: 74, borderRadius: 999, background: "rgba(255,255,255,.78)", right: -88, bottom: 0 },
  card: { background: "rgba(255,255,255,.92)", borderRadius: 24, padding: 20, boxShadow: "0 18px 45px rgba(100,70,0,.12)" },
  resultCard: { background: "rgba(255,255,255,.94)", borderRadius: 24, padding: 18, boxShadow: "0 18px 45px rgba(100,70,0,.12)" },
  menuButton: { width: "100%", display: "grid", gridTemplateColumns: "38px 1fr 22px", alignItems: "center", gap: 10, border: "1px solid #efdca9", borderRadius: 18, padding: 15, marginBottom: 12, background: "white", textAlign: "left", color: "#241100" },
  menuEmoji: { fontSize: 28 },
  arrow: { fontSize: 28, color: "#b48100" },
  bottomTurtle: { background: "white", display: "inline-block", padding: "12px 16px", borderRadius: 22, marginTop: 18, fontWeight: 800 },
  cardTitle: { margin: "0 0 14px", fontSize: 21 },
  label: { display: "block", margin: "13px 0 8px", fontWeight: 900 },
  input: { width: "100%", boxSizing: "border-box", border: "1px solid #efdca9", borderRadius: 14, padding: 14, background: "#fffef9", color: "#241100", fontSize: 16 },
  birthRow: { display: "grid", gridTemplateColumns: "1fr 22px .75fr 22px .75fr 22px", gap: 7, alignItems: "center" },
  metRow: { display: "grid", gridTemplateColumns: "1fr 22px .75fr 22px", gap: 7, alignItems: "center" },
  smallInput: { width: "100%", boxSizing: "border-box", border: "1px solid #efdca9", borderRadius: 14, padding: "13px 8px", textAlign: "center", background: "#fffef9", color: "#241100", fontSize: 16 },
  divider: { borderTop: "1px dashed #e7c76e", margin: "24px 0" },
  mainButton: { width: "100%", border: 0, borderRadius: 22, padding: 16, marginTop: 22, background: "linear-gradient(135deg,#ffd84d,#f6b900)", color: "#241100", fontWeight: 950, fontSize: 17 },
  turtleWrap: { textAlign: "center" },
  turtle: { fontSize: 92 },
  speech: { display: "inline-block", background: "white", borderRadius: 999, padding: "8px 15px", fontWeight: 950, boxShadow: "0 8px 20px rgba(120,80,0,.12)" },
  resultTitle: { textAlign: "center", fontSize: 28, lineHeight: 1.2 },
  scoreBox: { textAlign: "center", background: "white", borderRadius: 24, padding: 18, margin: "16px 0" },
  scoreLabel: { margin: 0, fontWeight: 900 },
  score: { fontSize: 68, margin: "4px 0", lineHeight: 1, fontWeight: 950 },
  scoreText: { fontWeight: 900 },
  barBg: { height: 14, background: "#f1ead6", borderRadius: 999, overflow: "hidden" },
  bar: { height: "100%", background: "linear-gradient(90deg,#ffd84d,#f6b900)" },
  barGuide: { display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 8 },
  scoreList: { display: "grid", gap: 10, margin: "16px 0" },
  scoreRow: { display: "grid", gridTemplateColumns: "38px 1fr 58px", gap: 8, alignItems: "center", background: "white", border: "1px solid #efdca9", borderRadius: 17, padding: 13 },
  scoreIcon: { fontSize: 25 },
  lockWrap: { position: "relative", marginTop: 16 },
  blurred: { filter: "blur(6px)", pointerEvents: "none", userSelect: "none", maxHeight: 520, overflow: "hidden" },
  unlocked: { filter: "none" },
  blurOverlay: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: 20, background: "rgba(255,255,255,.45)", borderRadius: 20, fontWeight: 900 },
  tableBox: { background: "#fffdf6", border: "1px solid #efdca9", borderRadius: 20, padding: 15, marginBottom: 14 },
  sajuGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 },
  sajuCell: { background: "white", border: "1px solid #efdca9", borderRadius: 13, padding: 10, textAlign: "center" },
  mbtiRow: { display: "grid", gridTemplateColumns: "92px 1fr", gap: 10, padding: "11px 0", borderTop: "1px dashed #e7c76e" },
  section: { borderTop: "1px dashed #e7c76e", padding: "18px 0" },
  sectionText: { whiteSpace: "pre-line", lineHeight: 1.78, margin: 0, fontSize: 16 },
  infoCard: { background: "#fffdf6", border: "1px solid #efdca9", borderRadius: 18, padding: 15, margin: "12px 0" },
  payButton: { width: "100%", border: 0, borderRadius: 22, padding: 16, marginTop: 18, background: "linear-gradient(135deg,#ffd84d,#f6b900)", color: "#241100", fontWeight: 950, fontSize: 17 },
  subButton: { width: "100%", border: "1px solid #efdca9", borderRadius: 22, padding: 15, marginTop: 12, background: "white", color: "#241100", fontWeight: 900, fontSize: 16 },
};