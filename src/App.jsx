import { useEffect, useMemo, useState } from "react";

const KAKAO_JS_KEY = "392f84c5486937d26780349c72b4a1d8";
const SITE_URL = "https://oursai.vercel.app";

const mbtiList = [
  "ISTJ", "ISFJ", "INFJ", "INTJ",
  "ISTP", "ISFP", "INFP", "INTP",
  "ESTP", "ESFP", "ENFP", "ENTP",
  "ESTJ", "ESFJ", "ENFJ", "ENTJ",
];

const relationshipList = ["친구(썸)", "연애 중", "짝사랑"];

const fortuneList = [
  {
    mood: "감정이 먼저 튀는 날",
    song: "Laufey - From The Start",
    youtubeId: "lSD_L-xic9o",
    topic: "요즘 별 이유 없이 계속 생각나는 사람이 있어?",
    advice:
      "오늘은 상대 마음을 맞히려고 하면 할수록 더 피곤해지는 날이야. 답장 하나, 말투 하나에 의미를 너무 많이 붙이면 네 감정만 먼저 닳아. 오늘은 길게 설명하지 말고, 가볍게 던지고 반응을 보는 게 맞아.",
  },
  {
    mood: "정리해야 하는 날",
    song: "아이유 - Love wins all",
    youtubeId: "JleoAppaxi0",
    topic: "너는 사람한테 정 떨어지는 순간이 뭐야?",
    advice:
      "붙잡는다고 다 인연은 아니야. 오늘은 사람을 정리한다기보다 네 에너지가 새는 구멍을 막는 날에 가까워. 애매한 관계에 너무 많은 시간을 쓰고 있다면, 오늘은 한 발 빼는 게 오히려 이기는 선택이야.",
  },
  {
    mood: "관계운이 강한 날",
    song: "NewJeans - Ditto",
    youtubeId: "pSUydWEqKwE",
    topic: "처음엔 별로였는데 갑자기 좋아진 사람 있어?",
    advice:
      "오늘은 먼저 말 걸어도 이상하지 않은 날이야. 대신 무겁게 들어가면 안 됨. 가볍게 시작해야 오래 이어져. 오늘 생기는 대화는 별거 아닌 것 같아도 나중에 꽤 중요한 연결점이 될 수 있어.",
  },
];

