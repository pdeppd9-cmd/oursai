import { useMemo, useState } from "react";
import "./App.css";

const SITE_URL = "https://oursai.vercel.app";
const KAKAO_JS_KEY = "392f84c5486937d26780349c72b4a1d8";

const mbtiList = [
  "ISTJ", "ISFJ", "INFJ", "INTJ",
  "ISTP", "ISFP", "INFP", "INTP",
  "ESTP", "ESFP", "ENFP", "ENTP",
  "ESTJ", "ESFJ", "ENFJ", "ENTJ",
];

export default function App() {
  const [mode, setMode] = useState("home");
  const [paid, setPaid] = useState(false);

  const [form, setForm] = useState({
    myYear: "",
    myMonth: "",
    myDay: "",
    myMbti: "",
    partnerYear: "",
    partnerMonth: "",
    partnerDay: "",
    partnerMbti: "",
    metYear: "",
    metMonth: "",
    relation: "친구(썸)",
  });

  const score = useMemo(() => {
    const text = Object.values(form).join("");
    let sum = 0;
    for (let i = 0; i < text.length; i++) sum += text.charCodeAt(i);
    return 60 + (sum % 36);
  }, [form]);

  const fortune = useMemo(() => {
    return {
      title: "좋은 에너지가 가득한 날이에요!",
      song: "For You",
      artist: "CHEN, BAEKHYUN, XIUMIN",
      color: "옐로우",
      colorText: "긍정, 행동, 창의력 상승",
      chance: "오후 2시 ~ 4시 사이 좋은 소식이 들어올 수 있어요.",
      quote: "행운은 준비된 자에게 미소를 짓는다.",
      detail:
        `오늘은 **가만히 있으면 손해 보는 날**이야.\n` +
        `평소라면 그냥 넘겼을 연락, 제안, 대화가 오늘은 생각보다 크게 이어질 수 있어.\n` +
        `특히 오전보다 **오후 흐름이 훨씬 강하게 살아나는 날**이라 중요한 말은 오후에 하는 게 좋아.\n` +
        `다만 오늘은 네 감정이 좀 빨리 달아오를 수 있어서, 상대 반응 하나에 바로 결론 내리면 손해야.\n` +
        `누가 조금 차갑게 말해도 그걸 곧바로 거절이나 무시로 받아들이지 마.\n` +
        `오늘의 핵심은 **먼저 움직이되, 매달리지는 않는 것**이야.\n` +
        `좋은 기회는 사람을 통해 들어오고, 특히 평소에 가볍게 알던 사람이 의외의 연결점이 될 수 있어.\n` +
        `오늘은 너무 착하게 굴 필요도 없고, 너무 계산적으로 굴 필요도 없어.\n` +
        `대신 네가 원하는 걸 짧고 분명하게 말해야 운이 붙어.\n` +
        `결론은 이거야. 오늘은 **망설이면 지나가고, 가볍게 잡으면 열리는 날**이야.`,
    };
  }, []);

  const sajuSummary = makeSajuSummary(score);
  const mbtiSummary = makeMbtiSummary(score, form.myMbti, form.partnerMbti);

  const update = (key, value, max) => {
    const onlyNumberKeys = ["myYear", "myMonth", "myDay", "partnerYear", "partnerMonth", "partnerDay", "metYear", "metMonth"];
    setForm({
      ...form,
      [key]: onlyNumberKeys.includes(key) ? value.replace(/\D/g, "").slice(0, max) : value,
    });
  };

  const share = async () => {
    try {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_JS_KEY);
        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: "우리 사이 🐢💛",
            description: "귀여운 거북이가 봐주는 궁합. 말은 생각보다 맵다.",
            imageUrl: `${SITE_URL}/turtle-wow.png`,
            link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL },
          },
          buttons: [{ title: "궁합 보러가기", link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL } }],
        });
        return;
      }
    } catch {}

    if (navigator.share) {
      await navigator.share({ title: "우리 사이", text: "우리 사이 궁합 봐봐 🐢💛", url: SITE_URL });
    } else {
      await navigator.clipboard.writeText(SITE_URL);
      alert("링크 복사했어!");
    }
  };

  if (mode === "fortune") {
    return (
      <Phone>
        <Top title="오늘의 운세" back={() => setMode("home")} share={share} />

        <div className="fortune-head">
          <p>2026년 오늘</p>
          <h1>{fortune.title}</h1>
          <img src="/turtle-heart.png" alt="" />
        </div>

        <div className="fortune-grid">
          <Card small>
            <h3>🎵 오늘의 노래</h3>
            <b>{fortune.song}</b>
            <p>{fortune.artist}</p>
            <div className="video-box">▶ YouTube에서 듣기</div>
          </Card>

          <Card small>
            <h3>💛 럭키 컬러</h3>
            <b>{fortune.color}</b>
            <p>{fortune.colorText}</p>
          </Card>

          <Card small>
            <h3>🎁 오늘 올 기회</h3>
            <p>{fortune.chance}</p>
          </Card>

          <Card small>
            <h3>📜 오늘의 격언</h3>
            <p>“{fortune.quote}”</p>
          </Card>
        </div>

        <Card>
          <h3>🔥 거북이가 솔직히 말해줄게</h3>
          <Text text={fortune.detail} />
        </Card>
      </Phone>
    );
  }

  if (mode === "saju" || mode === "mbti") {
    const isSaju = mode === "saju";

    return (
      <Phone>
        <Top title={isSaju ? "사주 궁합" : "MBTI 궁합"} back={() => setMode("home")} />

        <div className="step-row">
          <span className="active">1<br />정보 입력</span>
          <span>2<br />분석 중</span>
          <span>3<br />결과 보기</span>
        </div>

        <div className="input-guide">
          <img src="/turtle-heart.png" alt="" />
          <b>정확한 분석을 위해<br />정보를 입력해주세요!</b>
        </div>

        <Card>
          <h3>🟡 내 정보</h3>
          <BirthRow
            year={form.myYear}
            month={form.myMonth}
            day={form.myDay}
            onYear={(v) => update("myYear", v, 4)}
            onMonth={(v) => update("myMonth", v, 2)}
            onDay={(v) => update("myDay", v, 2)}
          />
          <MbtiSelect value={form.myMbti} onChange={(v) => update("myMbti", v)} />
        </Card>

        <Card>
          <h3>🟢 상대 정보</h3>
          <BirthRow
            year={form.partnerYear}
            month={form.partnerMonth}
            day={form.partnerDay}
            onYear={(v) => update("partnerYear", v, 4)}
            onMonth={(v) => update("partnerMonth", v, 2)}
            onDay={(v) => update("partnerDay", v, 2)}
          />
          <MbtiSelect value={form.partnerMbti} onChange={(v) => update("partnerMbti", v)} />
        </Card>

        <Card>
          <h3>💗 우리 관계</h3>
          <label>처음 만난 달</label>
          <div className="date-row two">
            <input placeholder="2024" value={form.metYear} onChange={(e) => update("metYear", e.target.value, 4)} />
            <input placeholder="11" value={form.metMonth} onChange={(e) => update("metMonth", e.target.value, 2)} />
          </div>
          <select value={form.relation} onChange={(e) => update("relation", e.target.value)}>
            <option>친구(썸)</option>
            <option>연애 중</option>
            <option>짝사랑</option>
          </select>
        </Card>

        <button className="main-btn" onClick={() => { setPaid(false); setMode("result"); }}>
          분석하기 ›
        </button>
      </Phone>
    );
  }

  if (mode === "result") {
    return (
      <Phone>
        <Top title="사주 궁합 결과" back={() => setMode("home")} share={share} />

        <div className="result-hero">
          <img src="/turtle-wow.png" alt="" />
          <div className="speech">와아!</div>
        </div>

        <Card>
          <p className="score-label">궁합 점수</p>
          <h1 className="score">{score}<span>%</span></h1>
          <p className="score-desc">생각보다 엄청 잘 맞는 조합이야!</p>
          <div className="bar"><div style={{ width: `${score}%` }} /></div>
        </Card>

        <div className="scores">
          <Score icon="💘" title="사랑 궁합" desc="감정 표현과 애정 방식" value="90%" color="#ff5b63" />
          <Score icon="💬" title="대화 궁합" desc="의사소통과 공감 능력" value="70%" color="#f08a00" />
          <Score icon="✨" title="성향 궁합" desc="가치관과 생활 방식" value="80%" color="#78a800" />
        </div>

        <Card>
          <div className="teaser">
            <h3>🔮 유료 해석 요약</h3>
            <p>{sajuSummary}</p>
            <p>{mbtiSummary}</p>
          </div>
        </Card>

        <Card>
          <div className={paid ? "" : "locked"}>
            <h3>우리의 사주</h3>
            <SajuTable />
            <Text text={makeLongSajuText(score)} />

            <h3>MBTI 상세 궁합</h3>
            <MbtiTable my={form.myMbti} partner={form.partnerMbti} />
            <Text text={makeLongMbtiText(score)} />
          </div>

          {!paid && (
            <div className="pay-box">
              <img src="/turtle-heart.png" alt="" />
              <h3>전체 내용을 확인하고 싶다면?</h3>
              <p>사주의 상세 해석, 운의 흐름, 궁합 포인트까지 모두 확인할 수 있어요.</p>
              <button className="pay-btn" onClick={() => setPaid(true)}>
                990원으로 전체 보기 kakaopay
              </button>
            </div>
          )}
        </Card>
      </Phone>
    );
  }

  return (
    <Phone>
      <div className="home-top">
        <span>☰</span>
        <b>우리 사이 🤍</b>
      </div>

      <div className="home-hero">
        <h1>너희 사이,<br />얼마나 특별할까?</h1>
        <p>생년월일, MBTI로<br />둘만의 흐름을 분석해줄게!</p>
        <img src="/turtle-heart.png" alt="" />
      </div>

      <div className="menu-list">
        <Menu icon="✨" title="오늘의 운세" desc="오늘의 운세와 행운 가득한 하루" onClick={() => setMode("fortune")} />
        <Menu icon="💗" title="사주 궁합" desc="우리가 만나게 된 운명적인 이유" onClick={() => setMode("saju")} />
        <Menu icon="👥" title="MBTI 궁합" desc="성격 궁합으로 알아보는 우리 사이" onClick={() => setMode("mbti")} />
      </div>
    </Phone>
  );
}

