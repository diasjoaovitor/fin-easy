import path from 'path'

const buildCommand = (filenames) => {
  const files = filenames.map((f) => path.relative(process.cwd(), f))
  return [
    `npx prettier --write ${files.join(' --file ')}`,
    `npx eslint --fix ${files.join(' ')} --report-unused-disable-directives --max-warnings 0`
  ]
}

export default {
  '*.{js,jsx,ts,tsx,vue}': [buildCommand]
}
