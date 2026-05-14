import { useEffect, useMemo, useState } from "react";
import "./App.css";

const SITE_URL = "https://oursai.vercel.app";
const KAKAO_JS_KEY = "392f84c5486937d26780349c72b4a1d8";

const mbtiList = [
  "ISTJ","ISFJ","INFJ","INTJ","ISTP","ISFP","INFP","INTP",
  "ESTP","ESFP","ENFP","ENTP","ESTJ","ESFJ","ENFJ","ENTJ",
];

const relations = ["모름", "친구(썸)", "연애 중", "짝사랑"];

const fortuneImages = [
  "001_lucky_shop.png","002_morning_sun.png","003_night_sky.png","004_love_heart.png","005_rain_umbrella.png",
  "006_coffee_break.png","007_studying.png","008_reading_book.png","009_writing.png","010_relaxed_couch.png",
  "011_travel.png","012_camera.png","013_bicycle.png","014_car_drive.png","015_hot_air_balloon.png",
  "016_train_window.png","017_airplane.png","018_beach.png","019_lighthouse.png","020_forest_walk.png",
  "021_picnic.png","022_flower_bouquet.png","023_letter.png","024_phone_call.png","025_message.png",
  "026_gift_box.png","027_birthday_cake.png","028_party.png","029_balloon.png","030_fireworks.png",
  "031_tulip.png","032_plant.png","033_water_plant.png","034_cooking.png","035_baking.png",
  "036_ice_cream.png","037_smoothie.png","038_music_listen.png","039_guitar.png","040_piano.png",
  "041_drawing.png","042_paint_palette.png","043_craft.png","044_notebook.png","045_calendar.png",
  "046_deadline.png","047_plan_board.png","048_checklist.png","049_target.png","050_idea_bulb.png",
  "051_success.png","052_goal_flag.png","053_climbing.png","054_running.png","055_workout.png",
  "056_yoga.png","057_stretching.png","058_sports_ball.png","059_basketball.png","060_swimming.png",
  "061_shopping_bag.png","062_market.png","063_coins.png","064_piggy_bank.png","065_wallet.png",
  "066_money_stack.png","067_bank.png","068_success_money.png","069_graph_up.png","070_graph_down.png",
  "071_door_open.png","072_door_closed.png","073_window.png","074_mirror.png","075_thinking.png",
  "076_confused.png","077_excited.png","078_tired.png","079_crying.png","080_broken_heart.png",
  "081_sleeping.png","082_pillow.png","083_alarm_clock.png","084_day_off.png","085_vacation.png",
  "086_home.png","087_cozy_blanket.png","088_camping.png","089_bonfire.png","090_stargazing.png",
  "091_cloud.png","092_rainbow.png","093_star.png","094_four_leaf_clover.png","095_lucky_cat.png",
  "096_lucky_dice.png","097_shooting_star.png","098_tree.png","099_autumn_leaves.png","100_snow.png",
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
  { name: "올리브 그린", cls: "olive", text: "차분한데 은근히 존재감 있는 색. 오늘은 안정감이 매력이야." },
  { name: "버터 옐로우", cls: "yellow", text: "말을 먼저 꺼내기 좋은 색. 밝은 인상이 운을 열어줘." },
  { name: "크림 화이트", cls: "cream", text: "복잡한 생각을 덜어내고 부드럽게 보이게 하는 색." },
  { name: "코랄 핑크", cls: "coral", text: "연락운과 호감 표현이 살아나는 색. 오늘은 따뜻함이 무기야." },
];