export default function App() {
  const [mode, setMode] = useState("home");
  const [paidOpen, setPaidOpen] = useState(false);

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

  const fortuneResult = useMemo(() => {
    const seed =
      Number(fortune.year || 0) +
      Number(fortune.month || 0) * 3 +
      Number(fortune.day || 1) * 7 +
      new Date().getDate();

    return fortuneList[seed % fortuneList.length];
  }, [fortune]);

  const result = useMemo(() => {
    const score = makeScore(form);
    const months = getMonthDiff(form.metYear, form.metMonth);

    return {
      score,
      turtle: getTurtle(score),
      title: getTitle(score),
      months,
      mbtiLine: makeMbtiLine(form.myMbti, form.partnerMbti, score),
      sajuLine: makeSajuLine(form.myYear, form.partnerYear, form.metMonth, score),
      paid: makePaidResult(score, months, form.relationship),
      love: clamp(score + 8),
      talk: clamp(score - 12),
      mood: clamp(score - 4),
      future: clamp(score + 2),
    };
  }, [form]);

  const savePerson = (person) => {
    if (!person.name) return;
    if (savedPeople.find((p) => p.name === person.name)) return;
    setSavedPeople([...savedPeople, person]);
  };

  const loadPersonToFortune = (name) => {
    const p = savedPeople.find((x) => x.name === name);
    if (!p) return;
    setFortune(p);
  };

  const loadPersonToForm = (target, name) => {
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

  const updateFortuneNumber = (key, value, max) => {
    setFortune({ ...fortune, [key]: value.replace(/\D/g, "").slice(0, max) });
  };

  const updateFormNumber = (key, value, max) => {
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

  const showCompatibility = () => {
    const required = [
      "myName",
      "myYear",
      "myMonth",
      "myDay",
      "myMbti",
      "partnerName",
      "partnerYear",
      "partnerMonth",
      "partnerDay",
      "partnerMbti",
      "metYear",
      "metMonth",
    ];

    if (required.some((key) => !form[key])) {
      alert("빈칸을 다 입력해줘.");
      return;
    }

    savePerson({
      name: form.myName,
      year: form.myYear,
      month: form.myMonth,
      day: form.myDay,
      mbti: form.myMbti,
    });

    savePerson({
      name: form.partnerName,
      year: form.partnerYear,
      month: form.partnerMonth,
      day: form.partnerDay,
      mbti: form.partnerMbti,
    });

    setMode("result");
  };

  const shareResult = async () => {
    const shareText = "우리 사이에서 궁합 봤는데 거북이가 말 너무 세게 함 🐢💛";

    try {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_JS_KEY);
        }

        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: "우리 사이 🐢💛",
            description: "귀여운 거북이가 봐주는 궁합. 근데 말은 생각보다 맵다.",
            imageUrl:
              "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?q=80&w=1200&auto=format&fit=crop",
            link: {
              mobileWebUrl: SITE_URL,
              webUrl: SITE_URL,
            },
          },
          buttons: [
            {
              title: "궁합 보러가기",
              link: {
                mobileWebUrl: SITE_URL,
                webUrl: SITE_URL,
              },
            },
          ],
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }

    if (navigator.share) {
      await navigator.share({
        title: "우리 사이",
        text: shareText,
        url: SITE_URL,
      });
      return;
    }

    await navigator.clipboard.writeText(SITE_URL);
    alert("링크 복사했어!");
  };

  if (mode === "fortune") {
    return (
      <Page>
        <TopBar onBack={() => setMode("home")} />
        <Hero
          title={"오늘의 운세,\n거북이가 봐줄게"}
          subtitle="오늘의 노래랑 대화주제까지 같이 추천해줄게!"
        />

        <Card>
          <MiniTitle emoji="☀️" text="내 정보" />

          <SavedPicker
            people={savedPeople}
            label="저장된 정보 불러오기"
            onSelect={loadPersonToFortune}
          />

          <label style={styles.label}>이름</label>
          <input
            style={styles.input}
            placeholder="이름을 입력해줘"
            value={fortune.name}
            onChange={(e) => setFortune({ ...fortune, name: e.target.value })}
          />

          <BirthInput
            year={fortune.year}
            month={fortune.month}
            day={fortune.day}
            onYear={(v) => updateFortuneNumber("year", v, 4)}
            onMonth={(v) => updateFortuneNumber("month", v, 2)}
            onDay={(v) => updateFortuneNumber("day", v, 2)}
          />

          <SelectInput
            label="MBTI"
            value={fortune.mbti}
            onChange={(v) => setFortune({ ...fortune, mbti: v })}
          />

          <button style={styles.mainButton} onClick={showFortune}>
            오늘의 운세 보기 🐢
          </button>
        </Card>
      </Page>
    );
  }

  if (mode === "fortuneResult") {
    return (
      <Page>
        <TopBar onBack={() => setMode("home")} />

        <ResultCard>
          <Turtle face="🐢🎧" speech="노래 틀고 읽어!" />
          <Badge>오늘의 운세</Badge>
          <h1 style={styles.resultTitle}>{fortune.name}의 오늘 흐름</h1>

          <SongBox
            song={fortuneResult.song}
            youtubeId={fortuneResult.youtubeId}
            reason={fortuneResult.songReason}
          />

          <Section title="🔥 오늘 운세" text={fortuneResult.advice} />

          <RecommendBox
            emoji="💬"
            title="오늘의 대화주제"
            main={fortuneResult.topic}
            sub="가볍게 던져도 대화가 깊어지는 질문이야."
          />

          <button style={styles.subButton} onClick={shareResult}>
            공유하기
          </button>
        </ResultCard>
      </Page>
    );
  }

  if (mode === "saju" || mode === "mbti") {
    const isSaju = mode === "saju";

    return (
      <Page>
        <TopBar onBack={() => setMode("home")} />
        <Hero
          title={isSaju ? "사주로 궁합 보기" : "MBTI로 궁합 보기"}
          subtitle={
            isSaju
              ? "생년월일과 처음 만난 달을 중심으로 봐줄게."
              : "MBTI와 관계 상태를 중심으로 봐줄게."
          }
        />

        <Card>
          <MiniTitle emoji="💛" text="내 정보" />

          <SavedPicker
            people={savedPeople}
            label="저장된 내 정보 불러오기"
            onSelect={(name) => loadPersonToForm("me", name)}
          />

          <label style={styles.label}>내 이름</label>
          <input
            style={styles.input}
            placeholder="이름을 입력해줘"
            value={form.myName}
            onChange={(e) => setForm({ ...form, myName: e.target.value })}
          />

          <BirthInput
            year={form.myYear}
            month={form.myMonth}
            day={form.myDay}
            onYear={(v) => updateFormNumber("myYear", v, 4)}
            onMonth={(v) => updateFormNumber("myMonth", v, 2)}
            onDay={(v) => updateFormNumber("myDay", v, 2)}
          />

          <SelectInput
            label="내 MBTI"
            value={form.myMbti}
            onChange={(v) => setForm({ ...form, myMbti: v })}
          />

          <Divider />

          <MiniTitle emoji="🐢" text="상대 정보" />

          <SavedPicker
            people={savedPeople}
            label="저장된 상대 정보 불러오기"
            onSelect={(name) => loadPersonToForm("partner", name)}
          />

          <label style={styles.label}>상대 이름</label>
          <input
            style={styles.input}
            placeholder="상대 이름을 입력해줘"
            value={form.partnerName}
            onChange={(e) => setForm({ ...form, partnerName: e.target.value })}
          />

          <BirthInput
            year={form.partnerYear}
            month={form.partnerMonth}
            day={form.partnerDay}
            onYear={(v) => updateFormNumber("partnerYear", v, 4)}
            onMonth={(v) => updateFormNumber("partnerMonth", v, 2)}
            onDay={(v) => updateFormNumber("partnerDay", v, 2)}
          />

          <SelectInput
            label="상대 MBTI"
            value={form.partnerMbti}
            onChange={(v) => setForm({ ...form, partnerMbti: v })}
          />

          <Divider />

          <MiniTitle emoji="💕" text="우리 관계" />

          <label style={styles.label}>처음 만난 달</label>
          <div style={styles.metRow}>
            <input
              style={styles.smallInput}
              placeholder="2024"
              value={form.metYear}
              onChange={(e) => updateFormNumber("metYear", e.target.value, 4)}
            />
            <span>년</span>
            <input
              style={styles.smallInput}
              placeholder="11"
              value={form.metMonth}
              onChange={(e) => updateFormNumber("metMonth", e.target.value, 2)}
            />
            <span>월</span>
          </div>

          <label style={styles.label}>현재 관계</label>
          <select
            style={styles.input}
            value={form.relationship}
            onChange={(e) => setForm({ ...form, relationship: e.target.value })}
          >
            {relationshipList.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <button style={styles.mainButton} onClick={showCompatibility}>
            우리 사이 분석하기 🐢
          </button>
        </Card>
      </Page>
    );
  }

  if (mode === "result") {
    return (
      <Page>
        <TopBar onBack={() => setMode("home")} />

        <ResultCard>
          <Turtle face={result.turtle.face} speech={result.turtle.speech} />
          <Badge>우리 사이 분석 결과</Badge>

          <h1 style={styles.resultTitle}>{result.title}</h1>

          <ScoreBox score={result.score} text={result.turtle.text} />

          <FreeTable mbtiLine={result.mbtiLine} sajuLine={result.sajuLine} />

          <button style={styles.payButton} onClick={() => setPaidOpen(true)}>
            🔒 전체 상세 분석 보기 · 990원
          </button>

          <button style={styles.subButton} onClick={shareResult}>
            공유하기
          </button>
        </ResultCard>

        {paidOpen && (
          <PaidModal
            result={result}
            onClose={() => setPaidOpen(false)}
            onShare={shareResult}
          />
        )}
      </Page>
    );
  }

  return (
    <Page>
      <div style={styles.topNav}>
        <span style={styles.menuIcon}>☰</span>
        <Badge>우리 사이 ❤</Badge>
      </div>

      <Hero
        title={"너희 사이,\n얼마나 특별할까?"}
        subtitle="귀여운 거북이가 봐주는데, 말은 생각보다 맵다!"
      />

      <div style={styles.turtleArea}>
        <div style={styles.cloudLeft} />
        <div style={styles.cloudRight} />
        <div style={styles.heroTurtle}>🐢💗</div>
      </div>

      <Card>
        <MenuButton
          emoji="☀️"
          title="오늘의 운세"
          desc="오늘의 흐름 + 노래 + 대화주제"
          onClick={() => setMode("fortune")}
        />
        <MenuButton
          emoji="🔮"
          title="사주로 궁합 보기"
          desc="생년월일과 처음 만난 달 중심"
          onClick={() => setMode("saju")}
        />
        <MenuButton
          emoji="💬"
          title="MBTI로 궁합 보기"
          desc="성향, 대화 방식, 감정 표현 중심"
          onClick={() => setMode("mbti")}
        />
      </Card>
    </Page>
  );
}

