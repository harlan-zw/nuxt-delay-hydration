import { readFileSync, writeFileSync } from 'fs'
import { basename, dirname, join } from 'upath'
import escapeRegExp from 'lodash/escapeRegExp'

export type TemplateId = 'client' | 'App' | 'index'

export type NuxtTemplate = {
  originalSrc?: string
  src: string
  custom: boolean
}

export type Template = {
  template: NuxtTemplate
  contents: () => string
  injectFileContents: (filePath: string, afterLine: string) => boolean
  publish: () => NuxtTemplate
}

const templateUtils = (options: Record<string, any> = {}) => {
  options = {
    publishPath: join(dirname(__dirname), '.runtime'),
    ...options,
  }

  const template = (r: NuxtTemplate): Template => {
    let content = ''
    const contents = () => {
      if (content)
        return content

      content = readFileSync(r.src, { encoding: 'utf-8' })
      return content
    }
    const injectFileContents = (file: string, afterLine: string) => {
      if (!content)
        contents()
      const originalContent = content
      // we need to replace the App.js template..
      const templateToInject = readFileSync(file, { encoding: 'utf-8' })
      // regex replace the css loader
      const subst = `$1\n${templateToInject}`
      const regex = new RegExp(`(${escapeRegExp(afterLine)})`, 'gm')
      content = content.replace(regex, subst)
      // true if the content has been modified
      return originalContent !== content
    }
    const publish = () => {
      const newPath = join(options.publishPath, basename(r.src))
      writeFileSync(newPath, content)
      r.custom = true
      r.originalSrc = r.src
      r.src = newPath
      return r
    }
    return {
      template: r,
      contents,
      injectFileContents,
      publish,
    }
  }

  const matchTemplate = (templates: NuxtTemplate[], id: TemplateId) => {
    const match = templates.find(template => template.src.endsWith(join('vue-app', 'template', `${id}.js`)))
    if (!match)
      return null
    return template(match)
  }

  return {
    matchTemplate,
    template,
  }
}

export default templateUtils
