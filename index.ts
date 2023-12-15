import { chromium } from 'playwright';
import { parse } from 'node-html-parser';

/**
 * Search an image from Google lens then return a list of visual matches.
 * @param imgUrl publicly available image
 */
export async function search(imgUrl: string) {
    const instance = await chromium.launch({ 'headless': true})
    const browser = await instance.newPage()
    await browser.goto( `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(imgUrl)}&hl='en'`)

    const content = await browser.content()
    const parsed = parse(content)

    const visual_matches = []

    for (const node of parsed.querySelectorAll(Selector.ITEM)) {
        const dataDivAttrs = node.querySelector(Selector.ITEM_DATA_DIV)?.attrs
        visual_matches.push({
            title: dataDivAttrs?.[CommonAttributes.TITLE],
            thumbnailUrl: dataDivAttrs?.[CommonAttributes.THUMBNAIL_URL],
            link:  dataDivAttrs?.[CommonAttributes.SOURCE_URL],
            source_icon:node.querySelector(Selector.ITEM_SOURCE_ICON)?.attrs?.[CommonAttributes.DATA_SRC],
            source: node.querySelector(Selector.ITEM_SOURCE)?.textContent,
            price: node.querySelector(Selector.ITEM_PRICE)?.textContent
        })
    }

    await instance.close()
    return { visual_matches }
} 

enum Selector {
    ITEM_PRICE = ".DdKZJb",
    ITEM = ".Vd9M6",
    ITEM_ATTR = ".GZrdsf",
    ITEM_DATA_DIV = ".ksQYvb",
    ITEM_SOURCE_ICON = ".wETe9b",
    ITEM_SOURCE = ".fjbPGe"
}

enum CommonAttributes {
    TITLE = 'data-item-title',
    THUMBNAIL_URL = 'data-thumbnail-url',
    SOURCE_URL = 'data-action-url',
    DATA_SRC = 'data-src'
}