export default function App() {
  const [mode, setMode] = useState("home");
  const [paid, setPaid] = useState(false);

  const [savedPeople, setSavedPeople] = useState(() => {
    const saved = localStorage.getItem("woorisai_people_v5");
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
    localStorage.setItem("woorisai_people_v5", JSON.stringify(savedPeople));
  }, [savedPeople]);

  const fortune = useMemo(() => makeDailyFortune(fortuneForm), [fortuneForm]);
  const score = useMemo(() => makeScore(form), [form]);
  const saju = useMemo(() => makeSajuData(form), [form]);
  const mbti = useMemo(() => makeMbtiData(form, score), [form, score]);

  const savePerson = (p) => {
    if (!p.name) return;
    const clean = { name: p.name, year: p.year, month: p.month, day: p.day, mbti: p.mbti };

    setSavedPeople((prev) => {
      const filtered = prev.filter((x) => x.name !== clean.name);
      return [clean, ...filtered].slice(0, 12);
    });
  };

  const loadFortune = (name) => {
    const p = savedPeople.find((x) => x.name === name);
    if (p) setFortuneForm({ ...fortuneForm, ...p });
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

  const share = async () => {
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
          <p>생년월일, MBTI, 처음 만난 날로<br />둘만의 흐름을 분석해줄게!</p>
          <img src="/turtle-heart.png" alt="" />
        </section>

        <div className="menu-list">
          <Menu icon="✨" title="오늘의 운세" desc="오늘의 노래, 럭키 컬러, 기회" onClick={() => setMode("fortune")} />
          <Menu icon="💗" title="사주 궁합" desc="사주표와 전문 용어 기반 궁합" onClick={() => setMode("saju")} />
          <Menu icon="👥" title="MBTI 궁합" desc="성격 궁합으로 보는 우리 사이" onClick={() => setMode("mbti")} />
        </div>
      </Phone>
    );
  }

  if (mode === "fortune") {
    return (
      <Phone>
        <Top title="오늘의 운세" back={() => setMode("home")} />

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
        <Top title="오늘의 운세" back={() => setMode("home")} share={share} />

        <section className="fortune-head">
          <p>{fortune.today}</p>
          <h1>{fortune.title}</h1>
          <img src={`/fortune-images/${fortune.heroImage}`} alt="" className="fortune-scene hero-scene" />
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

        <RevealCard icon="👗" title="오늘의 럭키 컬러">
          <div className="outfit-card">
            <div className={`real-outfit ${fortune.color.cls}`}>
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
        </RevealCard>

        <RevealCard icon="🎁" title="오늘 올 기회">
          <SceneImage file={fortune.chanceImage} />
          <p>{fortune.chance}</p>
        </RevealCard>

        <RevealCard icon="📜" title="오늘의 격언">
          <SceneImage file={fortune.quoteImage} />
          <p>“{fortune.quote}”</p>
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

        <button className="main-btn" onClick={() => setMode("saju")}>사주 궁합 보러 가기</button>
        <button className="sub-btn" onClick={() => setMode("mbti")}>MBTI 궁합 보러 가기</button>
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
          <SavedPicker people={savedPeople} label="최근 입력한 내 정보" onSelect={(name) => loadPerson("me", name)} />

          <label>이름</label>
          <input value={form.myName} placeholder="이름을 입력해주세요" onChange={(e) => updateForm("myName", e.target.value)} />

          <label>생년월일</label>
          <div className="date-row">
            <input placeholder="1998" value={form.myYear} onChange={(e) => updateForm("myYear", e.target.value, 4)} />
            <input placeholder="05" value={form.myMonth} onChange={(e) => updateForm("myMonth", e.target.value, 2)} />
            <input placeholder="14" value={form.myDay} onChange={(e) => updateForm("myDay", e.target.value, 2)} />
          </div>

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

          <label>생년월일</label>
          <div className="date-row">
            <input placeholder="1996" value={form.partnerYear} onChange={(e) => updateForm("partnerYear", e.target.value, 4)} />
            <input placeholder="09" value={form.partnerMonth} onChange={(e) => updateForm("partnerMonth", e.target.value, 2)} />
            <input placeholder="23" value={form.partnerDay} onChange={(e) => updateForm("partnerDay", e.target.value, 2)} />
          </div>

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
      <ResultShell title="사주 궁합 결과" score={score} back={() => setMode("home")} share={share}>
        <Card>
          <SceneImage file={saju.eventImage} />
          <h3>이 둘 사이에 있을 법한 사건</h3>
          <p className="event-text">{saju.event}</p>
        </Card>

        <Card>
          <h3>사주 구성표</h3>
          <SajuTable data={saju.table} />
        </Card>

        <PaidArea paid={paid}>
          <Card>
            <SceneImage file={saju.detailImage} />
            <h3>🔮 사주 전문 풀이</h3>
            <Paragraphs lines={saju.lines} />
          </Card>
        </PaidArea>

        {!paid && <button className="pay-btn" onClick={() => setPaid(true)}>990원으로 전체 보기 kakaopay</button>}
        <button className="sub-btn" onClick={share}>공유하기</button>
      </ResultShell>
    );
  }

  if (mode === "mbtiResult") {
    return (
      <ResultShell title="MBTI 궁합 결과" score={score} back={() => setMode("home")} share={share}>
        <Card>
          <SceneImage file={mbti.eventImage} />
          <h3>{form.myMbti || "나"} 💛 {form.partnerMbti || "상대"}</h3>
          <MbtiCharacters my={form.myMbti} partner={form.partnerMbti} />
          <p className="event-text">{mbti.event}</p>
        </Card>

        <Card>
          <h3>MBTI 궁합표</h3>
          <MbtiTable rows={mbti.rows} />
        </Card>

        <PaidArea paid={paid}>
          <Card>
            <SceneImage file={mbti.detailImage} />
            <h3>💬 MBTI 상세 풀이</h3>
            <Paragraphs lines={mbti.lines} />
          </Card>
        </PaidArea>

        {!paid && <button className="pay-btn" onClick={() => setPaid(true)}>990원으로 전체 보기 kakaopay</button>}
        <button className="sub-btn" onClick={share}>공유하기</button>
      </ResultShell>
    );
  }

  return null;
}

