/* ==========================================================================
   HumAIn site configuration — edit this file, nothing else is required.
   ========================================================================== */
window.HUMAIN_CONFIG = {
  /* TODO (Ian-Remi): paste ONLY the iframe "src" URL from your beehiiv embed code.
     beehiiv > Settings > Subscribe Forms > create a form > Embed > copy the code.
     It looks like:  https://embeds.beehiiv.com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
     While this is empty the site shows "Sign-up opens soon", collects no email,
     and the free course stays readable. */
  BEEHIIV_EMBED_URL: "",
  BEEHIIV_EMBED_HEIGHT: 320,

  /* Intermediate Course list (separate from the main newsletter placeholder).
     Paste ONLY the iframe "src" URL. While this is empty, intermediate.html
     shows "Sign-up opens soon" and collects no email. */
  INTERMEDIATE_EMBED_URL: "",
  INTERMEDIATE_EMBED_HEIGHT: 320,

  /* Sender identification shown in the CASL consent text (replace the TODOs). */
  SENDER_NAME: "HumAIn",
  SENDER_MAILING_ADDRESS: "2572 boul. Daniel-Johnson, 2nd floor, office 237, Laval, QC H7T 2R3, Canada",
  SENDER_CONTACT_EMAIL: "ian-remi.lafleur@neotechcloudsolutions.com",

  /* localStorage key for the soft gate. Change it to log everybody out. */
  STORAGE_KEY: "humain_subscribed_v1"
};
