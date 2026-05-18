import { useEffect, useMemo, useState } from "react";
import "./App.css";

const SITE_URL = "https://oursai.vercel.app";
const KAKAO_JS_KEY = "392f84c5486937d26780349c72b4a1d8";

const mbtiList = [
  "ISTJ","ISFJ","INFJ","INTJ",
  "ISTP","ISFP","INFP","INTP",
  "ESTP","ESFP","ENFP","ENTP",
  "ESTJ","ESFJ","ENFJ","ENTJ",
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
  {
    id: "coin1",
    title: "1코인",
    coins: 1,
    price: 990,
    desc: "가볍게 한 번 만들기",
  },
  {
    id: "coin10",
    title: "10코인",
    coins: 10,
    price: 9000,
    desc: "자주 쓸 사람 추천",
  },
];

const fortuneImages = [
  "001_lucky_shop.png",
  "002_morning_sun.png",
  "003_night_sky.png",
  "004_love_heart.png",
  "005_rain_umbrella.png",
  "006_coffee_break.png",
  "007_studying.png",
  "008_reading_book.png",
  "009_writing.png",
  "010_relaxed_couch.png",
  "023_letter.png",
  "024_phone_call.png",
  "025_message.png",
  "045_calendar.png",
  "048_checklist.png",
  "050_idea_bulb.png",
  "051_success.png",
  "061_shopping_bag.png",
  "063_coins.png",
  "071_door_open.png",
  "075_thinking.png",
  "077_excited.png",
  "083_alarm_clock.png",
  "091_cloud.png",
  "094_four_leaf_clover.png",
];

const songPool = [
  ["NewJeans - Ditto", "pSUydWEqKwE", "오늘은 감정이 차분히 정리되는 노래가 잘 맞아."],
  ["Laufey - From The Start", "lSD_L-xic9o", "부드럽게 기분을 올리고 싶을 때 좋아."],
  ["IU - Love wins all", "JleoAppaxi0", "생각이 많은 날, 마음 정리용으로 잘 맞아."],
  ["The Weeknd - Out of Time", "2fDzCWNS3ig", "타이밍이 중요한 날에 어울려."],
  ["Taylor Swift - Cruel Summer", "ic8j13piAhQ", "조금 더 과감하게 움직이고 싶을 때 좋아."],
  ["Post Malone, Swae Lee - Sunflower", "ApXoWvfEYVU", "가볍게 분위기 전환하기 좋은 노래야."],
];

const colors = [
  {
    name: "블랙",
    cls: "black",
    text: "중심을 잡고 싶을 때 좋아. 말보다 분위기로 설득되는 날이야.",
  },
  {
    name: "네이비",
    cls: "navy",
    text: "신뢰감과 차분함이 필요한 날에 잘 맞아.",
  },
  {
    name: "베이지",
    cls: "beige",
    text: "부드러운 인상을 만들고 관계운을 열어줘.",
  },
  {
    name: "화이트",
    cls: "white",
    text: "복잡한 생각을 덜어내고 깔끔한 흐름을 만들어줘.",
  },
  {
    name: "레드",
    cls: "red",
    text: "존재감과 추진력이 필요한 순간에 좋아.",
  },
  {
    name: "블루",
    cls: "blue",
    text: "말실수 줄이고 차분한 대화를 돕는 색이야.",
  },
];

const featureList = [
  ["birthday", "생일 전광판", "사진과 생일 날짜로 전광판 만들기"],
  ["animal", "커플 동물상", "사진을 동물상 콘셉트로 변환"],
  ["young", "어려지는 사진", "귀여운 어린 시절 분위기로 변환"],
  ["comic", "순정만화 속 우리", "만화 주인공 분위기로 변환"],
  ["travel", "여행 감성 콜라주", "사진을 감성 기록으로 변환"],
  ["color", "퍼스널컬러 분석", "컬러, 분위기, 스타일 리포트"],
  ["hair", "헤어스타일 추천", "얼굴형 기반 스타일 추천"],
  ["palm", "손금 분석", "손바닥 사진 기반 리포트"],
].map(([key, title, desc]) => ({ key, title, desc }));

