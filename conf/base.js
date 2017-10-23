/**
 * Here you can specify base properties for all environments.
 * This properties will be imported for *ALL* environnements.
 * The properties specified in this file will be overrided by *ALL* other configuration files, if any.
 */

const credentials = {
	"type": "service_account",
	"project_id": "kdosnoel-daniel",
	"private_key_id": "94bfaaac8309d3f4934d056d45503362ea67ac84",
	"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDvZmq5oZELMLBJ\nQmigHG+84EJNA+IeUUqwhyVaLWDobIg50rkwMSSkuW84Cv0Q72UIiXkFYTnLsD3l\nfhgvQpOSmW5NR7mlbCuKTcw3sKWmWlFLC7lO8WI7B1ehdWx4heR1yfAPSAkoeNKF\nK5oBZ5KWeGEQWaoN+VMxCOu5021vkSGBaHfKW63C3LKsnomXYxLrE/SEOFox3dE1\n83MFR4DXkoTVcyxbXr8CKCEIFyTG4WwI1UJcU3DP8m7jpaZHcQKDUzKFfaz1blWP\nHNVoX499UwBU6/hrwaZsHsyBC7TM7DCcu3em/Av9KHZ5w3R+D4l/4+vGWSK4CBbx\naB9SEs2bAgMBAAECggEAVaXP/+qQIC9CmmsSUFnsFegrgC8n+g2+SWqIT/tVJMIT\neJBtpZKnV/Fpm2S/BgyHmmbIb8bJbRh4BH84usu4TSXsQuSqw8Zvy1KrAa+Gi/3b\nAJzIprgQGys0zDRc4r+QLR3abzUn5Z1YP8GKHv+Ff6TAoR9bChXNkAjvgLNl/xf9\ncKmkNhb9EY0w5Figy6mdoHlBmDu9TVqyRAOIMtewux6cNGxn3YVZ3cNAZH/b9hs0\nkTRv7z9UMO36ZmJEbgcDGs2/sbbkU1cIpFcjx4xFeXghLFLwlJc6tQHxk7rLvDOQ\ngQMNj5nLRjBz38nkJmrK6nE8mYTe+sCZjV+GJDVhrQKBgQD+F7JtiUfVx13wl6yF\nIiRKGbGazPhUktZO6HZet6ixfdFRcqJpguBytQUyq9nGyra0Mk8wlrbBsXOhVgTp\ndpDWKvT1L7alvlA6RxeqI+aJVw5fWkINZOAM76myOt96wssz/vNHnaLW/ylTNwRj\nAPDm970mpubcHZ1BlLQ2SKbepQKBgQDxMnwMRu15dI0HeUkzK2THDx5WqgphDS4s\n6v1irAMDcdkZBHvurb7DD3C5OQqQW5euvm6apjwkweTWg2rS/PWrleww0UOzSbU1\nIHFvb1aPQtRlclnPbhtIuDk4Jo9I8uK3a2+v6Xk7dMKF7EIbZ6H7AdND2zIBFBYi\nsUgqqOWHPwKBgQCr6PR7T4oehQh1oujCGltbFw8moM7SyZXdRUHwy2mCzJE1/c0M\nfdPFR9wAcGyjJrt+JxuU0CNN4PVOjpg8LE/J1r5stJ9qe9xj0X2dSzTKbu/2a2aN\nEVbU6cFyKIrSz8ATqcaHCYwG0hPvjSWWpihW2/5JjFpdSlv+5tEWeQkNUQKBgCS9\nmvXHzB7HKUBtMkBQKN7Fp8ptxnz4JAOFnCluqFra+cX8z+AQqVFPRc2BKeHJgfaF\nXZXDIsA6pOAkTp5rGAUWJk9dYSGrZaX9FipyXE4gUPhPDe0yCYfvQBAUl5j2HqDw\nBahXOTdcVtFNpthD1gHFSmg4uIo/hAuu055j8erDAoGBAMpZEhqTsnw8/i+n0d+M\n5LIEeyKzjMBOY4Yypi6vk95Fh1kd75Wrj1muwX6tE/wvTc1YWVaCeVTgzRQzq7om\nTcez0yovsSnIuZiUBH8tIQk9Pi6I6NvhC4/DFKf1o5aeRTjgX9+VLglZKpGM3dms\nmts8hNcjDc+ewvB+xVhj94hn\n-----END PRIVATE KEY-----\n",
	"client_email": "webpack@kdosnoel-daniel.iam.gserviceaccount.com",
	"client_id": "106715978389217553839",
	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
	"token_uri": "https://accounts.google.com/o/oauth2/token",
	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
	"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/webpack%40kdosnoel-daniel.iam.gserviceaccount.com"
};

module.exports = {
	env: {
		api: '/api',
		baseUrl: '/'
	},
	dynamicI18n: {
		locale: {
			logger: console.error,
			title: 'translate',
			outputFilePrefix: 'locale',
			provider: 'google-sheet',
			languages: ['fr-FR'],
			'spreadsheet-key': '18AYFXalwxvrKi9bzRwqsDah4wHDQdZwBJiNbMfYX6bg',
			credentials
		},
	}
};
