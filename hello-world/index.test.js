import puppeteer from 'puppeteer'
import express from 'express'

const PORT = process.env.PORT || 8080

describe('Student assignment', () => {

	let app
	let browser
	let server

	beforeAll(async () => {
		app = express()
		app.use(express.static('assignment'))

		server = await Promise.resolve(app.listen(PORT))
		browser = await puppeteer.launch()
	})

	afterAll(async () => {
		await browser.close()
		server.close()
	})

	it ('should contain atleast one p tag and one h1 tag', async () => {
		const page = await browser.newPage()
		const res = await page.goto(`http://localhost:${PORT}/index.html`)
		
		expect(res.status()).toBeLessThan(400)

		const ptags = await page.$$('p')
		const h1tag = await page.$('h1')

		expect(ptags.length > 0).toBeTruthy()
		expect(h1tag).toBeTruthy()

		await page.close()
	})

	it ('should log HELLO WORLD to the console', async () => {
		const logs = []
		const page = await browser.newPage()
		page.on('console', msg => logs.push(msg.text()))

		const res = await page.goto(`http://localhost:${PORT}/index.html`)

		expect(res.status()).toBeLessThan(400)
		expect(logs).toContain('HELLO WORLD')
		
		await page.close()
	})
})
