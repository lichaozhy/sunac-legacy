const cityMap = require('./adcode.json');

const list = [];

for(const adcode in cityMap) {
	list.push(cityMap[adcode]);
}

list.sort((cityA, cityB) => cityA.adcode - cityB.adcode);

module.exports = Object.freeze({
	getCity(adcode) {
		return cityMap[adcode] || null;
	},
	getCityList() {
		return list.slice(0);
	}
});