function Phone({ children }) {
  return <main className="phone">{children}</main>;
}

function Top({ title, back, share }) {
  return (
    <div className="top-bar">
      <button onClick={back}>‹</button>
      <b>{title}</b>
      <button onClick={share || (() => {})}>{share ? "⌯" : ""}</button>
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

function SceneImage({ file }) {
  return <img src={`/fortune-images/${file}`} alt="" className="fortune-scene" />;
}

function ResultShell({ title, score, back, share, children }) {
  return (
    <Phone>
      <Top title={title} back={back} share={share} />

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

function SajuTable({ data }) {
  return (
    <div className="saju-card">
      <div className="saju-head"><span>시주</span><span>일주</span><span>월주</span><span>년주</span></div>
      <div className="saju-row gods">{data.topGods.map((x, i) => <span key={i}>{x}</span>)}</div>
      <div className="saju-row boxes">{data.top.map((x, i) => <SajuBox key={i} item={x} />)}</div>
      <div className="saju-row boxes">{data.bottom.map((x, i) => <SajuBox key={i} item={x} />)}</div>
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

function MbtiCharacters({ my, partner }) {
  return (
    <div className="mbti-characters">
      <MbtiFigure type={my || "ME"} />
      <div className="heart-big">💛</div>
      <MbtiFigure type={partner || "YOU"} />
    </div>
  );
}

function MbtiFigure({ type }) {
  const group =
    type.includes("NT") ? "purple" :
    type.includes("NF") ? "green" :
    type.includes("SJ") ? "teal" : "yellow";

  return (
    <div className={`mbti-figure ${group}`}>
      <div className="poly-head" />
      <div className="poly-hair" />
      <div className="poly-body" />
      <div className="poly-arm left" />
      <div className="poly-arm right" />
      <div className="poly-leg left" />
      <div className="poly-leg right" />
      <b>{type}</b>
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
  return fortuneImages[(seed + offset) % fortuneImages.length];
}

function makeSeed(input, daily = false) {
  const now = new Date();
  const key = daily ? `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}` : "";
  const text = JSON.stringify(input) + key;
  let seed = 0;
  for (let i = 0; i < text.length; i++) seed = (seed * 31 + text.charCodeAt(i)) % 1000003;
  return seed;
}

function makeScore(input) {
  const seed = makeSeed(input, false);
  return 58 + (seed % 39);
}

function clamp(n) {
  return Math.max(0, Math.min(100, n));
}

function makeDailyFortune(input) {
  const seed = makeSeed(input, true);
  const song = songPool[seed % songPool.length];
  const color = colors[seed % colors.length];
  const topic = input.topic.trim();

  return {
    today: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }),
    title: `${input.name || "너"}에게 오늘 들어오는 흐름`,
    song: song[0],
    youtubeId: song[1],
    songLine: song[2],
    color,
    heroImage: pickImage(seed, 2),
    songImage: pickImage(seed, 38),
    chanceImage: pickImage(seed, 50),
    quoteImage: pickImage(seed, 92),
    mainImage: pickImage(seed, 75),
    topicImage: pickImage(seed, 24),
    chance: seed % 2 === 0
      ? "오늘은 오후에 짧은 연락이나 제안이 생각보다 크게 이어질 수 있어."
      : "평소 별생각 없던 사람이나 일이 오늘은 의외의 힌트를 줄 수 있어.",
    quote: seed % 2 === 0
      ? "흐르는 건 억지로 붙잡지 말고, 남는 건 괜히 의심하지 마라."
      : "기회는 큰 소리로 오지 않는다. 스치듯 지나가는 말 속에 숨어 온다.",
    lines: makeFortuneLines(input, color),
    topicLines: topic ? makeTopicLines(topic) : [],
  };
}

function makeFortuneLines(input, color) {
  return [
    `오늘은 **가만히 있으면 손해 보는 날**이야. 괜히 눈치만 보다가 타이밍을 놓치면 나중에 아쉬움이 남을 수 있어.`,
    `특히 ${input.mbti || "너"} 성향상 오늘은 생각이 많아지기 쉬운데, 너무 오래 고민하면 흐름이 닫혀. 🐢`,
    `오늘의 핵심은 **짧고 분명하게 말하기**야. 길게 설명하면 진심보다 불안처럼 보일 수 있어.`,
    `누군가에게 연락하고 싶다면 무겁게 시작하지 마. 가볍게 던지는 말이 오히려 오래 이어질 가능성이 커.`,
    `오늘은 사람을 통해 기회가 들어오는 날이야. 평소에 깊게 친하지 않았던 사람이 의외의 연결점이 될 수 있어.`,
    `돈이나 일 쪽에서는 작은 제안, 짧은 알림, 갑작스러운 일정 변경을 그냥 넘기지 마. 거기에 힌트가 있어.`,
    `연애운은 직접적으로 세게 오는 게 아니라, 살짝 건드렸을 때 상대가 반응하는 식으로 와.`,
    `오늘 조심할 건 **혼자 상상해서 결론 내리기**야. 아직 일어나지도 않은 일을 머릿속에서 끝까지 굴리면 하루가 무너져.`,
    `오늘은 먼저 움직이되 매달리지는 않는 태도가 중요해. 이 균형만 잡으면 운이 훨씬 부드럽게 풀려.`,
    `럭키 컬러는 **${color.name}** 쪽이 좋아. 오늘은 색이 기분을 바꾸는 게 아니라, 네 태도를 바꿔주는 장치처럼 작동해.`,
    `오전에는 답답하게 막힌다고 느낄 수 있는데, 이건 운이 나쁜 게 아니라 아직 판이 덜 열린 거야.`,
    `오후로 갈수록 누가 말을 걸거나, 네가 먼저 움직일 명분이 생길 가능성이 커.`,
    `오늘은 괜히 완벽하게 준비하려고 하면 오히려 시작이 늦어져.`,
    `대충 하라는 뜻은 아니고, **70% 준비됐을 때 움직이는 게 이기는 날**이라는 뜻이야.`,
    `누군가의 반응이 미묘하면 바로 상처받지 마. 오늘은 상대도 자기 감정을 늦게 알아차릴 수 있어.`,
    `오늘은 말투가 중요해. 같은 말도 날카롭게 하면 막히고, 가볍게 하면 열려.`,
    `해야 할 일이 있다면 제일 쉬운 것부터 시작해. 오늘은 작은 성공을 하나 만들면 흐름이 빨리 붙어.`,
    `관계에서는 너무 많은 의미를 요구하지 마. 오늘은 확인보다 **분위기 회복**이 먼저야.`,
    `돈이나 일에서는 큰 한 방보다 작은 실마리가 중요해. 작은 메시지, 작은 제안, 작은 아이디어를 무시하지 마.`,
    `결론은 이거야. 오늘은 **망설이면 지나가고, 가볍게 잡으면 열리는 날**이야. ✨`,
  ];
}

function makeTopicLines(topic) {
  return [
    `네가 물어본 **${topic}** 쪽은 오늘 바로 결론이 나는 흐름은 아니야.`,
    `대신 작은 신호가 먼저 와. 말투, 제안, 연락, 표정 같은 사소한 것에서 방향이 보일 가능성이 커.`,
    `대처법은 단순해. **확인하려고 몰아붙이지 말고**, 상황이 열릴 틈을 만들어야 해.`,
    `마음가짐은 “당장 답을 받겠다”가 아니라 **흐름을 내가 유리하게 만들겠다** 쪽이 좋아.`,
    `오늘 이 주제는 세게 밀면 막히고, 부드럽게 건드리면 풀리는 쪽이야.`,
    `상대가 있거나 사람이 얽힌 문제라면, 오늘은 직접 결판내기보다 반응을 관찰하는 게 좋아.`,
    `돈이나 일과 관련된 문제라면, 큰 선택보다 작은 정리가 먼저야.`,
    `지금 마음이 급하다면 그 자체가 변수야. 급한 상태에서 내린 결정은 나중에 수정 비용이 커져.`,
    `오늘은 결과보다 **내가 어떤 태도로 움직였는지**가 더 중요해.`,
    `이 주제는 오늘 완성되는 문제가 아니라, 오늘 첫 단서가 열리는 문제로 보는 게 맞아.`,
  ];
}

function makeSajuData(form) {
  const seed = makeSeed(form, false);
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
    eventImage: pickImage(seed, 23),
    detailImage: pickImage(seed, 47),
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
    `여기서 중요한 건 누가 더 좋아하느냐가 아니야.`,
    `누가 더 안정적으로 관계의 리듬을 유지하느냐가 더 중요해.`,
    `둘 중 한 명은 불안하면 말을 더 많이 하려는 흐름이 있고, 다른 한 명은 불안하면 말이 줄어드는 흐름이 있어.`,
    `그래서 싸움이 생기면 한쪽은 “왜 말 안 해?”가 되고, 다른 한쪽은 “왜 이렇게 몰아붙여?”가 될 수 있어.`,
    `이 구조를 모르면 둘 다 자기 방식으로 사랑하는데도 서로를 피곤하게 만들 수 있어.`,
    `사주상 이 관계는 감정이 약한 궁합이 아니라, 오히려 감정이 빨리 쌓이는 쪽이야.`,
    `다만 감정이 빨리 쌓이는 만큼 오해도 빨리 쌓여.`,
    `처음부터 너무 많은 확신을 요구하면 관계가 무거워져.`,
    `반대로 너무 가볍게만 굴면 상대가 진심을 의심하게 돼.`,
    `그래서 이 궁합은 **가볍게 시작하되, 행동은 꾸준하게** 가야 해.`,
    `결론적으로 이 사주는 ${seed % 2 === 0 ? "**이어질 힘은 강하지만 솔직한 조율이 필요한 궁합**" : "**끌림은 있지만 감정 관리가 필요한 궁합**"}이야.`,
    `거북이 결론은 이거야. **좋아하면 천천히 확인하고, 불안하면 바로 단정하지 마.**`,
  ];
}

function makeMbtiData(form, score) {
  const seed = makeSeed(form, false);
  const my = form.myMbti || "모름";
  const partner = form.partnerMbti || "모름";

  return {
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
  return [
    `${my}와 ${partner}의 궁합은 단순히 좋다, 나쁘다로 끝낼 수 없어.`,
    `핵심은 **감정 표현 속도**와 **갈등 처리 방식**이야.`,
    `한쪽은 바로 확인받고 싶고, 다른 한쪽은 생각을 정리한 뒤에야 말이 나올 수 있어.`,
    `이 차이가 처음에는 신선한 매력으로 보일 수 있어.`,
    `하지만 시간이 지나면 같은 차이가 서운함으로 바뀔 수도 있어.`,
    `특히 답장 길이, 약속 잡는 방식, 감정 표현 빈도에서 차이가 잘 드러나.`,
    `이 관계는 대화가 터질 때는 진짜 빠르게 가까워져.`,
    `관심사가 맞으면 밤새 얘기할 수 있고, 별거 아닌 농담도 오래 이어질 수 있어.`,
    `그런데 싸울 때는 완전히 다른 문제가 나와.`,
    `한쪽은 바로 풀어야 마음이 편하고, 다른 한쪽은 혼자 정리해야 말이 나와.`,
    `이때 바로 풀고 싶은 쪽은 상대가 도망간다고 느껴.`,
    `반대로 혼자 정리하고 싶은 쪽은 상대가 압박한다고 느껴.`,
    `그래서 이 조합은 감정이 없는 게 아니라, **감정을 처리하는 방식이 다른 조합**이야.`,
    `좋을 때는 서로의 다름이 매력으로 보이고, 힘들 때는 그 다름이 피로로 보일 수 있어.`,
    `특히 연락에서 오해가 생기기 쉬워.`,
    `한쪽은 짧은 답장을 무심함으로 받아들이고, 다른 한쪽은 그냥 바빠서 짧게 답한 것일 수 있어.`,
    `이 차이를 모르면 마음이 있는데도 서로를 의심하게 돼.`,
    `데이트나 만남에서는 한쪽이 분위기를 만들고, 다른 한쪽이 안정감을 잡아주는 식이 잘 맞아.`,
    `다만 계획을 짤 때는 미리 기대치를 맞추는 게 좋아.`,
    `즉흥적인 쪽은 자유를 원하고, 계획적인 쪽은 예측 가능성을 원할 수 있어.`,
    `이 둘이 부딪히면 “왜 이렇게 답답해?”와 “왜 이렇게 불안정해?”가 동시에 나올 수 있어.`,
    `그래서 이 관계의 핵심 문장은 이거야. **상대의 방식이 틀린 게 아니라 다를 뿐이다.**`,
    `마음을 확인하고 싶으면 시험하지 말고 말로 물어봐야 해.`,
    `질투 유발, 일부러 답장 늦추기, 떠보기 같은 행동은 이 궁합에서 독이야.`,
    `상대가 불편함을 느끼면 회복 속도가 생각보다 느릴 수 있어.`,
    `반대로 편안함이 쌓이면 꽤 오래 안정적으로 갈 수 있어.`,
    `이 궁합은 처음 설렘보다 이후의 대화 습관이 더 중요해.`,
    `좋아하는 마음이 있어도 말투가 거칠면 오래 못 가고, 애정 표현이 적어도 태도가 꾸준하면 오래 갈 수 있어.`,
    `결론은 ${score >= 80 ? "**다름이 매력으로 작동할 가능성이 높은 조합**" : "**다름이 피로로 변하지 않게 관리해야 하는 조합**"}이야.`,
    `거북이 결론은 이거야. **상대의 반응 속도를 사랑의 크기로 착각하지 마.**`,
  ];
}