function Page({ children }) {
  return (
    <div style={styles.page}>
      <div style={styles.container}>{children}</div>
    </div>
  );
}

function Hero({ title, subtitle }) {
  return (
    <div style={styles.hero}>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.subtitle}>{subtitle}</p>
    </div>
  );
}

function TopBar({ onBack }) {
  return (
    <button style={styles.backButton} onClick={onBack}>
      ← 뒤로
    </button>
  );
}

function Card({ children }) {
  return <div style={styles.card}>{children}</div>;
}

function ResultCard({ children }) {
  return <div style={styles.resultCard}>{children}</div>;
}

function Badge({ children }) {
  return <p style={styles.badge}>{children}</p>;
}

function MenuButton({ emoji, title, desc, onClick }) {
  return (
    <button style={styles.menuButton} onClick={onClick}>
      <span style={styles.menuEmoji}>{emoji}</span>
      <div>
        <b>{title}</b>
        <p>{desc}</p>
      </div>
      <span style={styles.arrow}>›</span>
    </button>
  );
}

function MiniTitle({ emoji, text }) {
  return (
    <h2 style={styles.cardTitle}>
      {emoji} {text}
    </h2>
  );
}

function Divider() {
  return <div style={styles.divider} />;
}

function SavedPicker({ people, label, onSelect }) {
  if (people.length === 0) return null;

  return (
    <>
      <label style={styles.label}>{label}</label>
      <select style={styles.input} onChange={(e) => e.target.value && onSelect(e.target.value)}>
        <option value="">저장된 사람 선택</option>
        {people.map((p) => (
          <option key={p.name} value={p.name}>
            {p.name} · {p.mbti}
          </option>
        ))}
      </select>
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
        {mbtiList.map((mbti) => (
          <option key={mbti}>{mbti}</option>
        ))}
      </select>
    </>
  );
}

