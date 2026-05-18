import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const SITE_URL = "https://oursai.vercel.app";
const KAKAO_JS_KEY = "392f84c5486937d26780349c72b4a1d8";

const mbtiList = [
  "ISTJ", "ISFJ", "INFJ", "INTJ",
  "ISTP", "ISFP", "INFP", "INTP",
  "ESTP", "ESFP", "ENFP", "ENTP",
  "ESTJ", "ESFJ", "ENFJ", "ENTJ",
];

const relations = ["모름", "친구(썸)", "연애 중", "짝사랑", "전 연인", "부부"];
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

const coinPacks = [
  { id: "coin1", title: "1코인", coins: 1, price: 990, desc: "가볍게 한 번 만들기" },
  { id: "coin10", title: "10코인", coins: 10, price: 9000, desc: "자주 쓸 사람 추천" },
];

const featureList = [
  { key: "birthday", title: "생일 전광판", desc: "실제 사진으로 생일 축하 광고", icon: "🎂" },
  { key: "animal", title: "커플 동물상", desc: "커플을 고양이·동물상 콘셉트로", icon: "🐱" },
  { key: "young", title: "어린 시절 사진", desc: "우리의 어린 시절 모습 만들기", icon: "👶" },
  { key: "comic", title: "순정만화 속 우리", desc: "만화 주인공 분위기로 변환", icon: "💕" },
  { key: "travel", title: "여행 감성 콜라주", desc: "여행 기록 같은 감성 콜라주", icon: "🧳" },
  { key: "color", title: "퍼스널컬러 분석", desc: "컬러·분위기·스타일 리포트", icon: "🎨" },
  { key: "hair", title: "헤어스타일 추천", desc: "얼굴형 기반 헤어 추천", icon: "💇" },
  { key: "palm", title: "손금 분석", desc: "손바닥 사진 기반 리포트", icon: "✋" },
];

const songPool = [
  ["NewJeans - Ditto", "pSUydWEqKwE", "오늘은 감정이 차분히 정리되는 노래가 잘 맞아."],
  ["Laufey - From The Start", "lSD_L-xic9o", "부드럽게 기분을 올리고 싶을 때 좋아."],
  ["IU - Love wins all", "JleoAppaxi0", "생각이 많은 날, 마음 정리용으로 잘 맞아."],
  ["The Weeknd - Out of Time", "2fDzCWNS3ig", "타이밍이 중요한 날에 어울려."],
  ["Taylor Swift - Cruel Summer", "ic8j13piAhQ", "조금 더 과감하게 움직이고 싶을 때 좋아."],
];

const colors = [
  { name: "블랙", cls: "black", text: "중심을 잡고 싶을 때 좋아. 말보다 분위기로 설득되는 날이야." },
  { name: "네이비", cls: "navy", text: "신뢰감과 차분함이 필요한 날에 잘 맞아." },
  { name: "베이지", cls: "beige", text: "부드러운 인상을 만들고 관계운을 열어줘." },
  { name: "화이트", cls: "white", text: "복잡한 생각을 덜어내고 깔끔한 흐름을 만들어줘." },
  { name: "레드", cls: "red", text: "존재감과 추진력이 필요한 순간에 좋아." },
  { name: "블루", cls: "blue", text: "말실수 줄이고 차분한 대화를 돕는 색이야." },
];

