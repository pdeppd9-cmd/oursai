import { useEffect, useMemo, useState } from "react";
import "./App.css";

const SITE_URL = "https://oursai.vercel.app";
const KAKAO_JS_KEY = "392f84c5486937d26780349c72b4a1d8";

const mbtiList = [
  "ISTJ","ISFJ","INFJ","INTJ","ISTP","ISFP","INFP","INTP",
  "ESTP","ESFP","ENFP","ENTP","ESTJ","ESFJ","ENFJ","ENTJ",
];

const relations = ["친구(썸)", "연애 중", "짝사랑"];

export default function App() {
  const [mode, setMode] = useState("home");
  const [paid, setPaid] = useState(false);

  const [savedPeople, setSavedPeople] = useState(() => {
    const saved = localStorage.getItem("woorisai_people_v2");
    return saved ? JSON.parse(saved) : [];
  });

  const [fortuneForm, setFortuneForm] = useState({
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
    relation: "친구(썸)",
  });

  useEffect(() => {
    localStorage.setItem("woorisai_people_v2", JSON.stringify(savedPeople));
  }, [savedPeople]);

  const score = useMemo(() => makeScore(form), [form]);

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
      return [clean, ...filtered].slice(0, 10);
    });
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
      "myYear",
      "myMonth",
      "myDay",
      "partnerYear",
      "partnerMonth",
      "partnerDay",
      "metYear",
      "metMonth",
    ].includes(key);

    setForm({
      ...form,
      [key]: numeric ? value.replace(/\D/g, "").slice(0, max) : value,
    });
  };

  const shareResult = async () => {
    try {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_JS_KEY);
        }

        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: "우리 사이 🐢💛",
            description: "거북이가 몰래 다 말해줌",
            imageUrl: `${SITE_URL}/turtle-wow.png`,
            link: {
              mobileWebUrl: SITE_URL,
              webUrl: SITE_URL,
            },
          },
          buttons: [
            {
              title: "보러가기",
              link: {
                mobileWebUrl: SITE_URL,
                webUrl: SITE_URL,
              },
            },
          ],
        });

        return;
      }
    } catch (e) {
      console.log(e);
    }

    if (navigator.share) {
      navigator.share({
        title: "우리 사이",
        text: "우리 사이 궁합 봐봐 🐢",
        url: SITE_URL,
      });
    } else {
      navigator.clipboard.writeText(SITE_URL);
      alert("링크 복사 완료!");
    }
  };

  if (mode === "home") {
    return (
      <main className="phone">
        <div className="top-mini">
          <span>☰</span>
          <div className="logo-pill">우리 사이 🤍</div>
        </div>

        <section className="hero">
          <h1>
            너희 사이,
            <br />
            얼마나 특별할까?
          </h1>

          <p>
            생년월일, MBTI, 처음 만난 날로
            <br />
            둘만의 흐름을 분석해줄게!
          </p>

          <img src="/turtle-heart.png" alt="" className="hero-turtle" />
        </section>

        <div className="menu-wrap">
          <button className="menu-card" onClick={() => setMode("fortune")}>
            <div>
              <b>✨ 오늘의 운세</b>
              <p>오늘의 흐름과 기회</p>
            </div>
            <span>›</span>
          </button>

          <button className="menu-card" onClick={() => setMode("saju")}>
            <div>
              <b>💗 사주 궁합</b>
              <p>전문 사주 기반 분석</p>
            </div>
            <span>›</span>
          </button>

          <button className="menu-card" onClick={() => setMode("mbti")}>
            <div>
              <b>👥 MBTI 궁합</b>
              <p>성격 기반 궁합 분석</p>
            </div>
            <span>›</span>
          </button>
        </div>
      </main>
    );
  }

  if (mode === "fortune") {
    return (
      <main className="phone">
        <TopBar title="오늘의 운세" onBack={() => setMode("home")} />

        <div className="card">
          <h3>☀️ 내 정보</h3>

          <label>이름</label>
          <input
            value={fortuneForm.name}
            onChange={(e) => updateFortune("name", e.target.value)}
            placeholder="이름 입력"
          />

          <label>생년월일</label>

          <div className="date-row">
            <input
              placeholder="1998"
              value={fortuneForm.year}
              onChange={(e) =>
                updateFortune("year", e.target.value, 4)
              }
            />

            <input
              placeholder="05"
              value={fortuneForm.month}
              onChange={(e) =>
                updateFortune("month", e.target.value, 2)
              }
            />

            <input
              placeholder="14"
              value={fortuneForm.day}
              onChange={(e) =>
                updateFortune("day", e.target.value, 2)
              }
            />
          </div>

          <label>MBTI</label>

          <select
            value={fortuneForm.mbti}
            onChange={(e) =>
              updateFortune("mbti", e.target.value)
            }
          >
            <option value="">MBTI 선택</option>

            {mbtiList.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <button
            className="main-btn"
            onClick={() => {
              if (
                !fortuneForm.name ||
                !fortuneForm.year ||
                !fortuneForm.month ||
                !fortuneForm.day ||
                !fortuneForm.mbti
              ) {
                alert("정보를 다 입력해줘!");
                return;
              }

              savePerson(fortuneForm);
              setMode("fortuneResult");
            }}
          >
            오늘 운세 보기
          </button>
        </div>
      </main>
    );
  }

  if (mode === "fortuneResult") {
    return (
      <main className="phone">
        <TopBar
          title="오늘의 운세"
          onBack={() => setMode("home")}
          onShare={shareResult}
        />

        <div className="result-top">
          <img src="/turtle-wow.png" alt="" />

          <div className="speech">와아!</div>
        </div>

        <div className="card">
          <h2>🎵 오늘의 노래</h2>

          <p className="highlight">
            <b>NewJeans - Ditto</b>
          </p>

          <div className="youtube">
            <iframe
              src="https://www.youtube.com/embed/pSUydWEqKwE"
              title="youtube"
              allowFullScreen
            />
          </div>
        </div>

        <div className="card">
          <h2>✨ 오늘의 흐름</h2>

          <div className="fortune-text">
            <p>
              오늘은 <b>괜히 마음이 예민해지는 날</b>이야. 🐢
            </p>

            <p>
              특히 상대 반응 하나에 의미를 너무 크게 두면
              혼자 상처받기 쉬워.
            </p>

            <p>
              대신 오늘은 <b>가볍게 먼저 다가가는 행동</b>이
              좋은 흐름을 만들 수 있어.
            </p>

            <p>
              오후 시간대에 갑자기 들어오는 연락이나
              우연한 대화가 생각보다 오래 기억될 가능성이 커. ✨
            </p>

            <p>
              오늘의 럭키 컬러는 <b>올리브 그린</b>.
            </p>

            <p>
              차분한 색감이 상대에게 안정감을 주는 날이야.
            </p>

            <p>
              오늘은 “확인받으려는 말투”보다
              “편하게 던지는 말투”가 훨씬 잘 먹혀.
            </p>

            <p>
              그리고 오늘은 이상하게
              <b>옛 인연이나 지나간 관계</b>가 다시 생각날 수도 있어.
            </p>

            <p>
              그 감정이 다시 이어질 수도 있지만,
              단순히 외로움일 수도 있으니까 구분은 필요해.
            </p>

            <p>
              오늘의 격언 📜
              <br />
              <b>
                “흐르는 건 억지로 붙잡지 말고,
                남는 건 괜히 의심하지 마라.”
              </b>
            </p>
          </div>
        </div>

        <button
          className="main-btn"
          onClick={() => setMode("saju")}
        >
          💗 궁합 보러 가기
        </button>
      </main>
    );
  }

  return (
    <main className="phone">
      <TopBar
        title={
          mode === "saju"
            ? "사주 궁합"
            : mode === "mbti"
            ? "MBTI 궁합"
            : "결과"
        }
        onBack={() => setMode("home")}
        onShare={shareResult}
      />

      <div className="result-top">
        <img src="/turtle-wow.png" alt="" />
        <div className="speech">와아!</div>
      </div>

      <div className="card">
        <p className="score-label">궁합 점수</p>

        <h1 className="score">
          {score}
          <span>%</span>
        </h1>

        <p className="score-desc">
          생각보다 엄청 잘 맞는 조합이야!
        </p>

        <div className="bar">
          <div style={{ width: `${score}%` }} />
        </div>
      </div>

      <div className="card">
        <h2>
          {mode === "saju"
            ? "💗 사주 궁합"
            : "👥 MBTI 궁합"}
        </h2>

        <p className="preview">
          {mode === "saju"
            ? "둘은 서로를 신경 쓰게 되는 흐름이 강한 구조야."
            : "대화는 잘 되는데 감정 속도 차이가 꽤 큰 편이야."}
        </p>

        <div className="blur-wrap">
          <div className="blur-content">
            <p>
              실제로는 좋아하면서도 표현 타이밍이 자꾸
              어긋나는 타입이야.
            </p>

            <p>
              한쪽은 바로 풀고 싶어 하고,
              다른 한쪽은 혼자 정리하고 싶어 하는 흐름이 강해.
            </p>

            <p>
              그래서 감정은 있는데,
              서로 답답함을 느끼는 순간이 자주 생길 수 있어.
            </p>

            <p>
              특히 밤에 연락 이어질 때
              감정선이 급격히 가까워지는 타입이야.
            </p>
          </div>

          {!paid && (
            <div className="pay-lock">
              <img src="/turtle-heart.png" alt="" />

              <b>전체 해석은 결제 후 공개돼!</b>

              <button
                className="pay-btn"
                onClick={() => setPaid(true)}
              >
                카카오페이 990원 결제
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function TopBar({ title, onBack, onShare }) {
  return (
    <div className="top-bar">
      <button onClick={onBack}>‹</button>

      <b>{title}</b>

      <button onClick={onShare}>
        {onShare ? "⌯" : ""}
      </button>
    </div>
  );
}

function makeScore(form) {
  const text = Object.values(form).join("");

  let sum = 0;

  for (let i = 0; i < text.length; i++) {
    sum += text.charCodeAt(i);
  }

  return 70 + (sum % 25);
}