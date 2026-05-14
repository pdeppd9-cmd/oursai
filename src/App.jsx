import "./App.css";

export default function App() {
  return (
    <div className="app">

      {/* LEFT */}
      <section className="phone left">

        <div className="topbar">
          <button className="icon-btn">☰</button>

          <div className="logo">
            우리 사이 🤍
          </div>
        </div>

        <div className="hero">

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

          <img
            src="/turtle-heart.png"
            className="hero-turtle"
            alt=""
          />
        </div>

        <div className="card">

          <div className="section-title">
            🟡 내 정보
          </div>

          <label>생년월일</label>

          <div className="date-row">
            <input placeholder="1998" />
            <input placeholder="05" />
            <input placeholder="14" />
          </div>

          <label>MBTI</label>

          <select>
            <option>MBTI를 선택하세요</option>
          </select>

          <div className="divider"></div>

          <div className="section-title">
            🟢 상대 정보
          </div>

          <label>생년월일</label>

          <div className="date-row">
            <input placeholder="1996" />
            <input placeholder="09" />
            <input placeholder="23" />
          </div>

          <label>MBTI</label>

          <select>
            <option>MBTI를 선택하세요</option>
          </select>

          <div className="divider"></div>

          <div className="section-title">
            💗 우리 관계
          </div>

          <label>처음 만난 날</label>

          <div className="date-row">
            <input placeholder="2024" />
            <input placeholder="11" />
          </div>

          <label>현재 관계</label>

          <select>
            <option>친구(썸)</option>
            <option>연애 중</option>
            <option>짝사랑</option>
          </select>

          <button className="main-btn">
            🐢 우리 사이 분석하기
          </button>

        </div>

      </section>

      {/* RIGHT */}
      <section className="phone right">

        <div className="result-top">

          <button className="back-btn">
            ‹
          </button>

          <div className="result-title">
            우리 사이 분석 결과
          </div>

          <button className="share-btn">
            ↗
          </button>

        </div>

        <div className="result-hero">

          <img
            src="/turtle-wow.png"
            className="result-turtle"
            alt=""
          />

          <div className="speech">
            와아!
          </div>

        </div>

        <div className="score-card">

          <div className="score-label">
            궁합 점수
          </div>

          <div className="score">
            80<span>%</span>
          </div>

          <div className="score-desc">
            생각보다 엄청 잘 맞는 조합이야!
          </div>

          <div className="bar-wrap">
            <div className="bar-fill"></div>
          </div>

          <div className="percent-row">
            <span>0%</span>
            <span>20%</span>
            <span>40%</span>
            <span>60%</span>
            <span>80%</span>
            <span>100%</span>
          </div>

          <div className="stat">
            <div>
              ❤️ <b>사랑 궁합</b>
              <p>감정 흐름과 표현 방식</p>
            </div>

            <span>90%</span>
          </div>

          <div className="stat">
            <div>
              💬 <b>대화 궁합</b>
              <p>대화가 잘 통하는 정도</p>
            </div>

            <span>70%</span>
          </div>

          <div className="stat">
            <div>
              ✨ <b>성향 궁합</b>
              <p>생활/가치관 조화</p>
            </div>

            <span>80%</span>
          </div>

        </div>

      </section>

    </div>
  );
}