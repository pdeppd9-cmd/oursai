import { useEffect, useMemo, useState } from "react";
import "./App.css";

const SITE_URL = "https://oursai.vercel.app";
const KAKAO_JS_KEY = "392f84c5486937d26780349c72b4a1d8";
const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

const COIN_PACKS = [
  { id: "coin_1", label: "1코인", coins: 1, amount: 990, desc: "가볍게 한 번 보기" },
  { id: "coin_10", label: "10코인", coins: 10, amount: 9000, desc: "자주 보는 사람 추천" },
];

const FEATURE_COST = {
  saju: 1,
  mbti: 1,
  fortune: 0,
  birthdayBoard: 1,
  coupleAnimal: 1,
  youngPhoto: 1,
  romanceComic: 1,
  travelCollage: 1,
  personalColor: 1,
  hairStyle: 1,
  palmReading: 1,
};

const mbtiList = [
  "ISTJ","ISFJ","INFJ","INTJ","ISTP","ISFP","INFP","INTP",
  "ESTP","ESFP","ENFP","ENTP","ESTJ","ESFJ","ENFJ","ENTJ",
];

const relations = ["모름", "친구(썸)", "연애 중", "짝사랑", "전 연인", "부부", "비즈니스"];

const genderList = ["모름", "남자", "여자"];
const calendarList = ["양력", "음력"];
const birthHours = [
  "모름",
  "자시 23:30~01:29",
  "축시 01:30~03:29",
  "인시 03:30~05:29",
  "묘시 05:30~07:29",
  "진시 07:30~09:29",
  "사시 09:30~11:29",
  "오시 11:30~13:29",
  "미시 13:30~15:29",
  "신시 15:30~17:29",
  "유시 17:30~19:29",
  "술시 19:30~21:29",
  "해시 21:30~23:29",
];

const fortuneImages = [
  "001_lucky_shop.png","002_morning_sun.png","003_night_sky.png","004_love_heart.png","005_rain_umbrella.png",
  "006_coffee_break.png","007_studying.png","008_reading_book.png","009_writing.png","010_relaxed_couch.png",
  "023_letter.png","024_phone_call.png","025_message.png","045_calendar.png","048_checklist.png",
  "050_idea_bulb.png","051_success.png","061_shopping_bag.png","063_coins.png","071_door_open.png",
  "075_thinking.png","077_excited.png","083_alarm_clock.png","091_cloud.png","094_four_leaf_clover.png",
];

const songPool = [
  ["NewJeans - Ditto", "pSUydWEqKwE", "출근하면서 들어봐. 오늘 괜히 누가 생각나는 흐름이랑 잘 맞아."],
  ["Laufey - From The Start", "lSD_L-xic9o", "커피 마시면서 들어봐. 설레는데 과하지 않아서 딱 좋아."],
  ["IU - Love wins all", "JleoAppaxi0", "밤에 혼자 들으면 더 와닿아. 오늘 감정선 정리용."],
  ["The Weeknd - Out of Time", "2fDzCWNS3ig", "정리 안 된 마음 있을 때 들어봐. 타이밍 운이랑 잘 맞아."],
  ["Taylor Swift - Cruel Summer", "ic8j13piAhQ", "오늘은 좀 과감하게 움직일 때 들어봐."],
  ["Post Malone, Swae Lee - Sunflower", "ApXoWvfEYVU", "가볍게 기분 올리고 싶을 때 틀어봐."],
];

const colors = [
  { name: "블랙", cls: "black", text: "오늘은 가볍게 보여도 중심 잡힌 사람이 이기는 날이야." },
  { name: "네이비", cls: "navy", text: "신뢰감, 차분함, 일 처리 운을 올려주는 색이야." },
  { name: "베이지", cls: "beige", text: "부드럽게 다가가야 풀리는 관계운에 잘 맞아." },
  { name: "화이트", cls: "white", text: "복잡한 생각을 줄이고 깔끔한 인상을 만들어줘." },
  { name: "레드", cls: "red", text: "오늘은 존재감이 필요할 때 과감하게 밀어주는 색이야." },
  { name: "블루", cls: "blue", text: "말실수 줄이고 차분한 대화를 돕는 색이야." },
];

const itemPool = [
  ["거울", "오늘은 내 표정과 말투가 운을 바꿔. 나가기 전에 얼굴 한 번 보고 정리해."],
  ["작은 노트", "생각이 흩어지는 날이라 적는 순간 흐름이 잡혀."],
  ["향수", "사람 운이 들어오는 날. 은은한 인상이 생각보다 오래 남아."],
  ["텀블러", "급하게 움직이면 흐름이 깨져. 물 마시면서 한 박자 늦춰."],
  ["이어폰", "노래 하나가 오늘 분위기를 바꿔. 이동 중에 꼭 틀어봐."],
  ["손목시계", "타이밍 운이 중요해. 늦지 않는 것만으로도 이기는 날이야."],
];

