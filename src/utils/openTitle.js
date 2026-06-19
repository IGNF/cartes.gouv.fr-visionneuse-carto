/**
 * Renvoie un booléen indiquant si l'ellipse de l'élément est active
 * i.e. si l'élément est en mode "text-overflow".
 * 
 * @param {HTMLElement} elem Élément HTML à vérifier
 * @returns {Boolean} Vrai si l'ellipse est active, faux sinon
 */
function isEllipsisActive(elem) {
  return (elem.offsetWidth < elem.scrollWidth);
}

/**
 * Classe CSS dédiée au bouton de fermeture du titre.
 * Utilisée pour récupérer le bouton depuis d'autres fonctions.
 * @type {string}
 */
const TITLE_CLOSE_BUTTON_CLASS = "title__close-btn";

/**
 * Classe CSS du fond semi-transparent affiché derrière le titre ouvert.
 * @type {string}
 */
const TITLE_BACKDROP_CLASS = "title__backdrop";

/**
 * Ferme le titre et supprime le fond semi-transparent associé.
 * @param {import("mcutils/StoryMap.js").default} story Storymap
 */
function closeTitle(story) {
  story.element.titleDiv.classList.remove("title--opened");
  story.target?.querySelector(`.${TITLE_BACKDROP_CLASS}`)?.remove();
}

/**
 * Fonction permettant d'ajouter un bouton au titre
 * pour le fermer en mode mobile.
 * @param {import("mcutils/StoryMap.js").default} story Storymap
 * @returns {Boolean} Vrai si un bouton a été ajouté, faux sinon.
 */
export function addCloseButtonTitle(story) {
  if (!story?.element?.titleDiv) {
    return false;
  }

  if (getCloseButtonTitle(story)) {
    // Le bouton existe déjà
    return false;
  }

  // Vérifie si data-title est différent de "hidden"
  const dataTitle = document.querySelector("div[data-role=storymap]")?.dataset.title;
  if (story.element.title.textContent === "" && story.element.subTitle.textContent === "" && dataTitle !== "hidden") {
    // Pas de titre sur la carte
    return false;
  }

  // Créé le conteneur avec bouton
  const divButton = document.createElement("div");
  divButton.classList.add("title__actions");

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.classList.add("fr-btn", "fr-btn--tertiary-no-outline","fr-btn--icon-left", "fr-icon-close-line",  TITLE_CLOSE_BUTTON_CLASS);
  closeButton.textContent = "Fermer";

  closeButton.addEventListener("click", (e) => {
    // Empêche l'ouverture/fermeture immédiate via le listener placé sur le conteneur du titre.
    e.stopPropagation();
    closeTitle(story);
  });

  divButton.append(closeButton);
  story.element.titleDiv.append(divButton);

  return true;

}


/**
 * Retourne le bouton de fermeture du titre s'il existe.
 * @param {import("mcutils/StoryMap.js").default} story Storymap
 * @returns {HTMLButtonElement|null} Bouton de fermeture ou null.
 */
export function getCloseButtonTitle(story) {
  if (!story?.target) {
    return null;
  }

  return story.target.querySelector(`:scope > .title .${TITLE_CLOSE_BUTTON_CLASS}`);
}

/**
 * Function permettant d'ouvrir (ou non) le titre
 * @param {import("mcutils/StoryMap.js").default} story Storymap
 * @returns {Boolean} Vrai si le titre a été "ouvert", faux sinon.
 */
export default function openTitle(story) {
  if (!story.showTitle()) {
    // Le titre n'est pas visible
    return false;
  }
  const isOverflowing = isEllipsisActive(story.element.title) || isEllipsisActive(story.element.subTitle);
  const isOpened = story.target.querySelector(`.${TITLE_BACKDROP_CLASS}`);

  // Ne ferme pas le titre au clic de
  !isOpened && story.element.titleDiv.classList?.toggle("title--opened", isOverflowing);

  if (story.element.titleDiv.classList.contains("title--opened")) {
    // Crée le fond semi-transparent s'il n'existe pas déjà
    if (!isOpened) {
      const backdrop = document.createElement("div");
      backdrop.classList.add(TITLE_BACKDROP_CLASS);
      backdrop.setAttribute("aria-hidden", "true");
      backdrop.addEventListener("click", () => closeTitle(story));
      story.target.appendChild(backdrop);
    }
    getCloseButtonTitle(story)?.focus({focusVisible: false});
  } else {
    closeTitle(story);
  }
}