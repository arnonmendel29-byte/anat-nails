/*
  גלריית עבודות
  ----------------
  להוספת תמונה:
    1. שמרו את הקובץ בתיקייה images/gallery (מומלץ JPG/WebP, רוחב 900–1200px).
    2. הוסיפו או עדכנו שורה ברשימה למטה:
         { src: "images/gallery/01.jpg", alt: "לק ג'ל ניוד בגימור מבריק", shape: "tall" },

  shape – הפרופורציה של המסגרת:
    "tall"     → 2:3  (אנכי גבוה, מתאים במיוחד לצילומי ציפורניים)
    "portrait" → 4:5  (אנכי)
    "square"   → 1:1
  פריט בלי src מוצג כמקום שמור לתמונה.
*/
window.GALLERY = [
  {
    src: "images/gallery/03-build-ombre.png",
    alt: "בניית ציפורניים בצורת שקד עם אומברה פרנץ' בחיפה",
    shape: "tall",
  },
  {
    src: "images/gallery/05-gel-nude.png",
    alt: "לק ג'ל בגוון ניוד אלגנטי בחיפה",
    shape: "portrait",
  },
  {
    src: "images/gallery/02-gel-red.jpg",
    alt: "לק ג'ל אדום מבריק בצורת שקד",
    shape: "tall",
  },
  {
    src: "images/gallery/04-gel-blue.png",
    alt: "לק ג'ל בגוון כחול עדין",
    shape: "portrait",
  },
  {
    src: "images/gallery/06-gel-red-2.png",
    alt: "לק ג'ל אדום קלאסי בגימור מבריק",
    shape: "tall",
  },
  {
    src: "images/gallery/07-gel-blue-2.jpg",
    alt: "לק ג'ל כחול בצורת שקד",
    shape: "portrait",
  },
];
