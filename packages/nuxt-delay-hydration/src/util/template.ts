import fse from 'fs-extra'
import { basename, dirname, join } from 'pathe'
import escapeRegExp from 'lodash/escapeRegExp.js'

export type TemplateId = 'client' | 'App' | 'index'

export interface NuxtTemplate {
  originalSrc?: string
  src: string
  custom: boolean
}

export interface Template {
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

      content = fse.readFileSync(r.src, { encoding: 'utf-8' })
      return content
    }
    const injectFileContents = (file: string, afterLine: string) => {
      if (!content)
        contents()
      const originalContent = content
      // we need to replace the App.js template..
      const templateToInject = fse.readFileSync(file, { encoding: 'utf-8' })
      // regex replace the css loader
      const subst = `$1\n${templateToInject}`
      const regex = new RegExp(`(${escapeRegExp(afterLine)})`, 'gm')
      content = content.replace(regex, subst)
      // true if the content has been modified
      return originalContent !== content
    }
    const publish = () => {
      fse.ensureDirSync(options.publishPath)
      const newPath = join(options.publishPath, basename(r.src))
      fse.writeFileSync(newPath, content)
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
