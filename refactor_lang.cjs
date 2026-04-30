const fs = require('fs');
const path = require('path');

const files = [
  'src/project/home.jsx',
  'src/project/complain_path/com_home.jsx',
  'src/project/navbar/AboutAct.jsx',
  'src/project/navbar/FormatOfApplication.jsx',
  'src/project/navbar/Faq.jsx',
  'src/project/navbar/Publications.jsx',
  'src/project/navbar/Feedback.jsx',
  'src/project/navbar/PhotoGallery.jsx',
  'src/project/navbar/VideoGallery.jsx',
  'src/project/navbar/ContactUs.jsx'
];

for (const file of files) {
  const p = path.join(__dirname, file);
  let content = fs.readFileSync(p, 'utf8');
  
  // 1. remove translations import
  content = content.replace(/import \{ translations \} from '\.\/translations';\r?\n?/g, '');
  content = content.replace(/import \{ translations \} from '\.\.\/translations';\r?\n?/g, '');
  
  // 2. add useLanguage import after react import
  const contextPath = file === 'src/project/home.jsx' ? "'./LanguageContext'" : "'../LanguageContext'";
  content = content.replace(/(import React.*?from 'react';)/, `$1\nimport { useLanguage } from ${contextPath};`);
  
  // 3. state
  content = content.replace(/const \[lang, setLang\] = useState\('en'\);\s*const t = translations\[lang\];/g, 'const { lang, t } = useLanguage();');
  
  // 4. components
  content = content.replace(/<Header lang=\{lang\} setLang=\{setLang\} t=\{t\} \/>/g, '<Header />');
  content = content.replace(/<Footer t=\{t\} \/>/g, '<Footer />');
  
  fs.writeFileSync(p, content, 'utf8');
}
console.log("Refactoring complete");
