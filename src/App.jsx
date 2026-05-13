import { useEffect, useMemo, useState } from "react";

const mbtiList = [
  "ISTJ", "ISFJ", "INFJ", "INTJ",
  "ISTP", "ISFP", "INFP", "INTP",
  "ESTP", "ESFP", "ENFP", "ENTP",
  "ESTJ", "ESFJ", "ENFJ", "ENTJ",
];

const relationshipList = ["친구(썸)", "연애 중", "짝사랑"];

const dailyContents = [
  {
    mood: "몽글한데 예민함",
    quote:
      "고민과 의심은 하면 할수록 깊어진다. 하게 될 것들은 결국 하게 되고, 멀어질 것들은 붙잡아도 새어 나간다.",
    talkTopic: "요즘 별 이유 없이 계속 생각나는 사람이 있어?",
    talkTip:
      "이 질문은 가볍게 던져도 대답에서 감정 상태가 바로 보임. 장난처럼 시작해서 진심으로 들어가기 좋음.",
    song: "Laufey - From The Start",
    youtubeId: "lSD_L-xic9o",
    songReason:
      "설레는데 너무 들뜨진 않아서, 오늘처럼 마음이 괜히 간질거리는 날에 잘 맞음.",
  },
  {
    mood: "정리해야 하는 날",
    quote:
      "붙잡는다고 다 인연은 아니다. 애매하게 잡고 있는 마음이 제일 오래 사람을 지치게 한다.",
    talkTopic: "너는 사람한테 정 떨어지는 순간이 뭐야?",
    talkTip:
      "뻔한 이상형 질문보다 훨씬 재밌음. 상대의 선, 예민한 포인트, 인간관계 기준이 바로 나옴.",
    song: "아이유 - Love wins all",
    youtubeId: "JleoAppaxi0",
    songReason:
      "감정선이 깊어서 혼자 생각 정리하면서 보기 좋음. 오늘 흐름이랑 꽤 잘 맞음.",
  },
  {
    mood: "관계운 강함",
    quote:
      "기회는 거창하게 오지 않는다. 오늘 답장을 한 번 더 하게 되는 식으로 온다.",
    talkTopic: "처음엔 별로였는데 갑자기 좋아진 사람 있어?",
    talkTip:
      "썸 분위기에서 던지면 은근 반응 좋음. 상대가 연애에서 어떤 순간에 흔들리는지도 보임.",
    song: "NewJeans - Ditto",
    youtubeId: "pSUydWEqKwE",
    songReason:
      "괜히 누군가 생각나고, 과거 감정이 말랑하게 올라오는 분위기.",
  },
  {
    mood: "감정이 앞서는 날",
    quote:
      "상대가 헷갈리게 한다면, 사실 너는 이미 답을 알고 있을 가능성이 높다.",
    talkTopic: "너는 서운하면 바로 말해, 아니면 혼자 정리해?",
    talkTip:
      "상대의 회피 성향, 표현 방식, 싸움 스타일이 자연스럽게 나오는 질문.",
    song: "The Weeknd - Out of Time",
    youtubeId: "2fDzCWNS3ig",
    songReason:
      "후회, 타이밍, 미련이 섞여 있어서 오늘처럼 감정이 앞서는 날에 잘 맞음.",
  },
];