export default function App() {
  const [mode, setMode] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(featureList[0]);

  const [coins, setCoins] = useState(() => {
    const joined = localStorage.getItem("woorisai_joined_v6");
    const saved = localStorage.getItem("woorisai_coins_v6");

    if (!joined) {
      localStorage.setItem("woorisai_joined_v6", "true");
      localStorage.setItem("woorisai_coins_v6", "3");
      return 3;
    }

    return saved ? Number(saved) : 0;
  });

  const [unlocked, setUnlocked] = useState(() => {
    return JSON.parse(localStorage.getItem("woorisai_unlocked_v6") || "{}");
  });

  const [savedPeople, setSavedPeople] = useState(() => {
    return JSON.parse(localStorage.getItem("woorisai_people_v12") || "[]");
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

  useEffect(() => {
    localStorage.setItem("woorisai_coins_v6", String(coins));
  }, [coins]);

  useEffect(() => {
    localStorage.setItem("woorisai_unlocked_v6", JSON.stringify(unlocked));
  }, [unlocked]);

  useEffect(() => {
    localStorage.setItem("woorisai_people_v12", JSON.stringify(savedPeople));
  }, [savedPeople]);

  const fortune = useMemo(() => makeDailyFortune(fortuneForm), [fortuneForm]);
  const sajuScore = useMemo(() => makeSajuScore(form), [form]);
  const mbtiScore = useMemo(() => makeMbtiScore(form), [form]);
  const saju = useMemo(() => makeSajuData(form, sajuScore), [form, sajuScore]);
  const mbti = useMemo(() => makeMbtiData(form, mbtiScore), [form, mbtiScore]);

  const go = (next) => {
    setMode(next);
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const share = async () => {
    try {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_JS_KEY);
        }

        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: "우리 사이 🐢💛",
            description: "오늘의 운세랑 궁합을 확인해봐",
            imageUrl: `${SITE_URL}/turtle_500x500.png`,
            link: {
              mobileWebUrl: SITE_URL,
              webUrl: SITE_URL,
            },
          },
          buttons: [
            {
              title: "나도 해보기",
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

    const clean = { ...person };

    setSavedPeople((prev) => {
      return [clean, ...prev.filter((x) => x.name !== clean.name)].slice(0, 12);
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

  const updateFeatureBirth = (key, value, max) => {
    setFeatureForm({
      ...featureForm,
      [key]: value.replace(/\D/g, "").slice(0, max),
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
      (!featureForm.birthdayYear || !featureForm.birthdayMonth || !featureForm.birthdayDay)
    ) {
      alert("생일 날짜를 입력해줘.");
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
        alert(data?.error || "이미지 생성에 실패했어.");
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
      <DrawerItem title="홈" desc="처음 화면" onClick={() => go("home")} />
      <DrawerItem title="오늘의 운세" desc="노래, 색, 아이템, 기회" onClick={() => go("fortune")} />
      <DrawerItem title="사주 궁합" desc="사주표와 관계 흐름 분석" onClick={() => go("saju")} />
      <DrawerItem title="MBTI 궁합" desc="성향과 대화 패턴 분석" onClick={() => go("mbti")} />

      <div className="drawer-line" />

      {featureList.map((feature) => (
        <DrawerItem
          key={feature.key}
          title={feature.title}
          desc={feature.desc}
          onClick={() => openFeature(feature)}
        />
      ))}

      <div className="drawer-line" />

      <DrawerItem title={`내 코인 ${coins}개`} desc="충전하고 기능 사용하기" onClick={() => go("coin")} />
    </Drawer>
  );

  if (mode === "home") {
    return (
      <Phone>
        {drawer}

        <div className="home-top">
          <button className="icon-btn" onClick={() => setDrawerOpen(true)}>☰</button>
          <b>우리 사이 🤍</b>
        </div>

        <section className="home-hero">
          <h1>너희 사이,<br />얼마나 특별할까?</h1>
          <p>생년월일, MBTI, 처음 만난 날로<br />둘만의 흐름을 분석해줄게!</p>
          <img src="/turtle-heart.png" alt="" />
        </section>

        <CoinMini coins={coins} onClick={() => go("coin")} />

        <div className="menu-list">
          <Menu icon="✨" title="오늘의 운세" desc="노래, 색, 아이템, 기회" onClick={() => go("fortune")} />
          <Menu icon="💗" title="사주 궁합" desc="사주표와 관계 흐름 분석" onClick={() => go("saju")} />
          <Menu icon="👥" title="MBTI 궁합" desc="성향과 대화 패턴 분석" onClick={() => go("mbti")} />
        </div>
      </Phone>
    );
  }

  if (mode === "coin") {
    return (
      <Phone>
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
          <p className="soft-text">지금은 테스트라 버튼을 누르면 바로 충전돼. 실제 배포 전 토스 결제로 연결하면 돼.</p>

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
      <Phone>
        {drawer}

        <Top title="오늘의 운세" back={() => go("home")} menu={() => setDrawerOpen(true)} />

        <Card>
          <Guide text="오늘 흐름을 보려면 정보를 입력해줘!" />

          <SavedPicker people={savedPeople} label="최근 입력한 정보" onSelect={(name) => loadPerson("fortune", name)} />

          <label>이름</label>
          <input
            value={fortuneForm.name}
            onChange={(e) => updateFortune("name", e.target.value)}
            placeholder="이름"
          />

          <label>생년월일</label>
          <div className="date-row">
            <input
              placeholder="1998"
              value={fortuneForm.year}
              onChange={(e) => updateFortune("year", e.target.value, 4)}
            />
            <input
              placeholder="05"
              value={fortuneForm.month}
              onChange={(e) => updateFortune("month", e.target.value, 2)}
            />
            <input
              placeholder="14"
              value={fortuneForm.day}
              onChange={(e) => updateFortune("day", e.target.value, 2)}
            />
          </div>

          <label>MBTI</label>
          <select value={fortuneForm.mbti} onChange={(e) => updateFortune("mbti", e.target.value)}>
            <option value="">모름</option>
            {mbtiList.map((mbti) => (
              <option key={mbti}>{mbti}</option>
            ))}
          </select>

          <label>오늘 특별히 알고 싶은 것</label>
          <textarea
            value={fortuneForm.topic}
            onChange={(e) => updateFortune("topic", e.target.value)}
            placeholder="예: 오늘 면접, 이직, 연락운, 돈, 시험"
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
        </Card>
      </Phone>
    );
  }

  if (mode === "fortuneResult") {
    return (
      <Phone>
        {drawer}

        <Top title="오늘의 운세" back={() => go("home")} share={share} menu={() => setDrawerOpen(true)} />

        <section className="fortune-head">
          <p>{fortune.today}</p>
          <h1>{fortune.title}</h1>
          <SceneImage file={fortune.heroImage} className="hero-scene" />
        </section>

        <Card className="song-card">
          <SceneImage file={fortune.songImage} />
          <h3>🎵 오늘의 노래</h3>
          <b>{fortune.song}</b>
          <p>{fortune.songLine}</p>
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

        <button className="main-btn" onClick={() => go("saju")}>사주 궁합 보러 가기</button>
        <button className="sub-btn" onClick={() => go("mbti")}>MBTI 궁합 보러 가기</button>
      </Phone>
    );
  }

  if (mode === "saju" || mode === "mbti") {
    const isSaju = mode === "saju";

    return (
      <Phone>
        {drawer}

        <Top title={isSaju ? "사주 궁합" : "MBTI 궁합"} back={() => go("home")} menu={() => setDrawerOpen(true)} />

        <Guide text={isSaju ? "사주는 생년월일과 태어난 시간이 중요해!" : "MBTI 궁합은 성향만 따로 볼게!"} />

        <PersonCard
          title="🟡 내 정보"
          target="my"
          form={form}
          update={updateForm}
          isSaju={isSaju}
          people={savedPeople}
          load={(name) => loadPerson("me", name)}
        />

        <PersonCard
          title="🟢 상대 정보"
          target="partner"
          form={form}
          update={updateForm}
          isSaju={isSaju}
          people={savedPeople}
          load={(name) => loadPerson("partner", name)}
        />

        <Card>
          <h3>💗 우리 관계</h3>

          <label>처음 만난 달</label>
          <div className="date-row two">
            <input
              placeholder="2024"
              value={form.metYear}
              onChange={(e) => updateForm("metYear", e.target.value, 4)}
            />
            <input
              placeholder="11"
              value={form.metMonth}
              onChange={(e) => updateForm("metMonth", e.target.value, 2)}
            />
          </div>

          <label>관계</label>
          <select value={form.relation} onChange={(e) => updateForm("relation", e.target.value)}>
            {relations.map((relation) => (
              <option key={relation}>{relation}</option>
            ))}
          </select>
        </Card>

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
      </Phone>
    );
  }

  if (mode === "sajuResult") {
    return (
      <ResultShell
        drawer={drawer}
        title="사주 궁합 결과"
        score={sajuScore}
        coins={coins}
        back={() => go("home")}
        share={share}
        menu={() => setDrawerOpen(true)}
      >
        <Card className="summary-card">
          <h3>한 줄 요약</h3>
          <p>{saju.summary}</p>
        </Card>

        <Card>
          <h3>이 둘 사이에 있을 법한 사건</h3>
          <p className="event-text">{saju.event}</p>
        </Card>

        <Card>
          <h3>사주 구성표</h3>
          <SajuTable title="내 사주" data={saju.myTable} />
          <SajuTable title="상대 사주" data={saju.partnerTable} />
          <p className="saju-warning">
            현재는 앱 내부 간이 계산이야. 실제 만세력 API를 붙이면 을목/정화/대운/세운까지 더 정확하게 맞출 수 있어.
          </p>
        </Card>

        <Card>
          <h3>무료 핵심 해석</h3>
          <Paragraphs lines={saju.freeLines} />
        </Card>

        <Locked unlocked={unlocked.saju} onUnlock={() => setUnlocked({ ...unlocked, saju: true })}>
          <Card>
            <h3>🔮 사주 전문 풀이</h3>
            <Paragraphs lines={saju.lines} />
          </Card>
        </Locked>
      </ResultShell>
    );
  }

  if (mode === "mbtiResult") {
    return (
      <ResultShell
        drawer={drawer}
        title="MBTI 궁합 결과"
        score={mbtiScore}
        coins={coins}
        back={() => go("home")}
        share={share}
        menu={() => setDrawerOpen(true)}
      >
        <Card className="summary-card">
          <h3>한 줄 요약</h3>
          <p>{mbti.summary}</p>
        </Card>

        <Card>
          <h3>{form.myMbti || "나"} × {form.partnerMbti || "상대"}</h3>
          <MbtiBadge my={form.myMbti} partner={form.partnerMbti} />
          <p className="event-text">{mbti.event}</p>
        </Card>

        <Card>
          <h3>MBTI 궁합표</h3>
          <MbtiTable rows={mbti.rows} />
        </Card>

        <Locked unlocked={unlocked.mbti} onUnlock={() => setUnlocked({ ...unlocked, mbti: true })}>
          <Card>
            <h3>💬 MBTI 상세 풀이</h3>
            <Paragraphs lines={mbti.lines} />
          </Card>
        </Locked>
      </ResultShell>
    );
  }

  if (mode === "feature") {
    const isBirthday = selectedFeature.key === "birthday";
    const isTravel = selectedFeature.key === "travel";

    return (
      <Phone>
        {drawer}

        <Top title={selectedFeature.title} back={() => go("home")} menu={() => setDrawerOpen(true)} />

        <Card className="feature-hero">
          <h2>{selectedFeature.title}</h2>
          <p>{selectedFeature.desc}</p>
          <span>1코인 사용</span>
        </Card>

        <Card>
          {isBirthday && (
            <>
              <label>생일 날짜</label>
              <div className="date-row">
                <input
                  placeholder="1999"
                  value={featureForm.birthdayYear}
                  onChange={(e) => updateFeatureBirth("birthdayYear", e.target.value, 4)}
                />
                <input
                  placeholder="08"
                  value={featureForm.birthdayMonth}
                  onChange={(e) => updateFeatureBirth("birthdayMonth", e.target.value, 2)}
                />
                <input
                  placeholder="23"
                  value={featureForm.birthdayDay}
                  onChange={(e) => updateFeatureBirth("birthdayDay", e.target.value, 2)}
                />
              </div>
            </>
          )}

          {isTravel && (
            <>
              <label>여행지</label>
              <input
                value={featureForm.place}
                onChange={(e) => setFeatureForm({ ...featureForm, place: e.target.value })}
                placeholder="예: 제주도, 부산, 도쿄"
              />
            </>
          )}

          <label>사진 업로드</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFeatureFile(e.target.files?.[0])}
          />

          {featureForm.previewUrl && (
            <div className="image-preview-box">
              <p>업로드한 사진</p>
              <img src={featureForm.previewUrl} alt="업로드 미리보기" />
            </div>
          )}

          <button className="main-btn" onClick={generateFeature} disabled={featureForm.loading}>
            {featureForm.loading ? "만드는 중..." : "1코인 사용하고 만들기"}
          </button>

          {featureForm.loading && (
            <div className="loading-card">
              <img src="/turtle-heart.png" alt="" />
              <b>결과물을 만들고 있어</b>
              <p>업로드한 사진을 바탕으로 이미지를 생성 중이야.</p>
            </div>
          )}
        </Card>

        {featureForm.resultImage && (
          <Card className="result-image-card">
            <h3>완성 결과</h3>
            <img src={featureForm.resultImage} alt="생성 결과" />
            <a className="download-btn" href={featureForm.resultImage} download={`${selectedFeature.key}-result.png`}>
              이미지 저장하기
            </a>
          </Card>
        )}
      </Phone>
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
      <button onClick={share || menu}>{share ? "⌯" : "☰"}</button>
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

function Guide({ text }) {
  return (
    <div className="input-guide">
      <img src="/turtle-heart.png" alt="" />
      <b>{text}</b>
    </div>
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
    <Card>
      <h3>{title}</h3>

      <SavedPicker people={people} label="최근 입력 정보" onSelect={load} />

      <label>이름</label>
      <input
        value={form[`${prefix}Name`]}
        onChange={(e) => update(`${prefix}Name`, e.target.value)}
        placeholder="이름"
      />

      {isSaju && (
        <>
          <label>성별</label>
          <select value={form[`${prefix}Gender`]} onChange={(e) => update(`${prefix}Gender`, e.target.value)}>
            {genderList.map((gender) => (
              <option key={gender}>{gender}</option>
            ))}
          </select>

          <label>양력 / 음력</label>
          <select value={form[`${prefix}Calendar`]} onChange={(e) => update(`${prefix}Calendar`, e.target.value)}>
            {calendarList.map((calendar) => (
              <option key={calendar}>{calendar}</option>
            ))}
          </select>
        </>
      )}

      <label>생년월일</label>
      <div className="date-row">
        <input
          placeholder="1998"
          value={form[`${prefix}Year`]}
          onChange={(e) => update(`${prefix}Year`, e.target.value, 4)}
        />
        <input
          placeholder="05"
          value={form[`${prefix}Month`]}
          onChange={(e) => update(`${prefix}Month`, e.target.value, 2)}
        />
        <input
          placeholder="14"
          value={form[`${prefix}Day`]}
          onChange={(e) => update(`${prefix}Day`, e.target.value, 2)}
        />
      </div>

      {isSaju && (
        <>
          <label>태어난 시간</label>
          <select value={form[`${prefix}BirthHour`]} onChange={(e) => update(`${prefix}BirthHour`, e.target.value)}>
            {birthHours.map((hour) => (
              <option key={hour}>{hour}</option>
            ))}
          </select>

          <label>태어난 지역</label>
          <input
            value={form[`${prefix}BirthCity`]}
            onChange={(e) => update(`${prefix}BirthCity`, e.target.value)}
            placeholder="예: 서울, 천안"
          />
        </>
      )}

      <label>MBTI</label>
      <select value={form[`${prefix}Mbti`]} onChange={(e) => update(`${prefix}Mbti`, e.target.value)}>
        <option value="">모름</option>
        {mbtiList.map((mbti) => (
          <option key={mbti}>{mbti}</option>
        ))}
      </select>
    </Card>
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

function ResultShell({ drawer, title, score, coins, back, share, menu, children }) {
  return (
    <Phone>
      {drawer}

      <Top title={title} back={back} share={share} menu={menu} />
      <CoinMini coins={coins} onClick={() => {}} />

      <div className="result-hero">
        <img src="/turtle-wow.png" alt="" />
      </div>

      <Card>
        <p className="score-label">궁합 점수</p>
        <h1 className="score">{score}<span>%</span></h1>
        <p className="score-desc">
          {score >= 80 ? "생각보다 잘 맞는 조합이야." : "끌림은 있는데 조율이 필요한 조합이야."}
        </p>
        <div className="bar">
          <div style={{ width: `${score}%` }} />
        </div>
      </Card>

      {children}
    </Phone>
  );
}

function Locked({ unlocked, onUnlock, children }) {
  return (
    <div className="paid-area">
      <div className={unlocked ? "" : "locked"}>
        {children}
      </div>

      {!unlocked && (
        <div className="lock-cover">
          <img src="/turtle-heart.png" alt="" />
          <h3>상세 해석 열기</h3>
          <p>지금은 테스트 단계라 버튼만 누르면 바로 열려.</p>
          <button className="pay-btn" onClick={onUnlock}>전체 보기 열기</button>
        </div>
      )}
    </div>
  );
}

function Paragraphs({ lines }) {
  return (
    <div className="paragraphs">
      {lines.map((line, index) => (
        <p key={index}>
          <Bold text={line} />
        </p>
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

      <div className="saju-head">
        <span>시주</span>
        <span>일주</span>
        <span>월주</span>
        <span>년주</span>
      </div>

      <div className="saju-row gods">
        {data.topGods.map((god, index) => (
          <span key={index}>{god}</span>
        ))}
      </div>

      <div className="saju-row boxes">
        {data.top.map((item, index) => (
          <SajuBox key={index} item={item} />
        ))}
      </div>

      <div className="saju-row boxes">
        {data.bottom.map((item, index) => (
          <SajuBox key={index} item={item} />
        ))}
      </div>

      <div className="saju-row gods">
        {data.bottomGods.map((god, index) => (
          <span key={index}>{god}</span>
        ))}
      </div>
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
      <div>
        <b>{my || "ME"}</b>
        <span>나</span>
      </div>
      <strong>×</strong>
      <div>
        <b>{partner || "YOU"}</b>
        <span>상대</span>
      </div>
    </div>
  );
}

function MbtiTable({ rows }) {
  return (
    <div className="mbti-table">
      {rows.map((row) => (
        <div key={row.label}>
          <b>{row.label}</b>
          <span>{row.value}</span>
        </div>
      ))}
    </div>
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

function pickImage(seed, offset = 0) {
  return fortuneImages[Math.abs(seed + offset) % fortuneImages.length];
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
    title: `${input.name || "너"}의 오늘 운세`,
    song: song[0],
    youtubeId: song[1],
    songLine: song[2],
    color,
    heroImage: pickImage(seed, 2),
    songImage: pickImage(seed, 38),
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
      (makeSeed(
        {
          my: form.myMbti,
          partner: form.partnerMbti,
        },
        false
      ) %
        18)
  );
}

function makeSajuData(form, score) {
  const myTable = buildSimpleSajuTable(form.myYear, form.myMonth, form.myDay, form.myBirthHour);
  const partnerTable = buildSimpleSajuTable(
    form.partnerYear,
    form.partnerMonth,
    form.partnerDay,
    form.partnerBirthHour
  );

  return {
    myTable,
    partnerTable,
    summary:
      score >= 80
        ? "끌림과 안정이 같이 있는 조합. 다만 속도 조절이 중요해."
        : "끌림은 있지만 표현 방식이 달라 조율이 필요한 조합.",
    event:
      "둘은 사소한 연락 타이밍이나 약속 방식 때문에 서운함이 생길 수 있어. 그런데 이걸 피하지 않고 풀면 오히려 관계가 깊어지는 흐름이 있어.",
    freeLines: [
      `이 궁합은 **일주와 월주의 흐름**을 같이 봐야 해. 처음 끌림보다 실제로 편하게 지낼 수 있는지가 더 중요해.`,
      `한쪽은 마음이 생기면 확인하고 싶어지고, 다른 한쪽은 충분히 관찰한 뒤 움직이려는 흐름이 있어.`,
      `그래서 이 관계는 빠른 확신보다 **반복되는 태도와 일관성**이 더 중요해.`,
    ],
    lines: [
      `사주에서 **년주**는 첫 이미지, **월주**는 생활 리듬, **일주**는 관계의 중심, **시주**는 깊은 속마음으로 봐. 이 둘은 겉으로 보이는 끌림보다 실제 리듬을 맞추는 게 핵심이야. 처음에는 단순히 끌린다고 느낄 수 있지만, 시간이 지나면 서로의 생활 속도와 감정 회복 방식이 훨씬 중요해져. 그래서 이 궁합은 초반의 설렘보다 중후반의 안정감이 관계를 결정하는 구조에 가까워.`,
      `둘 사이에는 **편관과 정인**의 느낌이 섞여 있어. 편관은 긴장감과 자극, 정인은 이해와 보호를 뜻해. 그래서 신경 쓰이는데 동시에 조심스러운 관계가 만들어질 수 있어. 한쪽은 상대를 보며 긴장하고 더 잘하고 싶어지고, 다른 한쪽은 상대를 챙겨주고 싶어지는 흐름이 생겨. 이 조합은 무심한 관계가 되기 어렵고, 좋든 싫든 서로의 영향을 꽤 강하게 받는 편이야.`,
      `좋을 때는 서로에게 없는 기운을 채워주는 느낌이 강해. 한쪽은 현실감을 주고, 다른 한쪽은 감정의 온도를 올려줘. 그래서 같이 있으면 생각보다 안정이 되거나, 반대로 평소보다 더 솔직해지는 순간이 생길 수 있어. 특히 둘 중 한 명이 지쳐 있을 때 다른 한 명이 분위기를 바꿔주는 역할을 하게 돼. 이건 단순한 궁합 점수보다 실제 관계에서 더 크게 작용하는 부분이야.`,
      `다만 불안할 때는 한쪽은 말을 더 많이 하려 하고, 다른 한쪽은 말이 줄어들 수 있어. 이때 서로를 오해하기 쉬워. 말을 많이 하는 쪽은 “왜 피하지?”라고 느낄 수 있고, 조용해지는 쪽은 “왜 몰아붙이지?”라고 느낄 수 있어. 이 관계는 감정이 올라왔을 때 바로 결론을 내리기보다, 한 박자 쉬고 다시 말하는 습관이 필요해. 그 습관만 생기면 큰 싸움으로 번질 일을 줄일 수 있어.`,
      `이 관계를 오래 가져가려면 “누가 더 좋아하느냐”보다 **누가 더 안정적으로 관계 리듬을 유지하느냐**가 중요해. 사주 흐름상 감정의 세기보다 반복되는 태도가 더 크게 작용해. 매일 대단한 표현을 하지 않아도, 약속을 지키고 말투를 일정하게 유지하는 쪽이 관계를 깊게 만들어. 반대로 말과 행동이 자주 바뀌면 상대는 금방 불안해질 수 있어.`,
      `두 사람의 궁합은 단순히 편한 조합만은 아니야. 오히려 서로를 성장시키는 쪽에 가까워. 편한 사람은 아무 변화도 주지 않지만, 이 조합은 상대 때문에 내 표현 방식이나 생활 태도를 다시 보게 만들 수 있어. 그래서 좋은 방향으로 가면 서로가 더 성숙해지고, 나쁜 방향으로 가면 서로를 시험하는 관계처럼 느껴질 수 있어. 핵심은 상대를 고치려 하기보다 관계의 규칙을 같이 만드는 거야.`,
      `재물이나 현실 흐름에서는 한쪽이 더 계산적이고, 다른 한쪽이 더 감정적으로 움직이는 경향이 생길 수 있어. 돈, 약속, 미래 계획을 이야기할 때 서로의 기준이 다르다고 느낄 수 있지. 이때 중요한 건 누가 맞고 틀리냐가 아니라 기준을 숫자와 일정으로 맞추는 거야. “언젠가” 같은 말보다 “이번 달”, “다음 주”, “얼마까지”처럼 구체적으로 말할수록 오해가 줄어들어.`,
      `연애 흐름에서는 끌림이 생기면 꽤 빠르게 가까워질 수 있지만, 안정권에 들어가는 데는 시간이 필요해. 한쪽은 마음이 생기면 바로 확인하고 싶고, 다른 한쪽은 확신이 생길 때까지 관찰하려는 흐름이 있어. 이 차이를 잘 모르면 한쪽은 서운하고 한쪽은 부담스러워져. 그래서 초반에는 속도를 맞추는 대화가 필요해. “우리 어떻게 생각해?” 같은 무거운 질문보다 “나는 이런 속도가 편해”처럼 말하는 게 좋아.`,
      `갈등이 생겼을 때 이 궁합은 자존심 싸움으로 가면 손해가 커. 둘 다 속으로는 관계를 중요하게 생각하면서도 겉으로는 아닌 척할 수 있어. 특히 마음이 상했을 때 일부러 차갑게 말하거나, 아무렇지 않은 척하면 상대는 더 멀어졌다고 느낄 수 있어. 이 관계는 감정 표현을 너무 과하게 할 필요는 없지만, 최소한의 신호는 계속 줘야 해.`,
      `상대에게 안정감을 주는 방식은 생각보다 단순해. 갑작스럽게 사라지지 않기, 말 바꾸지 않기, 약속 시간을 지키기, 서운한 일이 생기면 비꼬지 않고 말하기. 이런 기본적인 태도가 이 관계에서는 큰 의미가 있어. 화려한 이벤트보다 반복되는 안정감이 더 강한 궁합이기 때문에, 작은 행동을 꾸준히 하는 사람이 관계의 중심을 잡게 돼.`,
      `서로의 약점도 분명해. 한쪽은 감정이 올라오면 말이 급해지고, 다른 한쪽은 생각이 많아지면 표현이 느려질 수 있어. 그래서 타이밍이 안 맞으면 서로가 서로를 힘들게 한다고 느껴. 하지만 이건 궁합이 나쁘다는 뜻이 아니라 대화 방식이 다르다는 뜻이야. 서로의 반응 속도를 성격 문제로 보지 않고, 처리 방식의 차이로 보면 관계가 훨씬 부드러워져.`,
      `결론적으로 이 궁합은 마음이 움직일 힘은 있지만, 서두르면 꼬이고 천천히 맞추면 깊어지는 조합이야. 단기간의 설렘만 보면 애매하게 느껴질 수 있지만, 서로가 반복적으로 안정감을 주기 시작하면 생각보다 오래 가는 힘이 있어. 중요한 건 감정 확인을 너무 자주 요구하지 않는 것, 그리고 무심한 척으로 상대를 시험하지 않는 거야. 이 두 가지만 조심하면 관계는 꽤 괜찮은 방향으로 갈 수 있어.`,
      `조언을 하나로 줄이면, 이 관계는 **확신보다 리듬**이 먼저야. 확신을 강제로 만들려고 하면 부담이 커지고, 리듬을 맞추면 자연스럽게 확신이 따라와. 연락 주기, 만나는 빈도, 감정 표현 방식, 돈과 시간에 대한 기준을 조금씩 맞춰가면 둘 사이의 긴장감은 안정감으로 바뀔 수 있어. 그래서 이 궁합은 처음보다 나중이 더 중요하고, 말보다 꾸준한 태도가 더 크게 작용해.`,
      `만약 지금 둘 사이가 애매하다면 바로 결론을 내리기보다는 최근 한 달의 흐름을 보는 게 좋아. 연락이 줄었는지, 만남 뒤에 피곤함이 큰지, 서로를 대할 때 말투가 부드러워졌는지, 약속을 지키는 태도가 있었는지 봐야 해. 사주 궁합은 순간 감정보다 반복 패턴을 더 중요하게 봐. 반복이 안정적이면 관계는 남고, 반복이 불안정하면 아무리 끌려도 흔들릴 수 있어.`,
      `마지막으로 이 조합은 서로에게 배울 게 있는 관계야. 한쪽은 감정을 다루는 법을 배우고, 다른 한쪽은 현실을 더 부드럽게 표현하는 법을 배워. 그래서 좋은 관계가 되면 단순히 즐겁기만 한 게 아니라 서로의 생활이 조금씩 정리되는 느낌이 생겨. 반대로 불안정하게 흘러가면 서로의 예민함만 건드릴 수 있어. 결국 이 궁합의 핵심은 누가 더 강한가가 아니라 누가 더 안정적인가야.`,
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
    event: `${my}와 ${partner}는 대화가 잘 풀릴 때 빠르게 가까워지지만, 답장 텀이나 말투 하나로 분위기가 바뀔 수 있어.`,
    rows: [
      {
        label: "내 성향",
        value: `${my}: 감정 표현과 관계 속도`,
      },
      {
        label: "상대 성향",
        value: `${partner}: 안정감을 느끼는 방식`,
      },
      {
        label: "끌림 포인트",
        value: "서로 다른 점이 호기심으로 작동",
      },
      {
        label: "충돌 포인트",
        value: "연락 텀, 말투, 서운함을 푸는 속도",
      },
    ],
    lines: [
      `${my}와 ${partner}의 궁합은 사주가 아니라 **성향 차이**로 봐야 해. 핵심은 감정 표현 속도와 갈등 처리 방식이야. 이 둘은 같은 사건을 겪어도 받아들이는 순서가 다를 수 있어. 한쪽은 먼저 감정이 올라오고 나중에 논리를 붙이는 편이고, 다른 한쪽은 먼저 상황을 정리한 뒤 감정을 확인하는 편일 수 있어. 그래서 서로가 틀린 게 아니라 처리 순서가 다르다는 걸 먼저 알아야 해.`,
      `한쪽은 바로 말해야 편하고, 다른 한쪽은 혼자 정리한 뒤 말이 나올 수 있어. 이 차이가 초반에는 매력이고 나중에는 서운함이 될 수 있어. 처음에는 “나랑 다르게 생각해서 신기하다”가 되지만, 관계가 깊어지면 “왜 이렇게 반응하지?”가 될 수 있거든. 그래서 이 조합은 다름을 매력으로 유지하려면 대화 규칙을 만드는 게 중요해.`,
      `좋을 때는 대화가 빠르게 이어지고, 관심사가 맞으면 오래 얘기할 수 있어. 특히 서로가 좋아하는 분야를 존중해주면 친밀감이 빨리 올라가. 다만 싸울 때는 말투가 가장 큰 변수가 돼. 같은 내용이라도 어떻게 말하느냐에 따라 상대가 받아들이는 감정이 완전히 달라질 수 있어. 그래서 이 관계는 문제 자체보다 말투 관리가 더 중요할 때가 많아.`,
      `이 조합은 상대의 반응 속도를 마음의 크기로 착각하면 안 돼. 답장이 짧아도 무심함이 아닐 수 있고, 말이 많아도 집착이 아닐 수 있어. 각자 편안함을 느끼는 표현 방식이 다른 거야. 한쪽은 자주 표현해야 마음이 안정되고, 다른 한쪽은 부담 없이 있어야 마음이 열린다. 이 차이를 인정하면 불필요한 오해가 크게 줄어들어.`,
      `감정 표현에서는 둘 중 한 명이 훨씬 직접적일 가능성이 있어. 직접적인 사람은 솔직하게 말하는 게 배려라고 생각하고, 조심스러운 사람은 상대가 부담을 느끼지 않게 하는 게 배려라고 생각해. 둘 다 배려하고 있는데 방식이 달라서 오해가 생길 수 있어. 이럴 때는 “왜 그렇게 해?”보다 “나는 이런 방식이 편해”라고 말하는 게 좋아.`,
      `연락 스타일도 중요한 포인트야. 한쪽은 짧게 자주 이어지는 연락을 좋아하고, 다른 한쪽은 할 말이 있을 때 집중해서 대화하는 걸 좋아할 수 있어. 이때 연락 빈도를 애정의 증거로만 보면 문제가 생겨. 좋은 방식은 최소한의 기준을 정하는 거야. 예를 들면 바쁠 때는 짧게라도 말해주기, 중요한 일정 전후에는 먼저 확인해주기 같은 식이야.`,
      `데이트나 만남에서는 즉흥성과 계획성의 차이가 나타날 수 있어. 한쪽은 그때그때 분위기에 따라 움직이는 걸 좋아하고, 다른 한쪽은 어느 정도 정해진 일정이 있어야 편할 수 있어. 이 차이는 나쁘지 않아. 오히려 잘 섞이면 한쪽은 새로운 경험을 열어주고, 다른 한쪽은 관계가 안정적으로 흘러가게 해줘. 문제는 서로의 방식을 무시할 때 생겨.`,
      `갈등 상황에서는 둘 다 자기 방식이 맞다고 느끼기 쉬워. 감정형 흐름이 강한 사람은 “내 기분을 먼저 알아줘야지”라고 생각할 수 있고, 사고형 흐름이 강한 사람은 “문제를 해결해야지”라고 생각할 수 있어. 둘 다 틀리지 않아. 다만 순서가 다를 뿐이야. 이 조합은 먼저 감정을 인정하고, 그다음 해결책을 찾는 방식이 가장 안정적이야.`,
      `상대가 조용해졌을 때 바로 최악의 결론을 내리면 관계가 흔들릴 수 있어. 어떤 유형은 감정이 깊을수록 바로 말하지 못하고 생각할 시간이 필요해. 반대로 어떤 유형은 조용함을 거절로 받아들여 불안해져. 그래서 “지금 이야기하기 어렵다면 나중에 다시 말해줘” 같은 문장이 좋아. 이 한 문장만 있어도 불필요한 감정 소모가 줄어들어.`,
      `둘의 장점은 서로가 서로의 부족한 부분을 건드려준다는 거야. 한쪽은 상대를 통해 더 부드럽게 표현하는 법을 배우고, 다른 한쪽은 상대를 통해 더 분명하게 말하는 법을 배울 수 있어. 좋은 관계가 되면 둘 다 조금씩 균형이 잡혀. 그래서 이 궁합은 단순히 편한 관계라기보다 성장형 관계에 가까워.`,
      `단점은 서로가 피곤할 때 가장 크게 드러나. 여유가 있을 땐 다름을 이해하지만, 지치면 그 다름이 단점처럼 보여. 평소에는 귀엽던 즉흥성이 무책임하게 느껴지고, 평소에는 든든하던 신중함이 답답하게 느껴질 수 있어. 그래서 이 관계는 컨디션이 나쁠 때 중요한 대화를 피하는 게 좋아. 피곤한 상태에서 한 말은 실제 마음보다 세게 나올 수 있어.`,
      `관계를 오래 유지하려면 칭찬 방식도 맞춰야 해. 어떤 사람은 구체적인 인정에 힘을 얻고, 어떤 사람은 감정적인 표현에 힘을 얻어. “좋아”라는 말도 좋지만 “네가 이렇게 해줘서 편했어”처럼 구체적으로 말하면 훨씬 잘 전달돼. 이 조합은 막연한 애정보다 구체적인 피드백이 관계 만족도를 올리는 편이야.`,
      `서운함을 말할 때는 타이밍이 중요해. 감정이 가장 올라왔을 때 말하면 상대가 방어적으로 변할 수 있어. 대신 감정이 조금 가라앉은 뒤 “아까 그 부분에서 나는 이렇게 느꼈어”라고 말하면 훨씬 부드럽게 풀려. 이 관계는 공격과 방어의 구조로 가면 오래 힘들어지고, 설명과 조율의 구조로 가면 꽤 잘 맞아.`,
      `결론은 **다름을 틀림으로 보지 않는 것**이야. 확인하고 싶으면 떠보지 말고 짧고 솔직하게 말하는 게 제일 좋아. “너 왜 그래?”보다 “나는 이런 반응이 조금 불안했어”가 훨씬 낫고, “알아서 해”보다 “나는 이렇게 해줬으면 좋겠어”가 훨씬 좋아. 이 조합은 솔직함이 관계를 살리지만, 날카로운 솔직함은 관계를 다치게 할 수 있어.`,
      `이 궁합은 서로를 완전히 똑같이 만들 필요가 없어. 오히려 서로가 다르기 때문에 배울 수 있는 게 있는 조합이야. 다만 다름을 방치하면 오해가 되고, 다름을 설명하면 매력이 돼. 그러니까 이 관계의 핵심은 성격을 바꾸는 게 아니라 번역하는 거야. 내 방식의 의미를 상대가 이해할 수 있게 말하고, 상대 방식의 의미를 너무 성급하게 판단하지 않는 것. 그게 가장 중요해.`,
    ],
  };
}

function makeFeaturePrompt(key, form) {
  const birthdayText = `${form.birthdayYear}.${form.birthdayMonth}.${form.birthdayDay}`;

  const prompts = {
    birthday: `
업로드한 인물 사진을 활용해서 생일 ${birthdayText} 기념 지하철 대형 전광판 광고처럼 보이는 이미지를 만든다.
파스텔 하늘, 부드러운 구름, 반짝이는 조명, HAPPY BIRTHDAY 타이포그래피, 한국어 축하 문구, 고급 팬 광고 느낌.
업로드한 인물의 얼굴 특징과 분위기를 자연스럽게 유지한다.
실제 지하철역 생일 광고판처럼 완성도 있게 구성한다.
`.trim(),

    animal: `
업로드한 사진의 포즈, 옷, 구도, 분위기를 최대한 유지하면서 인물을 세련된 의인화 고양이 또는 동물상 캐릭터로 변환한다.
실제 사진 같은 질감, 스트릿 패션, 자연스러운 조명, SNS 바이럴 감성.
얼굴 위치와 인물 간 거리감은 유지하고 과하게 왜곡하지 않는다.
귀엽지만 저렴한 만화체가 아니라 고급스럽고 공유하고 싶은 결과물로 만든다.
`.trim(),

    young: `
업로드한 인물 사진을 어린 시절 분위기로 변환한다.
얼굴 특징은 유지하되 동글한 얼굴, 맑은 눈, 부드러운 피부, 밝은 파란 배경, 귀여운 사진관 콘셉트로 만든다.
실제 어린 시절 사진처럼 자연스럽고 사랑스럽게 표현한다.
과장된 필터 느낌이 아니라 고급 사진관 결과물처럼 만든다.
`.trim(),

    comic: `
업로드한 사진을 일본 순정만화 표지처럼 변환한다.
반짝이는 눈, 부드러운 피부 표현, 벚꽃 조명, 로맨틱한 구도, 고급 웹툰 표지 느낌.
인물의 포즈와 관계 분위기를 유지한다.
실사 원본의 감정선을 살린 로맨틱한 포스터 이미지로 만든다.
`.trim(),

    travel: `
업로드한 사진을 ${form.place || "여행지"} 감성 브이로그 콜라주처럼 구성한다.
필름 질감, 햇빛 번짐, 여러 장의 프레임, 개인적인 여행 기록 느낌.
업로드 사진을 중심으로 여행 앨범처럼 꾸민다.
모바일에서 저장하고 공유하기 좋은 고급 콜라주 이미지로 만든다.
`.trim(),

    color: `
업로드한 얼굴 사진 기반 퍼스널컬러 리포트 이미지를 만든다.
피부톤, 베스트 컬러, 워스트 컬러, 메이크업 가이드, 어울리는 분위기 키워드가 보이는 고급 카드형 UI.
얼굴은 자연스럽게 유지하고 깔끔한 리포트 디자인으로 구성한다.
흰색과 크림색 배경, 둥근 카드, 컬러 팔레트가 잘 보이게 만든다.
`.trim(),

    hair: `
업로드한 얼굴 사진 기반 헤어스타일 추천 리포트 이미지를 만든다.
추천 헤어 3가지, 앞머리, 기장, 볼륨, 컬러 팁이 보이는 고급 미용실 상담 리포트 스타일.
업로드한 얼굴형을 기준으로 자연스러운 헤어 스타일 제안 카드로 구성한다.
실제 미용실 상담 자료처럼 깔끔하고 믿을 만한 느낌으로 만든다.
`.trim(),

    palm: `
업로드한 손바닥 사진 기반 손금 분석 리포트 이미지를 만든다.
생명선, 두뇌선, 감정선, 운명선, 태양선을 얇은 선으로 표시한다.
손바닥 선이 잘 보이도록 정리하고 미니멀한 고급 카드형 분석 디자인으로 구성한다.
흰 배경, 얇은 선, 둥근 카드, 깔끔한 설명 영역을 포함한다.
`.trim(),
  };

  return `
${prompts[key]}
모바일 공유용 고화질 이미지.
깔끔하고 비싼 느낌.
과한 왜곡 없이 자연스럽게.
사용자는 프롬프트를 보지 않고 완성 이미지만 보게 된다.
`.trim();
}