function Phone({ children }) {
  return <main className="phone">{children}</main>;
}

function Top({ title, back, share }) {
  return (
    <div className="top">
      <button onClick={back}>‹</button>
      <b>{title}</b>
      <button onClick={share || (() => {})}>{share ? "⌯" : ""}</button>
    </div>
  );
}

function Card({ children, small }) {
  return <section className={small ? "card small-card" : "card"}>{children}</section>;
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

function BirthRow({ year, month, day, onYear, onMonth, onDay }) {
  return (
    <>
      <label>생년월일</label>
      <div className="date-row">
        <input placeholder="1998" value={year} onChange={(e) => onYear(e.target.value)} />
        <input placeholder="05" value={month} onChange={(e) => onMonth(e.target.value)} />
        <input placeholder="14" value={day} onChange={(e) => onDay(e.target.value)} />
      </div>
    </>
  );
}

function MbtiSelect({ value, onChange }) {
  return (
    <>
      <label>MBTI</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">MBTI를 선택해줘</option>
        {mbtiList.map((m) => <option key={m}>{m}</option>)}
      </select>
    </>
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
      <strong style={{ color }}>{value}</strong>
    </div>
  );
}

function SajuTable() {
  const items = ["年柱", "月柱", "日柱", "時柱", "年柱", "月柱", "日柱", "時柱"];
  return (
    <div className="saju-table">
      {items.map((i, idx) => (
        <div key={idx}>
          <small>{i}</small>
          <b>{["갑자", "병오", "무진", "신유"][idx % 4]}</b>
        </div>
      ))}
    </div>
  );
}

function MbtiTable({ my, partner }) {
  return (
    <div className="mbti-table">
      <div><b>내 성향</b><span>{my || "MBTI"} · 감정 표현 방식</span></div>
      <div><b>상대 성향</b><span>{partner || "MBTI"} · 관계 안정감 방식</span></div>
      <div><b>끌림 포인트</b><span>다른 점이 초반 매력으로 작동</span></div>
      <div><b>충돌 포인트</b><span>연락 텀, 말투, 서운함 해소 속도</span></div>
    </div>
  );
}

function Text({ text }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <p className="long-text">
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </p>
  );
}

