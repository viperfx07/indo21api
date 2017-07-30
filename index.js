import cheerio from 'cheerio';
import axios from 'axios';
import express  from 'express';

const HOST = 'https://indoxxi.net';
const app = express();
const port = process.env.PORT || 80;

/**
 * Filter structure
 *
 * /[tipe]--[tipe-lain]/[genre]--[genre-lain]/[negara]--[negara-lain]/[year]--[year-lain]/[sub]--[sub-lain]/[sort]/[page]
 */
const filterOptions = {
	type: {
		"muvi": "Movies",
		"tv": "TV"
	},
	genre:{
		"action": "Action",
		"adventure": "Adventure",
		"animation": "Animation",
		"comedy": "Comedy",
		"drama": "Drama",
		"family": "Family",
		"fantasy": "Fantasy",
		"horror": "Horror",
		"mystery": "Mystery",
		"romance": "Romance",
		"Sci-fi": "Sci-Fi",
		"thriller": "Thriller",
		"war": "War",
		"documentary": "Documentary",
		"western": "Western",
		"musical": "Musical",
		"biography": "Biography",
		"sport": "Sport",
		"crime": "Crime",
		"history": "History",
		"short": "Short",
	},
	country:{
		"usa": "USA",
		"uk": "UK",
		"australia": "Australia",
		"china": "China",
		"philippines": "Philippines",
		"france": "France",
		"hong": " Kong  Hg Kong",
		"india": "India",
		"indonesia": "Indonesia",
		"japan": "Japan",
		"korea": "Korea",
		"taiwan": "Taiwan",
		"thailand": "Thailand",
		"italy": "Italy",
		"germany": "Germany",
		"greece": "Greece",
		"turkey": "Turkey",
		"malaysia": "Malaysia",
		"israel": "Israel",
		"belgium": "Belgium",
		"netherlands": "Netherlands",
		"portugal": "Portugal",
		"brazil": "Brazil",
		"spain": "Spain",
		"mexico": "Mexico",
		"czech": " Republic  Cch Republic",
		"norway": "Norway",
		"sweden": "Sweden",
		"hungary": "Hungary",
		"russia": "Russia",
	},
	year:{
		"2018": "2018",
		"2017": "2017",
		"2016": "2016",
		"2015": "2015",
		"2014": "2014",
		"2013": "2013",
		"2012": "2012",
		"2011": "2011",
		"2010": "2010",
		"2000": "2000's",
		"1990": "1990's",
		"1980": "1980's",
		"1970": "1970's",
		"lawas": "Lawas",
	},
	sort:{
		"terbaru": "Latest",
		"popular": "Popular",
		"rating": "Rating",
		"terbanyak": "Most viewed",
	},
	subtitle:{
		"en": "English",
		"id": "Indonesia"
	}
}

function getUrlByFilter(type="muvi", genre="all", country="all", year="all", sub="all", sort="terbaru", page=1){
	const urlized = (obj) =>{
		return Array.isArray(obj) ? obj.join('--') : obj;
	}

	return `${HOST}/${urlized(type)}/${urlized(genre)}/${urlized(country)}/${urlized(year)}/${urlized(sub)}/${urlized(sort)}/${page}`;
}

function doRequest(exReq, exRes){
	const { type, genre, country, year, sub, sort, page} = exReq.params;
	const url = getUrlByFilter(type, genre, country, year, sub, sort, page);
	axios
		.get(url)
		.then((ajaxRes) =>{
			const $ = cheerio.load(ajaxRes.data, {
				normalizeWhitespace: true,
			});
			
			const arr = $('.ml-item').map(function(){
				const $this = $(this);
				return {
					title: $this.find('.mli-info').text(),
					quality: $this.find('.mli-quality').text(),
					image: $this.find('img').attr('data-original'),
					link: $this.attr('data-movie-id') + '/play',
					imdb: $this.find('.mli-rating').text(),
					duration: $this.find('.mli-durasi').text()
				};
			}).get();

			exRes.json(arr);
		});
}

app.get('/:type?/:genre?/:country?/:year?/:sub?/:sort?/:page?', (req, res) =>{
	doRequest(req, res);
});


app.listen(port);