export default function App() {
  const [mode, setMode] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(featureList[0]);

  const [coins, setCoins] = useState(() => {
    const joined = localStorage.getItem("woorisai_joined_v10");
    const saved = localStorage.getItem("woorisai_coins_v10");

    if (!joined) {
      localStorage.setItem("woorisai_joined_v10", "true");
      localStorage.setItem("woorisai_coins_v10", "3");
      return 3;
    }

    return saved ? Number(saved) : 0;
  });

  const [unlocked, setUnlocked] = useState(() => {
    return JSON.parse(localStorage.getItem("woorisai_unlocked_v10") || "{}");
  });

  const [savedPeople, setSavedPeople] = useState(() => {
    return JSON.parse(localStorage.getItem("woorisai_people_v10") || "[]");
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

  const [featureForm, setFeatureForm] = useState({
    name: "",
    message: "",
    birthdayYear: "",
    birthdayMonth: "",
    birthdayDay: "",
    place: "",
    fileName: "",
    imageBase64: "",
    mimeType: "",
    previewUrl: "",
    resultImage: "",
    loading: false,
  });

  const [bottomTab, setBottomTab] = useState("home");

  useEffect(() => {
    localStorage.setItem("woorisai_coins_v10", String(coins));
  }, [coins]);

  useEffect(() => {
    localStorage.setItem("woorisai_unlocked_v10", JSON.stringify(unlocked));
  }, [unlocked]);

  useEffect(() => {
    localStorage.setItem("woorisai_people_v10", JSON.stringify(savedPeople));
  }, [savedPeople]);

  const fortune = useMemo(() => makeDailyFortune(fortuneForm), [fortuneForm]);
  const sajuScore = useMemo(() => makeSajuScore(form), [form]);
  const mbtiScore = useMemo(() => makeMbtiScore(form), [form]);
  const saju = useMemo(() => makeSajuData(form, sajuScore), [form, sajuScore]);
  const mbti = useMemo(() => makeMbtiData(form, mbtiScore), [form, mbtiScore]);

  const go = (next) => {
    setMode(next);
    setDrawerOpen(false);
    setBottomTab(
      next.includes("saju") ? "saju" :
      next.includes("mbti") ? "mbti" :
      next.includes("feature") ? "photo" :
      next.includes("fortune") ? "fortune" :
      "home"
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const share = async () => {
    try {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_JS_KEY);

        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: "우리 사이 🐢💛",
            description: "오늘의 운세랑 궁합을 확인해봐",
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
    } catch (error) {
      console.log(error);
    }

    if (navigator.share) {
      await navigator.share({
        title: "우리 사이",
        text: "우리 사이에서 봐봐",
        url: SITE_URL,
      });
    } else {
      await navigator.clipboard.writeText(SITE_URL);
      alert("링크 복사 완료!");
    }
  };

  const savePerson = (person) => {
    if (!person.name) return;
    setSavedPeople((prev) => {
      return [{ ...person }, ...prev.filter((x) => x.name !== person.name)].slice(0, 12);
    });
  };

  const loadPerson = (target, name) => {
    const person = savedPeople.find((x) => x.name === name);
    if (!person) return;

    if (target === "fortune") {
      setFortuneForm({
        ...fortuneForm,
        name: person.name,
        year: person.year,
        month: person.month,
        day: person.day,
        mbti: person.mbti || "",
      });
    }

    if (target === "me") {
      setForm({
        ...form,
        myName: person.name,
        myGender: person.gender || "모름",
        myCalendar: person.calendar || "양력",
        myYear: person.year,
        myMonth: person.month,
        myDay: person.day,
        myBirthHour: person.birthHour || "모름",
        myBirthCity: person.birthCity || "",
        myMbti: person.mbti || "",
      });
    }

    if (target === "partner") {
      setForm({
        ...form,
        partnerName: person.name,
        partnerGender: person.gender || "모름",
        partnerCalendar: person.calendar || "양력",
        partnerYear: person.year,
        partnerMonth: person.month,
        partnerDay: person.day,
        partnerBirthHour: person.birthHour || "모름",
        partnerBirthCity: person.birthCity || "",
        partnerMbti: person.mbti || "",
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

  const updateFeature = (key, value, max) => {
    const numeric = ["birthdayYear", "birthdayMonth", "birthdayDay"].includes(key);

    setFeatureForm({
      ...featureForm,
      [key]: numeric ? value.replace(/\D/g, "").slice(0, max) : value,
    });
  };

  const validate = () => {
    if (!form.myName || !form.partnerName) {
      alert("이름은 둘 다 입력해줘.");
      return false;
    }

    if (
      !form.myYear ||
      !form.myMonth ||
      !form.myDay ||
      !form.partnerYear ||
      !form.partnerMonth ||
      !form.partnerDay
    ) {
      alert("생년월일은 둘 다 입력해줘.");
      return false;
    }

    return true;
  };

  const openFeature = (feature) => {
    setSelectedFeature(feature);
    setFeatureForm({
      name: "",
      message: "",
      birthdayYear: "",
      birthdayMonth: "",
      birthdayDay: "",
      place: "",
      fileName: "",
      imageBase64: "",
      mimeType: "",
      previewUrl: "",
      resultImage: "",
      loading: false,
    });
    go("feature");
  };

  const handleFeatureFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있어.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.split(",")[1];

      setFeatureForm((prev) => ({
        ...prev,
        fileName: file.name,
        imageBase64: base64,
        mimeType: file.type,
        previewUrl: result,
        resultImage: "",
      }));
    };

    reader.readAsDataURL(file);
  };

  const generateFeature = async () => {
    if (coins <= 0) {
      alert("코인이 부족해. 충전 화면으로 이동할게.");
      go("coin");
      return;
    }

    if (!featureForm.imageBase64 || !featureForm.mimeType) {
      alert("사진을 먼저 업로드해줘.");
      return;
    }

    if (
      selectedFeature.key === "birthday" &&
      (!featureForm.name || !featureForm.birthdayYear || !featureForm.birthdayMonth || !featureForm.birthdayDay)
    ) {
      alert("이름과 생일 날짜를 입력해줘.");
      return;
    }

    const prompt = makeFeaturePrompt(selectedFeature.key, featureForm);

    try {
      setFeatureForm((prev) => ({
        ...prev,
        loading: true,
        resultImage: "",
      }));

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          imageBase64: featureForm.imageBase64,
          mimeType: featureForm.mimeType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        alert(data?.detail?.error?.message || data?.error || "이미지 생성에 실패했어.");
        setFeatureForm((prev) => ({
          ...prev,
          loading: false,
        }));
        return;
      }

      setCoins((prev) => prev - 1);

      setFeatureForm((prev) => ({
        ...prev,
        loading: false,
        resultImage: data.imageUrl,
      }));
    } catch (error) {
      console.error(error);
      alert("이미지 생성 중 오류가 났어.");
      setFeatureForm((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const drawer = (
    <Drawer open={drawerOpen} close={() => setDrawerOpen(false)} coins={coins}>
      <DrawerItem icon="🏠" title="홈" desc="처음 화면" onClick={() => go("home")} />
      <DrawerItem icon="✨" title="오늘의 운세" desc="노래, 색, 아이템, 기회" onClick={() => go("fortune")} />
      <DrawerItem icon="💗" title="사주 궁합" desc="사주표와 관계 흐름 분석" onClick={() => go("saju")} />
      <DrawerItem icon="👥" title="MBTI 궁합" desc="성향과 대화 패턴 분석" onClick={() => go("mbti")} />

      <div className="drawer-line" />

      {featureList.map((feature) => (
        <DrawerItem
          key={feature.key}
          icon={feature.icon}
          title={feature.title}
          desc={feature.desc}
          onClick={() => openFeature(feature)}
        />
      ))}

      <div className="drawer-line" />
      <DrawerItem icon="🪙" title={`내 코인 ${coins}개`} desc="충전하고 기능 사용하기" onClick={() => go("coin")} />
    </Drawer>
  );

  if (mode === "home") {
    return (
      <Phone bottomTab={bottomTab} go={go}>
        {drawer}

        <div className="home-top">
          <button className="icon-btn" onClick={() => setDrawerOpen(true)}>☰</button>
          <b>우리 사이 💖</b>
          <button className="coin-pill" onClick={() => go("coin")}>🪙 {coins}코인</button>
        </div>

        <section className="home-hero">
          <div>
            <h1>너희 사이,<br />얼마나 특별할까?</h1>
            <p>사주, 운세, MBTI로 우리 관계를<br />더 깊이 알아보세요!</p>
          </div>
          <img src="/turtle-heart.png" alt="" />
        </section>

        <CoinMini coins={coins} onClick={() => go("coin")} />

        <div className="menu-list">
          <Menu icon="✨" title="오늘의 운세" desc="오늘의 흐름, 노래, 색, 기회" onClick={() => go("fortune")} />
          <Menu icon="💖" title="사주 궁합" desc="사주표와 둘의 관계 분석" onClick={() => go("saju")} />
          <Menu icon="🧬" title="MBTI 궁합" desc="성향과 대화 패턴 분석" onClick={() => go("mbti")} />
          <Menu icon="📸" title="AI 사진 기능" desc="특별한 순간을 AI로 변환" onClick={() => go("featureHub")} />
          <Menu icon="🎂" title="생일 전광판" desc="실제 사진으로 생일 축하 광고" onClick={() => openFeature(featureList[0])} />
        </div>
      </Phone>
    );
  }

  if (mode === "coin") {
    return (
      <Phone bottomTab={bottomTab} go={go}>
        {drawer}
        <Top title="내 코인" back={() => go("home")} menu={() => setDrawerOpen(true)} />

        <Card className="coin-hero">
          <img src="/turtle-heart.png" alt="" />
          <p>현재 보유 코인</p>
          <h1>{coins}<span>개</span></h1>
          <small>처음 방문 시 3코인이 자동 지급돼.</small>
        </Card>

        <Card>
          <h3>충전하기</h3>
          <p className="soft-text">테스트 단계에서는 버튼을 누르면 바로 충전돼. 실제 배포 전에는 토스 결제로 연결하면 돼.</p>

          {coinPacks.map((pack) => (
            <button
              key={pack.id}
              className="coin-pack"
              onClick={() => {
                setCoins((prev) => prev + pack.coins);
                alert(`${pack.coins}코인 충전 완료`);
              }}
            >
              <div>
                <b>{pack.title}</b>
                <p>{pack.desc}</p>
              </div>
              <strong>{pack.price.toLocaleString()}원</strong>
            </button>
          ))}
        </Card>
      </Phone>
    );
  }

  if (mode === "fortune") {
    return (
      <Phone bottomTab={bottomTab} go={go}>
        {drawer}
        <Top title="오늘의 운세" back={() => go("home")} menu={() => setDrawerOpen(true)} />

        <Card>
          <div className="bubble-guide">
            <div>오늘의 운세를 알려줄게!<br />정보를 입력해줘~</div>
            <img src="/turtle-heart.png" alt="" />
          </div>

          <SavedPicker people={savedPeople} label="최근 입력한 정보" onSelect={(name) => loadPerson("fortune", name)} />

          <label>이름</label>
          <input value={fortuneForm.name} onChange={(e) => updateFortune("name", e.target.value)} placeholder="이름" />

          <label>생년월일</label>
          <div className="date-row">
            <input placeholder="1999" value={fortuneForm.year} onChange={(e) => updateFortune("year", e.target.value, 4)} />
            <input placeholder="08" value={fortuneForm.month} onChange={(e) => updateFortune("month", e.target.value, 2)} />
            <input placeholder="23" value={fortuneForm.day} onChange={(e) => updateFortune("day", e.target.value, 2)} />
          </div>

          <label>MBTI</label>
          <select value={fortuneForm.mbti} onChange={(e) => updateFortune("mbti", e.target.value)}>
            <option value="">모름</option>
            {mbtiList.map((mbti) => <option key={mbti}>{mbti}</option>)}
          </select>

          <label>오늘 고민이 있나요?</label>
          <textarea
            value={fortuneForm.topic}
            onChange={(e) => updateFortune("topic", e.target.value)}
            placeholder="예: 요즘 진로 때문에 고민이 많아요."
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

              go("fortuneResult");
            }}
          >
            운세 보러가기
          </button>

          <p className="save-note">* 입력한 정보는 저장되지 않아요 💗</p>
        </Card>
      </Phone>
    );
  }

  if (mode === "fortuneResult") {
    return (
      <Phone bottomTab={bottomTab} go={go}>
        {drawer}
        <Top title="오늘의 운세 결과" back={() => go("home")} share={share} menu={() => setDrawerOpen(true)} />

        <section className="fortune-visual">
          <div className="fortune-sky">
            <p>{fortune.today}</p>
            <h1>{fortune.title}</h1>
            <img src="/turtle-heart.png" alt="" />
          </div>
        </section>

        <Card className="song-card">
          <h3>🎵 오늘의 노래</h3>
          <b>{fortune.song}</b>
          <p>{fortune.songLine}</p>
          <div className="music-player">
            <span>0:00</span>
            <button>▶</button>
            <span>3:37</span>
          </div>
          <div className="youtube">
            <iframe src={`https://www.youtube.com/embed/${fortune.youtubeId}`} title={fortune.song} allowFullScreen />
          </div>
        </Card>

        <Card>
          <h3>🎨 오늘의 럭키 컬러</h3>
          <div className="color-card">
            <div className={`color-circle ${fortune.color.cls}`} />
            <div>
              <b>{fortune.color.name}</b>
              <p>{fortune.color.text}</p>
            </div>
          </div>
        </Card>

        <RevealCard icon="🎁" title="오늘의 기회">
          <Paragraphs lines={fortune.chanceLines} />
        </RevealCard>

        <RevealCard icon="📜" title="오늘의 격언">
          <Paragraphs lines={fortune.quoteLines} />
        </RevealCard>

        <Card>
          <h3>🔥 거북이가 솔직히 말해줄게</h3>
          <Paragraphs lines={fortune.lines} />
        </Card>

        {fortuneForm.topic.trim() && (
          <Card>
            <h3>🔍 네가 물어본 것</h3>
            <p className="question">“{fortuneForm.topic}”</p>
            <Paragraphs lines={fortune.topicLines} />
          </Card>
        )}
      </Phone>
    );
  }

  if (mode === "saju" || mode === "mbti") {
    const isSaju = mode === "saju";

    return (
      <Phone bottomTab={bottomTab} go={go}>
        {drawer}
        <Top title={isSaju ? "사주 궁합" : "MBTI 궁합"} back={() => go("home")} menu={() => setDrawerOpen(true)} />

        <Card>
          <h3>{isSaju ? "내 정보" : "MBTI 정보"}</h3>
          <PersonCard title="🟡 내 정보" target="my" form={form} update={updateForm} isSaju={isSaju} people={savedPeople} load={(name) => loadPerson("me", name)} />
          <PersonCard title="🟢 상대 정보" target="partner" form={form} update={updateForm} isSaju={isSaju} people={savedPeople} load={(name) => loadPerson("partner", name)} />

          <label>처음 만난 달</label>
          <div className="date-row two">
            <input placeholder="2024" value={form.metYear} onChange={(e) => updateForm("metYear", e.target.value, 4)} />
            <input placeholder="11" value={form.metMonth} onChange={(e) => updateForm("metMonth", e.target.value, 2)} />
          </div>

          <label>관계</label>
          <select value={form.relation} onChange={(e) => updateForm("relation", e.target.value)}>
            {relations.map((relation) => <option key={relation}>{relation}</option>)}
          </select>

          <button
            className="main-btn"
            onClick={() => {
              if (!validate()) return;

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

              go(isSaju ? "sajuResult" : "mbtiResult");
            }}
          >
            분석하기
          </button>
        </Card>
      </Phone>
    );
  }

  if (mode === "sajuResult") {
    return (
      <Phone bottomTab={bottomTab} go={go}>
        {drawer}
        <Top title="사주 궁합 결과" back={() => go("home")} share={share} menu={() => setDrawerOpen(true)} />

        <ResultHero score={sajuScore} />

        <Card className="summary-card">
          <h3>한 줄 요약</h3>
          <p>{saju.summary}</p>
        </Card>

        <Card>
          <h3>사주 구성표</h3>
          <SajuTable title="내 사주" data={saju.myTable} />
          <SajuTable title="상대 사주" data={saju.partnerTable} />
          <p className="saju-warning">현재는 앱 내부 간이 계산이야. 실제 만세력 API를 붙이면 더 정확하게 맞출 수 있어.</p>
        </Card>

        <Card>
          <h3>이 둘 사이에 있을 법한 사건</h3>
          <p className="event-text">{saju.event}</p>
        </Card>

        <Locked unlocked={unlocked.saju} onUnlock={() => setUnlocked({ ...unlocked, saju: true })}>
          <Card>
            <h3>🔮 사주 전문 풀이</h3>
            <Paragraphs lines={saju.lines} />
          </Card>
        </Locked>
      </Phone>
    );
  }

  if (mode === "mbtiResult") {
    return (
      <Phone bottomTab={bottomTab} go={go}>
        {drawer}
        <Top title="MBTI 궁합 결과" back={() => go("home")} share={share} menu={() => setDrawerOpen(true)} />

        <ResultHero score={mbtiScore} />

        <Card className="summary-card">
          <h3>{form.myMbti || "나"} × {form.partnerMbti || "상대"}</h3>
          <MbtiBadge my={form.myMbti} partner={form.partnerMbti} />
          <p>{mbti.summary}</p>
        </Card>

        <Card>
          <h3>궁합 포인트</h3>
          <MbtiTable rows={mbti.rows} />
        </Card>

        <Locked unlocked={unlocked.mbti} onUnlock={() => setUnlocked({ ...unlocked, mbti: true })}>
          <Card>
            <h3>💬 MBTI 상세 풀이</h3>
            <Paragraphs lines={mbti.lines} />
          </Card>
        </Locked>
      </Phone>
    );
  }

  if (mode === "featureHub") {
    return (
      <Phone bottomTab={bottomTab} go={go}>
        {drawer}
        <Top title="AI 사진 기능" back={() => go("home")} menu={() => setDrawerOpen(true)} />

        <div className="feature-grid">
          {featureList.map((feature) => (
            <button key={feature.key} className="feature-item" onClick={() => openFeature(feature)}>
              <div className="feature-thumb">{feature.icon}</div>
              <div>
                <b>{feature.title}</b>
                <p>{feature.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Phone>
    );
  }

  if (mode === "feature") {
    const isBirthday = selectedFeature.key === "birthday";
    const isTravel = selectedFeature.key === "travel";

    return (
      <Phone bottomTab={bottomTab} go={go}>
        {drawer}
        <Top title={selectedFeature.title} back={() => go("featureHub")} menu={() => setDrawerOpen(true)} />

        <Card className="feature-hero">
          <div className="feature-hero-icon">{selectedFeature.icon}</div>
          <h2>{selectedFeature.title}</h2>
          <p>{selectedFeature.desc}</p>
          <span>1코인 사용</span>
        </Card>

        <Card>
          {isBirthday && (
            <>
              <div className="bubble-guide">
                <div>생일을 축하할 사람의<br />정보와 사진을 넣어줘!</div>
                <img src="/turtle-heart.png" alt="" />
              </div>

              <label>이름</label>
              <input value={featureForm.name} onChange={(e) => updateFeature("name", e.target.value)} placeholder="예: 이서윤" />

              <label>생일 날짜</label>
              <div className="date-row">
                <input placeholder="1999" value={featureForm.birthdayYear} onChange={(e) => updateFeature("birthdayYear", e.target.value, 4)} />
                <input placeholder="08" value={featureForm.birthdayMonth} onChange={(e) => updateFeature("birthdayMonth", e.target.value, 2)} />
                <input placeholder="23" value={featureForm.birthdayDay} onChange={(e) => updateFeature("birthdayDay", e.target.value, 2)} />
              </div>

              <label>한 줄 문구</label>
              <input value={featureForm.message} onChange={(e) => updateFeature("message", e.target.value)} placeholder="예: 오늘도 너를 응원해 💙" />
            </>
          )}

          {isTravel && (
            <>
              <label>여행지</label>
              <input value={featureForm.place} onChange={(e) => updateFeature("place", e.target.value)} placeholder="예: 제주도, 부산, 도쿄" />
            </>
          )}

          <label>사진 업로드</label>
          <input type="file" accept="image/*" onChange={(e) => handleFeatureFile(e.target.files?.[0])} />

          {featureForm.previewUrl && (
            <div className={selectedFeature.key === "young" ? "before-after-preview" : "image-preview-box"}>
              {selectedFeature.key === "young" ? (
                <>
                  <div>
                    <small>before</small>
                    <img src={featureForm.previewUrl} alt="before" />
                  </div>
                  <div className="after-placeholder">
                    <small>after</small>
                    <span>✨</span>
                    <p>생성 후 표시</p>
                  </div>
                </>
              ) : (
                <>
                  <p>업로드한 사진</p>
                  <img src={featureForm.previewUrl} alt="업로드 미리보기" />
                </>
              )}
            </div>
          )}

          <button className="main-btn" onClick={generateFeature} disabled={featureForm.loading}>
            {featureForm.loading ? "만드는 중..." : "1코인 사용하고 만들기"}
          </button>

          <p className="save-note">보유 코인 {coins}개</p>
        </Card>

        {featureForm.loading && (
          <Card className="loading-card">
            <img src="/turtle-heart.png" alt="" />
            <b>거북이가 열심히<br />만드는 중이야!</b>
            <p>조금만 기다려줘 🐢💛</p>
            <div className="progress"><span /></div>
          </Card>
        )}

        {featureForm.resultImage && (
          <FeatureResultCard feature={selectedFeature} form={featureForm} retry={generateFeature} />
        )}
      </Phone>
    );
  }

  return null;
}

function Phone({ children, bottomTab, go }) {
  return (
    <main className="phone">
      {children}
      <BottomNav active={bottomTab} go={go} />
    </main>
  );
}

function Top({ title, back, share, menu }) {
  return (
    <div className="top-bar">
      <button onClick={back}>‹</button>
      <b>{title}</b>
      <button onClick={share || menu}>{share ? "⇧" : "☰"}</button>
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
      <div>
        <b>{title}</b>
        <p>{desc}</p>
      </div>
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
            <b>우리 사이 💖</b>
            <p>보유 코인 {coins}개</p>
          </div>
          <button onClick={close}>×</button>
        </div>
        <div className="drawer-body">{children}</div>
      </aside>
    </>
  );
}

function DrawerItem({ icon, title, desc, onClick }) {
  return (
    <button className="drawer-item" onClick={onClick}>
      <span>{icon}</span>
      <div>
        <b>{title}</b>
        <p>{desc}</p>
      </div>
    </button>
  );
}

function BottomNav({ active, go }) {
  const items = [
    ["home", "홈", "⌂", "home"],
    ["fortune", "오늘의 운세", "✨", "fortune"],
    ["saju", "사주 궁합", "💗", "saju"],
    ["mbti", "MBTI 궁합", "👥", "mbti"],
    ["photo", "AI 사진", "📸", "featureHub"],
  ];

  return (
    <nav className="bottom-nav">
      {items.map(([key, label, icon, target]) => (
        <button key={key} className={active === key ? "active" : ""} onClick={() => go(target)}>
          <span>{icon}</span>
          <b>{label}</b>
        </button>
      ))}
    </nav>
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

function SavedPicker({ people, label, onSelect }) {
  if (!people.length) return null;

  return (
    <>
      <label>{label}</label>
      <select onChange={(e) => e.target.value && onSelect(e.target.value)}>
        <option value="">불러오기</option>
        {people.map((person) => (
          <option key={person.name} value={person.name}>
            {person.name} · {person.year || "모름"}.{person.month || "모름"}.{person.day || "모름"} · {person.mbti || "모름"}
          </option>
        ))}
      </select>
    </>
  );
}

function PersonCard({ title, target, form, update, isSaju, people, load }) {
  const prefix = target === "my" ? "my" : "partner";

  return (
    <div className="person-box">
      <h4>{title}</h4>

      <SavedPicker people={people} label="최근 입력 정보" onSelect={load} />

      <label>이름</label>
      <input value={form[`${prefix}Name`]} onChange={(e) => update(`${prefix}Name`, e.target.value)} placeholder="이름" />

      {isSaju && (
        <>
          <label>성별</label>
          <select value={form[`${prefix}Gender`]} onChange={(e) => update(`${prefix}Gender`, e.target.value)}>
            {genderList.map((gender) => <option key={gender}>{gender}</option>)}
          </select>

          <label>양력 / 음력</label>
          <select value={form[`${prefix}Calendar`]} onChange={(e) => update(`${prefix}Calendar`, e.target.value)}>
            {calendarList.map((calendar) => <option key={calendar}>{calendar}</option>)}
          </select>
        </>
      )}

      <label>생년월일</label>
      <div className="date-row">
        <input placeholder="1999" value={form[`${prefix}Year`]} onChange={(e) => update(`${prefix}Year`, e.target.value, 4)} />
        <input placeholder="08" value={form[`${prefix}Month`]} onChange={(e) => update(`${prefix}Month`, e.target.value, 2)} />
        <input placeholder="23" value={form[`${prefix}Day`]} onChange={(e) => update(`${prefix}Day`, e.target.value, 2)} />
      </div>

      {isSaju && (
        <>
          <label>태어난 시간</label>
          <select value={form[`${prefix}BirthHour`]} onChange={(e) => update(`${prefix}BirthHour`, e.target.value)}>
            {birthHours.map((hour) => <option key={hour}>{hour}</option>)}
          </select>

          <label>태어난 지역</label>
          <input value={form[`${prefix}BirthCity`]} onChange={(e) => update(`${prefix}BirthCity`, e.target.value)} placeholder="예: 서울, 천안" />
        </>
      )}

      <label>MBTI</label>
      <select value={form[`${prefix}Mbti`]} onChange={(e) => update(`${prefix}Mbti`, e.target.value)}>
        <option value="">모름</option>
        {mbtiList.map((mbti) => <option key={mbti}>{mbti}</option>)}
      </select>
    </div>
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
          {children}
        </>
      )}
    </section>
  );
}

function ResultHero({ score }) {
  return (
    <Card className="result-hero-card">
      <p>궁합 점수</p>
      <div className="heart-score">
        <img src="/turtle-heart.png" alt="" />
        <strong>{score}<span>%</span></strong>
        <img src="/turtle-heart.png" alt="" />
      </div>
      <div className="bar"><div style={{ width: `${score}%` }} /></div>
      <small>{score >= 80 ? "생각보다 잘 맞는 조합이야." : "끌림은 있는데 조율이 필요한 조합이야."}</small>
    </Card>
  );
}

function Locked({ unlocked, onUnlock, children }) {
  return (
    <div className="paid-area">
      <div className={unlocked ? "" : "locked"}>{children}</div>

      {!unlocked && (
        <div className="lock-cover">
          <img src="/turtle-heart.png" alt="" />
          <h3>상세 해석 열기</h3>
          <p>지금은 테스트 단계라 버튼만 누르면 바로 열려.</p>
          <button className="pay-btn" onClick={onUnlock}>전체 해석 보기</button>
        </div>
      )}
    </div>
  );
}

function Paragraphs({ lines }) {
  return (
    <div className="paragraphs">
      {lines.map((line, index) => (
        <p key={index}><Bold text={line} /></p>
      ))}
    </div>
  );
}

function Bold({ text }) {
  return (
    <>
      {text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={index}>{part.slice(2, -2)}</strong>
          : <span key={index}>{part}</span>
      )}
    </>
  );
}

function SajuTable({ title, data }) {
  return (
    <div className="saju-card">
      <h4>{title}</h4>
      <div className="saju-head"><span>시주</span><span>일주</span><span>월주</span><span>년주</span></div>
      <div className="saju-row gods">{data.topGods.map((god, index) => <span key={index}>{god}</span>)}</div>
      <div className="saju-row boxes">{data.top.map((item, index) => <SajuBox key={index} item={item} />)}</div>
      <div className="saju-row boxes">{data.bottom.map((item, index) => <SajuBox key={index} item={item} />)}</div>
      <div className="saju-row gods">{data.bottomGods.map((god, index) => <span key={index}>{god}</span>)}</div>
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
      <div><b>{my || "ME"}</b><span>나</span></div>
      <strong>×</strong>
      <div><b>{partner || "YOU"}</b><span>상대</span></div>
    </div>
  );
}

function MbtiTable({ rows }) {
  return (
    <div className="mbti-table">
      {rows.map((row) => (
        <div key={row.label}>
          <b>{row.icon} {row.label}</b>
          <span>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function FeatureResultCard({ feature, form, retry }) {
  const isYoung = feature.key === "young";
  const isAnimal = feature.key === "animal";
  const isBirthday = feature.key === "birthday";

  return (
    <Card className="result-image-card">
      <h3>{feature.title} 결과</h3>

      {isYoung && form.previewUrl ? (
        <div className="before-after-result">
          <div>
            <small>before</small>
            <img src={form.previewUrl} alt="before" />
          </div>
          <div>
            <small>after</small>
            <img src={form.resultImage} alt="after" />
          </div>
        </div>
      ) : (
        <div className={isBirthday ? "billboard-frame" : isAnimal ? "animal-frame" : ""}>
          <img src={form.resultImage} alt="생성 결과" />
        </div>
      )}

      <div className="result-buttons">
        <a href={form.resultImage} download={`${feature.key}-result.png`}>저장하기</a>
        <button onClick={retry}>다시 만들기</button>
      </div>
    </Card>
  );
}

function makeSeed(input, daily = false) {
  const now = new Date();
  const key = daily ? `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}` : "";
  const text = JSON.stringify(input) + key;
  let seed = 0;

  for (let i = 0; i < text.length; i++) {
    seed = (seed * 31 + text.charCodeAt(i)) % 1000003;
  }

  return seed;
}

function clamp(number) {
  return Math.max(0, Math.min(100, number));
}

function mod(number, divisor) {
  return ((number % divisor) + divisor) % divisor;
}

function makeDailyFortune(input) {
  const seed = makeSeed(
    {
      name: input.name,
      year: input.year,
      month: input.month,
      day: input.day,
      mbti: input.mbti,
    },
    true
  );

  const song = songPool[seed % songPool.length];
  const color = colors[seed % colors.length];

  return {
    today: new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }),
    title: `${input.name || "너"} 님의 오늘 운세`,
    song: song[0],
    youtubeId: song[1],
    songLine: song[2],
    color,
    chanceLines: [
      `오늘의 기회는 **작은 신호**로 들어와. 짧은 연락, 제안, 갑작스러운 일정 변경을 그냥 넘기지 마.`,
      `오후에는 사람이 운을 열어줄 가능성이 커. 누가 말을 걸면 한 번 더 이어가 봐.`,
    ],
    quoteLines: [
      `“흐르는 건 억지로 붙잡지 말고, 남는 건 괜히 의심하지 마라.”`,
      `오늘은 전부 확인하려 들기보다 중요한 것 하나만 잡는 게 좋아.`,
    ],
    lines: [
      `오늘은 **망설이면 지나가고, 가볍게 움직이면 열리는 날**이야. 오전에는 흐름이 느릴 수 있지만 오후로 갈수록 움직일 명분이 생겨.`,
      `핵심은 **짧고 분명하게 말하기**야. 길게 설명하면 불안처럼 보일 수 있으니까 필요한 말만 정확하게 하는 게 좋아.`,
      `일이나 돈 쪽에서는 작은 알림, 일정 변경, 누군가의 짧은 제안을 잘 봐. 완벽한 준비보다 **70% 준비 후 실행**이 유리해.`,
      `관계에서는 확인보다 분위기 회복이 먼저야. 상대 반응을 너무 빨리 결론 내리지 말고, 가볍게 문을 여는 쪽이 좋아.`,
      `오늘의 색은 **${color.name}**이야. 옷이나 소품에 살짝 넣으면 네 태도가 더 안정적으로 잡힐 수 있어.`,
    ],
    topicLines: makeTopicLines(input.topic || ""),
  };
}

function makeTopicLines(topic) {
  const lowerTopic = topic.toLowerCase();

  if (
    lowerTopic.includes("면접") ||
    lowerTopic.includes("이직") ||
    lowerTopic.includes("취업") ||
    lowerTopic.includes("회사")
  ) {
    return [
      `네가 물어본 **${topic}**은 오늘 현실적인 판단이 중요한 주제야. 말은 길게 하기보다 “내가 뭘 해왔고, 어떤 문제를 해결할 수 있는지”를 짧고 분명하게 보여주는 게 좋아.`,
      `면접이나 이직 흐름이라면 오늘은 **경험을 숫자와 사례로 말하는 것**이 운을 올려줘. 막연히 열심히 한다보다 공정, 설비, 개선, 문제 해결 경험을 구체적으로 말해야 해.`,
      `주의할 점은 조급함이 드러나는 거야. 급해서 가고 싶다는 느낌보다, 내가 이 회사에서 어떤 역할을 할 수 있는지 차분하게 보여주는 쪽이 훨씬 유리해.`,
    ];
  }

  if (
    lowerTopic.includes("연락") ||
    lowerTopic.includes("사랑") ||
    lowerTopic.includes("연애") ||
    lowerTopic.includes("그 사람")
  ) {
    return [
      `네가 물어본 **${topic}**은 바로 결론을 보려 하기보다 반응을 보는 날이야. 무겁게 확인하려고 하면 흐름이 닫힐 수 있어.`,
      `오늘은 긴 메시지보다 짧고 자연스러운 말이 좋아. 상대가 답하기 쉬운 문장으로 시작해봐.`,
      `반응이 늦어도 바로 부정적으로 해석하지 마. 오늘은 감정이 크게 보이는 날이라 작은 신호를 과하게 받아들일 수 있어.`,
    ];
  }

  return [
    `네가 물어본 **${topic}**은 오늘 바로 결론을 내기보다 방향을 잡는 게 중요해. 지금은 큰 선택보다 작은 정리가 먼저야.`,
    `가장 좋은 방식은 문제를 하나로 좁히는 거야. “뭘 해야 하지?”보다 “오늘 당장 하나만 한다면 뭘 하지?”로 바꿔봐.`,
    `오늘은 무리해서 확정하려고 하면 피곤해져. 대신 작은 실행을 해두면 내일 흐름이 훨씬 편해질 가능성이 커.`,
  ];
}

function makeSajuScore(form) {
  return clamp(
    55 +
      (makeSeed(
        {
          a: form.myYear,
          b: form.partnerYear,
          c: form.myMonth,
          d: form.partnerMonth,
          e: form.metMonth,
        },
        false
      ) %
        42)
  );
}

function makeMbtiScore(form) {
  const pair = `${form.myMbti}-${form.partnerMbti}`;
  const goodPairs = [
    "ENFP-INFJ",
    "INFJ-ENFP",
    "ENTP-INFJ",
    "INFJ-ENTP",
    "INFP-ENFJ",
    "ENFJ-INFP",
    "ISTJ-ESFP",
    "ESFP-ISTJ",
  ];

  return clamp(
    (goodPairs.includes(pair) ? 82 : 61) +
      (makeSeed({ my: form.myMbti, partner: form.partnerMbti }, false) % 18)
  );
}

function makeSajuData(form, score) {
  const myTable = buildSimpleSajuTable(form.myYear, form.myMonth, form.myDay, form.myBirthHour);
  const partnerTable = buildSimpleSajuTable(form.partnerYear, form.partnerMonth, form.partnerDay, form.partnerBirthHour);

  return {
    myTable,
    partnerTable,
    summary:
      score >= 80
        ? "끌림과 안정이 같이 있는 조합. 궁금해진 관계가 될 수 있어요."
        : "끌림은 있지만 표현 방식이 달라 조율이 필요한 조합.",
    event:
      "둘은 사소한 연락 타이밍이나 약속 방식 때문에 서운함이 생길 수 있어. 그런데 이걸 피하지 않고 풀면 오히려 관계가 깊어지는 흐름이 있어.",
    lines: [
      `사주에서 **년주**는 첫 이미지, **월주**는 생활 리듬, **일주**는 관계의 중심, **시주**는 깊은 속마음으로 봐. 이 둘은 겉으로 보이는 끌림보다 실제 리듬을 맞추는 게 핵심이야. 처음에는 단순히 끌린다고 느낄 수 있지만, 시간이 지나면 서로의 생활 속도와 감정 회복 방식이 훨씬 중요해져. 그래서 이 궁합은 초반의 설렘보다 중후반의 안정감이 관계를 결정하는 구조에 가까워.`,
      `둘 사이에는 **편관과 정인**의 느낌이 섞여 있어. 편관은 긴장감과 자극, 정인은 이해와 보호를 뜻해. 그래서 신경 쓰이는데 동시에 조심스러운 관계가 만들어질 수 있어. 한쪽은 상대를 보며 긴장하고 더 잘하고 싶어지고, 다른 한쪽은 상대를 챙겨주고 싶어지는 흐름이 생겨. 이 조합은 무심한 관계가 되기 어렵고, 좋든 싫든 서로의 영향을 꽤 강하게 받는 편이야.`,
      `좋을 때는 서로에게 없는 기운을 채워주는 느낌이 강해. 한쪽은 현실감을 주고, 다른 한쪽은 감정의 온도를 올려줘. 그래서 같이 있으면 생각보다 안정이 되거나, 반대로 평소보다 더 솔직해지는 순간이 생길 수 있어. 특히 둘 중 한 명이 지쳐 있을 때 다른 한 명이 분위기를 바꿔주는 역할을 하게 돼.`,
      `다만 불안할 때는 한쪽은 말을 더 많이 하려 하고, 다른 한쪽은 말이 줄어들 수 있어. 이때 서로를 오해하기 쉬워. 말을 많이 하는 쪽은 “왜 피하지?”라고 느낄 수 있고, 조용해지는 쪽은 “왜 몰아붙이지?”라고 느낄 수 있어. 이 관계는 감정이 올라왔을 때 바로 결론을 내리기보다, 한 박자 쉬고 다시 말하는 습관이 필요해.`,
      `이 관계를 오래 가져가려면 “누가 더 좋아하느냐”보다 **누가 더 안정적으로 관계 리듬을 유지하느냐**가 중요해. 사주 흐름상 감정의 세기보다 반복되는 태도가 더 크게 작용해. 매일 대단한 표현을 하지 않아도, 약속을 지키고 말투를 일정하게 유지하는 쪽이 관계를 깊게 만들어.`,
      `결론적으로 이 궁합은 마음이 움직일 힘은 있지만, 서두르면 꼬이고 천천히 맞추면 깊어지는 조합이야. 중요한 건 감정 확인을 너무 자주 요구하지 않는 것, 그리고 무심한 척으로 상대를 시험하지 않는 거야. 이 두 가지만 조심하면 관계는 꽤 괜찮은 방향으로 갈 수 있어.`,
    ],
  };
}

function buildSimpleSajuTable(year, month, day, hour) {
  const stems = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
  const stemKr = ["갑","을","병","정","무","기","경","신","임","계"];
  const branches = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
  const branchKr = ["자","축","인","묘","진","사","오","미","신","유","술","해"];
  const gods = ["비견","겁재","식신","상관","편재","정재","편관","정관","편인","정인"];

  const y = Number(year || 1998);
  const m = Number(month || 1);
  const d = Number(day || 1);
  const h = Math.max(0, birthHours.indexOf(hour));
  const seed = y * 10000 + m * 100 + d + h;

  const top = [3, 2, 1, 0].map((offset) => {
    const index = mod(seed + offset, 10);
    return {
      char: stems[index],
      kr: stemKr[index],
      tone: ["green","green","red","red","yellow","yellow","white","white","dark","dark"][index],
    };
  });

  const bottom = [3, 2, 1, 0].map((offset) => {
    const index = mod(seed + offset, 12);
    return {
      char: branches[index],
      kr: branchKr[index],
      tone: ["dark","yellow","green","green","yellow","red","red","yellow","white","white","yellow","dark"][index],
    };
  });

  return {
    top,
    bottom,
    topGods: top.map((_, index) => gods[mod(seed + index, 10)]),
    bottomGods: bottom.map((_, index) => gods[mod(seed + index + 4, 10)]),
  };
}

function makeMbtiData(form, score) {
  const my = form.myMbti || "모름";
  const partner = form.partnerMbti || "모름";

  return {
    summary:
      score >= 80
        ? "서로 다른 점이 매력으로 작동하기 쉬운 조합."
        : "끌림은 있지만 대화 방식 조율이 필요한 조합.",
    rows: [
      { icon: "💗", label: "끌림 포인트", value: "서로 다른 점이 매력으로 작용해요." },
      { icon: "🧡", label: "충돌 포인트", value: "연락 텀, 말투, 서운함을 푸는 속도" },
      { icon: "💚", label: "연애 스타일", value: "자유로운 영혼 × 깊은 감성" },
      { icon: "💙", label: "서로에게 필요한 것", value: "이해와 배려, 솔직한 대화" },
    ],
    lines: [
      `${my}와 ${partner}의 궁합은 사주가 아니라 **성향 차이**로 봐야 해. 핵심은 감정 표현 속도와 갈등 처리 방식이야. 이 둘은 같은 사건을 겪어도 받아들이는 순서가 다를 수 있어. 한쪽은 먼저 감정이 올라오고 나중에 논리를 붙이는 편이고, 다른 한쪽은 먼저 상황을 정리한 뒤 감정을 확인하는 편일 수 있어.`,
      `한쪽은 바로 말해야 편하고, 다른 한쪽은 혼자 정리한 뒤 말이 나올 수 있어. 이 차이가 초반에는 매력이고 나중에는 서운함이 될 수 있어. 처음에는 “나랑 다르게 생각해서 신기하다”가 되지만, 관계가 깊어지면 “왜 이렇게 반응하지?”가 될 수 있거든.`,
      `연락 스타일도 중요한 포인트야. 한쪽은 짧게 자주 이어지는 연락을 좋아하고, 다른 한쪽은 할 말이 있을 때 집중해서 대화하는 걸 좋아할 수 있어. 이때 연락 빈도를 애정의 증거로만 보면 문제가 생겨.`,
      `결론은 **다름을 틀림으로 보지 않는 것**이야. 확인하고 싶으면 떠보지 말고 짧고 솔직하게 말하는 게 제일 좋아. “너 왜 그래?”보다 “나는 이런 반응이 조금 불안했어”가 훨씬 낫고, “알아서 해”보다 “나는 이렇게 해줬으면 좋겠어”가 훨씬 좋아.`,
    ],
  };
}

function makeFeaturePrompt(key, form) {
  const birthdayText = `${form.birthdayYear}.${String(form.birthdayMonth).padStart(2, "0")}.${String(form.birthdayDay).padStart(2, "0")}`;
  const message = form.message || "오늘도 너를 응원해 💙";

  const prompts = {
    birthday: `
Create a realistic Korean subway station birthday billboard advertisement using the uploaded person photo.
Keep the person as a real human. Do not turn into an animal, cartoon, anime, child, or illustration.
Make it look like an actual LED birthday advertisement installed in a subway station.
Large pastel blue and pink billboard, soft clouds, flower petals, sparkles, dreamy K-pop birthday support ad style.
Include clean Korean typography on the billboard:
"제 생일이에요. 다들 축하해주세요."
"${form.name}"
"HAPPY BIRTHDAY"
"${birthdayText}"
"${message}"
Place the uploaded person's portrait beautifully inside the billboard design.
Also show the subway wall, floor, and realistic billboard frame.
High quality, realistic photography, viral SNS birthday ad style.
`.trim(),

    animal: `
Transform the uploaded couple or person photo into a realistic fashionable anthropomorphic cat couple photo.
Keep original pose, clothing silhouette, mirror selfie composition, store background, and fashion mood.
Replace only human faces with realistic cat heads naturally blended into the scene.
Luxury editorial street fashion, warm indoor lighting, high-quality Instagram viral photo.
Do not make it childish. Do not make it cartoon. Make it realistic and stylish.
`.trim(),

    young: `
Create a before-after style result from the uploaded couple/person photo.
Transform the people into cute childhood versions while keeping the same pose, clothing color mood, and photo studio composition.
Make the after image look like a clean Korean children’s day couple profile photo, blue background, white stars, school uniform vibe.
Natural child faces, cute but realistic, high-quality studio portrait.
`.trim(),

    comic: `
Transform the uploaded photo into a romantic Korean/Japanese pure romance manga cover.
Keep the couple relationship mood and pose.
Soft glowing eyes, romantic lighting, premium webtoon cover style, cinematic composition.
`.trim(),

    travel: `
Turn the uploaded photo into a warm travel vlog collage in ${form.place || "a beautiful travel destination"}.
Film camera texture, sunlight flare, multiple memory frames, emotional personal travel diary.
`.trim(),

    color: `
Create a personal color analysis report based on the uploaded face photo.
Clean premium Korean beauty consulting report layout, best colors, worst colors, makeup guide, soft cream background.
`.trim(),

    hair: `
Create a premium hairstyle recommendation report based on the uploaded face photo.
Show three hairstyle recommendations, bangs, length, volume, hair color tips, salon consultation UI.
`.trim(),

    palm: `
Create a minimal premium palm reading report from the uploaded palm photo.
Mark heart line, head line, life line, fate line, sun line with thin elegant lines.
White background, clean cards, expensive-looking report design.
`.trim(),
  };

  return prompts[key];
}