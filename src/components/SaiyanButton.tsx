import { useState, useEffect, useCallback } from "react";
import styles from "./SaiyanButton.module.css";
import { cn } from "../utils/cn";

const forms = {
  base: {
    class: styles["base-form"],
    label: "Base",
    decreaseRate: 1
  },
  superSaiyan1: {
    class: styles["super-saiyan-1"],
    label: "Super Saiyan",
    decreaseRate: 2
  },
  superSaiyan2: {
    class: styles["super-saiyan-2"],
    label: "Super Saiyan 2",
    decreaseRate: 3
  },
  superSaiyan3: {
    class: styles["super-saiyan-3"],
    label: "Super Saiyan 3",
    decreaseRate: 4
  },
};

const SaiyanButton = () => {
  const [counter, setCounter] = useState(0);
  const [form, setForm] = useState(forms.base);

  const resetButton = useCallback(() => {
    setCounter(0);
    setForm(forms.base);
  }, []);

  const transformDown = useCallback(() => {
    if (form.label === forms.superSaiyan1.label) {
      setForm(forms.base);
    }
    if (form.label === forms.superSaiyan2.label) {
      setForm(forms.superSaiyan1);
    }
    if (form.label === forms.superSaiyan3.label) {
      setForm(forms.superSaiyan2);
    }
  }, [form.label]);

  const transformUp = useCallback(() => {
    if (form.label === forms.base.label) {
      setForm(forms.superSaiyan1);
    }
    if (form.label === forms.superSaiyan1.label) {
      setForm(forms.superSaiyan2);
    }
    if (form.label === forms.superSaiyan2.label) {
      setForm(forms.superSaiyan3);
    }
  }, [form.label]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.shiftKey) {
        resetButton();
      } else {
        setCounter((prev) => {
          const newValue = prev + 10;
          if (newValue >= 100) {
            transformUp();
            return 0;
          }
          return newValue;
        });
      }
    },
    [resetButton, transformUp]
  );

  useEffect(() => {
    let timer: number | undefined;
    if (counter > 0) {
      timer = window.setInterval(() => {
        setCounter((prev) => {
          const newValue = Math.max(prev - form.decreaseRate, 0);
          if (newValue === 0) {
            transformDown();
          }
          return newValue;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [counter, form.decreaseRate, transformDown]);

  return (
    <button
      className={cn(
        styles["saiyan-button"],
        form.class
      )}
      onClick={handleClick}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: "100%",
          width: `${counter}%`,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          transition: "height 0.1s linear",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{form.label}</span>
    </button>
  );
};

export default SaiyanButton;
