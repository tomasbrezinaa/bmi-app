import { Suspense, useState, useEffect } from "react";
/* importing i18next */
import i18n from "i18next"
import { initReactI18next, useTranslation} from "react-i18next"
/* importing react spinners animation for pre-loader */
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
/* importing css */
import "./index.css"

/* language translation */
const translationsEn = {language: "Language",
                        heading: "BMI Calculator",
                        weight: "Weight (kgs)",
                        height: "Height (cm)",
                        submit: "Submit", reload: "Reload",
                        answer : "Your BMI is : ",
                        under_weight: "You are underweight",
                        normal_weight: "You are healthy weight",
                        over_weight: "You are overweight",
};

const translationsSk = {language: "Jazyk",
                        heading: "BMI Kalkulačka",
                        weight: "Váha (kg)",
                        height: "Výška (cm)",
                        submit: "Potvrdiť",
                        reload: "Obnoviť",
                        answer : "Tvoje BMI  je : ",
                        under_weight: "Máš podváhu",
                        normal_weight: "Máš zdravá váhu",
                        over_weight: "Máš nadváhu",
};

/* initialization of i18next for language change */
i18n 
    .use(initReactI18next)
    .init(    {
      resources: {
        en : { translation: translationsEn },
        sk: { translation: translationsSk },
      },
      lng: "en",
      fallbackLng: "en",
      interpolation: { escapeValue : false},
    });

/* main function App */

function App() {
  /* declaring useTranslation hook */
  const { t } = useTranslation();

  /* declaring hooks for changing weight and height value */
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);

  const [bmi, setBmi] = useState("");
  const [message , setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  /* using variable to declare adapted message for user */
  const under_weight = <p>{t('under_weight')}</p>;
  const normal_weight = <p>{t('normal_weight')}</p>;
  const over_weight = <p>{t('over_weight')}</p>;

  /* declaring standard value for loading animation */
  let color = "#000";

  /* declaring variable for adapted emoji */
  let emoji = "";

  /* functions for remembering selectedTheme value after refreshing */
  
  const setDarkMode = () => {
    document.querySelector("body").setAttribute('data-theme', 'dark')
    localStorage.setItem("selectedTheme", "dark")
  }

  const setLightMode = () => {
    document.querySelector("body").setAttribute('data-theme', 'light')
    localStorage.setItem("selectedTheme", "light")
  }

  const selectedTheme = localStorage.getItem("selectedTheme")
  if(selectedTheme === "dark") {
    color = "#fff"
    setDarkMode();
  }

  const toggleTheme = (event) => {
    if(event.target.checked){setDarkMode();}
    else {setLightMode()}
  }
 
  /*  arrow function for changing language */
  let onChange = (event) => {
    i18n.changeLanguage(event.target.value);
  }

  /* main bmi calculation with preventing undesirable values */

  let calcBmi = (event) => {
    event.preventDefault()

    if (weight === 0 || height === 0) {
      alert('Please enter a valid value')
    } else {
      let bmi = (weight / (height * height / 10000))
      setBmi(bmi.toFixed(1))

      if (bmi < 18.5) {
        setMessage(under_weight)
      } else if (bmi >= 18.5 && bmi < 24.9) {
        setMessage(normal_weight)
      } else {
        setMessage(over_weight)
      }
      /* preventing lower limit*/
      if (weight < 25 || height < 100){
      alert('Please enter a valid value')
      setBmi(null);
      setMessage(null)
      }
      /* preventing upper limit*/
      if (weight > 300 || height > 250){
      alert('Please enter a valid value')
      setBmi(null);
      setMessage(null)
      }
    }
  }

  /* emoji change based on bmi value */
  
  if (bmi < 1) {
    emoji = null;
  } else {
    if (bmi < 18.5){
      emoji = "😌"
    } else if (bmi >= 18.5 && bmi < 24.9) {
      emoji = "😇"
    } else {
      emoji = "😏"
    }
  }
  /* arrow function for reload */

  let reload = () => {
    window.location.reload(); 
  } 
  
  /* react-spinners animation using useEffect() */
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2500)
  }, [])
  /* returning JSX */

  return (
    <Suspense fallback="Loading...">
    <div className="app">
      {/* using react-spinners and ternar operator, loading will be true for defined amount of seconds
      than set to false and returning app*/}
      {
        loading ?

        <ClimbingBoxLoader
        size={30}
        color={color}
        loading={loading}
        />
        : 
         <div className="container">
          <div className="addons">
          <div className ='darkmode-switch'>
            <label className="darkmode-label">
                <input className="darkmode-input" type='checkbox' onChange={toggleTheme} defaultChecked={selectedTheme === "dark"}/>
                <span className='slider'></span>
            </label>
            </div>
          <div className="language">
            <label className="title">{t('language')} </label>
                <select name="language" onChange={onChange}>
                  <option value="en">🇺🇸</option>
                  <option value="sk">🇸🇰</option>
                </select>
          </div>
        </div>
        <h2 className="center">{t('heading')}</h2>
        <form onSubmit={calcBmi}>
          <div>
            <label>{t('weight')}</label>
            <input type="number" value={weight} onChange={(event) => setWeight(event.target.value)}></input>
          </div>
          <div>
            <label>{t('height')}</label>
            <input type="number" value={height} onChange={(event) => setHeight(event.target.value)}></input>
          </div>
          <div>
            <button className="button" type="submit">{t('submit')}</button>
            <button className="button button-outline" type="submit" onClick={reload}>{t('reload')}</button>
          </div>
        </form>
        <div className="center">
          <h3>{t("answer")} {bmi}</h3>
          <p>{message}</p>
        </div>
        <div className="emoji">
          <p>{emoji}</p>
        </div>
      </div>
      }
    </div>
    </Suspense>
  )
}
/* exporting component to main index.js file */
export default App;