function Turtle({ face, speech }) {
  return (
    <div style={styles.turtleWrap}>
      <div style={styles.turtle}>{face}</div>
      <div style={styles.speech}>{speech}</div>
    </div>
  );
}

function SongBox({ song, reason, youtubeId }) {
  return (
    <div style={styles.songBox}>
      <p style={styles.songLabel}>🎧 오늘의 노래 먼저</p>
      <h2 style={styles.songTitle}>{song}</h2>
      <p style={styles.songReason}>{reason}</p>
      <div style={styles.videoWrap}>
        <iframe
          width="100%"
          height="220"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={song}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function ScoreBox({ score, text }) {
  return (
    <div style={styles.scoreBox}>
      <p style={styles.scoreLabel}>궁합 점수</p>
      <h2 style={styles.score}>{score}%</h2>
      <p style={styles.scoreText}>{text}</p>
      <div style={styles.barBg}>
        <div style={{ ...styles.bar, width: `${score}%` }} />
      </div>
      <div style={styles.barGuide}>
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

function FreeTable({ mbtiLine, sajuLine }) {
  return (
    <div style={styles.freeTable}>
      <h3>무료 한줄 궁합</h3>
      <div style={styles.tableRow}>
        <span>💬 MBTI</span>
        <b>{mbtiLine}</b>
      </div>
      <div style={styles.tableRow}>
        <span>🔮 사주</span>
        <b>{sajuLine}</b>
      </div>
      <p style={styles.lockText}>자세한 이유와 해석은 전체 상세 분석에서 볼 수 있어.</p>
    </div>
  );
}

function Section({ title, text }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      <p style={styles.sectionText}>
        <BoldText text={text} />
      </p>
    </div>
  );
}

function BoldText({ text }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function RecommendBox({ emoji, title, main, sub }) {
  return (
    <div style={styles.recommendBox}>
      <p style={styles.recommendEmoji}>{emoji}</p>
      <h3>{title}</h3>
      <p style={styles.recommendMain}>{main}</p>
      <p style={styles.recommendSub}>{sub}</p>
    </div>
  );
}

function PaidModal({ result, onClose, onShare }) {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <button style={styles.modalClose} onClick={onClose}>×</button>

        <h2>전체 상세 분석</h2>
        <p style={styles.modalSub}>카카오페이 990원 결제 후 열리는 화면 예시</p>

        <Section title="💘 사랑 궁합" text={result.paid.love} />
        <Section title="💬 대화 궁합" text={result.paid.talk} />
        <Section title="✨ 성향 궁합" text={result.paid.mood} />
        <Section title="🐢 미래 궁합" text={result.paid.future} />
        <Section title="⏰ 관계 흐름" text={result.paid.time} />
        <Section title="✅ 결론" text={result.paid.final} />

        <button style={styles.kakaoPayButton} onClick={() => alert("다음 단계에서 카카오페이 단건결제 API 연결")}>
          카카오페이로 990원 결제하기
        </button>

        <button style={styles.subButton} onClick={onShare}>
          공유하기
        </button>
      </div>
    </div>
  );
}

function makeScore(form) {
  const text = Object.values(form).join("");
  let sum = 0;
  for (let i = 0; i < text.length; i++) sum += text.charCodeAt(i);
  return 50 + (sum % 51);
}

function clamp(n) {
  return Math.max(0, Math.min(100, n));
}

function getTurtle(score) {
  if (score >= 90) return { face: "🐢😍", speech: "와아!", text: "눈에 하트 뜨는 조합!" };
  if (score >= 80) return { face: "🐢😲", speech: "와아!", text: "생각보다 엄청 잘 맞는 조합이야!" };
  if (score >= 70) return { face: "🐢😊", speech: "괜찮은데?", text: "좋은데 조율 못 하면 삐끗함!" };
  if (score >= 60) return { face: "🐢😐", speech: "음...", text: "끌림은 있는데 피곤한 포인트도 있음!" };
  return { face: "🐢😵", speech: "조심해!", text: "초반 끌림만 믿으면 다칠 수 있음!" };
}

function getTitle(score) {
  if (score >= 90) return "이건 솔직히 쉽게 안 끝나는 조합!";
  if (score >= 80) return "끌림이 꽤 강한데, 속도만 맞추면 터지는 조합!";
  if (score >= 70) return "좋긴 한데, 감정 표현 방식이 다른 조합!";
  if (score >= 60) return "좋아하는 마음만으로는 좀 피곤한 조합!";
  return "끌림보다 상처가 더 커질 수 있는 조합!";
}

function getMonthDiff(year, month) {
  if (!year || !month) return 0;
  const start = new Date(Number(year), Number(month) - 1);
  const now = new Date();
  const diff = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
  return Math.max(0, diff);
}

function makeMbtiLine(myMbti, partnerMbti, score) {
  if (score >= 80) return `${myMbti}와 ${partnerMbti}, 끌림은 강한데 감정 표현 속도는 맞춰야 함.`;
  if (score >= 65) return `${myMbti}와 ${partnerMbti}, 대화는 되는데 서운함을 푸는 방식이 다를 수 있음.`;
  return `${myMbti}와 ${partnerMbti}, 초반 호기심은 있지만 감정 소모가 생기기 쉬움.`;
}

function makeSajuLine(myYear, partnerYear, metMonth, score) {
  const gap = Math.abs(Number(myYear) - Number(partnerYear));
  if (score >= 80) return `나이 흐름 ${gap}년 차, 처음 만난 ${metMonth}월 기운이 강하게 붙는 쪽.`;
  if (score >= 65) return `나이 흐름 ${gap}년 차, 끌림은 있는데 생활 리듬 조율이 필요함.`;
  return `나이 흐름 ${gap}년 차, 감정이 앞서면 관계가 쉽게 피곤해질 수 있음.`;
}

function makePaidResult(score, months, relation) {
  const strong = score >= 80;

  return {
    love: strong
      ? "💘 한 줄 요약: **끌림은 강한데, 표현 안 하면 서로 오해함!**\n\n이 조합은 처음부터 은근히 신경 쓰이는 힘이 있어. 그냥 편해서 좋은 게 아니라, 상대의 말투나 반응이 계속 머리에 남는 쪽이야. 이유는 둘 사이의 감정 반응 속도가 빠르기 때문이야. 한쪽이 먼저 설레면 다른 한쪽도 금방 반응할 수 있는데, 문제는 둘 다 그걸 바로 인정하지 않을 가능성이 있다는 거야.\n\n그래서 좋을 때는 확 가까워지지만, 애매하게 굴면 바로 헷갈려져. 좋아하면 티를 내야 하고, 관심 없는 척으로 분위기를 끌면 괜히 상대만 지치게 만들 수 있어. 사랑 궁합은 나쁘지 않은데, 핵심은 **표현을 숨기지 않는 것**이야."
      : "💘 한 줄 요약: **끌리긴 하는데, 감정 소모도 같이 따라옴!**\n\n이 조합은 처음엔 호기심이 생기기 쉬워. 서로가 완전히 비슷해서 편한 관계라기보다, 달라서 신경 쓰이는 쪽에 가까워. 그래서 초반에는 오히려 더 끌릴 수 있음. 하지만 문제는 안정감으로 넘어가는 과정이야.\n\n상대 반응 하나에 기분이 크게 흔들린다면 이건 설렘이라기보다 감정 소모가 될 수 있어. 특히 애매한 답장, 늦은 연락, 말투 변화에 민감해질 가능성이 큼. 좋아하는 마음만으로 밀고 가기보다는 상대의 행동이 꾸준한지 보는 게 중요해.",

    talk: strong
      ? "💬 한 줄 요약: **대화 터지면 밤새는데, 삐지면 둘 다 말 안 함!**\n\n대화 궁합은 꽤 재밌는 편이야. 잘 맞는 날에는 별 얘기 아닌데도 계속 이어지고, 서로 장난도 잘 받을 수 있어. 이유는 둘 사이에 반응을 주고받는 템포가 맞는 구간이 있기 때문이야.\n\n근데 싸울 때가 문제야. 한쪽은 바로 풀고 싶고, 다른 한쪽은 혼자 정리할 시간이 필요할 수 있어. 이 차이를 이해하지 못하면 단답 하나로도 분위기가 확 바뀔 수 있음. 대화 궁합을 오래 좋게 유지하려면 ‘왜 그렇게 말했어?’보다 ‘지금 풀고 싶어, 아니면 시간 필요해?’라고 묻는 게 훨씬 좋아."
      : "💬 한 줄 요약: **말투 하나로 분위기 뒤집힐 수 있음!**\n\n이 조합은 말의 내용보다 말투에 더 예민할 수 있어. 같은 말이어도 차갑게 들리면 바로 서운함으로 넘어갈 가능성이 있음. 이유는 서로 감정을 처리하는 방식이 다르기 때문이야.\n\n한쪽은 확인받고 싶고, 다른 한쪽은 부담을 느낄 수 있어. 이 상태에서 대화를 길게 끌면 해결보다 피로가 먼저 쌓임. 그래서 이 관계는 긴 설명보다 짧고 정확한 표현이 더 잘 맞아. 애매하게 돌려 말하면 오히려 더 꼬일 수 있어.",

    mood: strong
      ? "✨ 한 줄 요약: **다른데, 그 다름이 매력으로 보일 수 있음!**\n\n성향 궁합은 흥미로운 편이야. 둘이 완전히 똑같아서 편한 느낌은 아니고, 서로에게 없는 분위기를 주는 조합에 가까워. 한쪽이 감정을 끌어올리면 다른 한쪽이 현실적으로 잡아주는 식이 될 수 있어.\n\n이게 잘 맞으면 둘 다 성장하는 관계가 돼. 하지만 서로를 고치려고 들면 바로 피곤해짐. 중요한 건 ‘왜 나랑 달라?’가 아니라 ‘아, 저 사람은 저렇게 안정감을 느끼는구나’ 하고 받아들이는 거야. 이걸 하면 오래 갈 가능성이 꽤 올라가."
      : "✨ 한 줄 요약: **다른 점이 매력일 수도, 스트레스일 수도 있음!**\n\n성향 차이가 꽤 느껴지는 조합이야. 처음엔 신선하게 느껴질 수 있는데, 시간이 지나면 같은 차이가 스트레스가 될 수 있음. 예를 들면 연락 텀, 약속 방식, 감정 표현, 혼자 있고 싶은 시간 같은 부분에서 차이가 날 수 있어.\n\n이 차이는 틀린 게 아니라 방식이 다른 거야. 그런데 둘 중 한 명이 자기 방식만 맞다고 생각하면 관계가 금방 피곤해져. 이 조합은 설득보다 인정이 중요해. 인정하면 괜찮고, 고치려 하면 힘들어져.",

    future: strong
      ? "🐢 한 줄 요약: **오래 가려면 자존심보다 솔직함이 먼저!**\n\n미래 궁합은 가능성이 있어. 다만 그냥 둬도 알아서 잘 굴러가는 관계는 아니야. 오히려 서로 차이를 알고 맞추면 강해지는 조합이야. 이유는 둘 사이에 끌림과 긴장감이 같이 있기 때문이야.\n\n이런 조합은 초반엔 설레지만, 시간이 지나면 자존심 싸움이 생길 수 있어. 좋으면 좋다고 말하고, 서운하면 서운하다고 말해야 해. 괜찮은 척을 오래 하면 나중에 한 번에 터질 수 있음. 오래 가려면 쿨한 척보다 솔직함이 훨씬 중요해."
      : "🐢 한 줄 요약: **오래 가려면 감정 게임부터 멈춰야 함!**\n\n미래 궁합은 관리가 필요해. 서로에게 끌림은 생길 수 있지만, 그 끌림이 바로 안정적인 관계를 뜻하진 않아. 이유는 감정 확인 욕구와 거리 두기 욕구가 부딪힐 수 있기 때문이야.\n\n밀당이 길어지면 이 관계는 설레는 게 아니라 지치는 쪽으로 갈 가능성이 큼. 누가 더 좋아하냐를 따지기 시작하면 답이 없어. 오래 가고 싶다면 감정 게임을 멈추고 행동의 일관성을 봐야 해.",

    time: `⏰ 한 줄 요약: **처음 만난 지 ${months}개월, 이제 진짜 성향이 보이는 구간!**\n\n처음 만난 지 약 ${months}개월 정도 됐어. 이 시기는 첫인상의 환상은 조금씩 빠지고, 실제 생활 방식과 감정 표현 차이가 보이기 시작하는 시기야.\n\n만난 지 얼마 안 됐다면 아직 설렘이 더 크게 느껴질 수 있고, 6개월 이상이라면 연락, 말투, 약속 방식에서 현실적인 차이가 나타나기 쉬워. 지금부터 중요한 건 감정의 크기보다 태도의 일관성이야.`,

    final: strong
      ? "✅ 결론: **이 조합은 끝까지 갈 수도 있음!**\n\n다만 자연스럽게 알아서 잘 되는 관계는 아니야. 서로 다름을 인정하고, 표현을 아끼지 않아야 오래 갈 수 있어. 좋아하는 마음이 있는데 자존심 때문에 숨기면 진짜 아깝게 틀어질 수 있음. 이 관계는 솔직하게 가면 강해지고, 애매하게 가면 피곤해져."
      : "✅ 결론: **끌림은 있는데 조심해야 함!**\n\n이 관계는 좋을 때는 좋지만, 애매하게 굴면 감정 소모가 커질 수 있어. 상대 반응 하나에 하루가 흔들린다면, 그건 궁합 문제가 아니라 관계 방식 자체를 다시 봐야 하는 신호야. 천천히 가되, 나를 잃으면서까지 맞추진 마.",
  };
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #fff5a8 0%, #fff0a0 42%, #fffdf2 100%)",
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    color: "#2b1700",
    padding: "14px",
  },
  container: {
    maxWidth: 520,
    margin: "0 auto",
  },
  topNav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 36,
  },
  menuIcon: {
    fontSize: 22,
  },
  badge: {
    display: "inline-block",
    margin: 0,
    padding: "8px 16px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.92)",
    color: "#2b1700",
    fontWeight: 900,
    boxShadow: "0 8px 20px rgba(120,80,0,0.12)",
  },
  hero: {
    textAlign: "center",
    paddingTop: 12,
  },
  title: {
    whiteSpace: "pre-line",
    fontSize: 34,
    lineHeight: 1.15,
    letterSpacing: "-1.2px",
    margin: "18px 0 10px",
    fontWeight: 950,
  },
  subtitle: {
    margin: 0,
    lineHeight: 1.55,
    fontWeight: 750,
  },
  turtleArea: {
    position: "relative",
    height: 170,
    textAlign: "center",
    marginTop: 2,
  },
  heroTurtle: {
    position: "relative",
    zIndex: 2,
    fontSize: 92,
    paddingTop: 22,
    filter: "drop-shadow(0 10px 12px rgba(100,70,0,0.18))",
  },
  cloudLeft: {
    position: "absolute",
    left: -80,
    bottom: 8,
    width: 180,
    height: 70,
    borderRadius: 999,
    background: "rgba(255,255,255,0.75)",
  },
  cloudRight: {
    position: "absolute",
    right: -80,
    bottom: 8,
    width: 180,
    height: 70,
    borderRadius: 999,
    background: "rgba(255,255,255,0.75)",
  },
  card: {
    background: "rgba(255,255,255,0.9)",
    borderRadius: 26,
    padding: 22,
    boxShadow: "0 22px 60px rgba(100,70,0,0.16)",
  },
  resultCard: {
    background: "rgba(255,255,255,0.92)",
    borderRadius: 28,
    padding: 22,
    boxShadow: "0 22px 60px rgba(100,70,0,0.16)",
  },
  menuButton: {
    width: "100%",
    background: "rgba(255,255,255,0.92)",
    border: "1px solid #f0d78d",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    display: "grid",
    gridTemplateColumns: "38px 1fr 20px",
    gap: 12,
    alignItems: "center",
    textAlign: "left",
    cursor: "pointer",
    color: "#2b1700",
  },
  menuEmoji: {
    fontSize: 26,
  },
  arrow: {
    fontSize: 28,
    color: "#b88900",
  },
  backButton: {
    border: "none",
    background: "rgba(255,255,255,0.85)",
    borderRadius: 999,
    padding: "9px 14px",
    fontWeight: 900,
    marginBottom: 14,
    cursor: "pointer",
  },
  cardTitle: {
    margin: "0 0 14px",
    fontSize: 21,
  },
  label: {
    display: "block",
    margin: "14px 0 8px",
    fontWeight: 900,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: 15,
    border: "1px solid #efdca9",
    borderRadius: 16,
    fontSize: 16,
    background: "#fffef9",
    color: "#2b1700",
  },
  birthRow: {
    display: "grid",
    gridTemplateColumns: "1fr 24px 0.8fr 24px 0.8fr 24px",
    gap: 7,
    alignItems: "center",
  },
  metRow: {
    display: "grid",
    gridTemplateColumns: "1fr 24px 0.8fr 24px",
    gap: 7,
    alignItems: "center",
  },
  smallInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 10px",
    border: "1px solid #efdca9",
    borderRadius: 15,
    fontSize: 16,
    textAlign: "center",
    background: "#fffef9",
    color: "#2b1700",
  },
  divider: {
    borderTop: "1px dashed #e9cd77",
    margin: "26px 0",
  },
  mainButton: {
    width: "100%",
    marginTop: 24,
    padding: 17,
    border: "none",
    borderRadius: 22,
    background: "linear-gradient(135deg, #ffd84d 0%, #f6b900 100%)",
    color: "#2b1700",
    fontSize: 18,
    fontWeight: 950,
    cursor: "pointer",
  },
  turtleWrap: {
    textAlign: "center",
  },
  turtle: {
    fontSize: 92,
  },
  speech: {
    display: "inline-block",
    background: "white",
    borderRadius: 999,
    padding: "9px 16px",
    fontWeight: 900,
    boxShadow: "0 8px 20px rgba(120,80,0,0.12)",
  },
  resultTitle: {
    fontSize: 30,
    lineHeight: 1.2,
    textAlign: "center",
  },
  scoreBox: {
    background: "rgba(255,255,255,0.92)",
    borderRadius: 24,
    padding: 20,
    textAlign: "center",
    border: "1px solid #efdca9",
    margin: "18px 0",
  },
  scoreLabel: {
    margin: 0,
    fontWeight: 900,
  },
  score: {
    fontSize: 66,
    margin: "4px 0",
    lineHeight: 1,
  },
  scoreText: {
    margin: "8px 0 14px",
    fontWeight: 900,
  },
  barBg: {
    height: 14,
    borderRadius: 999,
    background: "#f1ead6",
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    background: "linear-gradient(90deg, #ffd84d, #f6b900)",
  },
  barGuide: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    marginTop: 8,
  },
  freeTable: {
    background: "#fffdf6",
    border: "1px solid #efdca9",
    borderRadius: 22,
    padding: 16,
    margin: "18px 0",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "78px 1fr",
    gap: 10,
    padding: "12px 0",
    borderTop: "1px dashed #ecd795",
  },
  lockText: {
    margin: "10px 0 0",
    color: "#7a5a12",
    fontWeight: 800,
  },
  payButton: {
    width: "100%",
    padding: 17,
    border: "none",
    borderRadius: 22,
    background: "linear-gradient(135deg, #ffd84d 0%, #f6b900 100%)",
    color: "#2b1700",
    fontSize: 17,
    fontWeight: 950,
    cursor: "pointer",
  },
  subButton: {
    width: "100%",
    marginTop: 12,
    padding: 15,
    border: "1px solid #efdca9",
    borderRadius: 22,
    background: "white",
    color: "#2b1700",
    fontSize: 16,
    fontWeight: 900,
    cursor: "pointer",
  },
  songBox: {
    background: "linear-gradient(135deg, #3b2b00 0%, #1f1400 100%)",
    borderRadius: 24,
    padding: 18,
    color: "white",
    margin: "18px 0",
  },
  songLabel: {
    color: "#ffd84d",
    fontWeight: 900,
    margin: 0,
  },
  songTitle: {
    color: "white",
    margin: "8px 0",
  },
  songReason: {
    lineHeight: 1.6,
    fontWeight: 700,
  },
  videoWrap: {
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 12,
  },
  recommendBox: {
    background: "#fffdf6",
    border: "1px solid #efdca9",
    borderRadius: 22,
    padding: 16,
    margin: "16px 0",
  },
  recommendEmoji: {
    fontSize: 30,
    margin: 0,
  },
  recommendMain: {
    fontSize: 20,
    fontWeight: 900,
  },
  recommendSub: {
    lineHeight: 1.6,
    fontWeight: 700,
  },
  section: {
    borderTop: "1px dashed #e9cd77",
    padding: "20px 0",
  },
  sectionTitle: {
    margin: "0 0 10px",
  },
  sectionText: {
    margin: 0,
    whiteSpace: "pre-line",
    lineHeight: 1.75,
    fontSize: 16,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    zIndex: 99,
    padding: 18,
    overflowY: "auto",
  },
  modal: {
    maxWidth: 520,
    margin: "30px auto",
    background: "white",
    borderRadius: 28,
    padding: 22,
    position: "relative",
  },
  modalClose: {
    position: "absolute",
    top: 14,
    right: 14,
    border: "none",
    background: "#fff3c8",
    borderRadius: 999,
    width: 34,
    height: 34,
    fontSize: 22,
    cursor: "pointer",
  },
  modalSub: {
    fontWeight: 800,
    color: "#7a5a12",
  },
  kakaoPayButton: {
    width: "100%",
    marginTop: 16,
    padding: 17,
    border: "none",
    borderRadius: 22,
    background: "#fee500",
    color: "#191600",
    fontSize: 17,
    fontWeight: 950,
    cursor: "pointer",
  },
};