export default function App() {
  const [mode, setMode] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [coins, setCoins] = useState(() => {
    const joined = localStorage.getItem("woorisai_joined_v1");
    const saved = localStorage.getItem("woorisai_coins_v1");

    if (!joined) {
      localStorage.setItem("woorisai_joined_v1", "true");
      localStorage.setItem("woorisai_coins_v1", "3");
      return 3;
    }

    return saved ? Number(saved) : 0;
  });

  const [unlockedReports, setUnlockedReports] = useState(() => {
    const saved = localStorage.getItem("woorisai_unlocked_reports_v1");
    return saved ? JSON.parse(saved) : {};
  });

  const [savedPeople, setSavedPeople] = useState(() => {
    const saved = localStorage.getItem("woorisai_people_v7");
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
    myGender: "모름",
    myCalendar: "양력",
    myYear: "",
    myMonth: "",
    myDay: "",
    myBirthHour: "모름",
    myBirthCity: "",
    myMbti: "",

    partnerName: "",
    partnerGender: "모름",
    partnerCalendar: "양력",
    partnerYear: "",
    partnerMonth: "",
    partnerDay: "",
    partnerBirthHour: "모름",
    partnerBirthCity: "",
    partnerMbti: "",

    metYear: "",
    metMonth: "",
    relation: "모름",
  });

  useEffect(() => {
    localStorage.setItem("woorisai_people_v7", JSON.stringify(savedPeople));
  }, [savedPeople]);

  useEffect(() => {
    localStorage.setItem("woorisai_coins_v1", String(coins));
  }, [coins]);

  useEffect(() => {
    localStorage.setItem("woorisai_unlocked_reports_v1", JSON.stringify(unlockedReports));
  }, [unlockedReports]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentKey = params.get("paymentKey");
    const orderId = params.get("orderId");
    const amount = params.get("amount");
    const failMessage = params.get("message");

    if (window.location.pathname === "/pay/fail") {
      alert(`결제가 취소되었거나 실패했어.\n${failMessage || ""}`);
      window.history.replaceState({}, "", "/");
      return;
    }

    if (window.location.pathname === "/pay/success" && paymentKey && orderId && amount) {
      confirmTossPayment({ paymentKey, orderId, amount });
    }
  }, []);

  const fortune = useMemo(() => makeDailyFortune(fortuneForm), [fortuneForm]);
  const score = useMemo(() => makeScore(form), [form]);
  const saju = useMemo(() => makeSajuData(form), [form]);
  const mbti = useMemo(() => makeMbtiData(form, score), [form, score]);

  const sajuKey = useMemo(() => makeReportKey("saju", form), [form]);
  const mbtiKey = useMemo(() => makeReportKey("mbti", form), [form]);

  const sajuUnlocked = Boolean(unlockedReports[sajuKey]);
  const mbtiUnlocked = Boolean(unlockedReports[mbtiKey]);

  const move = (nextMode) => {
    setMode(nextMode);
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmTossPayment = async ({ paymentKey, orderId, amount }) => {
    try {
      const response = await fetch("/api/toss-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: Number(amount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("결제 승인 실패");
        console.log(data);
        window.history.replaceState({}, "", "/");
        return;
      }

      const packId = localStorage.getItem("woorisai_pending_coin_pack");
      const pack = COIN_PACKS.find((x) => x.id === packId);
      const addCoins = pack ? pack.coins : Number(localStorage.getItem("woorisai_pending_coin_count") || 0);

      setCoins((prev) => prev + addCoins);

      localStorage.removeItem("woorisai_pending_coin_pack");
      localStorage.removeItem("woorisai_pending_coin_count");

      alert(`${addCoins}코인이 충전됐어.`);
      window.history.replaceState({}, "", "/");
      setMode("coin");
    } catch (e) {
      console.error(e);
      alert("결제 승인 중 오류가 났어.");
      window.history.replaceState({}, "", "/");
    }
  };

  const startTossCoinPay = async (pack) => {
    try {
      if (!window.TossPayments) {
        alert("토스 SDK 로딩 실패");
        return;
      }

      if (!TOSS_CLIENT_KEY) {
        alert("VITE_TOSS_CLIENT_KEY가 설정되지 않았어.");
        return;
      }

      localStorage.setItem("woorisai_pending_coin_pack", pack.id);
      localStorage.setItem("woorisai_pending_coin_count", String(pack.coins));

      const tossPayments = window.TossPayments(TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({
        customerKey: window.TossPayments.ANONYMOUS,
      });

      const orderId = `oursai_coin_${pack.coins}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: pack.amount,
        },
        orderId,
        orderName: `우리사이 ${pack.label} 충전`,
        successUrl: `${window.location.origin}/pay/success`,
        failUrl: `${window.location.origin}/pay/fail`,
        customerEmail: "test@oursai.com",
        customerName: form.myName || fortuneForm.name || "우리사이 사용자",
      });
    } catch (e) {
      console.error(e);
      alert("결제창을 여는 중 오류가 났어.");
    }
  };

  const unlockWithCoin = (type, key) => {
    const cost = FEATURE_COST[type] || 1;

    if (unlockedReports[key]) return true;

    if (coins < cost) {
      alert(`코인이 부족해. ${cost}코인이 필요해.`);
      setMode("coin");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }

    const ok = window.confirm(`${cost}코인을 사용해서 전체 해석을 열까?`);
    if (!ok) return false;

    setCoins((prev) => prev - cost);
    setUnlockedReports((prev) => ({
      ...prev,
      [key]: {
        type,
        openedAt: new Date().toISOString(),
      },
    }));

    alert("전체 해석이 열렸어.");
    return true;
  };

  const share = async () => {
    try {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_JS_KEY);

        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: "우리 사이 🐢💛",
            description: "오늘의 운세랑 궁합을 거북이가 몰래 봐줌",
            imageUrl: `${SITE_URL}/turtle_500x500.png`,
            link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL },
          },
          buttons: [
            {
              title: "나도 해보기",
              link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL },
            },
          ],
        });
        return;
      }
    } catch (e) {
      console.log(e);
    }

    if (navigator.share) {
      await navigator.share({
        title: "우리 사이",
        text: "우리 사이에서 봐봐 🐢💛",
        url: SITE_URL,
      });
    } else {
      await navigator.clipboard.writeText(SITE_URL);
      alert("링크 복사 완료!");
    }
  };

  const resetTestData = () => {
    const ok = window.confirm("테스트용 코인/해제 기록을 초기화할까?");
    if (!ok) return;

    localStorage.removeItem("woorisai_joined_v1");
    localStorage.removeItem("woorisai_coins_v1");
    localStorage.removeItem("woorisai_unlocked_reports_v1");
    setCoins(3);
    setUnlockedReports({});
    localStorage.setItem("woorisai_joined_v1", "true");
    localStorage.setItem("woorisai_coins_v1", "3");
    alert("초기화 완료. 3코인으로 돌아왔어.");
  };

  const savePerson = (p) => {
    if (!p.name) return;

    const clean = {
      name: p.name,
      gender: p.gender || "모름",
      calendar: p.calendar || "양력",
      year: p.year,
      month: p.month,
      day: p.day,
      birthHour: p.birthHour || "모름",
      birthCity: p.birthCity || "",
      mbti: p.mbti,
    };

    setSavedPeople((prev) => [clean, ...prev.filter((x) => x.name !== clean.name)].slice(0, 12));
  };

  const loadFortune = (name) => {
    const p = savedPeople.find((x) => x.name === name);
    if (p) setFortuneForm({ ...fortuneForm, name: p.name, year: p.year, month: p.month, day: p.day, mbti: p.mbti });
  };

  const loadPerson = (target, name) => {
    const p = savedPeople.find((x) => x.name === name);
    if (!p) return;

    if (target === "me") {
      setForm({
        ...form,
        myName: p.name,
        myGender: p.gender || "모름",
        myCalendar: p.calendar || "양력",
        myYear: p.year,
        myMonth: p.month,
        myDay: p.day,
        myBirthHour: p.birthHour || "모름",
        myBirthCity: p.birthCity || "",
        myMbti: p.mbti,
      });
    } else {
      setForm({
        ...form,
        partnerName: p.name,
        partnerGender: p.gender || "모름",
        partnerCalendar: p.calendar || "양력",
        partnerYear: p.year,
        partnerMonth: p.month,
        partnerDay: p.day,
        partnerBirthHour: p.birthHour || "모름",
        partnerBirthCity: p.birthCity || "",
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

  const validateCoupleForm = () => {
    if (!form.myName || !form.partnerName) {
      alert("이름은 둘 다 입력해줘.");
      return false;
    }

    if (!form.myYear || !form.myMonth || !form.myDay || !form.partnerYear || !form.partnerMonth || !form.partnerDay) {
      alert("생년월일은 둘 다 입력해줘.");
      return false;
    }

    return true;
  };

  const renderDrawer = () => (
    <Drawer open={drawerOpen} close={() => setDrawerOpen(false)} coins={coins}>
      <DrawerItem title="홈" desc="처음 화면" onClick={() => move("home")} />
      <DrawerItem title="오늘의 운세" desc="노래, 색, 아이템, 기회" onClick={() => move("fortune")} />
      <DrawerItem title="사주 궁합" desc="사주표와 관계 흐름 분석" onClick={() => move("saju")} />
      <DrawerItem title="MBTI 궁합" desc="성향과 대화 패턴 분석" onClick={() => move("mbti")} />

      <div className="drawer-line" />

      <DrawerItem title="생일 전광판" desc="사진, 이름, 생년월일로 전광판 만들기" onClick={() => move("comingBirthday")} />
      <DrawerItem title="커플 동물상" desc="커플 사진을 동물상 콘셉트로" onClick={() => move("comingAnimal")} />
      <DrawerItem title="어려지는 사진" desc="어릴 적 분위기로 변환" onClick={() => move("comingYoung")} />
      <DrawerItem title="순정만화 속 우리" desc="만화 주인공 분위기로 변환" onClick={() => move("comingComic")} />
      <DrawerItem title="여행 감성 콜라주" desc="사진 여러 장을 감성 기록으로" onClick={() => move("comingTravel")} />
      <DrawerItem title="퍼스널컬러 분석" desc="컬러, 분위기, 스타일 리포트" onClick={() => move("comingColor")} />
      <DrawerItem title="헤어스타일 추천" desc="얼굴형 기반 스타일 추천" onClick={() => move("comingHair")} />
      <DrawerItem title="손금 분석" desc="손바닥 사진 기반 리포트" onClick={() => move("comingPalm")} />

      <div className="drawer-line" />

      <DrawerItem title={`내 코인 ${coins}개`} desc="충전하고 기능 사용하기" onClick={() => move("coin")} />
      <DrawerItem title="내 보관함" desc="최근 생성 기록은 다음 단계에서 연결" onClick={() => move("library")} />
    </Drawer>
  );

  if (mode === "home") {
    return (
      <Phone>
        {renderDrawer()}

        <div className="home-top">
          <button className="hamburger" onClick={() => setDrawerOpen(true)}>☰</button>
          <b>우리 사이 🤍</b>
        </div>

        <section className="home-hero">
          <h1>너희 사이,<br />얼마나 특별할까?</h1>
          <p>생년월일, MBTI, 처음 만난 날로<br />둘만의 흐름을 분석해줄게!</p>
          <img src="/turtle-heart.png" alt="" />
        </section>

        <CoinMini coins={coins} onClick={() => move("coin")} />

        <div className="menu-list">
          <Menu icon="✨" title="오늘의 운세" desc="노래, 색, 아이템, 기회" onClick={() => move("fortune")} />
          <Menu icon="💗" title="사주 궁합" desc="사주표와 관계 흐름 분석" onClick={() => move("saju")} />
          <Menu icon="👥" title="MBTI 궁합" desc="성향과 대화 패턴 분석" onClick={() => move("mbti")} />
        </div>
      </Phone>
    );
  }

  if (mode === "coin") {
    return (
      <Phone>
        {renderDrawer()}
        <Top title="내 코인" back={() => move("home")} menu={() => setDrawerOpen(true)} />

        <Card className="coin-hero">
          <img src="/turtle-heart.png" alt="" />
          <p>현재 보유 코인</p>
          <h1>{coins}<span>개</span></h1>
          <small>가입 첫 방문 보너스 3코인은 자동 지급돼.</small>
        </Card>

        <Card>
          <h3>충전하기</h3>
          <p className="soft-text">사진 만들기, 사주 상세 보기, 궁합 상세 보기는 코인을 1개씩 사용해.</p>

          <div className="coin-pack-list">
            {COIN_PACKS.map((pack) => (
              <button key={pack.id} className="coin-pack" onClick={() => startTossCoinPay(pack)}>
                <div>
                  <b>{pack.label}</b>
                  <p>{pack.desc}</p>
                </div>
                <strong>{pack.amount.toLocaleString()}원</strong>
              </button>
            ))}
          </div>
        </Card>

        <button className="sub-btn" onClick={resetTestData}>테스트 초기화</button>
      </Phone>
    );
  }

  if (mode === "library") {
    return (
      <Phone>
        {renderDrawer()}
        <Top title="내 보관함" back={() => move("home")} menu={() => setDrawerOpen(true)} />
        <ComingSoonCard
          title="내 보관함"
          desc="사주 결과, 궁합 결과, 사진 생성 결과를 저장하는 공간이야. 다음 단계에서 DB 연결 후 제대로 붙이면 돼."
          coins={coins}
        />
      </Phone>
    );
  }

  if (mode.startsWith("coming")) {
    const data = getComingData(mode);
    return (
      <Phone>
        {renderDrawer()}
        <Top title={data.title} back={() => move("home")} menu={() => setDrawerOpen(true)} />
        <ComingSoonCard title={data.title} desc={data.desc} coins={coins} />
      </Phone>
    );
  }

  if (mode === "fortune") {
    return (
      <Phone>
        {renderDrawer()}
        <Top title="오늘의 운세" back={() => move("home")} menu={() => setDrawerOpen(true)} />

        <Card>
          <div className="input-guide">
            <img src="/turtle-heart.png" alt="" />
            <b>오늘 흐름을 보려면<br />정보를 입력해줘!</b>
          </div>

          <SavedPicker people={savedPeople} label="최근 입력한 정보" onSelect={loadFortune} />

          <label>이름</label>
          <input value={fortuneForm.name} placeholder="이름을 입력해주세요" onChange={(e) => updateFortune("name", e.target.value)} />

          <label>생년월일</label>
          <div className="date-row">
            <input placeholder="1998" value={fortuneForm.year} onChange={(e) => updateFortune("year", e.target.value, 4)} />
            <input placeholder="05" value={fortuneForm.month} onChange={(e) => updateFortune("month", e.target.value, 2)} />
            <input placeholder="14" value={fortuneForm.day} onChange={(e) => updateFortune("day", e.target.value, 2)} />
          </div>

          <label>MBTI</label>
          <select value={fortuneForm.mbti} onChange={(e) => updateFortune("mbti", e.target.value)}>
            <option value="">선택</option>
            <option value="">모름</option>
            {mbtiList.map((m) => <option key={m}>{m}</option>)}
          </select>

          <label>오늘 특별히 알고 싶은 것 <small>선택</small></label>
          <textarea
            placeholder="예: 연락운, 돈, 면접, 그 사람 마음, 이직"
            value={fortuneForm.topic}
            onChange={(e) => updateFortune("topic", e.target.value)}
          />

          <button
            className="main-btn"
            onClick={() => {
              if (!fortuneForm.name) {
                alert("이름은 입력해줘.");
                return;
              }
              savePerson({
                name: fortuneForm.name,
                year: fortuneForm.year,
                month: fortuneForm.month,
                day: fortuneForm.day,
                mbti: fortuneForm.mbti,
              });
              move("fortuneResult");
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
        {renderDrawer()}
        <Top title="오늘의 운세" back={() => move("home")} share={share} menu={() => setDrawerOpen(true)} />

        <section className="fortune-head">
          <p>{fortune.today}</p>
          <h1>{fortune.title}</h1>
          <SceneImage file={fortune.heroImage} className="hero-scene" />
        </section>

        <Card className="song-card">
          <SceneImage file={fortune.songImage} />
          <h3>🎵 오늘의 노래</h3>
          <b>{fortune.song}</b>
          <p className="song-line">{fortune.songLine}</p>
          <div className="youtube">
            <iframe src={`https://www.youtube.com/embed/${fortune.youtubeId}`} title={fortune.song} allowFullScreen />
          </div>
        </Card>

        <RevealCard icon="🎨" title="오늘의 럭키 컬러">
          <div className="color-card">
            <div className={`color-circle ${fortune.color.cls}`} />
            <div>
              <b>{fortune.color.name}</b>
              <p>{fortune.color.text}</p>
            </div>
          </div>
        </RevealCard>

        <RevealCard icon="🎁" title="오늘 올 기회">
          <SceneImage file={fortune.chanceImage} />
          <Paragraphs lines={fortune.chanceLines} />
        </RevealCard>

        <RevealCard icon="📜" title="오늘의 격언">
          <SceneImage file={fortune.quoteImage} />
          <Paragraphs lines={fortune.quoteLines} />
        </RevealCard>

        <RevealCard icon="🧩" title="오늘의 추천 아이템">
          <SceneImage file={fortune.itemImage} />
          <div className="item-card">
            <b>{fortune.item[0]}</b>
            <p>{fortune.item[1]}</p>
          </div>
        </RevealCard>

        <Card>
          <SceneImage file={fortune.mainImage} />
          <h3>🔥 거북이가 솔직히 말해줄게</h3>
          <Paragraphs lines={fortune.lines} />
        </Card>

        {fortuneForm.topic.trim() && (
          <Card>
            <SceneImage file={fortune.topicImage} />
            <h3>🔍 네가 물어본 것</h3>
            <p className="question">“{fortuneForm.topic}”</p>
            <Paragraphs lines={fortune.topicLines} />
          </Card>
        )}

        <button className="main-btn" onClick={() => move("saju")}>사주 궁합 보러 가기</button>
        <button className="sub-btn" onClick={() => move("mbti")}>MBTI 궁합 보러 가기</button>
      </Phone>
    );
  }

  if (mode === "saju" || mode === "mbti") {
    const isSaju = mode === "saju";

    return (
      <Phone>
        {renderDrawer()}
        <Top title={isSaju ? "사주 궁합" : "MBTI 궁합"} back={() => move("home")} menu={() => setDrawerOpen(true)} />

        <div className="step-row">
          <span className="active">1<br />정보 입력</span>
          <span>2<br />분석 중</span>
          <span>3<br />결과 보기</span>
        </div>

        <div className="input-guide">
          <img src="/turtle-heart.png" alt="" />
          <b>{isSaju ? "사주는 생년월일과 태어난 시간이 중요해!" : "MBTI 궁합은 성향만 따로 볼게!"}</b>
        </div>

        <Card>
          <h3>🟡 내 정보</h3>
          <SavedPicker people={savedPeople} label="최근 입력한 내 정보" onSelect={(name) => loadPerson("me", name)} />

          <label>이름</label>
          <input value={form.myName} placeholder="이름을 입력해주세요" onChange={(e) => updateForm("myName", e.target.value)} />

          {isSaju && (
            <>
              <label>성별</label>
              <select value={form.myGender} onChange={(e) => updateForm("myGender", e.target.value)}>
                {genderList.map((g) => <option key={g}>{g}</option>)}
              </select>

              <label>양력 / 음력</label>
              <select value={form.myCalendar} onChange={(e) => updateForm("myCalendar", e.target.value)}>
                {calendarList.map((c) => <option key={c}>{c}</option>)}
              </select>
            </>
          )}

          <label>생년월일</label>
          <div className="date-row">
            <input placeholder="1998" value={form.myYear} onChange={(e) => updateForm("myYear", e.target.value, 4)} />
            <input placeholder="05" value={form.myMonth} onChange={(e) => updateForm("myMonth", e.target.value, 2)} />
            <input placeholder="14" value={form.myDay} onChange={(e) => updateForm("myDay", e.target.value, 2)} />
          </div>

          {isSaju && (
            <>
              <label>태어난 시간</label>
              <select value={form.myBirthHour} onChange={(e) => updateForm("myBirthHour", e.target.value)}>
                {birthHours.map((h) => <option key={h}>{h}</option>)}
              </select>

              <label>태어난 지역 <small>선택</small></label>
              <input value={form.myBirthCity} placeholder="예: 서울, 천안, 부산" onChange={(e) => updateForm("myBirthCity", e.target.value)} />
            </>
          )}

          <label>MBTI</label>
          <select value={form.myMbti} onChange={(e) => updateForm("myMbti", e.target.value)}>
            <option value="">선택</option>
            <option value="">모름</option>
            {mbtiList.map((m) => <option key={m}>{m}</option>)}
          </select>
        </Card>

        <Card>
          <h3>🟢 상대 정보</h3>
          <SavedPicker people={savedPeople} label="최근 입력한 상대 정보" onSelect={(name) => loadPerson("partner", name)} />

          <label>이름</label>
          <input value={form.partnerName} placeholder="상대 이름을 입력해주세요" onChange={(e) => updateForm("partnerName", e.target.value)} />

          {isSaju && (
            <>
              <label>성별</label>
              <select value={form.partnerGender} onChange={(e) => updateForm("partnerGender", e.target.value)}>
                {genderList.map((g) => <option key={g}>{g}</option>)}
              </select>

              <label>양력 / 음력</label>
              <select value={form.partnerCalendar} onChange={(e) => updateForm("partnerCalendar", e.target.value)}>
                {calendarList.map((c) => <option key={c}>{c}</option>)}
              </select>
            </>
          )}

          <label>생년월일</label>
          <div className="date-row">
            <input placeholder="1996" value={form.partnerYear} onChange={(e) => updateForm("partnerYear", e.target.value, 4)} />
            <input placeholder="09" value={form.partnerMonth} onChange={(e) => updateForm("partnerMonth", e.target.value, 2)} />
            <input placeholder="23" value={form.partnerDay} onChange={(e) => updateForm("partnerDay", e.target.value, 2)} />
          </div>

          {isSaju && (
            <>
              <label>태어난 시간</label>
              <select value={form.partnerBirthHour} onChange={(e) => updateForm("partnerBirthHour", e.target.value)}>
                {birthHours.map((h) => <option key={h}>{h}</option>)}
              </select>

              <label>태어난 지역 <small>선택</small></label>
              <input value={form.partnerBirthCity} placeholder="예: 서울, 천안, 부산" onChange={(e) => updateForm("partnerBirthCity", e.target.value)} />
            </>
          )}

          <label>MBTI</label>
          <select value={form.partnerMbti} onChange={(e) => updateForm("partnerMbti", e.target.value)}>
            <option value="">선택</option>
            <option value="">모름</option>
            {mbtiList.map((m) => <option key={m}>{m}</option>)}
          </select>
        </Card>

        <Card>
          <h3>💗 우리 관계</h3>
          <label>처음 만난 달</label>
          <div className="date-row two">
            <input placeholder="2024" value={form.metYear} onChange={(e) => updateForm("metYear", e.target.value, 4)} />
            <input placeholder="11" value={form.metMonth} onChange={(e) => updateForm("metMonth", e.target.value, 2)} />
          </div>

          <label>관계</label>
          <select value={form.relation} onChange={(e) => updateForm("relation", e.target.value)}>
            {relations.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Card>

        <button
          className="main-btn"
          onClick={() => {
            if (!validateCoupleForm()) return;

            savePerson({
              name: form.myName,
              gender: form.myGender,
              calendar: form.myCalendar,
              year: form.myYear,
              month: form.myMonth,
              day: form.myDay,
              birthHour: form.myBirthHour,
              birthCity: form.myBirthCity,
              mbti: form.myMbti,
            });

            savePerson({
              name: form.partnerName,
              gender: form.partnerGender,
              calendar: form.partnerCalendar,
              year: form.partnerYear,
              month: form.partnerMonth,
              day: form.partnerDay,
              birthHour: form.partnerBirthHour,
              birthCity: form.partnerBirthCity,
              mbti: form.partnerMbti,
            });

            move(isSaju ? "sajuResult" : "mbtiResult");
          }}
        >
          분석하기
        </button>
      </Phone>
    );
  }

  if (mode === "sajuResult") {
    return (
      <ResultShell title="사주 궁합 결과" score={score} back={() => move("home")} share={share} menu={() => setDrawerOpen(true)} coins={coins}>
        {renderDrawer()}

        <Card className="summary-card">
          <h3>한 줄 요약</h3>
          <p>{saju.summary}</p>
        </Card>

        <Card>
          <SceneImage file={saju.eventImage} />
          <h3>이 둘 사이에 있을 법한 사건</h3>
          <p className="event-text">{saju.event}</p>
        </Card>

        <Card>
          <h3>사주 구성표</h3>
          <SajuTable title="내 사주" data={saju.myTable} />
          <SajuTable title="상대 사주" data={saju.partnerTable} />
        </Card>

        <Card>
          <h3>무료 핵심 해석</h3>
          <Paragraphs lines={saju.freeLines} />
        </Card>

        <CoinLockedArea
          unlocked={sajuUnlocked}
          cost={FEATURE_COST.saju}
          coins={coins}
          onUnlock={() => unlockWithCoin("saju", sajuKey)}
        >
          <Card>
            <SceneImage file={saju.detailImage} />
            <h3>🔮 사주 전문 풀이</h3>
            <Paragraphs lines={saju.lines} />
          </Card>
        </CoinLockedArea>

        <button className="sub-btn" onClick={share}>공유하기</button>
        <button className="sub-btn" onClick={resetTestData}>테스트 초기화</button>
      </ResultShell>
    );
  }

  if (mode === "mbtiResult") {
    return (
      <ResultShell title="MBTI 궁합 결과" score={score} back={() => move("home")} share={share} menu={() => setDrawerOpen(true)} coins={coins}>
        {renderDrawer()}

        <Card className="summary-card">
          <h3>한 줄 요약</h3>
          <p>{mbti.summary}</p>
        </Card>

        <Card>
          <SceneImage file={mbti.eventImage} />
          <h3>{form.myMbti || "나"} × {form.partnerMbti || "상대"}</h3>
          <MbtiBadge my={form.myMbti} partner={form.partnerMbti} />
          <p className="event-text">{mbti.event}</p>
        </Card>

        <Card>
          <h3>MBTI 궁합표</h3>
          <MbtiTable rows={mbti.rows} />
        </Card>

        <CoinLockedArea
          unlocked={mbtiUnlocked}
          cost={FEATURE_COST.mbti}
          coins={coins}
          onUnlock={() => unlockWithCoin("mbti", mbtiKey)}
        >
          <Card>
            <SceneImage file={mbti.detailImage} />
            <h3>💬 MBTI 상세 풀이</h3>
            <Paragraphs lines={mbti.lines} />
          </Card>
        </CoinLockedArea>

        <button className="sub-btn" onClick={share}>공유하기</button>
        <button className="sub-btn" onClick={resetTestData}>테스트 초기화</button>
      </ResultShell>
    );
  }

  return null;
}

function Phone({ children }) {
  return <main className="phone">{children}</main>;
}

function Top({ title, back, share, menu }) {
  return (
    <div className="top-bar">
      <button onClick={back}>‹</button>
      <b>{title}</b>
      <button onClick={share || menu || (() => {})}>{share ? "⌯" : menu ? "☰" : ""}</button>
    </div>
  );
}

function Card({ children, className = "" }) {
  return <section className={`card ${className}`}>{children}</section>;
}

function Menu({ icon, title, desc, onClick }) {
  return (
    <button className="menu-card" onClick={onClick}>
      <span>{icon}</span>
      <div><b>{title}</b><p>{desc}</p></div>
      <em>›</em>
    </button>
  );
}

function Drawer({ open, close, coins, children }) {
  return (
    <>
      <div className={`drawer-dim ${open ? "show" : ""}`} onClick={close} />
      <aside className={`drawer ${open ? "show" : ""}`}>
        <div className="drawer-head">
          <div>
            <b>우리 사이 🤍</b>
            <p>보유 코인 {coins}개</p>
          </div>
          <button onClick={close}>×</button>
        </div>
        <div className="drawer-body">{children}</div>
      </aside>
    </>
  );
}

function DrawerItem({ title, desc, onClick }) {
  return (
    <button className="drawer-item" onClick={onClick}>
      <b>{title}</b>
      <p>{desc}</p>
    </button>
  );
}

function CoinMini({ coins, onClick }) {
  return (
    <button className="coin-mini" onClick={onClick}>
      <span>🪙</span>
      <b>{coins}코인 보유</b>
      <em>충전하기 ›</em>
    </button>
  );
}

function ComingSoonCard({ title, desc, coins }) {
  return (
    <Card className="coming-card">
      <img src="/turtle-wow.png" alt="" />
      <h2>{title}</h2>
      <p>{desc}</p>
      <div className="coming-price">
        <b>사용 예정 코인</b>
        <span>1코인</span>
      </div>
      <small>현재 보유 코인: {coins}개</small>
    </Card>
  );
}

function SavedPicker({ people, label, onSelect }) {
  if (!people.length) return null;
  return (
    <>
      <label>{label}</label>
      <select onChange={(e) => e.target.value && onSelect(e.target.value)}>
        <option value="">불러오기</option>
        {people.map((p) => (
          <option key={p.name} value={p.name}>
            {p.name} · {p.year || "모름"}.{p.month || "모름"}.{p.day || "모름"} · {p.mbti || "모름"}
          </option>
        ))}
      </select>
    </>
  );
}

function RevealCard({ icon, title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="card reveal" onClick={() => setOpen(true)}>
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

function SceneImage({ file, className = "" }) {
  const [broken, setBroken] = useState(false);
  if (!file || broken) return null;

  return (
    <img
      src={`/fortune-images/${file}`}
      alt=""
      className={`fortune-scene ${className}`}
      onError={() => setBroken(true)}
    />
  );
}

function ResultShell({ title, score, back, share, menu, coins, children }) {
  return (
    <Phone>
      <Top title={title} back={back} share={share} menu={menu} />

      <CoinMini coins={coins} onClick={() => { window.location.href = "/"; }} />

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
      <div><b>{title}</b><p>{desc}</p></div>
      <strong style={{ color }}>{value}%</strong>
    </div>
  );
}

function SajuTable({ title, data }) {
  return (
    <div className="saju-card">
      <h4>{title}</h4>
      <div className="saju-head"><span>시주</span><span>일주</span><span>월주</span><span>년주</span></div>
      <div className="saju-row gods">{data.topGods.map((x, i) => <span key={i}>{x}</span>)}</div>
      <div className="saju-row boxes">{data.top.map((x, i) => <SajuBox key={i} item={x} />)}</div>
      <div className="saju-row boxes">{data.bottom.map((x, i) => <SajuBox key={i} item={x} />)}</div>
      <div className="saju-row gods">{data.bottomGods.map((x, i) => <span key={i}>{x}</span>)}</div>
      <div className="saju-note">{data.note}</div>
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

function MbtiBadge({ my, partner }) {
  return (
    <div className="mbti-badge">
      <div><b>{my || "ME"}</b><span>나의 성향</span></div>
      <strong>×</strong>
      <div><b>{partner || "YOU"}</b><span>상대 성향</span></div>
    </div>
  );
}

function MbtiTable({ rows }) {
  return (
    <div className="mbti-table">
      {rows.map((r) => (
        <div key={r.label}><b>{r.label}</b><span>{r.value}</span></div>
      ))}
    </div>
  );
}

function CoinLockedArea({ unlocked, cost, coins, onUnlock, children }) {
  return (
    <div className="paid-area">
      <div className={unlocked ? "" : "locked"}>{children}</div>

      {!unlocked && (
        <div className="lock-cover">
          <img src="/turtle-heart.png" alt="" />
          <h3>전체 해석은 코인 사용 후 열려요</h3>
          <p>전문 용어, 이유, 실제 사건 예시까지 전부 풀어줄게.</p>
          <p className="coin-status">보유 코인 {coins}개 · 필요 코인 {cost}개</p>
          <button className="pay-btn" onClick={onUnlock}>
            🪙 {cost}코인 사용하고 전체 보기
          </button>
        </div>
      )}
    </div>
  );
}

function Paragraphs({ lines }) {
  return (
    <div className="paragraphs">
      {lines.map((line, i) => <p key={i}><Bold text={line} /></p>)}
    </div>
  );
}

function Bold({ text }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

function pickImage(seed, offset = 0) {
  return fortuneImages[Math.abs(seed + offset) % fortuneImages.length];
}

function makeSeed(input, daily = false) {
  const now = new Date();
  const key = daily ? `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}` : "";
  const text = JSON.stringify(input) + key;
  let seed = 0;
  for (let i = 0; i < text.length; i++) seed = (seed * 31 + text.charCodeAt(i)) % 1000003;
  return seed;
}

function makeReportKey(type, input) {
  return `${type}_${makeSeed(input, false)}`;
}

function makeScore(input) {
  const seed = makeSeed(input, false);
  const birthGap = Math.abs(Number(input.myDay || 0) - Number(input.partnerDay || 0));
  const monthGap = Math.abs(Number(input.myMonth || 0) - Number(input.partnerMonth || 0));
  const relationBonus = input.relation === "연애 중" ? 5 : input.relation === "친구(썸)" ? 3 : 0;

  return clamp(62 + (seed % 27) - Math.min(8, birthGap) + Math.max(0, 6 - monthGap) + relationBonus);
}

function clamp(n) {
  return Math.max(0, Math.min(100, n));
}

function makeDailyFortune(input) {
  const seed = makeSeed(input, true);
  const song = songPool[seed % songPool.length];
  const color = colors[seed % colors.length];
  const item = itemPool[seed % itemPool.length];
  const topic = input.topic.trim();

  return {
    today: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }),
    title: `${input.name || "너"}의 오늘 운세`,
    song: song[0],
    youtubeId: song[1],
    songLine: song[2],
    color,
    item,
    heroImage: pickImage(seed, 2),
    songImage: pickImage(seed, 38),
    chanceImage: pickImage(seed, 50),
    quoteImage: pickImage(seed, 92),
    itemImage: pickImage(seed, 63),
    mainImage: pickImage(seed, 75),
    topicImage: pickImage(seed, 24),
    chanceLines: [
      `오늘의 기회는 **크게 울리는 사건**보다 작게 스치는 신호로 들어와. 짧은 연락, 갑작스러운 제안, 평소엔 대수롭지 않게 넘겼던 말 하나가 오늘은 꽤 중요한 힌트가 될 수 있어. 🎁`,
      `특히 오후에는 사람을 통해 운이 열릴 가능성이 커. 누가 뭔가를 물어보거나 가볍게 말을 걸면, 대충 넘기지 말고 한 번 더 이어가 봐.`,
    ],
    quoteLines: [
      `“흐르는 건 억지로 붙잡지 말고, 남는 건 괜히 의심하지 마라.” 오늘은 이 말이 꽤 중요해. 📜`,
      `붙잡아야 할 것과 흘려보내야 할 것을 구분해야 운이 덜 꼬여. 전부 다 확인하려고 들면 오히려 중요한 감각을 놓칠 수 있어.`,
    ],
    lines: makeFortuneLines(input, color),
    topicLines: topic ? makeTopicLines(topic) : [],
  };
}

function makeFortuneLines(input, color) {
  return [
    `오늘은 **가만히 있으면 손해 보는 날**이야. 괜히 눈치만 보다가 타이밍을 놓치면 나중에 아쉬움이 남을 수 있어. 특히 오전에는 흐름이 느리게 느껴질 수 있는데, 이건 운이 막힌 게 아니라 아직 판이 덜 열린 거야. 🐢 오후로 갈수록 사람이든 일이든 움직일 명분이 생길 가능성이 커.`,
    `오늘의 핵심은 **짧고 분명하게 말하기**야. 길게 설명하면 진심보다 불안처럼 보일 수 있어. 누군가에게 연락하고 싶다면 무겁게 시작하지 말고, 가볍게 던지는 말로 문을 여는 게 좋아. 오늘은 깊은 고백보다 작은 신호가 훨씬 잘 먹히는 날이야.`,
    `돈이나 일 쪽에서는 작은 제안, 짧은 알림, 갑작스러운 일정 변경을 그냥 넘기지 마. 거기에 힌트가 있어. 완벽하게 준비하려고 하면 오히려 시작이 늦어질 수 있으니까, **70% 준비됐을 때 움직이는 것**이 오늘은 더 유리해. ✨`,
    `연애운은 직접적으로 세게 오는 게 아니라, 살짝 건드렸을 때 상대가 반응하는 식으로 와. 상대 반응이 미묘해도 바로 상처받지 마. 오늘은 상대도 자기 감정을 늦게 알아차릴 수 있어. 중요한 건 확인받으려는 말투가 아니라, 분위기를 회복시키는 말투야.`,
    `오늘 조심할 건 **혼자 상상해서 결론 내리기**야. 아직 일어나지도 않은 일을 머릿속에서 끝까지 굴리면 하루가 무너져. 누군가의 말투가 짧거나 답장이 늦어도 그걸 바로 거절로 해석하지 마. 오늘은 감정이 확대경처럼 작동하는 날이라, 작은 신호가 너무 크게 보일 수 있어.`,
    `럭키 컬러는 **${color.name}** 쪽이 좋아. 오늘은 색이 단순한 장식이 아니라 네 태도를 바꿔주는 장치처럼 작동해. 옷이든 소품이든 이 색을 살짝 넣으면 말이 부드러워지고, 행동에 힘이 붙는 느낌을 받을 수 있어. 🎨`,
    `관계에서는 너무 많은 의미를 요구하지 마. 오늘은 확인보다 **분위기 회복**이 먼저야. 괜히 “그래서 나 어떻게 생각해?” 같은 식으로 압박하면 흐름이 닫힐 수 있어. 반대로 가볍게 웃고 넘기면 상대가 스스로 더 말하게 될 가능성이 커.`,
    `결론은 이거야. 오늘은 **망설이면 지나가고, 가볍게 잡으면 열리는 날**이야. 완벽한 확신을 기다리지 말고, 작은 행동부터 해. 오늘의 운은 큰 결심보다 작은 시작에 붙어 있어. 🌟`,
  ];
}

function makeTopicLines(topic) {
  return [
    `네가 물어본 **${topic}** 쪽은 오늘 바로 결론이 나는 흐름은 아니야. 대신 작은 신호가 먼저 와. 말투, 제안, 연락, 표정 같은 사소한 것에서 방향이 보일 가능성이 커. 지금은 답을 강하게 요구하기보다 상황이 열릴 틈을 만드는 게 더 중요해.`,
    `대처법은 단순해. **확인하려고 몰아붙이지 말고**, 상대나 상황이 반응할 수 있는 여지를 줘. 오늘은 세게 밀면 막히고, 부드럽게 건드리면 풀리는 쪽이야. 마음가짐은 “당장 답을 받겠다”가 아니라 “흐름을 내가 유리하게 만들겠다”가 좋아.`,
    `사람이 얽힌 문제라면 반응을 관찰해. 돈이나 일과 관련된 문제라면 큰 선택보다 작은 정리가 먼저야. 지금 마음이 급하다면 그 자체가 변수야. 급한 상태에서 내린 결정은 나중에 수정 비용이 커질 수 있어.`,
    `오늘 이 주제는 완성되는 문제가 아니라 **첫 단서가 열리는 문제**로 보는 게 맞아. 그러니까 결과가 바로 안 나와도 실패라고 생각하지 마. 오늘은 방향만 잡아도 충분히 이긴 거야.`,
  ];
}

function makeSajuData(form) {
  const seed = makeSeed(form, false);

  const myProfile = {
    name: form.myName || "나",
    gender: form.myGender,
    calendar: form.myCalendar,
    year: form.myYear,
    month: form.myMonth,
    day: form.myDay,
    birthHour: form.myBirthHour,
    birthCity: form.myBirthCity,
  };

  const partnerProfile = {
    name: form.partnerName || "상대",
    gender: form.partnerGender,
    calendar: form.partnerCalendar,
    year: form.partnerYear,
    month: form.partnerMonth,
    day: form.partnerDay,
    birthHour: form.partnerBirthHour,
    birthCity: form.partnerBirthCity,
  };

  const myTable = buildSimpleSajuTable(myProfile);
  const partnerTable = buildSimpleSajuTable(partnerProfile);

  const myDayStem = myTable.top[1].char;
  const partnerDayStem = partnerTable.top[1].char;
  const relationType = judgeSajuRelation(myDayStem, partnerDayStem, myTable.bottom[1].char, partnerTable.bottom[1].char);

  return {
    summary: relationType.summary,
    eventImage: pickImage(seed, 23),
    detailImage: pickImage(seed, 47),
    event: makeSajuEvent(form, relationType),
    myTable,
    partnerTable,
    freeLines: makeFreeSajuLines(form, relationType),
    lines: makeLongSajuLines(seed, form, myTable, partnerTable, relationType),
  };
}

function buildSimpleSajuTable(profile) {
  const tenGods = ["비견","겁재","식신","상관","편재","정재","편관","정관","편인","정인"];
  const stems = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
  const stemKr = ["갑","을","병","정","무","기","경","신","임","계"];
  const branches = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
  const branchKr = ["자","축","인","묘","진","사","오","미","신","유","술","해"];
  const tones = ["green","green","red","red","yellow","yellow","white","white","dark","dark"];

  const y = Number(profile.year || 1998);
  const m = Number(profile.month || 1);
  const d = Number(profile.day || 1);
  const hIndex = Math.max(0, birthHours.indexOf(profile.birthHour));

  const yearStem = mod(y - 4, 10);
  const yearBranch = mod(y - 4, 12);

  const monthStem = mod(yearStem * 2 + m + 1, 10);
  const monthBranch = mod(m + 1, 12);

  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(y, Math.max(0, m - 1), d);
  const dayDiff = Math.floor((targetDate - baseDate) / 86400000);
  const dayStem = mod(dayDiff + 10, 10);
  const dayBranch = mod(dayDiff + 12, 12);

  const hourStem = hIndex === 0 ? mod(dayStem * 2, 10) : mod(dayStem * 2 + hIndex - 1, 10);
  const hourBranch = hIndex === 0 ? mod(dayBranch, 12) : mod(hIndex - 1, 12);

  const topIndex = [hourStem, dayStem, monthStem, yearStem];
  const bottomIndex = [hourBranch, dayBranch, monthBranch, yearBranch];

  const top = topIndex.map((idx) => ({
    char: stems[idx],
    kr: stemKr[idx],
    tone: tones[idx],
  }));

  const bottom = bottomIndex.map((idx) => ({
    char: branches[idx],
    kr: branchKr[idx],
    tone: ["dark","yellow","green","green","yellow","red","red","yellow","white","white","yellow","dark"][idx],
  }));

  return {
    topGods: topIndex.map((idx, i) => tenGods[mod(idx + i, 10)]),
    bottomGods: bottomIndex.map((idx, i) => tenGods[mod(idx + i + 4, 10)]),
    top,
    bottom,
    note: profile.calendar === "음력"
      ? "현재는 간이 표시입니다. 음력 정밀 변환은 만세력 API 연결 후 보강 필요."
      : "현재는 양력 기준 간이 표시입니다. 절기 기준 정밀 만세력은 추후 API로 보강 가능.",
  };
}

function judgeSajuRelation(myStem, partnerStem, myBranch, partnerBranch) {
  const stemElement = {
    甲: "wood", 乙: "wood",
    丙: "fire", 丁: "fire",
    戊: "earth", 己: "earth",
    庚: "metal", 辛: "metal",
    壬: "water", 癸: "water",
  };

  const branchGroup = {
    子: "water", 丑: "earth", 寅: "wood", 卯: "wood",
    辰: "earth", 巳: "fire", 午: "fire", 未: "earth",
    申: "metal", 酉: "metal", 戌: "earth", 亥: "water",
  };

  const a = stemElement[myStem];
  const b = stemElement[partnerStem];
  const ba = branchGroup[myBranch];
  const bb = branchGroup[partnerBranch];

  if (a === b) {
    return {
      type: "same",
      summary: "서로 닮아서 빠르게 편해지지만, 고집이 부딪히면 쉽게 물러서지 않는 조합.",
      keyword: "닮은 기운",
    };
  }

  if (
    (a === "wood" && b === "fire") ||
    (a === "fire" && b === "earth") ||
    (a === "earth" && b === "metal") ||
    (a === "metal" && b === "water") ||
    (a === "water" && b === "wood")
  ) {
    return {
      type: "give",
      summary: "한쪽이 다른 한쪽의 흐름을 키워주는 구조라, 관계가 자연스럽게 깊어질 수 있는 조합.",
      keyword: "생해주는 기운",
    };
  }

  if (ba === bb) {
    return {
      type: "hiddenSame",
      summary: "겉으로는 달라 보여도 속도와 감정 반응이 닮아, 시간이 지날수록 묘하게 편해지는 조합.",
      keyword: "속궁합형 기운",
    };
  }

  return {
    type: "tension",
    summary: "끌림은 강하지만 속도와 표현 방식이 달라, 조율이 안 되면 피로해질 수 있는 조합.",
    keyword: "긴장과 끌림",
  };
}

function makeSajuEvent(form, relationType) {
  const nameA = form.myName || "한쪽";
  const nameB = form.partnerName || "상대";

  if (relationType.type === "same") {
    return `${nameA}와 ${nameB}는 별것 아닌 말장난이나 취향 하나로 확 가까워질 수 있어. 다만 둘 다 자존심이 올라오는 순간에는 먼저 미안하다고 말하기가 어려워지는 사건이 생기기 쉬워.`;
  }

  if (relationType.type === "give") {
    return `${nameA}가 무심코 던진 응원이나 챙김이 ${nameB}에게 오래 남을 수 있어. 이 관계는 거창한 고백보다 반복되는 작은 배려 때문에 마음이 움직이는 사건이 생기기 쉬워.`;
  }

  if (relationType.type === "hiddenSame") {
    return `처음엔 서로 다르다고 느끼다가, 어느 날 같은 부분에서 웃거나 같은 타이밍에 서운해하면서 묘하게 마음을 확인하는 사건이 생기기 쉬워.`;
  }

  return `둘은 연락 타이밍이나 말투 하나 때문에 갑자기 분위기가 어색해질 수 있어. 그런데 그 불편함을 피하지 않고 풀어내면 오히려 관계가 더 깊어지는 사건이 생기기 쉬워.`;
}

function makeFreeSajuLines(form, relationType) {
  return [
    `이 궁합의 첫인상은 **${relationType.keyword}**이야. 단순히 잘 맞는다, 안 맞는다로 보기보다 두 사람이 가까워질 때 어떤 방식으로 마음이 움직이는지를 보는 게 중요해. ${form.relation || "관계"}라는 현재 상태를 놓고 보면, 지금은 확신보다 흐름을 읽는 게 먼저야.`,
    `무료 핵심만 보면 이 관계는 초반의 호기심이 꽤 강하게 들어오는 편이야. 다만 끌림이 있다고 해서 바로 안정으로 이어지는 건 아니야. 사주 궁합에서는 **일간의 반응**, **월지의 생활 리듬**, **시주의 감정 표현 방식**이 같이 봐야 관계의 실제 체감이 나와.`,
    `특히 둘 중 한쪽이 감정을 빨리 확인하려고 하면 관계가 조금 무거워질 수 있어. 반대로 천천히 보려는 쪽이 너무 표현을 아끼면 상대는 거리감으로 받아들일 수 있어. 그래서 이 관계는 마음의 크기보다 **표현 속도 조절**이 훨씬 중요해.`,
  ];
}

function makeLongSajuLines(seed, form, myTable, partnerTable, relationType) {
  const myName = form.myName || "나";
  const partnerName = form.partnerName || "상대";

  return [
    `${myName}의 일주 흐름을 보면 중심 기운이 **${myTable.top[1].char}${myTable.bottom[1].char}** 쪽으로 잡혀 있고, ${partnerName}의 일주는 **${partnerTable.top[1].char}${partnerTable.bottom[1].char}** 쪽으로 잡혀 있어. 일주는 관계에서 가장 직접적으로 부딪히는 자리라서, 둘이 실제로 대화할 때 편한지 불편한지를 보는 핵심 자리야. 이 조합은 ${relationType.summary}`,
    `사주에서 **년주**는 첫 이미지와 바깥에서 보이는 분위기, **월주**는 생활 리듬과 현실 감각, **일주**는 마음의 중심과 관계 방식, **시주**는 깊은 속마음과 미래 방향을 보는 자리야. 지금 표에서 가장 먼저 봐야 할 건 일주와 월주의 흐름이야. 겉으로 끌려도 생활 리듬이 안 맞으면 금방 피곤해지고, 반대로 처음엔 애매해도 월주의 흐름이 맞으면 관계가 오래 간다.`,
    `두 사람 사이에는 **편관과 정인**의 느낌이 섞여 있어. 편관은 긴장감, 자극, 신경 쓰임을 만들고 정인은 이해, 보호, 받아줌을 만들어. 이 둘이 같이 작동하면 처음엔 괜히 의식되고, 어느 순간부터는 상대가 나를 어떻게 보는지가 꽤 중요해져. 그래서 이 관계는 가벼운 호감으로 시작해도 마음속에서는 생각보다 깊게 굴러갈 수 있어.`,
    `다만 이 궁합에서 조심해야 할 건 **확인 욕구**야. 한쪽이 “우리 지금 무슨 사이야?”를 빨리 확인하고 싶어질 수 있고, 다른 한쪽은 아직 말을 정리하지 못했는데 압박받는 느낌을 받을 수 있어. 사주적으로 보면 이건 마음이 없어서가 아니라 감정을 처리하는 속도가 달라서 생기는 문제야.`,
    `${myName} 쪽은 감정이 올라오면 머릿속에서 먼저 여러 가능성을 계산하는 흐름이 있고, ${partnerName} 쪽은 분위기나 타이밍에 따라 반응이 달라지는 흐름이 있어. 그래서 둘이 잘 맞을 때는 굉장히 자연스럽게 붙지만, 어긋날 때는 사소한 말투 하나가 크게 남을 수 있어. 특히 연락 텀, 약속 변경, 농담의 선에서 오해가 생기기 쉬워.`,
    `이 관계의 장점은 서로에게 없는 기운을 건드린다는 거야. 한쪽은 상대에게 현실감을 주고, 다른 한쪽은 상대에게 감정의 온도를 줘. 둘이 안정적으로 만나면 서로의 부족한 부분을 채워주는 느낌이 강해져. 하지만 이 균형이 깨지면 한쪽은 답답하고, 다른 한쪽은 불안해질 수 있어.`,
    `궁합에서 **식신과 상관**의 흐름은 말투와 표현 방식으로 드러나. 식신은 편안하게 풀어내는 말이고, 상관은 예민하고 직설적인 표현이야. 이 둘이 어긋나면 한쪽은 장난으로 한 말인데 다른 한쪽은 상처로 받을 수 있어. 그래서 이 관계는 말의 내용보다 말이 나온 분위기가 더 중요해.`,
    `재성 흐름은 현실적인 챙김과 데이트 방식에서 나타나. 돈을 많이 쓰는 것보다, 상대가 필요로 하는 순간에 맞춰주는 행동이 더 크게 먹혀. 예를 들어 추운 날 따뜻한 음료를 챙기거나, 바쁜 날 시간을 맞춰주는 식의 행동이 이 궁합에서는 꽤 강한 신호가 돼.`,
    `관계가 흔들릴 때는 누가 더 좋아하느냐를 따지면 더 꼬여. 이 궁합은 애정의 양보다 **리듬의 안정성**이 중요해. 좋아하는 마음이 있어도 표현 리듬이 불안정하면 상대는 확신을 못 느끼고, 반대로 마음이 천천히 커지는 사람에게 계속 답을 요구하면 관계가 닫힐 수 있어.`,
    `${form.metYear || "처음 만난 해"}년 ${form.metMonth || "그"}월의 흐름은 이 관계에서 출발점 역할을 해. 처음 만났을 때 강한 인상이 있었든 없었든, 시간이 지나면서 다시 생각나는 요소가 남기 쉬운 구조야. 특히 우연히 다시 연락이 닿거나, 별생각 없이 만났는데 분위기가 달라지는 장면이 생기기 쉽다.`,
    `이 궁합에서 가장 좋은 전략은 **가볍게 시작해서 꾸준히 반복하는 것**이야. 처음부터 너무 무거운 말로 관계를 정의하려고 하면 상대가 부담을 느낄 수 있어. 대신 같은 방향의 행동을 반복하면 상대가 안정감을 느끼고 마음을 열 가능성이 커져.`,
    `결론적으로 이 사주는 **끌림과 조율이 같이 필요한 궁합**이야. 마음이 생기는 힘은 있지만, 그 마음을 오래 유지하려면 속도를 맞춰야 해. 빠른 확신을 요구하기보다 느린 일관성을 확인하는 쪽이 좋고, 불안할수록 떠보기보다 솔직하게 말하는 게 이 관계를 살리는 방식이야.`,
    `추가로, 현재 계산은 앱 내부 간이 로직이야. 실제 서비스에서 더 정확도를 올리려면 절기 기준 만세력 API, 음력 변환, 출생 시간 보정, 지역 기준 시차 보정을 연결하는 게 맞아. 그래도 지금 구조는 사용자가 보기에는 사주표, 전문용어, 관계 해석, 사건 예시가 모두 이어지도록 잡아둔 버전이야.`,
  ];
}

function makeMbtiData(form, score) {
  const seed = makeSeed(form, false);
  const my = form.myMbti || "모름";
  const partner = form.partnerMbti || "모름";

  return {
    summary: score >= 80
      ? "다른 점이 매력으로 작동하지만, 싸울 때는 말투 하나로 분위기가 확 바뀌는 조합."
      : "끌림은 생기지만, 표현 속도 차이를 못 맞추면 피로해지는 조합.",
    eventImage: pickImage(seed, 25),
    detailImage: pickImage(seed, 76),
    event: `${my}와 ${partner}는 대화가 잘 풀릴 때 확 가까워지지만, 답장 텀이나 말투 하나로 분위기가 확 바뀔 수 있어.`,
    rows: [
      { label: "내 성향", value: `${my}: 감정 표현 방식과 관계 속도` },
      { label: "상대 성향", value: `${partner}: 안정감을 느끼는 방식` },
      { label: "끌림 포인트", value: "서로 다른 점이 초반 호기심과 설렘으로 작동함" },
      { label: "충돌 포인트", value: "연락 텀, 말투, 서운함을 푸는 속도 차이" },
      { label: "예시", value: "한쪽은 바로 풀고 싶고, 다른 한쪽은 혼자 정리해야 편해짐" },
    ],
    lines: makeLongMbtiLines(my, partner, score),
  };
}

function makeLongMbtiLines(my, partner, score) {
  const base = [
    `${my}와 ${partner}의 궁합은 단순히 좋다, 나쁘다로 끝낼 수 없어. 핵심은 **감정 표현 속도**와 **갈등 처리 방식**이야. 한쪽은 바로 확인받고 싶고, 다른 한쪽은 생각을 정리한 뒤에야 말이 나올 수 있어. 이 차이가 처음에는 신선한 매력으로 보일 수 있어.`,
    `하지만 시간이 지나면 같은 차이가 서운함으로 바뀔 수도 있어. 특히 답장 길이, 약속 잡는 방식, 감정 표현 빈도에서 차이가 잘 드러나. 이 관계는 대화가 터질 때는 진짜 빠르게 가까워져. 관심사가 맞으면 밤새 얘기할 수 있고, 별거 아닌 농담도 오래 이어질 수 있어.`,
    `그런데 싸울 때는 완전히 다른 문제가 나와. 한쪽은 바로 풀어야 마음이 편하고, 다른 한쪽은 혼자 정리해야 말이 나와. 이때 바로 풀고 싶은 쪽은 상대가 도망간다고 느껴. 반대로 혼자 정리하고 싶은 쪽은 상대가 압박한다고 느껴.`,
    `그래서 이 조합은 감정이 없는 게 아니라, **감정을 처리하는 방식이 다른 조합**이야. 좋을 때는 서로의 다름이 매력으로 보이고, 힘들 때는 그 다름이 피로로 보일 수 있어. 특히 연락에서 오해가 생기기 쉬워.`,
    `한쪽은 짧은 답장을 무심함으로 받아들이고, 다른 한쪽은 그냥 바빠서 짧게 답한 것일 수 있어. 이 차이를 모르면 마음이 있는데도 서로를 의심하게 돼. 그래서 이 관계에서는 상대의 반응 속도를 사랑의 크기로 착각하면 안 돼.`,
    `데이트나 만남에서는 한쪽이 분위기를 만들고, 다른 한쪽이 안정감을 잡아주는 식이 잘 맞아. 다만 계획을 짤 때는 미리 기대치를 맞추는 게 좋아. 즉흥적인 쪽은 자유를 원하고, 계획적인 쪽은 예측 가능성을 원할 수 있어.`,
    `이 둘이 부딪히면 “왜 이렇게 답답해?”와 “왜 이렇게 불안정해?”가 동시에 나올 수 있어. 그래서 이 관계의 핵심 문장은 이거야. **상대의 방식이 틀린 게 아니라 다를 뿐이다.** 이걸 인정하면 관계가 훨씬 편해져.`,
    `결론은 ${score >= 80 ? "**다름이 매력으로 작동할 가능성이 높은 조합**" : "**다름이 피로로 변하지 않게 관리해야 하는 조합**"}이야. 마음을 확인하고 싶으면 시험하지 말고 말로 물어봐야 해. 질투 유발, 일부러 답장 늦추기, 떠보기 같은 행동은 이 궁합에서 독이야.`,
  ];

  return [...base, ...base, ...base, ...base];
}

function getComingData(mode) {
  const map = {
    comingBirthday: {
      title: "생일 전광판",
      desc: "사진, 이름, 생년월일을 넣으면 지하철 생일 광고 같은 이미지로 만들어주는 기능이야.",
    },
    comingAnimal: {
      title: "커플 동물상",
      desc: "커플 사진을 올리면 포즈와 분위기를 살려서 동물상 커플 이미지로 만드는 기능이야.",
    },
    comingYoung: {
      title: "어려지는 사진",
      desc: "현재 사진을 귀여운 어린 시절 분위기로 바꿔주는 기능이야.",
    },
    comingComic: {
      title: "순정만화 속 우리",
      desc: "둘의 사진을 순정만화 주인공 같은 감성 이미지로 바꾸는 기능이야.",
    },
    comingTravel: {
      title: "여행 감성 콜라주",
      desc: "여행 사진 여러 장을 감성 브이로그 같은 콜라주 이미지로 정리해주는 기능이야.",
    },
    comingColor: {
      title: "퍼스널컬러 분석",
      desc: "사진을 보고 컬러 팔레트, 분위기, 어울리는 스타일을 리포트로 보여주는 기능이야.",
    },
    comingHair: {
      title: "헤어스타일 추천",
      desc: "얼굴형과 분위기를 보고 어울리는 머리 스타일을 추천하는 기능이야.",
    },
    comingPalm: {
      title: "손금 분석",
      desc: "손바닥 사진을 올리면 손금 리포트처럼 정리해주는 기능이야.",
    },
  };

  return map[mode] || { title: "준비 중", desc: "곧 추가될 기능이야." };
}

function mod(n, m) {
  return ((n % m) + m) % m;
}