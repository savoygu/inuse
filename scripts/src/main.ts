import { resolve } from 'node:path'
import { readFileSync, writeFile, writeFileSync } from 'node:fs'
import { defineCommand, runMain } from 'citty'
import yaml from 'js-yaml'
import type { NestWebStack, WebStack, WebStacks } from './types'

export const main = defineCommand({
  meta: {
    name: 'inuse',
    description: 'InUse Scripts',
  },
  run: async () => {
    const rootDir = resolve(__dirname, '../../')
    const input = resolve(rootDir, 'data/webstack.yml')
    const output = resolve(rootDir, 'README.md')

    const webstacks = yaml.load(readFileSync(input, 'utf-8')) as WebStacks
    let readme = readFileSync(output, 'utf-8')
    readme = fillPlaceholder(readme, transformWebStacks(webstacks), 'WEB_STACK')
    writeFileSync(output, readme, 'utf-8')
  },
})

runMain(main)

function fillPlaceholder(fileContent: string, filledContent: string, placeholder: string, insertionPosition: 'head' | 'tail' | 'none' = 'none') {
  const START = `<!--${placeholder}_STARTS-->`
  const END = `<!--${placeholder}_ENDS-->`
  const regex = new RegExp(`${START}[\\s\\S]*?${END}`, 'im')

  const target = filledContent ? `${START}\n${filledContent}\n${END}` : `${START}${END}`

  if (!regex.test(fileContent)) {
    if (insertionPosition === 'none')
      return fileContent
    if (insertionPosition === 'head')
      return `${target}\n\n${fileContent}`
    return `${fileContent}\n\n${target}`
  }

  return fileContent.replace(regex, target)
}

function transformLinks(links: WebStack['links']) {
  return links.map(link => `- <img src="${link.logo}" width="14" height="14" /> [${link.title}](${link.url}) ${link.description}`).join('\n')
}

function transformList(list: NestWebStack['list']) {
  return list.reduce((acc, item) => {
    acc.push(`#### ${item.term}`, transformLinks(item.links))
    return acc
  }, [] as string[])
}

function transformWebStacks(webstacks: WebStacks) {
  return webstacks.reduce((acc, item) => {
    acc.push(`### ${item.taxonomy}`)

    if ('list' in item)
      acc.push(...transformList(item.list))

    if ('links' in item)
      acc.push(transformLinks(item.links))

    return acc
  }, [] as string[]).join('\n\n')
}