function makeSajuSummary(score) {
  if (score >= 80) return "둘은 끌림보다 타이밍이 더 강하게 작동하는 조합이에요.";
  if (score >= 70) return "서로 다른 기운이 부딪히지만, 그래서 더 신경 쓰이는 관계예요.";
  return "감정은 생기지만 속도 차이가 관계를 피곤하게 만들 수 있어요.";
}

function makeMbtiSummary(score, my, partner) {
  if (score >= 80) return `${my || "내 MBTI"}와 ${partner || "상대 MBTI"}는 대화가 터지면 빠르게 가까워지는 조합이에요.`;
  return `${my || "내 MBTI"}와 ${partner || "상대 MBTI"}는 표현 방식 차이를 조심해야 하는 조합이에요.`;
}

function makeLongSajuText(score) {
  return (
    `사주 흐름으로 보면 이 관계는 단순히 좋다, 나쁘다로 끝낼 수 없어. 두 사람 사이에는 **처음 만난 시점의 기운**이 꽤 크게 작용하고 있어.\n\n` +
    `한쪽은 관계를 빠르게 확인하고 싶어 하고, 다른 한쪽은 상황을 보면서 천천히 움직이려는 흐름이 강해. 그래서 처음엔 묘하게 끌리지만, 시간이 지나면 **속도 차이**가 서운함으로 바뀔 수 있어.\n\n` +
    `좋은 점은 서로에게 없는 부분을 자극한다는 거야. 한쪽은 감정을 열게 만들고, 다른 한쪽은 현실감을 잡아줘. 이게 잘 맞으면 서로가 서로를 성장시키는 관계가 될 수 있어.\n\n` +
    `하지만 위험한 건 **감정의 온도 차이**야. 한쪽이 이미 깊어졌는데 다른 한쪽이 아직 계산하고 있으면 관계가 피곤해져. 이 조합은 밀당을 오래 하면 설렘보다 피로가 먼저 와.\n\n` +
    `결론적으로 이 사주는 ${score >= 80 ? "**계속 이어질 가능성은 높지만 솔직함이 필수인 조합**" : "**끌림은 있지만 조심스럽게 봐야 하는 조합**"}이야.`
  );
}

