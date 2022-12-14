import fs from 'fs'
import path from 'path'

const assetsPath = path.resolve(process.cwd(), 'dist/assets')

const jsPath = path.resolve(
  assetsPath,
  fs
    .readdirSync(assetsPath)
    .find((file) => file.startsWith('index.') && file.endsWith('.js'))
)

const cssPath = path.resolve(
  assetsPath,
  fs
    .readdirSync(assetsPath)
    .find((file) => file.startsWith('index.') && file.endsWith('.css'))
)

// It requires those slashes to be escaped multiple times,
// one in the template and once in appending in the document head
const cssContent = fs.readFileSync(cssPath, 'utf8').replaceAll('\\', `\\\\\\\\`)
const appendCss = `document.head.appendChild(document.createElement('style')).innerHTML= \\\`${cssContent}\\\``

const jsContent = fs
  .readFileSync(jsPath, 'utf8')
  .replaceAll('\\', `\\\\`)
  .replaceAll('`', '\\`')
  .replaceAll('${', '\\${')

const bookmarklet = `javascript:${appendCss};${jsContent}_initRecorder();`

function assignLink() {
  return `document.getElementById('link').href=\`${bookmarklet}\`;`
}

const htmlOutput = `<!DOCTYPE html>
<html>
  <body>
    <div>
      <a id="link">Start Test Recording</a>
      (Drag & Drop this link to your bookmarks bar)
    </div>

    <script>
      ${assignLink()}
    </script>
  </body>
</html>`

fs.writeFileSync(
  path.resolve(process.cwd(), 'dist/bookmarklet.html'),
  htmlOutput
)