export default function App() {
  const [mode, setMode] = useState("home");
  const [showPay, setShowPay] = useState(false);

  const [savedPeople, setSavedPeople] = useState(() => {
    const saved = localStorage.getItem("woorisai_people");
    return saved ? JSON.parse(saved) : [];
  });

  const [solo, setSolo] = useState({
    name: "",
    year: "",
    month: "",
    day: "",
    mbti: "",
  });

  const [couple, setCouple] = useState({
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

  const soloResult = useMemo(() => {
    const seed =
      Number(solo.year || 0) +
      Number(solo.month || 0) * 3 +
      Number(solo.day || 1) * 7 +
      new Date().getDate();

    const item = dailyContents[seed % dailyContents.length];

    return {
      score: 60 + (seed % 36),
      ...item,
      message:
        `오늘 ${solo.name || "너"}는 사람 마음을 평소보다 더 예민하게 읽는 날이야. 근데 이게 좋은 쪽으로만 작동하는 건 아님. 상대가 별생각 없이 한 말도 너는 두 번, 세 번 곱씹을 수 있어. 그래서 오늘은 **상대 마음을 맞히려고 하면 할수록 더 피곤해지는 날**이야.\n\n` +
        `특히 연락 문제 조심해야 함. 답장이 늦거나 말투가 짧으면 바로 의미 부여하고 싶어질 수 있는데, 오늘은 그걸 그대로 믿으면 안 돼. 오늘 네 감정은 약간 확대경 같아서 작은 신호도 크게 보일 수 있음. 그러니까 오늘은 상대를 추리하지 말고, **내가 왜 이 말에 흔들렸는지**를 먼저 봐야 해.\n\n` +
        `그리고 오늘은 누군가에게 마음을 다 보여주기 좋은 날은 아니야. 오히려 가볍게 던지고 반응을 보는 쪽이 훨씬 좋음. 길게 설명하고, 마음 증명하고, 상대 반응 기다리는 흐름으로 가면 너만 지칠 가능성이 큼. 오늘은 말 많이 하는 사람이 이기는 날이 아니라 **덜 흔들리는 사람이 이기는 날**이야.\n\n` +
        `일이나 공부 쪽도 비슷해. 오늘은 큰 결정을 내리기보다 작은 정리를 하는 게 맞아. 밀린 연락 정리, 캡처해둔 것 정리, 마음 불편했던 사람과의 거리 조절 같은 것들. 작은 걸 정리하면 생각보다 기분이 많이 가벼워질 수 있어.\n\n` +
        `연애나 인간관계에서는 오늘 괜히 쿨한 척하지 마. 근데 그렇다고 너무 진심을 쏟아내지도 마. 딱 중간. **가볍게, 짧게, 하지만 도망가지는 않게.** 이게 오늘 제일 좋은 태도야.\n\n` +
        `결론은 이거야. 오늘은 뭔가를 잡으려고 애쓸수록 손에서 빠져나갈 수 있음. 반대로 내 리듬을 지키면 이상하게 상대가 다시 보이거나, 상황이 정리되는 흐름이 생길 수 있어. 그러니까 오늘은 제발 감정으로 달리지 말고, 거북이처럼 가. 느린데 안 무너지는 쪽이 결국 이김.`,
    };
  }, [solo]);

  const coupleResult = useMemo(() => {
    const score = makeScore(couple);
    const months = getMonthDiff(couple.metYear, couple.metMonth);

    return {
      score,
      turtle: getTurtle(score),
      title: getTitle(score),
      love: clamp(score + 8),
      talk: clamp(score - 17),
      mood: clamp(score - 3),
      future: clamp(score + 1),
      months,
      text: makeLongResult(score, months, couple.relationship),
    };
  }, [couple]);

  const savePerson = (person) => {
    if (!person.name) return;
    if (savedPeople.find((p) => p.name === person.name)) return;
    setSavedPeople([...savedPeople, person]);
  };

  const loadSoloPerson = (name) => {
    const p = savedPeople.find((x) => x.name === name);
    if (!p) return;
    setSolo({ name: p.name, year: p.year, month: p.month, day: p.day, mbti: p.mbti });
  };

  const loadCouplePerson = (target, name) => {
    const p = savedPeople.find((x) => x.name === name);
    if (!p) return;

    if (target === "me") {
      setCouple({
        ...couple,
        myName: p.name,
        myYear: p.year,
        myMonth: p.month,
        myDay: p.day,
        myMbti: p.mbti,
      });
    } else {
      setCouple({
        ...couple,
        partnerName: p.name,
        partnerYear: p.year,
        partnerMonth: p.month,
        partnerDay: p.day,
        partnerMbti: p.mbti,
      });
    }
  };

  const updateSoloNumber = (key, value, maxLength) => {
    setSolo({ ...solo, [key]: value.replace(/\D/g, "").slice(0, maxLength) });
  };

  const updateCoupleNumber = (key, value, maxLength) => {
    setCouple({ ...couple, [key]: value.replace(/\D/g, "").slice(0, maxLength) });
  };

  const showSoloResult = () => {
    if (!solo.name || !solo.year || !solo.month || !solo.day || !solo.mbti) {
      alert("내 정보를 다 입력해줘.");
      return;
    }

    savePerson({
      name: solo.name,
      year: solo.year,
      month: solo.month,
      day: solo.day,
      mbti: solo.mbti,
    });

    setMode("soloResult");
  };

  const showCoupleResult = () => {
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

    if (required.some((key) => !couple[key])) {
      alert("빈칸을 다 입력해줘.");
      return;
    }

    savePerson({
      name: couple.myName,
      year: couple.myYear,
      month: couple.myMonth,
      day: couple.myDay,
      mbti: couple.myMbti,
    });

    savePerson({
      name: couple.partnerName,
      year: couple.partnerYear,
      month: couple.partnerMonth,
      day: couple.partnerDay,
      mbti: couple.partnerMbti,
    });

    setMode("coupleResult");
  };

  const shareResult = async () => {
    const url = window.location.href;
    const text = "우리 사이에서 궁합 봤는데 거북이가 너무 세게 말함 🐢💛";

    if (navigator.share) {
      await navigator.share({
        title: "우리 사이",
        text,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("링크 복사했어!");
    }
  };

  if (mode === "solo") {
    return (
      <Page>
        <TopBar onBack={() => setMode("home")} />
        <Hero
          title={"오늘 너의 흐름,\n거북이가 봐줄게"}
          subtitle="한 번 입력하면 저장돼서 다음엔 바로 선택할 수 있어."
        />

        <Card>
          <MiniTitle emoji="☀️" text="내 정보" />

          <SavedPicker people={savedPeople} label="저장된 내 정보 불러오기" onSelect={loadSoloPerson} />

          <label style={styles.label}>이름</label>
          <input
            style={styles.input}
            placeholder="예: 우혁"
            value={solo.name}
            onChange={(e) => setSolo({ ...solo, name: e.target.value })}
          />

          <BirthInput
            year={solo.year}
            month={solo.month}
            day={solo.day}
            onYear={(v) => updateSoloNumber("year", v, 4)}
            onMonth={(v) => updateSoloNumber("month", v, 2)}
            onDay={(v) => updateSoloNumber("day", v, 2)}
          />

          <SelectInput label="내 MBTI" value={solo.mbti} onChange={(v) => setSolo({ ...solo, mbti: v })} />

          <button style={styles.mainButton} onClick={showSoloResult}>
            오늘의 흐름 보기 🐢
          </button>
        </Card>
      </Page>
    );
  }

  if (mode === "soloResult") {
    return (
      <Page>
        <TopBar onBack={() => setMode("home")} />

        <Card>
          <Turtle face="🐢🎧" speech="노래 틀고 읽어!" />
          <Badge>무료 · 오늘의 흐름</Badge>

          <h1 style={styles.bigTitle}>{solo.name}의 오늘 분위기</h1>

          <SongBox song={soloResult.song} reason={soloResult.songReason} youtubeId={soloResult.youtubeId} />

          <ScoreBox score={soloResult.score} text={soloResult.mood} label="오늘 에너지" />

          <Section title="🐢 한 줄 요약" text="**오늘은 상대를 읽으려 하지 말고, 네 반응을 먼저 봐야 하는 날!**" />

          <Section title="🔥 솔직히 말하면" text={soloResult.message} />

          <div style={styles.quoteBox}>
            <p style={styles.quoteTitle}>오늘의 조언</p>
            <h3 style={styles.quote}>{soloResult.quote}</h3>
          </div>

          <RecommendBox
            emoji="💬"
            title="오늘의 대화주제"
            main={soloResult.talkTopic}
            sub={soloResult.talkTip}
          />

          <button style={styles.subButton} onClick={shareResult}>
            결과 공유하기
          </button>

          <button style={styles.mainButton} onClick={() => setMode("couple")}>
            궁합도 보러가기 💌
          </button>
        </Card>
      </Page>
    );
  }

  if (mode === "couple") {
    return (
      <Page>
        <TopBar onBack={() => setMode("home")} />

        <Hero
          title={"너희 사이,\n거북이가 까놓고 봐줄게"}
          subtitle="귀엽게 생겼지만 말은 좀 세게 할 수 있음."
        />

        <Card>
          <MiniTitle emoji="💛" text="내 정보" />

          <SavedPicker
            people={savedPeople}
            label="저장된 내 정보 불러오기"
            onSelect={(name) => loadCouplePerson("me", name)}
          />

          <label style={styles.label}>내 이름</label>
          <input
            style={styles.input}
            placeholder="예: 우혁"
            value={couple.myName}
            onChange={(e) => setCouple({ ...couple, myName: e.target.value })}
          />

          <BirthInput
            year={couple.myYear}
            month={couple.myMonth}
            day={couple.myDay}
            onYear={(v) => updateCoupleNumber("myYear", v, 4)}
            onMonth={(v) => updateCoupleNumber("myMonth", v, 2)}
            onDay={(v) => updateCoupleNumber("myDay", v, 2)}
          />

          <SelectInput label="내 MBTI" value={couple.myMbti} onChange={(v) => setCouple({ ...couple, myMbti: v })} />

          <Divider />

          <MiniTitle emoji="🐢" text="상대 정보" />

          <SavedPicker
            people={savedPeople}
            label="저장된 상대 정보 불러오기"
            onSelect={(name) => loadCouplePerson("partner", name)}
          />

          <label style={styles.label}>상대 이름</label>
          <input
            style={styles.input}
            placeholder="예: 수아"
            value={couple.partnerName}
            onChange={(e) => setCouple({ ...couple, partnerName: e.target.value })}
          />

          <BirthInput
            year={couple.partnerYear}
            month={couple.partnerMonth}
            day={couple.partnerDay}
            onYear={(v) => updateCoupleNumber("partnerYear", v, 4)}
            onMonth={(v) => updateCoupleNumber("partnerMonth", v, 2)}
            onDay={(v) => updateCoupleNumber("partnerDay", v, 2)}
          />

          <SelectInput
            label="상대 MBTI"
            value={couple.partnerMbti}
            onChange={(v) => setCouple({ ...couple, partnerMbti: v })}
          />

          <Divider />

          <MiniTitle emoji="💕" text="우리 관계" />

          <label style={styles.label}>처음 만난 달</label>
          <div style={styles.metRow}>
            <input
              style={styles.smallInput}
              placeholder="2024"
              value={couple.metYear}
              onChange={(e) => updateCoupleNumber("metYear", e.target.value, 4)}
            />
            <span>년</span>
            <input
              style={styles.smallInput}
              placeholder="11"
              value={couple.metMonth}
              onChange={(e) => updateCoupleNumber("metMonth", e.target.value, 2)}
            />
            <span>월</span>
          </div>

          <label style={styles.label}>현재 관계</label>
          <select
            style={styles.input}
            value={couple.relationship}
            onChange={(e) => setCouple({ ...couple, relationship: e.target.value })}
          >
            {relationshipList.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <button style={styles.mainButton} onClick={showCoupleResult}>
            우리 사이 분석하기 🐢
          </button>
        </Card>
      </Page>
    );
  }

  if (mode === "coupleResult") {
    return (
      <Page>
        <TopBar onBack={() => setMode("couple")} />

        <Card>
          <Turtle face={coupleResult.turtle.face} speech={coupleResult.turtle.speech} />

          <Badge>우리 사이 분석 결과</Badge>

          <h1 style={styles.bigTitle}>{coupleResult.title}</h1>

          <ScoreBox score={coupleResult.score} text={coupleResult.turtle.text} label="총 궁합" />

          <ScoreList
            love={coupleResult.love}
            talk={coupleResult.talk}
            mood={coupleResult.mood}
            future={coupleResult.future}
          />

          <Section title="💥 한 줄 요약" text={coupleResult.text.oneLine} />
          <Section title="🔥 솔직히 말해줄게" text={coupleResult.text.main} />
          <Section title="💘 사랑 궁합" text={coupleResult.text.love} />
          <Section title="💬 대화 궁합" text={coupleResult.text.talk} />
          <Section title="✨ 성향 궁합" text={coupleResult.text.mood} />
          <Section title="🐢 미래 궁합" text={coupleResult.text.future} />
          <Section title="⏰ 처음 만난 시점 기준 흐름" text={coupleResult.text.time} />
          <Section title="✅ 결론" text={coupleResult.text.final} />

          <button style={styles.payButton} onClick={() => setShowPay(true)}>
            🔒 전체 상세 분석 보기 · 990원
          </button>

          <button style={styles.subButton} onClick={shareResult}>
            결과 공유하기
          </button>
        </Card>

        {showPay && <PayModal onClose={() => setShowPay(false)} />}
      </Page>
    );
  }

  return (
    <Page>
      <Hero
        title={"우리 사이,\n오늘은 어떨까?"}
        subtitle="귀여운 거북이가 봐주는데, 말은 생각보다 매움."
      />

      <div style={styles.turtleHome}>
        <div style={styles.turtleShell}>🐢</div>
        <div style={styles.bubble}>귀엽게 말하지만 봐주는 건 없음!</div>
      </div>

      <Card>
        <button style={styles.menuButton} onClick={() => setMode("solo")}>
          <span style={styles.menuEmoji}>☀️</span>
          <div>
            <b>혼자 매일 보기</b>
            <p>오늘의 흐름 + 노래 + 조언 + 대화주제 · 무료</p>
          </div>
        </button>

        <button style={styles.menuButton} onClick={() => setMode("couple")}>
          <span style={styles.menuEmoji}>💌</span>
          <div>
            <b>우리 사이 궁합 보기</b>
            <p>MBTI, 생년월일, 처음 만난 달 반영</p>
          </div>
        </button>
      </Card>
    </Page>
  );
}

function Page({ children }) {
  return (
    <div style={styles.page}>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />
      <div style={styles.container}>{children}</div>
    </div>
  );
}

function Hero({ title, subtitle }) {
  return (
    <div style={styles.hero}>
      <Badge>우리 사이 🐢💛</Badge>
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

function Badge({ children }) {
  return <p style={styles.badge}>{children}</p>;
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
      <div style={styles.speech}>{speech}</div>
      <div style={styles.turtle}>{face}</div>
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

function ScoreBox({ score, text, label }) {
  return (
    <div style={styles.scoreBox}>
      <p style={styles.scoreLabel}>{label}</p>
      <h2 style={styles.score}>{score}%</h2>
      <p style={styles.scoreText}>{text}</p>
      <div style={styles.barBg}>
        <div style={{ ...styles.bar, width: `${score}%` }} />
      </div>
    </div>
  );
}

function ScoreList({ love, talk, mood, future }) {
  const rows = [
    ["💘", "사랑 궁합", "끌림, 애정표현, 설렘의 강도", love],
    ["💬", "대화 궁합", "말투, 연락, 서운함을 푸는 방식", talk],
    ["✨", "성향 궁합", "생활 리듬, 가치관, 감정 처리 방식", mood],
    ["🐢", "미래 궁합", "오래 갈 가능성과 현실적인 안정감", future],
  ];

  return (
    <div style={styles.scoreList}>
      {rows.map(([icon, label, desc, value]) => (
        <div style={styles.scoreRow} key={label}>
          <span style={styles.scoreIcon}>{icon}</span>
          <div>
            <b>{label}</b>
            <p>{desc}</p>
          </div>
          <strong>{value}%</strong>
        </div>
      ))}
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

function PayModal({ onClose }) {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h2>전체 상세 분석 · 990원</h2>
        <p>
          실제 결제 연결 전 임시 화면이야. 다음 단계에서 토스페이먼츠나 포트원 연결하면
          이 버튼들이 진짜 결제로 바뀜.
        </p>

        <button style={styles.payChoice} onClick={() => alert("다음 단계에서 토스페이먼츠 연결")}>
          토스페이로 결제하기
        </button>

        <button style={styles.payChoice} onClick={() => alert("다음 단계에서 카카오페이 연결")}>
          카카오페이로 결제하기
        </button>

        <button style={styles.subButton} onClick={onClose}>
          닫기
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
  if (score >= 100) return { face: "🐢🤯💖", speech: "야 이건 거의 운명인데?!", text: "이 정도면 그냥 넘기기 어려운 조합!" };
  if (score >= 90) return { face: "🐢😍", speech: "눈에 하트 떴다!", text: "서로한테 끌리는 힘이 꽤 미쳤음!" };
  if (score >= 80) return { face: "🐢😲", speech: "와 잠깐만!", text: "생각보다 훨씬 잘 맞는 조합!" };
  if (score >= 70) return { face: "🐢😊", speech: "오 괜찮은데?", text: "좋은데 조율 못 하면 삐끗함!" };
  if (score >= 60) return { face: "🐢😐", speech: "음... 애매한데?", text: "끌림은 있는데 피곤한 포인트도 큼!" };
  return { face: "🐢😵", speech: "야 이건 조심!", text: "초반 끌림만 믿으면 다칠 수 있음!" };
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

function makeLongResult(score, months, relation) {
  const strong = score >= 80;

  return {
    oneLine: strong
      ? "🐢 **끌림은 확실한데, 감정 조절 못 하면 바로 드라마 찍는 조합!**"
      : "🐢 **호기심은 있는데, 안정감으로 가려면 꽤 조심해야 하는 조합!**",

    main: strong
      ? `와 이건 그냥 평범하게 “괜찮네?” 하고 넘길 조합이 아니야! 처음부터 묘하게 신경 쓰이고, 상대 말투 하나가 계속 머리에 남는 타입이야. 근데 문제는 이게 순한 궁합이 아니라는 거! **좋을 땐 확 좋고, 서운할 땐 진짜 확 서운해지는 조합**이라 감정선이 꽤 세게 움직여.\n\n${relation} 관계라면 더 조심해야 함. 애매하게 굴면 설레는 게 아니라 사람 미치게 만들 수 있어!`
      : `솔직히 말하면 이 조합은 막 편하게 흘러가는 관계는 아니야. 처음엔 “뭐지? 은근 신경 쓰이네?” 할 수 있는데, 가까워질수록 생각보다 피곤한 포인트가 빨리 보일 수 있음. **관계 속도, 표현 방식, 기대치** 이 세 개가 안 맞으면 바로 삐끗해.\n\n근데 또 이상하게 아예 끊기는 조합도 아니라 더 골치 아픔!`,

    love: strong
      ? "💘 한 줄 요약: **끌림은 강한데, 표현 안 하면 서로 오해함!**\n\n사랑 궁합은 꽤 좋게 나왔어! 둘 사이에 설렘이 생기면 되게 빨리 커지는 편이야. 문제는 한쪽은 티를 내고 싶고, 한쪽은 괜히 숨기거나 간 보는 식으로 갈 수 있다는 거야. 이러면 진짜 아깝게 꼬임! 좋아하면 티 좀 내야 돼."
      : "💘 한 줄 요약: **끌리긴 하는데, 감정 소모도 같이 따라옴!**\n\n사랑 궁합은 신경 쓰이다가 점점 감정이 커지는 쪽이야. 근데 문제는 감정 확인을 너무 자주 하게 될 수 있다는 거! 상대 반응 하나에 기분이 흔들리면 설렘이 아니라 피로가 될 수 있음.",

    talk: strong
      ? "💬 한 줄 요약: **대화 터지면 밤새는데, 삐지면 둘 다 말 안 함!**\n\n대화 궁합은 재밌는 편이야. 잘 맞는 날엔 진짜 시간 순삭임! 근데 싸울 때가 문제야. 한쪽은 바로 풀고 싶고, 한쪽은 혼자 정리해야 하면 여기서 크게 부딪혀."
      : "💬 한 줄 요약: **말투 하나로 분위기 뒤집힐 수 있음!**\n\n대화 궁합은 조금 조심해야 돼. 이 조합은 말 자체보다 말의 온도에 예민해질 수 있어. 단답, 늦은 답장, 읽씹 같은 거에서 감정이 바로 흔들릴 수 있음.",

    mood: strong
      ? "✨ 한 줄 요약: **다른데, 그 다름이 매력으로 보일 수 있음!**\n\n성향 궁합은 꽤 흥미로워. 둘이 완전 똑같아서 편한 느낌은 아니고, 오히려 달라서 끌리는 쪽에 가까움. 한 명은 분위기를 띄우고, 한 명은 중심을 잡아주는 식으로 맞으면 좋음."
      : "✨ 한 줄 요약: **다른 점이 매력일 수도, 스트레스일 수도 있음!**\n\n성향 차이가 꽤 느껴질 수 있어. 처음엔 신선한데, 시간이 지나면 ‘왜 저렇게 하지?’가 될 수 있음. 특히 연락 텀, 약속 방식, 감정 표현에서 차이가 나면 오래 쌓임.",

    future: strong
      ? "🐢 한 줄 요약: **오래 가려면 자존심보다 솔직함이 먼저!**\n\n미래 궁합은 가능성 있어! 근데 자연스럽게 술술 흘러가는 관계는 아니야. 서로 차이를 알고 맞추면 강해지는 조합임. 애매하게 숨기는 거 금지!"
      : "🐢 한 줄 요약: **오래 가려면 감정 게임부터 멈춰야 함!**\n\n미래 궁합은 관리가 필요해. 밀당이 길어지면 설레는 게 아니라 지치는 쪽으로 갈 가능성이 큼. 누가 더 좋아하냐 싸움 들어가면 답 없음.",

    time: `⏰ 처음 만난 지 약 **${months}개월** 정도 됐어!\n\n이 기간이면 첫인상에서 생긴 환상은 조금씩 빠지고, 진짜 성향 차이가 보이기 시작하는 구간이야. 만난 지 얼마 안 됐다면 아직 설렘이 더 크고, 6개월 이상이라면 이제 연락, 말투, 약속 방식에서 현실적인 차이가 드러나기 쉬움.`,

    final: strong
      ? "✅ 결론: **이 조합은 끝까지 갈 수도 있음!** 근데 그냥 두면 잘 되는 관계는 아니고, 서로 다름을 인정해야 오래 감. 좋아하는 마음 있는데 자존심 때문에 표현 아끼면 진짜 아깝게 틀어질 수 있어!"
      : "✅ 결론: **끌림은 있는데 조심해야 함!** 이 관계는 좋을 때는 좋지만, 애매하게 굴면 감정 소모가 커질 수 있어. 상대 반응 하나에 네 하루가 흔들린다면, 관계 방식 자체를 다시 봐야 함!",
  };
}

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #fff8d8 0%, #ffe779 32%, #f8c948 58%, #fff4b8 100%)",
    fontFamily:
      "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    color: "#111111",
    padding: "20px 14px",
  },
  glowOne: {
    position: "fixed",
    width: "320px",
    height: "320px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.45)",
    top: "-90px",
    left: "-100px",
    filter: "blur(8px)",
  },
  glowTwo: {
    position: "fixed",
    width: "260px",
    height: "260px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.35)",
    bottom: "40px",
    right: "-80px",
    filter: "blur(10px)",
  },
  container: {
    position: "relative",
    zIndex: 2,
    maxWidth: "520px",
    margin: "0 auto",
  },
  hero: {
    padding: "24px 6px 18px",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    margin: 0,
    padding: "9px 16px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.88)",
    border: "2px solid #111111",
    boxShadow: "0 6px 0 #111111",
    fontWeight: 900,
    color: "#111111",
  },
  title: {
    whiteSpace: "pre-line",
    fontSize: "38px",
    lineHeight: 1.15,
    letterSpacing: "-1.5px",
    margin: "24px 0 12px",
    color: "#111111",
  },
  subtitle: {
    fontSize: "16px",
    lineHeight: 1.6,
    color: "#111111",
    margin: 0,
    fontWeight: 800,
  },
  turtleHome: {
    textAlign: "center",
    margin: "8px 0 22px",
  },
  turtleShell: {
    fontSize: "88px",
    filter: "drop-shadow(0 10px 0 rgba(17,17,17,0.2))",
  },
  bubble: {
    display: "inline-block",
    background: "white",
    border: "2px solid #111111",
    borderRadius: "999px",
    padding: "9px 16px",
    fontWeight: 900,
    boxShadow: "0 5px 0 #111111",
    color: "#111111",
  },
  card: {
    background: "rgba(255,255,255,0.9)",
    border: "2px solid #111111",
    borderRadius: "32px",
    padding: "24px",
    boxShadow: "0 12px 0 #111111, 0 30px 80px rgba(0,0,0,0.18)",
    color: "#111111",
  },
  menuButton: {
    width: "100%",
    border: "2px solid #111111",
    background: "linear-gradient(135deg, #ffffff 0%, #fff5bf 100%)",
    borderRadius: "26px",
    padding: "18px",
    display: "flex",
    gap: "14px",
    alignItems: "center",
    textAlign: "left",
    cursor: "pointer",
    marginBottom: "14px",
    fontSize: "17px",
    boxShadow: "0 6px 0 #111111",
    color: "#111111",
  },
  menuEmoji: {
    fontSize: "34px",
  },
  cardTitle: {
    margin: "0 0 14px",
    fontSize: "21px",
    color: "#111111",
  },
  label: {
    display: "block",
    margin: "14px 0 8px",
    fontWeight: 900,
    color: "#111111",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px",
    border: "2px solid #111111",
    borderRadius: "17px",
    fontSize: "16px",
    background: "#fffef8",
    color: "#111111",
  },
  birthRow: {
    display: "grid",
    gridTemplateColumns: "1fr 24px 0.8fr 24px 0.8fr 24px",
    gap: "7px",
    alignItems: "center",
  },
  metRow: {
    display: "grid",
    gridTemplateColumns: "1fr 24px 0.8fr 24px",
    gap: "7px",
    alignItems: "center",
  },
  smallInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 10px",
    border: "2px solid #111111",
    borderRadius: "16px",
    fontSize: "16px",
    textAlign: "center",
    background: "#fffef8",
    color: "#111111",
  },
  divider: {
    height: "1px",
    borderTop: "2px dashed #111111",
    margin: "28px 0",
  },
  mainButton: {
    width: "100%",
    marginTop: "24px",
    padding: "17px",
    border: "2px solid #111111",
    borderRadius: "22px",
    background: "linear-gradient(135deg, #ffd43b 0%, #ffb800 100%)",
    color: "#111111",
    fontSize: "18px",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 7px 0 #111111",
  },
  backButton: {
    border: "2px solid #111111",
    background: "white",
    color: "#111111",
    borderRadius: "999px",
    padding: "9px 14px",
    fontWeight: 900,
    fontSize: "16px",
    margin: "0 0 16px",
    cursor: "pointer",
    boxShadow: "0 4px 0 #111111",
  },
  turtleWrap: {
    textAlign: "center",
    marginBottom: "14px",
  },
  turtle: {
    fontSize: "88px",
  },
  speech: {
    display: "inline-block",
    background: "white",
    color: "#111111",
    border: "2px solid #111111",
    borderRadius: "999px",
    padding: "9px 16px",
    fontWeight: 900,
    marginBottom: "8px",
    boxShadow: "0 5px 0 #111111",
  },
  bigTitle: {
    fontSize: "32px",
    lineHeight: 1.2,
    letterSpacing: "-1px",
    margin: "20px 0",
    color: "#111111",
  },
  songBox: {
    background: "linear-gradient(135deg, #111111 0%, #3b2b00 100%)",
    color: "white",
    borderRadius: "28px",
    padding: "20px",
    border: "2px solid #111111",
    boxShadow: "0 8px 0 #111111",
    margin: "18px 0",
  },
  songLabel: {
    margin: 0,
    fontWeight: 900,
    color: "#ffd43b",
  },
  songTitle: {
    color: "white",
    fontSize: "24px",
    margin: "8px 0",
  },
  songReason: {
    color: "white",
    lineHeight: 1.6,
    fontWeight: 700,
  },
  videoWrap: {
    overflow: "hidden",
    borderRadius: "20px",
    marginTop: "14px",
    border: "2px solid #ffd43b",
  },
  scoreBox: {
    background: "linear-gradient(135deg, #fff3a3 0%, #ffffff 100%)",
    border: "2px solid #111111",
    borderRadius: "28px",
    padding: "20px",
    margin: "18px 0",
    textAlign: "center",
    boxShadow: "0 6px 0 #111111",
    color: "#111111",
  },
  scoreLabel: {
    margin: 0,
    fontWeight: 900,
    color: "#111111",
  },
  score: {
    margin: "4px 0",
    fontSize: "64px",
    lineHeight: 1,
    color: "#111111",
  },
  scoreText: {
    margin: "8px 0 14px",
    color: "#111111",
    fontWeight: 900,
  },
  barBg: {
    height: "15px",
    background: "white",
    borderRadius: "999px",
    overflow: "hidden",
    border: "2px solid #111111",
  },
  bar: {
    height: "100%",
    background: "linear-gradient(90deg, #ffe066, #ffb800)",
  },
  scoreList: {
    display: "grid",
    gap: "12px",
    margin: "20px 0",
  },
  scoreRow: {
    display: "grid",
    gridTemplateColumns: "38px 1fr 62px",
    alignItems: "center",
    background: "#fffdf2",
    color: "#111111",
    border: "2px solid #111111",
    borderRadius: "20px",
    padding: "14px",
  },
  scoreIcon: {
    fontSize: "26px",
  },
  section: {
    borderTop: "2px dashed #111111",
    padding: "22px 0",
  },
  sectionTitle: {
    margin: "0 0 10px",
    fontSize: "20px",
    color: "#111111",
  },
  sectionText: {
    margin: 0,
    whiteSpace: "pre-line",
    fontSize: "16px",
    lineHeight: 1.82,
    color: "#111111",
  },
  payButton: {
    width: "100%",
    padding: "17px",
    border: "2px solid #111111",
    borderRadius: "22px",
    background: "linear-gradient(135deg, #ffd43b 0%, #ffb800 100%)",
    color: "#111111",
    fontSize: "17px",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 7px 0 #111111",
  },
  subButton: {
    width: "100%",
    marginTop: "12px",
    padding: "15px",
    border: "2px solid #111111",
    borderRadius: "22px",
    background: "white",
    color: "#111111",
    fontSize: "16px",
    fontWeight: 900,
    cursor: "pointer",
  },
  quoteBox: {
    background: "linear-gradient(135deg, #fff0a3 0%, #ffffff 100%)",
    color: "#111111",
    border: "2px solid #111111",
    borderRadius: "26px",
    padding: "18px",
    margin: "18px 0",
    boxShadow: "0 6px 0 #111111",
  },
  quoteTitle: {
    margin: 0,
    fontWeight: 900,
    color: "#111111",
  },
  quote: {
    fontSize: "22px",
    lineHeight: 1.5,
    color: "#111111",
  },
  recommendBox: {
    background: "#fffdf2",
    color: "#111111",
    border: "2px solid #111111",
    borderRadius: "26px",
    padding: "18px",
    margin: "16px 0",
    boxShadow: "0 5px 0 #111111",
  },
  recommendEmoji: {
    fontSize: "34px",
    margin: 0,
  },
  recommendMain: {
    fontSize: "20px",
    fontWeight: 900,
    lineHeight: 1.45,
    margin: "8px 0",
    color: "#111111",
  },
  recommendSub: {
    color: "#111111",
    lineHeight: 1.6,
    margin: 0,
    fontWeight: 700,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 99,
  },
  modal: {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    color: "#111111",
    border: "2px solid #111111",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 10px 0 #111111",
  },
  payChoice: {
    width: "100%",
    marginTop: "12px",
    padding: "15px",
    border: "2px solid #111111",
    borderRadius: "18px",
    background: "#ffd43b",
    color: "#111111",
    fontSize: "16px",
    fontWeight: 900,
    cursor: "pointer",
  },
};