const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('grep -rl "getPayload" src/app --include="*.tsx"').toString().trim().split('\n');

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  if (!c.includes('export const dynamic')) {
    c = "export const dynamic = 'force-dynamic'\n\n" + c;
    fs.writeFileSync(f, c);
    console.log('Fixed:', f);
  } else {
    console.log('Already fixed:', f);
  }
});
