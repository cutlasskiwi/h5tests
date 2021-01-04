const puppeteer = require ('puppeteer')
const express = require('express')

const PORT = process.env.PORT || 8080

describe('Student assignment', () => {

	let app
	let browser
	let server

	beforeAll(async () => {
		app = express()
		app.use(express.static('.'))

		server = await Promise.resolve(app.listen(PORT))
		browser = await puppeteer.launch()
	})

	afterAll(async () => {
		await browser.close()
		server.close()
	})

	it ('Innehåller minst en rubrik (h1) samt en paragraf (p).', async () => {
		const page = await browser.newPage()
		const res = await page.goto(`http://localhost:${PORT}/index.html`)
		
		expect(res.status()).toBeLessThan(400)

		const ptags = await page.$$('p')
		const h1tag = await page.$('h1')

		expect(ptags.length > 0).toBeTruthy()
		expect(h1tag).toBeTruthy()

		await page.close()
	})

	it ('Har en lista (ul) med minst 3 saker (li)', async () => {
		const page = await browser.newPage()
		const res = await page.goto(`http://localhost:${PORT}/index.html`)
		
		expect(res.status()).toBeLessThan(400)

		const litags = await page.$$('li')
		const ultag = await page.$('ul')

		expect(litags.length > 2).toBeTruthy()
		expect(ultag).toBeTruthy()

		await page.close()
	})

	it ('Skall via javascriptfilen konsoll-logga "Hello World" till konsollen.', async () => {
		const logs = []
		const page = await browser.newPage()
		page.on('console', msg => logs.push(msg.text()))

		const res = await page.goto(`http://localhost:${PORT}/index.html`)

		expect(res.status()).toBeLessThan(400)
		expect(logs).toContain('Hello World')
		
		await page.close()
	})
})
