import templateUtils from '../../src/util/template'
import {dirname, join} from "upath";
import {existsSync} from "fs";

test('template utils', () => {

  const templates = [
    {
      src: join(dirname(__dirname), 'template', 'client.js'),
      custom: false,
    },
  ]

  const utils = templateUtils({ publishPath: join(dirname(dirname(__dirname)), '.runtime') })

  const template = utils.matchTemplate(templates, 'client')

  if (!template) {
    return
  }

  expect(template.template).toStrictEqual(templates[0])
  expect(template.contents()).toMatchSnapshot()

  expect(
    template.injectFileContents(join(dirname(__dirname), 'template', 'customImport.js'), 'import Vue from \'vue\'')
  ).toBeTruthy()

  expect(template.contents()).toContain('import \'my-custom-import\'')

  const published = template.publish()

  expect(existsSync(published.src)).toBeTruthy()
  expect(published.custom).toBeTruthy()
})
