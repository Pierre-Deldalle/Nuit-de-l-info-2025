// Fichier : SnakeJeu.jsx
import React, { useState, useEffect, useRef } from "react";
import styles from "./snake.module.css";

export default function Snake() {
  const tailleGrille = 20;
  const [serpent, setSerpent] = useState([[10, 10]]);
  const directionRef = useRef([0, 1]);
  const [pomme, setPomme] = useState([5, 5]);
  const [perdu, setPerdu] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const vitesse = 150;

  const reinitialiserJeu = () => {
    setSerpent([[10, 10]]);
    directionRef.current = [0, 1];
    setPomme([5, 5]);
    setPerdu(false);
    setEnCours(true);
  };

  const changerDirection = (e) => {
    const dir = directionRef.current;
    switch (e.key) {
      case "ArrowUp":
      case "z":
      case "Z":
        if (!(dir[0] === 1)) directionRef.current = [-1, 0];
        break;
      case "ArrowDown":
      case "s":
      case "S":
        if (!(dir[0] === -1)) directionRef.current = [1, 0];
        break;
      case "ArrowLeft":
      case "q":
      case "Q":
        if (!(dir[1] === 1)) directionRef.current = [0, -1];
        break;
      case "ArrowRight":
      case "d":
      case "D":
        if (!(dir[1] === -1)) directionRef.current = [0, 1];
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", changerDirection);
    return () => window.removeEventListener("keydown", changerDirection);
  }, []);

  const genererPomme = (etatSerpent) => {
    let x, y, collision;
    do {
      x = Math.floor(Math.random() * tailleGrille);
      y = Math.floor(Math.random() * tailleGrille);
      collision = etatSerpent.some((p) => p[0] === x && p[1] === y);
    } while (collision);
    setPomme([x, y]);
  };

  useEffect(() => {
    if (!enCours || perdu) return;

    const id = setInterval(() => {
      setSerpent((prevSerpent) => {
        const dir = directionRef.current;
        const tete = prevSerpent[0];
        const nouvelleTete = [tete[0] + dir[0], tete[1] + dir[1]];

        if (
          nouvelleTete[0] < 0 ||
          nouvelleTete[0] >= tailleGrille ||
          nouvelleTete[1] < 0 ||
          nouvelleTete[1] >= tailleGrille
        ) {
          setPerdu(true);
          return prevSerpent;
        }

        const collisionCorps = prevSerpent.some(
          (p) => p[0] === nouvelleTete[0] && p[1] === nouvelleTete[1]
        );
        if (collisionCorps) {
          setPerdu(true);
          return prevSerpent;
        }

        let nouveau = [nouvelleTete, ...prevSerpent];

        if (nouvelleTete[0] === pomme[0] && nouvelleTete[1] === pomme[1]) {
          genererPomme(nouveau);
        } else {
          nouveau.pop();
        }

        return nouveau;
      });
    }, vitesse);

    return () => clearInterval(id);
  }, [enCours, perdu, pomme]);

  return (
    <div className={styles.conteneurJeu}>
      <button className={styles.bouton} onClick={() => setEnCours(true)}>
        Démarrer
      </button>

      <button className={styles.bouton} onClick={reinitialiserJeu}>
        Recommencer
      </button>

      {perdu && <div className={styles.perdu}>Perdu !</div>}

      <div className={styles.grille}>
        {Array.from({ length: tailleGrille }).map((_, i) => (
          <div key={i} className={styles.ligne}>
            {Array.from({ length: tailleGrille }).map((_, j) => {
              const estSerpent = serpent.some((p) => p[0] === i && p[1] === j);
              const estPomme = pomme[0] === i && pomme[1] === j;
              const classes = [
                styles.case,
                estSerpent ? styles.serpent : "",
                estPomme ? styles.pomme : "",
              ].join(" ");
              return <div key={j} className={classes} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}