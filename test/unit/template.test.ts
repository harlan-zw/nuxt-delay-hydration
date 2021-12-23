import templateUtils from '../../src/util/template'
import {dirname, join} from "upath";
import {existsSync, readFileSync} from "fs";

test('template utils', () => {

  const templates = [
    {
      src: join(dirname(__dirname), 'fixtures', 'vue-app', 'template', 'client.js'),
      custom: false,
    },
  ]

  const utils = templateUtils({ publishPath: join(dirname(dirname(__dirname)), '.runtime') })

  const template = utils.matchTemplate(templates, 'client')

  expect(template).toBeTruthy()

  if (!template) {
    return
  }

  expect(template.template).toStrictEqual(templates[0])

  expect(
    template.injectFileContents(join(dirname(__dirname), 'fixtures', 'template', 'customImport.js'), 'import Vue from \'vue\'')
  ).toBeTruthy()

  expect(template.contents()).toContain('import \'my-custom-import\'')

  const published = template.publish()

  const publishedTemplate = readFileSync(published.src, { encoding: 'utf-8' })

  expect(existsSync(published.src)).toBeTruthy()
  expect(publishedTemplate).toMatchSnapshot()
  expect(published.custom).toBeTruthy()
})