function makeLongMbtiText(score) {
  return (
    `MBTI 기준으로 보면 핵심은 **표현 방식의 차이**야. 같은 감정을 느껴도 한쪽은 바로 말하고, 한쪽은 혼자 정리한 뒤에야 표현할 수 있어.\n\n` +
    `이 차이가 처음에는 매력으로 보여. “나랑 달라서 신기하다”는 느낌이 생기고, 그래서 더 궁금해져. 그런데 시간이 지나면 같은 차이가 **서운함의 원인**이 될 수 있어.\n\n` +
    `예를 들어 한쪽은 답장이 짧으면 마음이 식었다고 느끼고, 다른 한쪽은 그냥 바빠서 짧게 보낸 것일 수 있어. 이걸 모르면 서로를 무관심하거나 예민한 사람으로 오해하게 돼.\n\n` +
    `이 관계에서 중요한 건 반응 속도를 사랑의 크기로 착각하지 않는 거야. 상대가 늦게 말한다고 마음이 없는 건 아니고, 바로 말한다고 더 깊은 것도 아니야.\n\n` +
    `결론은 ${score >= 80 ? "**다름이 매력으로 작동할 가능성이 높은 조합**" : "**다름이 피로로 변하지 않게 관리해야 하는 조합**"}이야.`
  );
}