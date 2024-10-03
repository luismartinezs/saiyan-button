import { useState, useEffect, useCallback } from "react";
import styles from "./SaiyanButton.module.css";
import { cn } from "../utils/cn";

const MAX_POWER = 300;

const forms = {
  base: {
    class: styles["base-form"],
    label: "Base Form",
    decreaseRate: 1,
    nextForm: "superSaiyan1",
    prevForm: null,
  },
  superSaiyan1: {
    class: styles["super-saiyan-1"],
    label: "Super Saiyan",
    decreaseRate: 2,
    nextForm: "superSaiyan2",
    prevForm: "base",
  },
  superSaiyan2: {
    class: styles["super-saiyan-2"],
    label: "Super Saiyan 2",
    decreaseRate: 2,
    nextForm: "superSaiyan3",
    prevForm: "superSaiyan1",
  },
  superSaiyan3: {
    class: styles["super-saiyan-3"],
    label: "Super Saiyan 3",
    decreaseRate: 3,
    nextForm: "superSaiyanGod",
    prevForm: "superSaiyan2",
  },
  superSaiyanGod: {
    class: styles["super-saiyan-god"],
    label: "Super Saiyan God",
    decreaseRate: 1,
    nextForm: "superSaiyanBlue",
    prevForm: "superSaiyan3",
  },
  superSaiyanBlue: {
    class: styles["super-saiyan-blue"],
    label: "Super Saiyan Blue",
    decreaseRate: 2,
    nextForm: null,
    prevForm: "superSaiyanGod",
  },
};

const SaiyanButton = () => {
  const [counter, setCounter] = useState(0);
  const [form, setForm] = useState<(typeof forms)[keyof typeof forms]>(
    forms.base
  );
  const fractionalCounter = (counter / MAX_POWER) * 100;

  const resetButton = useCallback(() => {
    setCounter(0);
    setForm(forms.base);
  }, []);

  const transformDown = useCallback(() => {
    if (form.prevForm) {
      setForm(forms[form.prevForm as keyof typeof forms]);
      setCounter(MAX_POWER - 1);
    }
  }, [form.prevForm]);

  const transformUp = useCallback(() => {
    if (form.nextForm) {
      setForm(forms[form.nextForm as keyof typeof forms]);
    }
  }, [form.label]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.shiftKey) {
        transformDown();
      } else if (event.metaKey) {
        transformUp();
      } else {
        setCounter((prev) => {
          const newValue = prev + 10;
          if (newValue >= MAX_POWER) {
            transformUp();
            return 10;
          }
          return newValue;
        });
      }
    },
    [transformUp, transformDown]
  );

  useEffect(() => {
    let timer: number | undefined;
    if (counter > 0) {
      timer = window.setInterval(() => {
        setCounter((prev) => Math.max(prev - form.decreaseRate, 0));
      }, 100);
    } else if (counter === 0 && form.prevForm) {
      transformDown();
    }
    return () => clearInterval(timer);
  }, [counter, form.decreaseRate, form.prevForm, transformDown]);

  return (
    <button
      className={cn(styles["saiyan-button"], form.class)}
      onClick={handleClick}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: "100%",
          width: `${fractionalCounter}%`,
          background:
            "linear-gradient(to left, rgba(255, 255, 255, 0.8) 20px, rgba(255, 255, 255, 0) 100px)",
          boxShadow: "0 0 10px rgba(255, 255, 255, 0.7)",
          transition: "height 0.1s linear",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{form.label}</span>
    </button>
  );
};

export default SaiyanButton;
